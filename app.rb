#!/usr/bin/env ruby
# coding: utf-8

require 'bundler/setup'
Bundler.require
require "sinatra/reloader"
require "yaml"
require 'google/cloud/datastore'
Dir.glob('./{helpers,models,lib}/*.rb').each { |file| require file }

config = AppConfig.instance

configure do
  set :sessions, :expire_after => config.session_expire
  set :session_secret, config.session_secret
end

use OmniAuth::Builder do
  provider :google_oauth2, config.omniauth_client_id("google_oauth2"), config.omniauth_secret("google_oauth2")
end

helpers do
  def authorized?
    if @user.nil?
      raise "not authorized"
    end
  end

  def log_error(ex)
    STDERR.print ex.message + "\n"
    ex.backtrace.each do |m|
      STDERR.print m + "\n"
    end
  end
end

before do
  if session[:user_id]
    @user = User[session[:user_id]]
  end
end

get "/" do
  erb :index
end

get "/auth/:provider/callback" do
  auth_info = request.env["omniauth.auth"]
  user = User.get(auth_info["provider"], auth_info["uid"])
  session[:user_id] = user.id
  redirect to("/")
end

post "/user" do
  result = {
    id: @user ? @user.id : nil,
    created_at: @user ? @user.created_at : nil,
    authorized: !@user.nil?,
    start_year: @user.start_year,
  }

  json result
end

# 支払いの追加
# params[:paid_date] : 支払日付
# params[:method_id] : 支払い方法ID
# params[:recipient] : 支払先
# params[:amount] : 金額
# params[:description] : 概要
post "/user/payment" do
  begin
    authorized?
    @user.append_payment(params)

    json true
  rescue => ex
    log_error ex
    halt 500, ex.message
  end
end

# 支払リストの取得（年と月を指定）
# params[:year] : 年
# params[:month] : 月
get "/user/payments/:year/:month" do
  begin
    authorized?
    cache_control :no_cache

    json @user.payments(params[:year].to_i, params[:month].to_i)
  rescue => ex
    log_error ex
    halt 500, ex.message
  end
end

# 支払い方法リストの取得
get "/user/payment_methods" do
  begin
    authorized?
    cache_control :no_cache

    json @user.payment_methods
  rescue => ex
    log_error ex
    halt 404, ex.message
  end
end

# 支払い方法の追加
# params[:name] : 新しい支払い方法
post "/user/payment_method" do
  begin
    authorized?
    name = params[:name].to_s
    if name == ""
      raise "空の支払い方法は追加できません"
    end

    @user.append_payment_method name

    json @user.payment_methods
  rescue => ex
    log_error ex
    halt 404, ex.message
  end
end

# 支払い方法の更新
# params[:id] : 支払い方法IDX
# params[:name] : 支払い方法名
put "/user/payment_method/:id" do
  begin
    authorized?
    id = params[:id].to_i
    name = params[:name].to_s
    if name == ""
      raise "支払い方法は空にできません"
    end

    STDERR.print name
    @user.update_payment_method id, name
    json @user.payment_methods
  rescue => ex
    log_error ex
    halt 500, ex.message
  end
end

# 支払い方法の削除
delete "/user/payment_method/:id" do
  begin
    authorized?
    id = params[:id].to_i
    @user.remove_payment_method id
    json @user.payment_methods
  rescue => ex
    log_error ex
    halt 500, ex.message
  end
end
