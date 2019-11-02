require 'singleton'
require 'yaml'
require 'google/cloud/datastore'

class AppConfig
  include Singleton

  attr_reader :gcp_project_id, :gcp_credentials, :session_secret, :session_expire
  
  def initialize
    data = YAML.load_file("config.yaml")
    @omniauth = data["omniauth"] ? data["omniauth"] : {}
    @gcp_project_id = data["gcp"]["project_id"]
    @gcp_credentials = data["gcp"]["credentials"]
    @session_secret = data["session_secret"]
    @session_expire = data["session_expire"]
  end

  def omniauth_client_id(provider)
    @omniauth[provider]["client_id"]
  end

  def omniauth_secret(provider)
    @omniauth[provider]["secret"]
  end

  def datastore
    @datastore ||= Google::Cloud::Datastore.new(project_id: @gcp_project_id, credentials: @gcp_credentials)
  end
end
