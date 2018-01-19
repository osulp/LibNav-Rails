class CreateLabels < ActiveRecord::Migration[5.1]
  def change
    create_table :labels do |t|

      t.timestamps
    end
  end
end
