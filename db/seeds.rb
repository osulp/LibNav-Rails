# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
images = [
  { level: 1, file: 'Map_1.svg' },
  { level: 2, file: 'Map_2.svg' },
  { level: 3, file: 'Map_3.svg' },
  { level: 4, file: 'Map_4.svg' },
  { level: 5, file: 'Map_5.svg' },
  { level: 6, file: 'Map_6.svg' }
]

floors = [
  { name: 'First Floor', level: 1 },
  { name: 'Second Floor - Main', level: 2 },
  { name: 'Third Floor', level: 3 },
  { name: 'Fourth Floor', level: 4 },
  { name: 'Fifth Floor', level: 5 },
  { name: 'Sixth Floor', level: 6 }
]

floors.each do |f|
  floor = Floor.where(name: f[:name]).first
  floor = Floor.create(f) if floor.nil?
  next unless floor.map_file_name.nil?
  image = images.find { |i| i[:level] == f[:level] }
  file = File.open(File.join(Rails.root, 'app/assets/images', image[:file]))
  floor.map = file
  file.close
  floor.save!
end

locations = [
  { name: 'Circulation', position_x: 71, position_y: 121, width: 314, height: 151, floor_id: Floor.where(level: 2).first.id },
  { name: "2nd Floor Women's Restroom", position_x: 421, position_y: 520, width: 39, height: 67, floor_id: Floor.where(level: 2).first.id }
]

kiosk_locations = [
  { name: '4th Floor Kiosk', persistent: true, position_x: 267, position_y: 313, width: 9, height: 11, floor_id: Floor.where(level: 4).first.id },
  { name: '2nd Floor Kiosk', persistent: true, position_x: 440, position_y: 265, width: 9, height: 11, floor_id: Floor.where(level: 2).first.id }
]
# you_are_here_locations = [
#   { name: 'You Are Here - 4th Floor', persistent: true, position_x: 425, position_y: 237, width: 100, height: 100, floor_id: Floor.where(level: 4).first.id },
#   { name: 'You Are Here - 2nd Floor', persistent: true, position_x: 	221, position_y: 308, width: 100, height: 100, floor_id: Floor.where(level: 2).first.id }
# ]

kiosk_trait = Trait.create(name: 'Kiosk', value: 'Yes') unless Trait.exists?(name: 'Kiosk')
kiosk_trait ||= Trait.where(name: 'Kiosk')

you_are_here_label = Label.create(name: 'You Are Here', value: 'You Are Here') unless Label.exists?(name: 'You Are Here')
you_are_here_label ||= Label.where(name: 'You Are Here')
you_are_here_trait = Trait.create(name: 'render-only-at-kiosk', value: 'Yes') unless Trait.exists?(name: 'render-only-at-kiosk')
you_are_here_trait ||= Trait.where(name: 'render-only-at-kiosk')

locations.each do |location|
  Location.create(location) unless Location.exists?(name: location[:name])
end

kiosk_locations.each do |kiosk_location|
  location = Location.create(kiosk_location) unless Location.exists?(name: kiosk_location[:name])
  location ||= Location.where(name: kiosk_location[:name]).first
  location.traits << kiosk_trait unless location.traits.include?(kiosk_trait)
  location.save
end

# you_are_here_locations.each do |you_are_here|
#   location = Location.create(you_are_here) unless Location.exists?(name: you_are_here[:name])
#   location ||= Location.where(name: you_are_here[:name]).first
#   location.label << you_are_here_label unless location.label.include?(you_are_here_label)
#   location.traits << you_are_here_trait
#   location.save
# end
