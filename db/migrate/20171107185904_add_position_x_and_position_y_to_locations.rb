class AddPositionXAndPositionYToLocations < ActiveRecord::Migration[5.1]
  def change
    add_column :locations, :position_x, :integer
    add_column :locations, :position_y, :integer
  end
end
