class RemoveTagFromLocation < ActiveRecord::Migration[5.1]
  def change
    remove_reference :locations, :tag, foreign_key: true
  end
end
