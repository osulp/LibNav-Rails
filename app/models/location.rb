class Location < ApplicationRecord
  has_many :traits
  has_many :tags
end
