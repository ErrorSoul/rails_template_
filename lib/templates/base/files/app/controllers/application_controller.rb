# frozen_string_literal: true

class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  helper_method :current_user, :current_superuser, :app_display_name

  def current_user
    @current_user ||= Authenticator.current_user(cookies)
  end

  def current_superuser
    @current_superuser ||= Authenticator.current_superuser(cookies)
  end

  def app_display_name
    ENV.fetch("APP_NAME", "App")
  end
end
