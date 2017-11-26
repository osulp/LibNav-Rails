json.array!(current_user) do |user|
  json.extract! user, :id, :email
end
json.floors @floors
json.map map
json.search_results @search_results
