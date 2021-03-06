class Label < ApplicationRecord
  has_many :location_labels, inverse_of: :label
  has_many :locations, through: :location_labels

  validates :name, presence: true
  validates :value, presence: true

  rails_admin do
    base do
      field :name
      field :value
      field :locations do
        inline_add false
        nested_form false
      end
    end
  end
end
