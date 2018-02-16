class AddPolygonPointsToLocation < ActiveRecord::Migration[5.1]
  def change
    add_column :locations, :polygon_points, :string
  end
end
