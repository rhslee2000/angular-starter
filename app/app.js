(function () {

'use strict';

 require('angular');
 require('angular-animate');
 require('angular-ui-router');

  angular.module('SampleApp', ['ui.router', 'ngAnimate'])

  .config(
    function($locationProvider, $stateProvider, $urlRouterProvider) {
      $locationProvider.hashPrefix('!');

      // states
      var home = {
        name : 'home',
        url : '/home',
        templateUrl : '/home/home.html',
        controller : 'MainController'
      };
      $stateProvider.state(home);
      
      $urlRouterProvider.otherwise('/');
    }
  );

  //Load controller
  angular.module('SampleApp')

  .controller('MainController',
    function($scope) {
      console.log('main controller');
      $scope.test = "Testing...";
    }
  );

}());
