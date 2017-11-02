module FloorHelper
  def get_floor_id(floor)
    "floor-#{floor.level}"
  end

  def get_floor_link_class(floor)
    if floor.level == 2
      'nav-link active'
    else
      'nav-link'
    end
  end

  def get_floor_pane_class(floor)
    if floor.level == 2
      'tab-pane show active'
    else
      'tab-pane'
    end
  end
end
