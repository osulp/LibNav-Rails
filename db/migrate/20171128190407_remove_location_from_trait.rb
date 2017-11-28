class RemoveLocationFromTrait < ActiveRecord::Migration[5.1]
  def change
    remove_reference :traits, :location, foreign_key: true
  end
end
