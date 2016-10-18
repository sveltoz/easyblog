'use strict';
//var app = angular.module("RegistrationApp", []);
app.controller('registrationController', function ($scope, $http) {
    debugger;
    $scope.image = [{ src: '/app/app-images/img.jpg' },
							{ src: '/app/app-images/download (3).jpg' },
							{ src: '/app/app-images/Healthy-Eating_Healthy-Kids_w710xh2111.jpg' },
							{ src: '/app/app-images/healthy-foods.jpg' },
							{ src: '/app/app-images/Rajarani_Temple_2.jpg' },
							{ src: '/app/app-images/hd-wallpaper-free-download-40.jpg' },
							{ src: '/app/app-images/images.jpg' },
							{ src: '/app/app-images/images (1).jpg'}];
    $scope.registration = function () {
        debugger;
        var first_name = document.getElementById('First_Name').value;
        var last_name = document.getElementById('Last_Name').value;
        var email_address = document.getElementById('Email').value;
        var display_name = document.getElementById('display_name').value;
        var Mobile_Number = document.getElementById('Mobile_Number').value;
        var password = document.getElementById('Password').value;
        var parameters = {
            first_name: first_name,
            last_name: last_name,
            email_address: email_address,
            Mobile_Number: Mobile_Number,
            display_name: display_name,
            password: password
        };
        $http.get('./registration/', { params: parameters }).success(function (success) { });
    };
});