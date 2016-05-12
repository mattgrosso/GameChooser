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
        votes: 0,
        name: null,
        games: []
      };

      this.nomineesArray.forEach(function (each) {
        if(each.votes > mostVotes.votes){
          mostVotes.name = each.name;
          mostVotes.votes = each.votes;
          mostVotes.games = [each];
        } else if((each.votes > 0) && (each.votes === mostVotes.votes)){
          mostVotes.name = mostVotes.name + ' and ' + each.name;
          mostVotes.games.push(each);
        }
      });
      this.showNominees = false;
      this.winner = mostVotes;
    };

  }

})();