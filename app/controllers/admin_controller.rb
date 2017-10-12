class AdminController < ApplicationController
  before_action :user_is_admin?

  private

    def user_is_admin?
      redirect_to "/" unless user_signed_in? && current_user.admin?
    end
end
