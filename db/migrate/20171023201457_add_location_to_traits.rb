class AddLocationToTraits < ActiveRecord::Migration[5.1]
  def change
    add_reference :traits, :location, foreign_key: true
  end
end
