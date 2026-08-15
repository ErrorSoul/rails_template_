# frozen_string_literal: true

module Admin
  class SuperusersController < AdminController
    before_action :load_superuser, only: %i[show edit update destroy]

    def index
      @superusers = Superuser.order(:login)
    end

    def show; end

    def new
      @superuser = Superuser.new
    end

    def create
      @superuser = Superuser.new(superuser_params)
      if @superuser.save
        redirect_to admin_superuser_path(@superuser), notice: 'Создан'
      else
        render :new, status: :unprocessable_entity
      end
    end

    def edit; end

    def update
      attrs = superuser_params
      attrs.delete(:password) if attrs[:password].blank?
      if @superuser.update(attrs)
        redirect_to admin_superuser_path(@superuser), notice: 'Обновлён'
      else
        render :edit, status: :unprocessable_entity
      end
    end

    def destroy
      @superuser.destroy
      redirect_to admin_superusers_path, notice: 'Удалён'
    end

    private

    def load_superuser
      @superuser = Superuser.find(params[:id])
    end

    def superuser_params
      params.require(:superuser).permit(:login, :password)
    end
  end
end
