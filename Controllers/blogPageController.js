app.controller('blogPageController', function ($scope, $http, $location, $sce) {
    debugger;
    $scope.NameInvalid = false;
    var id = $location.absUrl().split('=');
    $scope.id = id[1];

    //getComments
    $http.get('/getComments/' + id[1]).success(function (response) {
        $scope.Comments = response;
    });

    $scope.image = [{ src: '/app/app-images/healthy-foods.jpg' },
						{ src: '/app/app-images/Gallery/back-to-school-tips-to-get-prepared-600x360.jpg' },
						{ src: '/app/app-images/Gallery/pear-honey-margarita-600x360.jpg' },
						{ src: '/app/app-images/Gallery/download.jpg' },
						{ src: '/app/app-images/Gallery/nature-basket-nature-fruits-00383923-oJrBsc.jpg' },
						{ src: '/app/app-images/Gallery/images.jpg'}];


    $scope.InsertComment = function () {
        debugger;
        $scope.UserInvalid = false;
        $scope.NameInvalid = false;
        $http.get('/getUser').success(function (success) {
            $scope.GetCurrentUser = success;
            console.log('user' + $scope.GetCurrentUser);
            $scope.UserInvalid = false;
            if ($scope.GetCurrentUser) {
                $scope.NameInvalid = false;
                var name = document.getElementById('usrName').value;
                var email = document.getElementById('usrEmail').value;
                // var oi=form.inputEmail.$valid;
                if (name && email) {

                    $scope.parameters.blogId = $scope.id;
                    $http.get('/blogPageData/', { params: $scope.parameters }).success(function (success) {
                        $scope.parameters = null;

                    })
								.error(function (error) {
								    console.log(error);
								});

                }
                else {
                    $scope.NameInvalid = true;
                }
            }
            else {
                $scope.UserInvalid = true;
            }
        });

    };

    $http.get('/getBlogData/' + id[1]).success(function (response) {
        $scope.blogData = response;
        // Completed till here need to bind in scope and use in Page
        $scope.blogData.blogContents = $sce.trustAsHtml(response.blogContents);
    })
								.error(function (error) {
								    console.log(error);
								});

});