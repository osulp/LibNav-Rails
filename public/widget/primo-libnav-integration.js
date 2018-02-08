(function () {
  "use strict";
  'use strict';


  var app = angular.module('viewCustom', ['angularLoad'])


  /*<!-- LibNav Widget Integration -->*/
  app.controller('prmSearchResultAvailabilityLineAfterController',  ['angularLoad', function (angularLoad) {
    var w = this;
    var w = document.createElement("script");
    w.type = "text/javascript";
    w.async = true;
    w.src = "http://navigation.library.oregonstate.edu/widget/lib-nav.js";
    var b = document.getElementsByTagName("script")[0];
    b.parentNode.insertBefore(w, b);

    var css2 = document.createElement("link");
    css2.type = "text/css";
    css2.rel = "Stylesheet";
    css2.href = "http://navigation.library.oregonstate.edu/widget/lib-nav.css";
    var a = document.getElementsByTagName("script")[0];
    a.parentNode.insertBefore(css2, a);
  }]);

  app.component('prmSearchResultAvailabilityLineAfter', {
    bindings: { },
    controller: 'prmSearchResultAvailabilityLineAfterController',
    template: `<div class="libnav-map">
    </div>`
  });
  /*<!-- LibNav End -->*/
})();

