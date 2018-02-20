class FloorsController < ApplicationController
  before_action :set_floors, only: %i[index]
  before_action :set_floor, only: %i[add_location update]
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
      add_location_url: route_for(:floor_add_location, id: 'FLOORID'),
      delete_location_url: route_for(:floor_delete_location, id: 'FLOORID', location_id: 'LOCATIONID'),
      edit_locations: Location.all,
      floor: params[:floor_number] || 2,
      floors: @floors,
      locations: locations,
      maps: @floors.map { |f| f.map.url(:original) },
      persistent_locations: get_persistent_locations,
      search_result_floors: search_result_floors,
      user: { email: user_signed_in? ? current_user.email : '' }
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

  def add_location
    locations = []
    floor_params[:locations_attributes].each_pair do |_k, location|
      locations << create_location(location) if location['id'].nil?
      locations << update_location(location) if location['id'].present?
    end
    respond_to do |format|
      format.json do
        render json: locations
      end
    end
  rescue StandardError => e
    respond_to do |format|
      format.json do
        render json: { error: e }, status: :internal_error
      end
    end
  end

  def delete_location
    location = Location.find(params[:location_id])
    location.destroy
    respond_to do |format|
      format.json do
        render json: []
      end
    end
  rescue StandardError => e
    respond_to do |format|
      format.json do
        render json: { error: e }, status: :internal_error
      end
    end
  end

  def floor_params
    params.require(:floor).permit(
      :id,
      :name,
      locations_attributes: %i[height id name polygon_points position_x position_y text_position_x text_position_y width]
    )
  end

  private

  def update_location(location)
    l = Location.find(location['id'])
    l.height = location['height'].to_i
    l.position_x = location['position_x'].to_i
    l.position_y = location['position_y'].to_i
    l.text_position_x = location['text_position_x'].to_i
    l.text_position_y = location['text_position_y'].to_i
    l.width = location['width'].to_i
    l.polygon_points = location['polygon_points']
    l.save
    l
  end
  def create_location(location)
    location['height'] = location['height'].to_i
    location['position_x'] = location['position_x'].to_i
    location['position_y'] = location['position_y'].to_i
    location['text_position_x'] = location['text_position_x'].to_i
    location['text_position_y'] = location['text_position_y'].to_i
    location['width'] = location['width'].to_i
    location['floor_id'] = @floor['id']
    Location.create(location)
  end

  def get_persistent_locations
    locations = Location.persistent.select { |location| !location.kiosk_only? }
    locations << Location.persistent.on_floor(params[:floor_number]).select { |location| location.kiosk_only? } if params[:floor_number] && (params[:kiosk] == "true")
    locations.flatten.uniq
  end

  def process_search(search_params)
    return [] if search_params.nil?
    results = []
    results << Location.search_for(search_params)
    results << Tag.search_for(search_params).has_location
    results << Trait.search_for(search_params).has_location
    results.flatten.uniq
  end

  def extract_floors(locations)
    floors = Array.new(6)
    locations.to_a.each do |location|
      floors[location.floor.level - 1] = location.floor if floors[location.floor.level - 1].nil?
    end
    floors
  end

  def extract_locations(sr)
    locations = []
    locations << sr.select { |r| r.is_a?(Trait) && r.value.casecmp('yes').zero? }.map{ |r| r.locations.to_a }
    locations << sr.select { |r| r.is_a?(Tag) && !r.location.nil? }.map{ |r| r.location }
    locations << sr.select { |r| r.is_a?(Location) }
    locations.flatten.uniq
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
