class Floor < ApplicationRecord
  has_many :locations
  has_attached_file :map
  has_many :locations, inverse_of: :floor
  accepts_nested_attributes_for :locations
  validates_attachment_content_type :map, content_type: [/svg(\+xml)?\Z/]

  def get_edit_map_props
    # map_props = %i[bounding_box_height bounding_box_width bounding_box_x bounding_box_y grid_size]
    # map_props.each_with_object({}) { |prop, hash| (hash[prop] = send(prop)) if send(prop) }
    #          .merge(id: "floor-#{level}")
    { locations: locations.map(&:get_edit_map_props),
      id: "floor-#{id}" }
  end

  rails_admin do
    base do
      field :name
      field :level
      field :locations
      field :map, :paperclip do
        thumb_method :original
      end
    end
  end
end
