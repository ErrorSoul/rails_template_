class Admin::UsersController < Admin::BaseController

  before_action :set_user, only:  [:show, :edit, :update, :destroy]

  def index
    @users = User.order(id: :desc)
                 .page(params[:page])
    @obj = TableObject.new(
      name: 'User',
      pool: @users,
      attrs: get_attrs
    )
  end

  def new
    @user = User.new
  end

  def show
  end


  def create
    @user = User.new(user_params)

    if @user.save
      flash[:success] = "User successufully created"
      return redirect_to users_path
    else
      render :new
    end
  end

  def edit
    @user = User.find params[:id]
  end

  def update
    if @user.update(user_params1)
      flash[:success] = "User successufully created"
      return redirect_to admin_users_path
    else
      render :new
    end
  end

  def destroy
    if @user.destroy
      flash[:success] = "User successufully deleted"
      return redirect_to admin_users_path
    end
  end
  private

  def get_attrs
    %w[id email role]
  end

  def set_user
    @user = User.find params[:id]
  end

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :role, :category_id)
  end

   def user_params1
    params.require(:user).permit(:email,  :role, :category_id)
  end
end
