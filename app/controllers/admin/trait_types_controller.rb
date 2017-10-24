class Admin::TraitTypesController < AdminController
  skip_before_action :user_is_admin?, only: [:index, :show]
  before_action :find_trait_type, only: [:show, :edit, :update, :destroy]

  def index
    @trait_types = TraitType.all
  end

  def show
  end

  def new
    @trait_type = TraitType.new
  end

  def edit
  end

  def create
    @trait_type = TraitType.new(trait_type_params)

    respond_to do |format|
      if @trait_type.save
        format.html { redirect_to admin_trait_type_path(@trait_type.id), :method => :get, notice: 'TraitType was successfully created.' }
        format.json { render :show, status: :created, trait_type: @trait_type }
      else
        format.html { render :new }
        format.json { render json: @trait_type.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @trait_type.update(trait_type_params)
        format.html { redirect_to admin_trait_type_path(@trait_type.id), :method => :get, notice: 'TraitType was successfully updated.' }
        format.json { render :show, status: :ok, trait_type: @trait_type }
      else
        format.html { render :edit }
        format.json { render json: @trait_type.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @trait_type.destroy
    respond_to do |format|
      format.html { redirect_to admin_trait_types_url, notice: 'TraitType was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
  def trait_type_params
    params.require(:trait_type).permit(:label, :values)
  end

  def find_trait_type
    @trait_type = TraitType.find(params[:id])
  end

end
