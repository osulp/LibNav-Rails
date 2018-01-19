class AddLocationIdAndLabelIdToLocationLabels < ActiveRecord::Migration[5.1]
  def change
    add_column :location_labels, :location_id, :integer
    add_column :location_labels, :label_id, :integer
  end
end
