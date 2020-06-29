class Api::V1::StaticController < Api::V1::BaseController

  def offerta
    offerta = Offertum.first
    json_response({body: offerta.body})
  end

end
