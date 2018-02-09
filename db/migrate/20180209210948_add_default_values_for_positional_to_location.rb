class AddDefaultValuesForPositionalToLocation < ActiveRecord::Migration[5.1]
  def change
    change_column_default :locations, :position_x, 50
    change_column_default :locations, :position_y, 50
    change_column_default :locations, :width, 50
    change_column_default :locations, :height, 50
  end
end
