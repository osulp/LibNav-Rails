json.array!(current_user) do |user|
  json.extract! user, :id, :email
end
json.floors @floors
json.maps @maps
json.locations @locations
json.search_result_floors @search_result_floors
