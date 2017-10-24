class Floor < ApplicationRecord
  has_attached_file :map
  validates_attachment_content_type :map, content_type: [/svg(\+xml)?\Z/]
end
