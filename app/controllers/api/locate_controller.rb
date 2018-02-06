class Api::LocateController < Api::ApiController
  def show
    respond_to do |format|
      format.html { redirect_to redirect_url }
      format.json { render json: { result: 'not-yet-implemented' }, status: :ok }
    end
  end

  private

  def redirect_url
    return ENV['API_DEFAULT_REDIRECT_URL'] if params[:location_code].nil?
    url = lookup_redirect_url(params[:location_code])
    url.blank? ? ENV['API_DEFAULT_REDIRECT_URL'] : url
  end

  # :nocov:
  def load_yaml
    YAML.safe_load(File.read(File.join(Rails.root, ENV['API_LOCATION_MAP_LOOKUP'])))
  end
  # :nocov:

  def lookup_redirect_url(location_code)
    lookup = load_yaml
    lookup[location_code]
  end
end
