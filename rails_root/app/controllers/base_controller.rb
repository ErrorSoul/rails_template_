class Api::V1::BaseController < ApplicationController
  include Response
  protect_from_forgery with: :null_session

  def check_auth
    return if current_user
    render_unauthorized
  end

   def check_auth_admin
    return if superuser
    render_unauthorized
  end

  def render_unauthorized
    self.headers['WWW-Authenticate'] = 'Token realm="Application"'
    return json_response({status: 'unauthorized', message: 'Bad credentials'}, :unauthorized)
  end
end
