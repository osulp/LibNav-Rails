class FloorsController < ApplicationController
  before_action :set_floors, only: %i[index]
  before_action :set_floor, only: %i[update]
  before_action :show_navbar
  # before_action :set_locations, only: %i[update]

  def index
    search_results = process_search(params[:search])
    locations = extract_locations(search_results)
    search_result_floors = extract_floors(locations)
    admin_user = false
    admin_user = current_user.admin? if user_signed_in?

    @state = {
      admin_user: admin_user,
      edit_locations: Location.all,
      floor: params[:floor_number] || 2,
      floors: @floors,
      locations: locations,
      maps: @floors.map { |f| f.map.url(:original) },
      persistent_locations: params[:kiosk] ? you_are_here_persistent_locations.flatten : you_are_not_here_persistent_locations,
      search_result_floors: search_result_floors,
      user: current_user
    }
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

  def floor_params
    params.require(:floor).permit(
      :id,
      :name,
      locations_attributes: %i[id position_x position_y height width]
    )
  end

  private

  def you_are_here_persistent_locations
    locations = persistent_locations_without_kiosk_only
    locations << you_are_here_location if params[:floor_number]
    locations
  end

  def you_are_not_here_persistent_locations
    persistent_locations_without_kiosk_only
  end

  def you_are_here_location
    Location.persistent.on_floor(params[:floor_number]).select { |location| location.kiosk_only? }
  end

  def persistent_locations_without_kiosk_only
    Location.persistent.select { |location| !location.kiosk_only? }
  end

  def process_search(search_params)
    return [] if search_params.nil?
    results = []
    results << Location.search_for(search_params)
    results << Tag.search_for(search_params)
    results << Trait.search_for(search_params)
    results.flatten
  end

  def extract_floors(locations)
    floors = Array.new(6)
    locations.to_a.each do |location|
      floors[location.floor.level - 1] = location.floor if floors[location.floor.level - 1].nil?
    end
    floors
  end

  def extract_locations(search_results)
    search_results.select do |r|
      return r.locations.to_a if r.is_a?(Trait) && r.value.casecmp('yes').zero?
      return r.location if r.is_a?(Tag)
      r
    end
  end

  def show_navbar
    params[:show_navbar] ||= '1'
    @show_navbar = params[:show_navbar] == '1'
  end

  def set_floor
    @floor = Floor.find(params[:id])
  end

  def set_locations
    @floor.locations = Location.where(floor: @floor)
  end

  def set_floors
    @floors = Floor.ordered
  end
end
