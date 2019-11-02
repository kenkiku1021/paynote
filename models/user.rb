# coding: utf-8
require "date"
require "./models/basic_datastore"

class User < BasicDatastore
  attr_reader :id, :uid, :provider, :created_at
  
  def initialize(entity)
    @id = entity.key.id
    @uid = entity[:uid]
    @provider = entity[:provider]
    @created_at = entity[:created_at]
  end

  def start_year
    qry = DS.query("Payment")
            .where("user_id", "=", @id)
            .order("paid_date")
            .limit(1)
    payment = DS.run(qry).first
    payment ? payment[:paid_date].year : nil
  end
  
  def payment_methods
    qry = DS.query("PaymentMethod")
            .where("user_id", "=", @id)
            .order("last_used_at", :desc)
    methods = DS.run(qry).map{|entity| {id: entity.key.id, name: entity[:name]} }
    if methods.empty?
      set_default_payment_method
      payment_methods
    else
      methods
    end
  end

  def append_payment_method(name)
    method = DS.entity("PaymentMethod") do |m|
      m["user_id"] = @id
      m["name"] = name
      m["last_used_at"] = Time.now
    end

    DS.save method
  end

  def update_payment_method(id, name)
    method = get_payment_method(id)
    if method
      method["name"] = name
      DS.save method
    end
  end

  def remove_payment_method(id)
    method_key = DS.key("PaymentMethod", id)
    DS.delete method_key
  end

  def get_payment_method(id)
    method = DS.find("PaymentMethod", id)
    if method["user_id"] != @id
      raise "Invalid PaymentMethod ID"
    else
      method
    end
  end

  def use_payment(id)
    method = get_payment_method(id)
    if method
      method["last_used_at"] = Time.now
      DS.save method
    end
  end

  # params[:paid_date] : 支払日付
  # params[:method_id] : 支払い方法ID
  # params[:recipient] : 支払先
  # params[:amount] : 金額
  # params[:description] : 概要
  def append_payment(params)
    method = get_payment_method(params[:method_id].to_i)
    if method.nil?
      raise "Invalid payment method"
    end
    
    payment = DS.entity("Payment") do |pm|
      pm["user_id"] = @id
      pm["paid_date"] = Date.parse(params[:paid_date])
      pm["method_id"] = method.key.id
      pm["recipient"] = params[:recipient].to_s
      pm["amount"] = params[:amount].to_i
      pm["description"] = params[:description].to_s
      pm["created_at"] = Time.now
    end

    use_payment(method.key.id)
    
    DS.transaction do |tx|
      tx.save payment
    rescue
      tx.rollback
    end
  end

  def payments(year, month)
    methods = payment_methods.map{|m| [m[:id], m[:name]]}.to_h
    from = Date.new(year, month, 1)
    to = from.next_month
    qry = DS.query("Payment")
            .where("user_id", "=", @id)
            .where("paid_date", ">=", from)
            .where("paid_date", "<", to)
            .order("paid_date", :asc)
    result = DS.run(qry).map{|row|
      {id: row.key.id,
       paid_date: row["paid_date"].iso8601,
       method_id: row["method_id"],
       method: methods[row["method_id"]],
       recipient: row["recipient"],
       amount: row["amount"],
       description: row["description"],
       created_at: row["created_at"]}
    }
  end

  def User.[](id)
    key = DS.key "User", id.to_i
    entity = DS.find key
    entity ? User.new(entity) : nil
  end
  
  def User.get(provider, uid)
    qry = DS.query("User")
            .where("provider", "=", provider)
            .where("uid", "=", uid)
    result = DS.run(qry)

    result.empty? ? User.create(provider, uid) : User.new(result[0])
  end

  def User.create(provider, uid)
    user = DS.entity("User") do |u|
      u["provider"] = provider
      u["uid"] = uid
      u["created_at"] = Time.now
    end
    DS.save user
    User.get(provider, uid)
  end

  private
  def set_default_payment_method
    method = DS.entity("PaymentMethod") do |m|
      m["user_id"] = @id
      m["name"] = "現金"
      m["last_used_at"] = Time.now
    end

    DS.save method
  end
end
