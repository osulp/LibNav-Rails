Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  devise_for :users
  root 'floors#index'
  get '/floor/:floor_number(/:toggle_navbar)', to: 'floors#chosen_floor', as: 'chosen_floor'
  resources :floors do
    resources :locations
  end
  post '/search', to: 'home#search', as: 'search'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
