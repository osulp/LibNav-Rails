Rails.application.routes.draw do
  devise_for :users
  root "home#index"
  get "/admin", to: "admin/admin_dashboard#index"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  #

  namespace :admin do
    resources :locations
  end
end
