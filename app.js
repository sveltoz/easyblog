var app = angular.module('myApp', ['ngRoute','textAngular','ngFileUpload']);
app.config(function ($routeProvider) {
     $routeProvider
  .when('/HomePage', {
      templateUrl: 'views/HomePage.html',
     
  })
  .when('/blogPage', {
      templateUrl: 'views/blogPage.html',
      controller: 'blogPageController'
  })
  .when('/', {
      templateUrl: 'views/editor.html',
      controller: 'editorController'
  })
  .when('/Login',{
  templateUrl:'views/Login.html',
  controller:'loginController'
  })
  .when('/Final', {
      templateUrl: 'views/Final.html',
      controller: 'finalController'
  })
   .when('/SignUp', {
       templateUrl: 'SignUp.html',
       controller: 'registrationController'
   })
  .otherwise({ redirectTo: '/' });
});


	  

	  