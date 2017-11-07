class FloorsController < ApplicationController
  before_action :set_floors, only: %i[index]
  before_action :set_floor, only: %i[update]

  def index
    @floors = @floors.order('level ASC')
    @search_results = params[:search_type].constantize.search_for(params[:search]) if params[:search]
  end

  def update
    if @floor.update(floor_params)
      respond_to do |format|
        format.json do
          render json: @floor
        end
      end
    end
  end

  def chosen_floor
    @floor = Floor.find(params[:floor_number])
  end

  def floor_params
    params.require(:floor).permit(
      :id,
      :bounding_box_x,
      :bounding_box_y,
      :bounding_box_height,
      :bounding_box_width,
      :grid_size
    )
  end

  private

  def set_floor
    @floor = Floor.find(params[:id])
  end

  def set_floors
    @floors = Floor.all
  end
end
