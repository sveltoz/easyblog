app.controller('loginController', function ($scope, $http) {
    debugger;
    $scope.LoginUp=function(){
        debugger;
        var email=document.getElementById('email11').value;
        var password=document.getElementById('password11').value;
        
        var datalist=encodeURIComponent(JSON.stringify({'email':email,'password':password}));
        $http.get('/login').success(function (response) {
        $scope.data=response;
        }).error(function(error){});
        };

    $scope.SendPassword = function () {
        debugger;
        var emailId = document.getElementById('Text11').value;
        if (emailId) {
        var datalist=encodeURIComponent(JSON.stringify({'email':emailId}));
            $http.get('/forgotPassword/'+emailId).success(function (response) {
            $scope.text=response;

            }).error(function (err) {
                console.log("Error is determine");
            }); 
        }
    };
});
//app.controller('loginController',function($scope,$http){
//        debugger;
//        $scope.LoginUp=function(){
//        debugger;
//        var email=document.getElementById('email11').value;
//        var password=document.getElementById('password11').value;
//        
//        var datalist=encodeURIComponent(JSON.stringify({'email':email,'password':password}));
//         $http.get('/login').success(function(response){
//        $scope.data=response;
//        }).error(function(error){});
//        };

//        $scope.SendPassword = function () {
//        debugger;
//        var emailId = document.getElementById('Text11').value;
//        if (emailId) {
//        var datalist=encodeURIComponent(JSON.stringify({'email':emailId}));
//            $http.get('/forgotPassword/'+emailId).success(function (response) {
//            $scope.text=response;

//            }).error(function (err) {
//                console.log("Error is determine");
//            }); 
//        }
//    };