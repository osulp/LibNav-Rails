class Location < ApplicationRecord
  has_many :attributes, dependant: :destroy
end
