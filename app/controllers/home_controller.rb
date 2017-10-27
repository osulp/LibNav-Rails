class HomeController < ApplicationController
  def index
    @floor = Floor.all.first
  end
end
