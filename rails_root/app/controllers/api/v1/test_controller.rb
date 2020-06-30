class Api::V1::TestController < Api::V1::BaseController

  def check_api
    json_response({ping: :pong})
  end

end
