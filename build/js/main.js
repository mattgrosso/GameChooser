(function() {
  'use strict';

  angular
    .module('game', ['ui.router', 'ngStorage'])
    .config(gameConfig);

  gameConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function gameConfig($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home/home.template.html',
        controller: 'HomeController',
        controllerAs: 'home'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'login/login.template.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })
      .state('list', {
        url: '/list',
        templateUrl: 'lists/game-list.template.html',
        controller: 'ListController',
        controllerAs: 'list'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'settings/settings.template.html',
        controller: 'SettingsController',
        controllerAs: 'settings'
      })
      .state('choose', {
        url: '/choose',
        templateUrl: 'chooser/chooser.template.html',
        controller: 'ChooserController',
        controllerAs: 'choose'
      })
      .state('random', {
        url: '/random',
        templateUrl: 'chooser/random-chooser.template.html',
        controller: 'RandomChooserController',
        controllerAs: 'random',
        params: {
          filteredCollection: []
        }
      })
      .state('nominate-random', {
        url: '/nomrand',
        templateUrl: 'chooser/nominate-random-chooser.template.html',
        controller: 'NomRandChooserController',
        controllerAs: 'nomrand',
        params: {
          filteredCollection: []
        }
      })
      .state('eliminate', {
        url: '/eliminate',
        templateUrl: 'chooser/eliminate.template.html',
        controller: 'EliminateChooserController',
        controllerAs: 'eliminate',
        params: {
          filteredCollection: []
        }
      })
      .state('vote', {
        url: '/vote',
        templateUrl: 'chooser/vote.template.html',
        controller: 'VoteChooserController',
        controllerAs: 'vote',
        params: {
          filteredCollection: []
        }
      });
  }

})();

(function() {
  'use strict';

  angular
    .module('game')
    .filter('gameFilter', function () {
      return function gameFilter(input, players, duration, genre) {
        players = Number(players) || null;
        duration = Number(duration) || null;
        return input.filter(function (each) {
          var include = true;
          if(players && (players < each.playerCount.min || players > each.playerCount.max)){
            include = false;
          }
          if(duration && duration > each.playTime){
            include = false;
          }
          if(include && genre){
            include = each.genres.indexOf(genre.toLowerCase()) > -1;
          }
          return include;
        });
      };
    });

})();

(function() {
  'use strict';

  angular
    .module('game')
    // This filter was lifted from http://ng.malsup.com/#!/titlecase-filter.
    .filter('titleCase', function () {
      return function(s) {
        s = ( s === undefined || s === null ) ? '' : s;
        return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
            return ch.toUpperCase();
        });
      };
    });

})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('ChooserController', ChooserController);

  ChooserController.$inject = ['GameFactory', '$localStorage', '$state'];

  function ChooserController(GameFactory, $localStorage, $state) {
    var that = this;

    this.collection = [];
    this.players = "";
    this.duration = "";
    this.genre = "";
    this.genreArray = $localStorage.genreArray;
    this.chooser = "";
    this.chooserArray = ['random', 'nominate-random', 'eliminate', 'vote'];

    GameFactory.getUserCollection().then(function (collection) {
      that.collection = collection;
    });

    this.goToChooser = function (filtered) {
      $state.go(this.chooser, {filteredCollection: filtered});
    };

    this.tester = function () {
    };
  }
})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('EliminateChooserController', EliminateChooserController);

  EliminateChooserController.$inject = ['$stateParams'];

  function EliminateChooserController($stateParams) {

    this.collection = $stateParams.filteredCollection;
    this.downToOne = false;

    this.eliminateGame = function eliminateGame(game) {
      game.eliminated = true;
      console.log(game.eliminated);
      this.collection = this.collection.filter(function (game) {
        if(game.eliminated){
          return false;
        } else{
          return true;
        }
      });
      console.log(this.collection.length);
      if(this.collection.length === 1){
        this.downToOne = true;
      }
    };

  }


})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('NomRandChooserController', NomRandChooserController);

  NomRandChooserController.$inject = ['$stateParams'];

  function NomRandChooserController($stateParams) {
    this.collection = $stateParams.filteredCollection;
    this.nomineesArray = [];
    this.randomGame = null;

    this.addNominee = function addNominee() {
      this.nomineesArray = this.collection.filter(function (game) {
        if(game.nominated){
          return true;
        } else{
          return false;
        }
      });
    };

    this.doneNominating = function doneNominating() {
      console.log(this.collection);
      var randomNumber = Math.floor(Math.random() * this.nomineesArray.length);
      this.randomGame = this.nomineesArray[randomNumber];
    };
  }

})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('RandomChooserController', RandomChooserController);

  RandomChooserController.$inject = ['$stateParams'];

  function RandomChooserController($stateParams) {

    this.collection = $stateParams.filteredCollection;
    this.randomGame = null;

    this.chooseRandomGame = function chooseRandomGame() {
      var randomNumber = Math.floor(Math.random() * this.collection.length);
      this.randomGame = this.collection[randomNumber];
    };
  }

})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('VoteChooserController', VoteChooserController);

  VoteChooserController.$inject = ['$stateParams'];

  function VoteChooserController($stateParams) {

    this.collection = $stateParams.filteredCollection;
    this.nomineesArray = [];
    this.showCollection = true;
    this.showNominees = false;
    this.winner = null;

    this.addNominee = function addNominee() {
      this.nomineesArray = this.collection.filter(function (game) {
        if(game.nominated){
          return true;
        } else{
          return false;
        }
      });
    };

    this.doneNominating = function doneNominating() {
      this.showCollection = false;
      this.showNominees = true;
    };

    this.voteForGame = function voteForGame(game) {
      game.votes = game.votes || 0;
      game.votes = game.votes + 1;
    };

    this.showWinner = function showWinner() {
      var mostVotes = {
        votes: 0
      };

      this.nomineesArray.forEach(function (each) {
        if(each.votes > mostVotes.votes){
          mostVotes = each;
        }
      });
      this.showNominees = false;
      this.winner = mostVotes;
    };

  }

})();

