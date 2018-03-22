RailsAdmin.config do |config|
  ## == Devise/Warden Authorization using User #admin? method ==
  config.authorize_with do
    if !current_user.nil? && !current_user.admin?
      flash[:info] = 'Access Denied'
      redirect_to main_app.root_path
    end
  end

  # Configures CRUD Actions/Functionality
  config.actions do
    # Mandatory for Rails_Admin
    dashboard
    index
    new do
      except %w(Floor User Icon)
    end
    show
    edit
    delete do
      except Floor
    end

    # Provided by Rails_Admin. Not entirely sure what this does yet.
    export
    # Most of these don't have a controller and #show
    #show_in_app

    # Configuration for Models controlled by rails_admin
    config.included_models = %w[User Location Trait Floor Tag Icon Label]
  end
end
