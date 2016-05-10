(function() {
  'use strict';

  angular
    .module('game')
    .factory('GameFactory', GameFactory);

  GameFactory.$inject = ['$http', '$q', '$localStorage'];

  function GameFactory($http, $q, $localStorage) {

    return {
      getUserCollection: getUserCollection,
    };

    function getUserCollection(username) {
      if ($localStorage.collection){
        console.log('inside of if($localStorage.collection)', $localStorage.collection);
        var def = $q.defer();
        def.resolve($localStorage.collection);
        return def.promise;
      } else {
        console.log('inside of else in getUserCollection', $localStorage.collection);
        return $http({
          method: 'GET',
          url: 'http://mattgrosso.herokuapp.com/api/v1/collection?username=' + username,
        }).then(function successGetUserCollection(response) {
          $localStorage.collection = response.data.items.item;
          return $localStorage.collection;
        });
      }
    }

  }


})();
