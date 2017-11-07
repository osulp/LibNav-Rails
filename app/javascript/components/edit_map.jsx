import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class EditMap extends React.Component {
  render() {
    console.log(this.props);
    return <div className="map" />
  }

  componentDidMount() {
    d3.select('')
  }
}