class Location < ApplicationRecord
  has_and_belongs_to_many :traits
  has_many :tags
  has_one :icon
  belongs_to :floor, inverse_of: :locations
  scoped_search on: [:name]

  def get_edit_map_props
    map_props = %i[width height position_x position_y id]
    map_props.each_with_object({}) { |prop, hash| hash[prop] = send(prop) if send(prop) }
  end

  private

  def self.is_persistent?
    self.persistent
  end

end
