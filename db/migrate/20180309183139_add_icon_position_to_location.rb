class AddIconPositionToLocation < ActiveRecord::Migration[5.1]
  def change
    add_column :locations, :icon_position_x, :integer
    add_column :locations, :icon_position_y, :integer
  end
end
