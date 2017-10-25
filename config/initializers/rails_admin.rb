RailsAdmin.config do |config|

  ## == Devise/Warden Authorization using User #admin? method ==
  config.authorize_with do
    redirect_to main_app.root_path unless warden.user.admin?
  end

  # Configures CRUD Actions/Functionality
  config.actions do
    ##Mandatory for Rails_Admin
    dashboard
    index

    #CRUD
    new
    show
    edit
    delete

    #Provided by Rails_Admin. Not entirely sure what this does yet.
    export
    show_in_app

    #Configuration for Models controlled by rails_admin
    config.included_models = %w[User Location Trait TraitType]

    #User Model Configuration. Allows editing of Email and Admin Status
    config.model 'User' do
      edit do
        field :email
        field :admin
      end
    end

    #Location Model Configuration.
    config.model 'Location' do
      edit do
        field :name
        field :trait
      end
    end

    #Trait Model Configuration
    config.model 'Trait' do
      edit do
        field :name
        field :value
      end
    end

    #TraitType Model Configuration
    config.model 'TraitType' do
      edit do
        field :label
        field :values
      end
    end
  end
end