(function() {
  'use strict';

  angular
    .module('game')
    .factory('GameFactory', GameFactory);

  GameFactory.$inject = ['$http', '$q', '$localStorage'];

  function GameFactory($http, $q, $localStorage) {

    var genreArray = [];

    return {
      getUserCollection: getUserCollection,
    };

    function getUserCollection(username) {
      if ($localStorage.collection){
        var def = $q.defer();
        var collection = angular.copy($localStorage.collection);
        def.resolve(collection);
        buildGenreArray(collection);
        console.log(collection);
        return def.promise;
      } else {
        return $http({
          method: 'GET',
          url: 'http://mattgrosso.herokuapp.com/api/v1/collection?username=' + username + '&stats=1&excludesubtype=boardgameexpansion&own=1',
          transformResponse: function prettifyCollectionArray(response) {
            var parsedResponse = JSON.parse(response);
            console.log(parsedResponse);
            var prettyCollectionArray = [];
            parsedResponse.items.item.forEach(function (each) {
              var gameObject = {};
              gameObject.objectID = each.$.objectid;
              gameObject.name = each.name[0]._;
              gameObject.type = each.$.subtype;
              gameObject.image = {
                imageURL: each.image[0],
                thumbnailURL: each.thumbnail[0]
              };
              gameObject.status = {
                forTrade: each.status[0].$.fortrade,
                own: each.status[0].$.own,
                previouslyOwn: each.status[0].$.prevowned,
                wantInTrade: each.status[0].$.want
              };
              gameObject.year = each.yearpublished[0];
              gameObject.playerCount = {
                max: each.stats[0].$.maxplayers,
                min: each.stats[0].$.minplayers
              };
              gameObject.playTime = each.stats[0].$.playingtime;
              gameObject.rating = {
                myRating: each.stats[0].rating[0].$.value,
                userAverage: each.stats[0].rating[0].average[0].$.value,
                userRatings: each.stats[0].rating[0].usersrated[0].$.value,
                geekRating: each.stats[0].rating[0].bayesaverage[0].$.value,
              };
              gameObject.rank = {};
              gameObject.genres = [];
              each.stats[0].rating[0].ranks[0].rank.forEach(function (rank) {
                gameObject.rank[rank.$.name] = rank.$.value;
                gameObject.genres.push(rank.$.name);
              });
              prettyCollectionArray.push(gameObject);
            });
            return prettyCollectionArray;
          }
        }).then(function successGetUserCollection(response) {
          buildGenreArray(response.data);
          $localStorage.collection = response.data;
          console.log(response.data);
          console.log($localStorage.genreArray);
          return response.data;
        });
      }
    }

    function buildGenreArray(gameArray) {
      $localStorage.genreArray = [];
      gameArray.forEach(function (each) {
        each.genres.forEach(function (genre) {
          if($localStorage.genreArray.indexOf(genre) < 0){

            $localStorage.genreArray.push(genre);
          }
        });
      });
      return genreArray;
    }

  }


})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['GameFactory', '$localStorage'];

  function HomeController() {

  }

})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('ListController', ListController);

  ListController.$inject = ['GameFactory', '$localStorage'];

  function ListController(GameFactory) {

    var that = this;

    this.collection = [];

    GameFactory.getUserCollection().then(function (collection) {
      that.collection = collection;
    });

  }

})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('LoginController', LoginController);

LoginController.$inject = ['GameFactory', '$localStorage'];

  function LoginController(GameFactory, $localStorage) {

    var that = this;

    this.username = null;
    this.storedUsername = $localStorage.username;
    this.message = "";

    this.login = function login() {
      $localStorage.collection = null;
      GameFactory.getUserCollection(that.username)
        .then(function () {
          $localStorage.username = that.username;
          that.message = "You are now logged in.";
        })
        .catch(function () {
          that.message = "Log in failed. Please check your username.";
        });

    };
  }

})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$localStorage'];

  function SettingsController($localStorage) {
    this.logout = function logout() {
      $localStorage.username = null;
      $localStorage.collection = null;
    };
  }
})();

//# sourceMappingURL=main.js.map