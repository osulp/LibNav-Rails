class Location {
  constructor(props) {
    let guid = Location.guid();
    this.id                     = props.id                    || guid;
    this.admin_url              = props.admin_url             || '';
    this.add_location_url       = props.add_location_url      || '';
    this.created_at             = props.created_at            || new Date().toISOString();
    this.delete_location_url    = props.delete_location_url   || '';
    this.didSave                = props.deleteSave            || false;
    this.floor_id               = props.floor_id              || 1;
    this.hasChanges             = props.hasChanges            || false;
    this.hasError               = props.hasError              || false;
    this.height                 = props.height                || 50;
    this.label_id               = props.label_id              || 0;
    this.icon_id                = props.icon_id               || 0;
    this.icon_url               = props.icon_url              || '';
    this.internal_id            = props.internal_id           || guid;
    this.isChanging             = props.isChanging            || false;
    this.isDragging             = props.isDragging            || false;
    this.isSaving               = props.isSaving              || false;
    this.isNew                  = props.isNew                 || false;
    this.label_text             = props.label_text            || '';
    this.name                   = props.name                  || '';
    this.persistent             = props.persistent            || false;
    this.polygon_points         = props.polygon_points        || '';
    this.polygon_points_diff_x  = props.polygon_points_diff_x || 0;
    this.polygon_points_diff_y  = props.polygon_points_diff_y || 0;
    this.polygon_points_max_x   = props.polygon_points_max_x  || 0;
    this.polygon_points_max_y   = props.polygon_points_max_y  || 0;
    this.polygonClosed          = props.polygon_Closed        || false;
    this.position_x             = props.position_x            || 10;
    this.position_y             = props.position_y            || 10;
    this.previous_position_x    = props.previous_position_x   || 10;
    this.previous_position_y    = props.previous_position_y   || 10;
    this.shouldSave             = props.shouldSave            || false;
    this.text_height            = props.text_height           || 0;
    this.text_position_x        = props.text_position_x       || 0;
    this.text_position_y        = props.text_position_y       || 0;
    this.text_width             = props.text_width            || 0;
    this.updated_at             = props.updated_at            || new Date().toISOString();
    this.width                  = props.width                 || 50;
  }

  static guid = () => {
    let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  static addPolygonPoint = (x, y, p) => {
    let points = Location.deserializedPolygonPoints(p);
    points.push([x,y]);
    return Location.serializePolygonPoints(points);
  }

  static deserializedPolygonPoints = (points) => {
    if(points === '') {
      return [];
    } else if(typeof(points) === 'string') {
      return points.split(' ').map(p => [parseInt(p.split(',')[0]), parseInt(p.split(',')[1])]);
    }
    return points;
  }

  static movePolygonPoints = (diffX, diffY, p) => {
    let points = Location.deserializedPolygonPoints(p).map(p => [p[0] + diffX, p[1] + diffY]);
    return Location.serializePolygonPoints(points);
  }

  static polygonPointMax = (points) => {
    return {
      polygon_points_max_x: Math.max(...points.map(p => p[0])),
      polygon_points_max_y: Math.max(...points.map(p => p[1]))
    };
  }

  static serializePolygonPoints = (points) => {
    if(typeof(points) === 'string') {
      return points;
    } else {
      return points.map(p => `${p[0]},${p[1]}`).join(' ');
    }
  }

  delete = (csrf, success, fail) => {
    let token = $('meta[name="csrf-token"]').attr('content');
    $.ajax({
      url: this.delete_location_url.replace('FLOORID', this.floor_id).replace('LOCATIONID', this.id),
      type: 'delete',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-CSRF-Token', csrf);
      }
    }).done((data, status, xhr) => {
      success(this.id);
    }).fail((xhr, status, error) => {
      fail({
        didSave: false,
        hasChanges: false,
        hasError: true,
        internal_id: this.internal_id,
        isNew: false,
        isSaving: false,
        shouldSave: false
      });
    });
  }

  save = (csrf, success, fail) => {
    let locations = [{
      height: this.height,
      name: this.name,
      position_x: this.position_x,
      position_y: this.position_y,
      polygon_points: this.polygon_points,
      text_position_x: this.text_position_x,
      text_position_y: this.text_position_y,
      width: this.width
    }];

    if(typeof(this.id) !== 'string') {
      locations[0] = {...locations[0], ...{ id: this.id }};
    }
    setTimeout(() =>   {
      $.ajax({
        url: this.add_location_url.replace('FLOORID', this.floor_id),
        type: 'post',
        beforeSend: (xhr) => {
          xhr.setRequestHeader('X-CSRF-Token', csrf);
        },
        data: {
          floor: {
            locations_attributes: locations
          }
        }
      }).done((data, status, xhr) => {
        success({location: data[0], next_state: {
          admin_url: data[0].admin_url,
          didSave: true,
          hasChanges: false,
          hasError: false,
          id: data[0].id,
          internal_id: this.internal_id,
          isNew: false,
          isSaving: false,
          polygon_points: data[0].polygon_points,
          shouldSave: false
        }});
      }).fail((xhr, status, error) => {
        fail({
          didSave: false,
          hasChanges: false,
          hasError: true,
          internal_id: this.internal_id,
          isSaving: false,
          shouldSave: false
        });
      });
    }, 1000);
  }
}

export default Location;