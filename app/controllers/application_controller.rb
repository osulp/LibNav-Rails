class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception, unless: :isApiRequest?

  private

  def isApiRequest?
    request.controller_class.to_s.start_with?('Api::')
  end
end
