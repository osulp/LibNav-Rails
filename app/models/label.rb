class Label < ApplicationRecord
  has_many :location_labels
  has_many :locations, through: :location_labels

  rails_admin do
    base do
      field :name
      field :value
    end
  end
end
