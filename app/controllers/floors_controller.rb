class FloorsController < ApplicationController
  before_action :set_floors, only: %i[index]
  before_action :set_icons, only: %i[index]
  before_action :set_floor, only: %i[add_location update]
  before_action :show_navbar
  before_action :enable_iframe
  # before_action :set_locations, only: %i[update]

  def index
    flash.clear
    search_results = is_valid_search? ? process_search(params[:search]) : []
    locations = extract_locations(search_results)
    search_result_floors = extract_floors(locations)
    admin_user = false
    admin_user = current_user.admin? if user_signed_in?
    flash[:info] = 'No locations found' if search_results.empty?
    flash[:success] = "Found #{locations.count} location#{locations.count == 1 ? '' : 's'}" unless locations.empty?

    @state = {
      add_location_url: route_for(:floor_add_location, id: 'FLOORID'),
      admin_user: admin_user,
      delete_location_url: route_for(:floor_delete_location, id: 'FLOORID', location_id: 'LOCATIONID'),
      edit_locations: Location.all,
      flash_messages: flash.to_h,
      floor: params[:floor_number] || 2,
      floors: @floors,
      icons: @icons,
      locations: locations,
      maps: @floors.map { |f| f.map.url(:original) },
      persistent_locations: get_persistent_locations,
      search_result_floors: search_result_floors,
      user: { email: user_signed_in? ? current_user.email : '' }
    }
  end

  def add_location
    locations = []
    floor_params[:locations_attributes].each_pair do |_k, l|
      location = create_location(l) if l['id'].nil?
      location = update_location(l) if l['id'].present?
      label = find_or_create_label(location, floor_params[:label_attributes]) if floor_params[:label_attributes].present?
      icon = save_location_on_icon(location, floor_params[:icon_attributes][:id]) if floor_params[:icon_attributes].present?
      data = { location: location }
      data.merge({icon: icon}) if icon.present?
      data.merge({label: label}) if label.present?
      locations << data
    end
    respond_to do |format|
      format.json do
        render json: locations
      end
    end
  rescue StandardError => e
    logger.error e.message
    e.backtrace.each { |l| logger.error l }
    respond_to do |format|
      format.json do
        render json: { error: 'Failed saving location.' }, status: :internal_error
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
      icon_attributes: %i[ id ],
      locations_attributes: %i[ height id name polygon_points position_x position_y text_position_x text_position_y icon_position_x icon_position_y width ]
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

  def save_location_on_icon(location, icon_id)
    return location.icon unless location.icon.nil?
    icon = nil
    if Icon.exists?(icon_id)
      icon = Icon.find(icon_id)
      icon.locations << location
      icon.save
    end
    icon
  end

  def update_location(l)
    location = Location.find(l['id'])
    location.height = l['height'].to_i
    location.position_x = l['position_x'].to_i
    location.position_y = l['position_y'].to_i
    location.text_position_x = l['text_position_x'].to_i
    location.text_position_y = l['text_position_y'].to_i
    location.icon_position_x = l['icon_position_x'].to_i
    location.icon_position_y = l['icon_position_y'].to_i
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
    params['icon_position_x'] = params['icon_position_x'].to_i
    params['icon_position_y'] = params['icon_position_y'].to_i
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
    results << Icon.search_for(search_params).has_locations
    results = results.flatten.uniq
    results
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
    locations << sr.select { |r| r.is_a?(Trait) }.map{ |r| r.locations.to_a }
    locations << sr.select { |r| r.is_a?(Tag) && !r.location.nil? }.map{ |r| r.location }
    locations << sr.select { |r| r.is_a?(Location) }
    locations << sr.select { |r| r.is_a?(Icon) }.map{ |r| r.locations.to_a }
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

  def set_icons
    @icons = Icon.ordered
  end

  def enable_iframe
    response.headers.except! 'X-Frame-Options'
  end

  def is_valid_search?
    params[:search].present? && !params[:search].empty?
  end
end
