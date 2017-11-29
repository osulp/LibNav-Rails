class FloorsController < ApplicationController
  before_action :set_floors, only: %i[index]
  before_action :set_floor, only: %i[update]

  def index
    @floors = @floors.order('level ASC')
    @search_results = params[:search_type].constantize.search_for(params[:search]) if params[:search]
    @locations = extract_locations(@search_results) if @search_results
    @search_result_floors = extract_floors(@locations.flatten) if @locations
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

  def normalize_search_result_floors(floors)
    @normalized_floors = [nil, nil, nil, nil, nil, nil]
    floors.each do |floor|
      @normalized_floors[floor.level - 1] = floor
    end
    @normalized_floors
  end

  def extract_floors(locations)
    @search_result_floors = []
    locations.each do |location|
      @search_result_floors << location.floor if !@search_result_floors.include?(location.floor)
    end
    normalize_search_result_floors(@search_result_floors)
  end

  def extract_locations(search_results)
    @locations = []
    if search_results.first.is_a?(Trait)
      search_results.each do |result|
        @locations << result.locations if result.value == "Yes"
      end
    else
      search_results.each do |result|
        @locations << result.location
      end
    end
    @locations
  end

  def set_floor
    @floor = Floor.find(params[:id])
  end

  def set_floors
    @floors = Floor.all
  end
end
