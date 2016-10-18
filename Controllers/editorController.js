
window.fbAsyncInit = function () {  
             FB.init({    // jshint ignore:line
                 appId: '1099392880156202',  //'1231500983547179',  
                 status: true,  
                 cookie: true,  
                 xfbml: true,  
                 version: 'v2.7'  
             });  
         };  
  
         (function (d, s, id) {  
             var js, fjs = d.getElementsByTagName(s)[0];  
             if (d.getElementById(id)) { return; }  
             js = d.createElement(s); js.id = id;  
             js.src = '//connect.facebook.net/en_US/sdk.js';  
             fjs.parentNode.insertBefore(js, fjs);  
         } (document, 'script', 'facebook-jssdk'));

         app.controller("editorController", function ($scope, $http, $sce, $window, $rootScope) {
             debugger;
             $scope.UserNotAvailable = false;

             $http.get('/getUser').success(function (responce) {
                 $scope.user = responce;
                 if ($scope.user) {
                     var id = $scope.user._id;
                     $http.get('/UserId/' + id).success(function (responce) {
                         if (responce == null) {
                             $scope.UserNotAvailable = true;
                         }

                     });
                 }
             });


             $scope.image = [{ src: '/app/app-images/img.jpg' },
							{ src: '/app/app-images/download (3).jpg' },
							{ src: '/app/app-images/Healthy-Eating_Healthy-Kids_w710xh2111.jpg' },
							{ src: '/app/app-images/healthy-foods.jpg' },
							{ src: '/app/app-images/Rajarani_Temple_2.jpg' },
							{ src: '/app/app-images/hd-wallpaper-free-download-40.jpg' },
							{ src: '/app/app-images/images.jpg' },
							{ src: '/app/app-images/images (1).jpg'}];
             $scope.twitter = function (post) {
                 debugger;
                 var url = window.location + 'blogPage?id=' + post._id;
                 window.open("https://twitter.com/share?url=" + encodeURIComponent(url));
             };
             $scope.share = function (post) {
                 debugger;
                 FB.ui(
    {
        method: 'feed',
        name: post.blogTitle,
        link: 'http://www.hyperarts.com/external-xfbml/' + post._id,
        caption: post.blogTitle,
        description: post.blogContents,
        message: ''
    });
             };
             $scope.SubscribeMethos = function (d) {
                 debugger;
                 var email = document.getElementById('emailForSub').value;
                 if (email) {
                     $http.get('/subscribed/' + email).success(function (response) {
                         $scope.text = response;
                         document.getElementById('DivSub').style.display = 'none';
                     }).error(function (err) {
                         console.log("Error is determine");
                     }); ;
                 }
             };

             $scope.blogLikeFun = function (blogData) {
                 debugger;                 
                 if ($scope.user) {
                     if (blogData.UserId.indexOf($scope.user._id) !== -1) {

                     }
                     else {
                         blogData.blogLikes = parseInt(blogData.blogLikes) + 1;
                         blogData.UserId = blogData.UserId + ',' + $scope.user._id;
                         $http.get('/updateLikes/', { params: blogData }).success(function (response) {
                             response.UserNotAvaliable = false;
                         });
                     }

                 }



             };

             $http.get('/editor').success(function (response) {
                 debugger;
                 $scope.output = response;

                 var i = 0;
                 for (i; i < response.length; i++) {
                     $scope.output[i].blogContents1 = $sce.trustAsHtml(response[i].blogContents);
                     if ($scope.user) {
                         if ($scope.output[i].UserId === '' || $scope.output[i].UserId) {
                             if ($scope.output[i].UserId.indexOf($scope.user._id) !== -1) {
                                 $scope.output[i].UserNotAvaliable = false;
                             }
                             else {
                                 $scope.output[i].UserNotAvaliable = true;

                             }
                         }

                     }


                 }
             });
         });


