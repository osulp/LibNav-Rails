Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  devise_for :users
  root 'floors#index'
  resources :floors
  get "/floor/:floor_number", to: "floors#chosen_floor", as: "chosen_floor"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
