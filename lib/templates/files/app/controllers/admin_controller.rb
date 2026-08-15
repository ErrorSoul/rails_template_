# frozen_string_literal: true

class AdminController < ApplicationController
  layout 'dashboard'
  before_action :require_admin, except: %i[login authenticate]

  def index
    redirect_to admin_superusers_path
  end

  def login
    render layout: 'auth'
  end

  def authenticate
    su = Superuser.find_by(login: params[:login])
    if su&.authenticate(params[:password])
      Authenticator.login(cookies, su)
      redirect_to admin_root_path
    else
      flash.now[:error] = 'Неверный логин или пароль'
      render :login, layout: 'auth', status: :unauthorized
    end
  end

  def logout
    Authenticator.logout(cookies, role: :admin)
    redirect_to admin_login_path
  end

  private

  def require_admin
    return if current_superuser
    redirect_to admin_login_path
  end
end
