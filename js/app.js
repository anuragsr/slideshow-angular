var app = angular.module('app', ['ui.router'])

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/home");
  $stateProvider
  .state('home', {
    url: "/home?ext",
    params: {slides: null},
    templateUrl: "templates/home.html?v=2",
    controller: 'HomeCtrl'
  })
  .state('shows', {
    url: "/shows?ext",
    params: {slides: null},
    templateUrl: "templates/shows.html?v=2",
    controller: 'ShowCtrl'
  })
  .state('play', {
    url: "/play?showId",
    templateUrl: "templates/play.html?v=1",
    controller: 'PlayCtrl'
  })
})
