class ChangeFloorColumnName < ActiveRecord::Migration[5.1]
  def self.up
    rename_column :floors, :bounding_box_length, :bounding_box_height
  end

  def self.down
    rename_column :floors, :bounding_box_height, :bounding_box_length
  end
end
