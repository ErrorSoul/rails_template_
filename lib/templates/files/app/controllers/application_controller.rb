# frozen_string_literal: true

class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  helper_method :current_user, :current_superuser, :tg_app_name

  def current_user
    @current_user ||= Authenticator.current_user(cookies)
  end

  def current_superuser
    @current_superuser ||= Authenticator.current_superuser(cookies)
  end

  def tg_app_name
    ENV.fetch('TG_APP_NAME', 'TMA')
  end
end
