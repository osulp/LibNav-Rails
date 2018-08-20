# frozen_string_literal: true

if %w[production staging].include? Rails.env
  Datadog.configure do |c|
    c.use :rails, service_name: "lib-nav-#{Rails.env}"
    c.use :http, service_name: "lib-nav-#{Rails.env}-http"
  end
end
