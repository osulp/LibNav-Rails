class Location < ApplicationRecord
  scope :persistent, -> { where(persistent: true) }
  has_and_belongs_to_many :traits
  has_many :tags
  belongs_to :icon, optional: true
  belongs_to :floor, inverse_of: :locations
  scoped_search on: [:name]

  validates :name, :floor, :position_x, :position_y, :width, :height, presence: true

  def admin_url
    RailsAdmin::Engine.routes.url_helpers.edit_path(self.class.to_s.downcase, id)
  end

  def get_edit_map_props
    map_props = %i[width height position_x position_y id]
    map_props.each_with_object({}) { |prop, hash| hash[prop] = send(prop) if send(prop) }
  end

  def attributes
    super.merge(admin_url: admin_url)
  end

  rails_admin do
    base do
      field :name
      field :floor
      field :position_x
      field :position_y
      field :width
      field :height
      field :persistent
      field :traits
      field :tags
      field :icon
    end
  end

  private

  def self.is_persistent?
    self.persistent
  end
end
