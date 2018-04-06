class RemoveTagFromLocation < ActiveRecord::Migration[5.1]
  def change
    remove_reference :locations, :tag, index: true
  end
end
