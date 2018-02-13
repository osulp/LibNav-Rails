class AddLabelIdToLocation < ActiveRecord::Migration[5.1]
  def change
    add_reference :locations, :label, foreign_key: true
  end
end
