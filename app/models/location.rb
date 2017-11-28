class Location < ApplicationRecord
  has_and_belongs_to_many :traits
  has_many :tags
  belongs_to :floor
end
