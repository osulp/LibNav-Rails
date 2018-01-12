class AddIconIdToLocation < ActiveRecord::Migration[5.1]
  def change
    add_reference :locations, :icon, foreign_key: true
  end
end
