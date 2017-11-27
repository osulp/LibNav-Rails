class Floor < ApplicationRecord
  has_attached_file :map
  validates_attachment_content_type :map, content_type: [/svg(\+xml)?\Z/]

  def get_edit_map_props
    # {
    #   bounding_box_x: @bounding_box_x,
    #   bounding_box_y: @bounding_box_y,
    #   bounding_box_height: @bounding_box_height,
    #   bounding_box_width: @bounding_box_width,
    #   grid_size: @grid_size,
    #   id: "floor-#{@level}"
    # }
    map_props = %i[bounding_box_height bounding_box_width bounding_box_x bounding_box_y grid_size]
    map_props.each_with_object({}) { |prop, hash| (hash[prop] = send(prop)) if send(prop) }
             .merge(id: "floor-#{level}")
  end
end
