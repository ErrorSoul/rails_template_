# frozen_string_literal: true

module Response
  extend ActiveSupport::Concern

  def json_response(data, status = :ok)
    render json: data, status: status
  end
end
