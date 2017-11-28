class RemoveTraitFromLocation < ActiveRecord::Migration[5.1]
  def change
    remove_reference :locations, :trait, foreign_key: true
  end
end
