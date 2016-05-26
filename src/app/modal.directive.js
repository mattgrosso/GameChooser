(function() {
  'use strict';

  angular
    .module('game')
    .directive('modal', Modal);

  function Modal() {
    
    return {
      restrict: 'E',
      templateUrl: '/app/modal.template.html',
      link: setup,
      transclude: true,
      scope: {
        show: '=show',
        close: '&close'
      }
    };

    function setup(scope) {
      scope.$watch(function () {
        return scope.show;
      }, function (value) {
        if (value) {
          angular.element('body').addClass('freeze-scrolling');
        } else {
          angular.element('body').removeClass('freeze-scrolling');
        }
      });
    }
  }



})();
