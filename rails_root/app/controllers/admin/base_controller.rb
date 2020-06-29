class Api::V1::Admin::BaseController < Api::V1::BaseController
  before_action :check_auth_admin
end
