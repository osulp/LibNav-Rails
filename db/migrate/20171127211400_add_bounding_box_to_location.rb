class AddBoundingBoxToLocation < ActiveRecord::Migration[5.1]
  def change
    add_column :locations, :height, :integer, default: 10
    add_column :locations, :width, :integer, default: 10
  end
end
