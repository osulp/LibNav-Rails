class Admin::LocationsController < AdminController
  skip_before_action :user_is_admin?, only: [:index, :show]
  before_action :find_location, only: [:show, :edit, :update, :destroy]

  def index
    @locations = Location.all
  end

  def show
  end

  def new
    @location = Location.new
  end

  def edit
  end

  def create
    @location = Location.new(location_params)

    respond_to do |format|
      if @location.save
        format.html { redirect_to admin_location_path(@location.id), :method => :get, notice: 'Location was successfully created.' }
        format.json { render :show, status: :created, location: @location }
      else
        format.html { render :new }
        format.json { render json: @location.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @location.update(location_params)
        format.html { redirect_to admin_location_path(@location.id), :method => :get, notice: 'Location was successfully updated.' }
        format.json { render :show, status: :ok, location: @location }
      else
        format.html { render :edit }
        format.json { render json: @location.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @location.destroy
    respond_to do |format|
      format.html { redirect_to admin_locations_url, notice: 'Location was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
  def location_params
    params.require(:location).permit(:name)
  end

  def find_location
    @location = Location.find(params[:id])
  end
end
