class RemoveTagFromLocation < ActiveRecord::Migration[5.1]
  def change
    if foreign_key_exists?(:locations, column: :tag_id)
      remove_reference :locations, :tag, index: true
    end
  end
end
