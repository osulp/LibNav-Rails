RailsAdmin.config do |config|
  ## == Devise/Warden Authorization using User #admin? method ==
  config.authorize_with do
    redirect_to main_app.root_path unless !warden.user.nil? && warden.user.admin?
  end

  # Configures CRUD Actions/Functionality
  config.actions do
    # #Mandatory for Rails_Admin
    dashboard
    index

    # CRUD
    new do
      except Floor
    end
    show
    edit
    delete do
      except Floor
    end

    # Provided by Rails_Admin. Not entirely sure what this does yet.
    export
    show_in_app

    # Configuration for Models controlled by rails_admin
    config.included_models = %w[User Location Trait TraitType Floor Tag]

    # User Model Configuration. Allows editing of Email and Admin Status
    config.model 'User' do
      edit do
        field :email
        field :admin
      end
    end

    # Location Model Configuration.
    config.model 'Location' do
      edit do
        field :name
        field :position_x
        field :position_y
        field :width
        field :height
        field :traits
        field :tags
      end
    end

    # Trait Model Configuration
    config.model 'Trait' do
      edit do
        field :name
        field :value
        field :locations
      end
    end

    # TraitType Model Configuration
    config.model 'TraitType' do
      edit do
        field :label
        field :values
      end
    end

    # Floor model Configuration
    config.model 'Floor' do
      edit do
        field :name
        field :level
        field :map do
          thumb_method :medium
        end
      end
    end
    config.model 'Tag' do
      edit do
        field :label
        field :location
      end
    end
  end
end
