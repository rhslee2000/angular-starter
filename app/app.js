(function () {

'use strict';

 require('angular');
 require('angular-route');
 require('angular-animate');

  angular.module('SampleApp', ['ngRoute', 'ngAnimate'])

  .config(
    function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');
      // routes
      $routeProvider
        .when("/", {
          templateUrl: "./home/home.html",
          controller: "MainController"
        })
        .otherwise({
           redirectTo: '/'
        });
    }
  );

  //Load controller
  angular.module('SampleApp')

  .controller('MainController',
    function($scope) {
      $scope.test = "Testing...";
    }
  );

}());
