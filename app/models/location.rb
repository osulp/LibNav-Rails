class Location < ApplicationRecord
  has_many :traits, dependent: :destroy
end
