class Authentication::SessionsController < Devise::SessionsController
  layout 'session'

  skip_before_action :verify_authenticity_token, only: :create

  private

  def after_sign_in_path_for(_resource_or_scope)
    root_path
  end

  def after_sign_out_path_for(_resource_or_scope)
    new_user_session_path
  end
end
