class Api::V1::Admin::UsersController < Api::V1::Admin::BaseController

  def index
    users = User.page(params[:page])
    users_count = User.count
    total_pages = User.page(1).total_pages
    headers = User.headers
    current_page = User.page(params[:page]).current_page

    return json_response(
      {
        data: users,
        headers: headers,
        data_count: users_count,
        resource_name: 'users',
        total_pages: total_pages,
        current_page: current_page
      }
    )
  end

  def pretend
    user = User.find_by(id: params[:id])

    if user
      Authenticator.login(cookies, user)
      return json_response(result: :ok)
    else
      return json_response({ error: :user_not_found }, :unprocessable_entity)
    end
  end

  def show
    user = User.find params[:id]

    return json_response(
      resource_name: 'User',
      item: user.as_json(show: true)
    )

  end
end
