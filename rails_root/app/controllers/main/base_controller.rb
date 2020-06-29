class Api::V1::Main::BaseController < Api::V1::BaseController
  before_action :check_auth
end
