 app.controller('finalController', function wysiwygeditor($scope, $http,Upload, $sce,$window) {
     debugger;
     $scope.successfull=false;
          $scope.disabled = false;
		  $scope.TestApp=function(blogTitle,blogContents){
				debugger;
                $scope.successfull=false;
				$scope.title=blogTitle;
				$scope.item = $sce.trustAsHtml(blogContents);
                $scope.blogContent=blogContents;
				$scope.date = new Date();
                $scope.UserId='';
               if ($scope.file) { //check if from is valid
               id='123';   
               Upload.upload({// jshint ignore:line
              url: '/upload12/' + id, //webAPI exposed to upload the file
              data: { file: $scope.file} //pass file as data, should be user ng-model
          }).then(function (resp) { //upload function returns a promise
              if (resp.data.error_code === 0) {// jshint ignore:line
              debugger;
                  $scope.submitted = true;
                  var datalist;                  
                  $scope.Image=resp.data.Image;
                  var blogTitle =$scope.title;
				var blogContents = $scope.blogContent;
				var blogCreationDate = new Date();
				var blogImage=$scope.Image;
                var UserId='';
				var parameters = {
					blogTitle: blogTitle,
					blogContents: blogContents,
					blogCreationDate: blogCreationDate,
                    blogImage:blogImage,
                    UserId:UserId
					};
		
				 $http.get('/view/', { params: parameters }) .success(function(success){
                 $scope.successfull=true;
							 $window.location.href = '/'
							})
							.error(function(error){
							console.log(error);
				});		
              } else {
                  // $window.alert('an error occured');
              }
          },function (resp) { //catch error
              console.log('Error status: ' + resp.status);
              // $window.alert('Error status: ' + resp.status);
          });//call upload function
            }
            else
            {
                var blogTitle =$scope.title;
				var blogContents = $scope.blogContent;
				var blogCreationDate = new Date();
                var UserId='';
				var parameters = {
					blogTitle: blogTitle,
					blogContents: blogContents,
					blogCreationDate: blogCreationDate,
                    blogLikes: 0,
                    UserId:UserId
                                      
					};
		
				 $http.get('/view/', { params: parameters }) .success(function(success){
							console.log("posted successfully");
                            $window.location.href = '/'
                            $scope.successfull=true;
							})
							.error(function(error){
							console.log(error);
				});		
            }

				
			};	
//----------------preview functionality -----------------------------
		 
			$scope.TestAppPreview=function(blogTitle,blogContents,file){
					debugger;
					var toPrint = blogContents;
					var div = document.createElement("div");
                    var img=document.createElement("img");
					var popupWin = window.open('', '_blank', 'width=350,height=250,location=no,left=200px');
					popupWin.document.open();
					popupWin.document.write('<html><head><title>::Print Preview::</title></head><body>')
					div.innerHTML=blogContents;                    
					popupWin.document.write(div.innerText);
					popupWin.document.write('</html>');
					popupWin.document.close();
			};


			$scope.image = [{src: '/app/app-images/blender-icon.png',},
						{src: '/app/app-images/opportunities.png',},
						{src: '/app/app-images/hd-wallpaper-free-download-40.jpg',},
						{src: '/app/app-images/images.jpg',},
						{src: '/app/app-images/images (1).jpg',},
						{src: '/app/app-images/wallpaper-2851543.jpg',},
						{src: '/app/app-images/344634.JPG',},
						{src: '/app/app-images/Good morning light green leaves Wallpapers HD 2560x1440.jpg',},
						{src: '/app/app-images/viviscape_hd_wallpaper.jpg',}];
			
			});
	  