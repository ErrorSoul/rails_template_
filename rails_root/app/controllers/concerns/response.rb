module Response
  def json_response(object, status = :ok)
    render(json: object.merge(status: status), status: status)
  rescue StandardError => e
    message = Rails.env.production? ? 'Something is wrong' : e.message
    Rails.logger.error ['Errors:', message].join(' ')
    render(json: { errors: message }, status: :unprocessable_entity)
  end
end
