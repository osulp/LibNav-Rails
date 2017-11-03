class FloorsController < ApplicationController
  before_action :set_floors, only: %i[index]

  def index
    @floors = @floors.order('level ASC')
  end

  private

  def set_floors
    @floors = Floor.all
  end
end
