class CreateLocationLabels < ActiveRecord::Migration[5.1]
  def change
    create_table :location_labels do |t|

      t.timestamps
    end
  end
end
