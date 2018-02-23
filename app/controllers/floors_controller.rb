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
    if @floor.update(floor_params.except(:label_params))
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
    floor_params[:locations_attributes].each_pair do |_k, l|
      location = create_location(l) if l['id'].nil?
      location = update_location(l) if l['id'].present?
      label = find_or_create_label(location, floor_params[:label_attributes])
      locations << { location: location, label: label }
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
      label_attributes: %i[ name ],
      locations_attributes: %i[ height id name polygon_points position_x position_y text_position_x text_position_y width ]
    )
  end

  private

  def find_or_create_label(location, params)
    return location.label unless location.label.nil?
    label = Label.where('lower(value) = ?', params[:name].downcase).first
    label ||= Label.create(name: params[:name], value: params[:name])
    label.locations << location
    label.save
    label
  end

  def update_location(l)
    location = Location.find(l['id'])
    location.height = l['height'].to_i
    location.position_x = l['position_x'].to_i
    location.position_y = l['position_y'].to_i
    location.text_position_x = l['text_position_x'].to_i
    location.text_position_y = l['text_position_y'].to_i
    location.width = l['width'].to_i
    location.polygon_points = l['polygon_points']
    location.save
    location
  end

  def create_location(params)
    params['height'] = params['height'].to_i
    params['position_x'] = params['position_x'].to_i
    params['position_y'] = params['position_y'].to_i
    params['text_position_x'] = params['text_position_x'].to_i
    params['text_position_y'] = params['text_position_y'].to_i
    params['width'] = params['width'].to_i
    params['floor_id'] = @floor['id']
    Location.create(params)
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
