class FloorsController < ApplicationController
  before_action :set_floors, only: %i[index]
  before_action :set_floor, only: %i[update]
  # before_action :set_locations, only: %i[update]

  def index
    @floors = @floors.order('level ASC')
    @floor = params[:floor_number] || 2
    @toggle_nav = params[:toggle_navbar] || false
    @maps = extract_maps_from_floors(@floors)
    @persistent_locations = fetch_persistent_locations
    @search_results = process_search(params[:search]) if params[:search]
    if current_user
      @admin_user = current_user.admin?
    else
      @admin_user = false
    end
    @search_results = @search_results.flatten if @search_results
    if @search_results
      @locations = extract_locations(@search_results) if @search_results
      @search_result_floors = extract_floors(@locations) if @locations
      @edit_locations = Location.all
    else
      @edit_locations = Location.all
    end
  end

  def update
    if @floor.update(floor_params)
      floor_params[:locations_attributes].each_pair do |_k, location|
        Location.find(location[:id]).update_attributes(location)
      end
      respond_to do |format|
        format.json do
          puts '== responding to JSON'
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
      :name,
      locations_attributes: %i[id position_x position_y height width]
    )
  end

  private

  def fetch_persistent_locations
    Location.where(:persistent => true)
  end

  def process_search(search_params)
    @search_results = []
    @search_results << Location.search_for(search_params)
    @search_results << Tag.search_for(search_params)
    @search_results << Trait.search_for(search_params)
    @search_results
  end

  def normalize_search_result_floors(floors)
    @normalized_floors = [nil, nil, nil, nil, nil, nil]
    floors.each do |floor|
      @normalized_floors[floor.level - 1] = floor
    end
    @normalized_floors
  end

  def extract_maps_from_floors(floors)
    @maps = []
    floors.each do |floor|
      @maps << floor.map
    end
    @maps
  end

  def extract_floors(locations)
    @search_result_floors = []
      locations.each do |location|
        if (location.is_a?(Location))
          @search_result_floors << location.floor unless @search_result_floors.include?(location.floor)
        elsif(locations.first.is_a?(Tag))
          @search_result_floors << tag.location.floor unless @search_result_floors.include?(tag.location.floor)
        else

        end
      end
    normalize_search_result_floors(@search_result_floors)
  end

  def extract_locations(search_results)
    @locations = []
    if search_results.first.is_a?(Trait)
      search_results.each do |result|
        @locations.concat(result.locations) if result.value == 'Yes'
      end
    elsif search_results.first.is_a?(Tag)
      search_results.each do |result|
        @locations << result.location
      end
    else
      search_results.each do |result|
        @locations << result
      end
    end
    @locations
  end

  def set_floor
    @floor = Floor.find(params[:id])
    # byebug
  end

  def set_locations
    @floor.locations = Location.where(floor: @floor)
  end

  def set_floors
    @floors = Floor.all
  end
end
