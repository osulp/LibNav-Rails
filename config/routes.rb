Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  devise_for :users
  root 'floors#index'
  get '/floor/:floor_number(/:show_navbar)(/:kiosk)', to: 'floors#index', as: 'chosen_floor'
  resources :floors do
    resources :locations
  end
  post '/search', to: 'home#search', as: 'search'
  namespace :api do
    match '/locate', to: 'locate#show', as: 'locate', via: %i[get post]
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
