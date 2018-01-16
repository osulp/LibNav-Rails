const webpack = require('webpack')
const { environment } = require('@rails/webpacker')
environment.plugins.set('Provide', new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
  Popper: 'popper.js/dist/popper',
  bootstrap: 'bootstrap/dist/js/bootstrap'
}));

module.exports = environment
