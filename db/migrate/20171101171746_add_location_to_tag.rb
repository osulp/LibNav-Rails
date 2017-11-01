class AddLocationToTag < ActiveRecord::Migration[5.1]
  def change
    add_reference :tags, :location, foreign_key: true
  end
end
