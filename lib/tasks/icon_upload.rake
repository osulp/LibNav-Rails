namespace :libnav do
  desc "Uploads a directory specified or default directories images as Icons in LibNav"
  task :upload_icons, [:icon_directory_path] => [ :environment ] do |t, args|
    #set default for the argument
    args.with_defaults(:icon_directory_path => Rails.root.join("public", "images", "icons"))

    #display path being used
    puts "Using images in path #{args[:icon_directory_path]}"

    #ensure the directory specified actually exists
    if !Dir.exists?(args[:icon_directory_path])
      puts "Path to icons doesnt exist #{args[:icon_directory_path]}" unless Dir.exists?(args[:icon_directory_path])
      exit
    end

    #iterate through files and create icons with icon images. Name of icon is
    #the file name for the file.
    files_processed = 0
    files_total = Dir.glob(File.join(args[:icon_directory_path], "*.*")).count
    Dir.foreach(args[:icon_directory_path]) do |file|
      next unless file.to_s.include?(".svg") || file.to_s.include?(".png") || file.to_s.include?(".jpg") || file.to_s.include?(".jpeg")
      if !Icon.exists?(:name => file.to_s.split(".").first)
        Icon.create!(:name => file.to_s.split(".").first,
                     :icon_image => File.open(args[:icon_directory_path].to_s + "/" + file.to_s))
        files_processed += 1
      end
    end

    puts "processed #{files_processed} files out of #{files_total}"
  end
end
