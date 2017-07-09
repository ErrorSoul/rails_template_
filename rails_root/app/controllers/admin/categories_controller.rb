class Admin::CategoriesController < Admin::BaseController
  before_action :set_category, only: [:show, :edit, :update, :destroy]

  # GET /categorys
  # GET /categorys.json
  def index
    @categories = Category.order(id: :desc)
                         .page(params[:page])
    @obj = TableObject.new(
      name: "Category",
      pool: @categories,
      attrs: get_attrs
    )
  end

  def new
    @category = Category.new
  end

  # GET /categorys/1
  # GET /categorys/1.json
  def show
    @obj = ShowObject.new(elem: @category)
  end

  # GET /categorys/new
  def new
    @category = Category.new
  end

  # GET /categorys/1/edit
  def edit
  end

  # POST /categorys
  # POST /categorys.json
  def create
    @category = Category.new(category_params)
    if @category.save
      flash[:success] =  'Category was successfully created.'
      return redirect_to admin_category_path(@category)
    else
      render :new
    end
  end

  # PATCH/PUT /categorys/1
  # PATCH/PUT /categorys/1.json
  def update
    respond_to do |format|
      if @category.update(category_params)
        format.html { redirect_to admin_category_path(@category), notice: 'Category was successfully updated.' }
        format.json { render :show, status: :ok, location: @category }
      else
        format.html { render :edit }
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /categorys/1
  # DELETE /categorys/1.json
  def destroy
    @category.destroy
    respond_to do |format|
      format.html { redirect_to admin_categories_url, notice: 'Category was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def search
    categorys = Category.find_by(id: params[:product_search][:name])
    render json: { products: [categorys] }
  end

  private

  def get_attrs
    %w[name]
  end
    # Use callbacks to share common setup or constraints between actions.
    def set_category
      @category = Category.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def category_params
      params.require(:category).permit(:name)
    end
end
