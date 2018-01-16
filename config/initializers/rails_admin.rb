RailsAdmin.config do |config|
  ## == Devise/Warden Authorization using User #admin? method ==
  config.authorize_with do
    redirect_to main_app.root_path unless !warden.user.nil? && warden.user.admin?
  end

  # Configures CRUD Actions/Functionality
  config.actions do
    # Mandatory for Rails_Admin
    dashboard
    index
    new do
      except %w(Floor User)
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
    #config.included_models = %w[User Location Trait TraitType Floor Tag]
  end
end
