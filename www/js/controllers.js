angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $ionicPopup, $ionicPopover) {
  // Form data for the login modal
  $scope.loginData = {};
  $scope.signupData = {};
  $scope.auth = {};
  $scope.apiUrl = "http://twix.linuxw.info:3000";
  //$("#menuLogout").hide();

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modallogin = modal;
  });

  // Create the signup modal
  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalsignup = modal;
  });

  $scope.popLoginOk = function() {
    $ionicPopup.alert({
    title: 'Success!',
    content: 'Hello '+$scope.auth.pseudo+'!'
    }).then(function(res) {
      console.log('Test Alert Box');
    });
  };

  $scope.popLoginNok = function() {
    $ionicPopup.alert({
    title: 'Fail!',
    content: 'Bad credentials...'
    }).then(function(res) {
      console.log('Test Alert Box');
    });
  };

  $scope.popLogOut = function() {
    $ionicPopup.alert({
    title: 'Bye '+$scope.auth.pseudo+'!',
    content: 'You logged out successfully!'
    }).then(function(res) {
      console.log('Test Alert Box');
    });
  };

  $scope.popSignupOk = function() {
    $ionicPopup.alert({
    title: 'Success!',
    content: 'Hello '+$scope.auth.pseudo+'!'
    }).then(function(res) {
      console.log('Test Alert Box');
    });
  };

  $scope.popSignupNok = function() {
    $ionicPopup.alert({
    title: 'Fail!',
    content: 'Error occured...'
    }).then(function(res) {
      console.log('Test Alert Box');
    });
  };

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modallogin.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modallogin.show();
  };

  // Open the login modal
  $scope.signup = function() {
    $scope.closeLogin();
    $scope.modalsignup.show();
  };

  // Triggered in the signup modal to close it
  $scope.closeSignup = function() {
    $scope.modalsignup.hide();
  };

  // Vérifie si l'user est authentifié
  $scope.isLogged = function() {
    return $scope.auth.id;
  };

  // Vérifie si l'user est authentifié
  $scope.logOut = function() {
    $scope.popLogOut();
    $scope.auth = {};
    /*$("#menuLogout").hide();
    $("#menuLogin").show();*/
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $.ajax($scope.apiUrl+'/user/login',
    {
      dataType: "json",
      type: "POST",
      data: $scope.loginData,
      xhrFields: { withCredentials: true},
      success: function(data) { 
        console.log(data); 
        $scope.auth.id = data.id;
        $scope.auth.pseudo = data.pseudo;
        /*$("#menuLogin").hide();
        $("#menuLogout").show();*/
        $scope.closeLogin();
        $scope.popLoginOk();
        //$scope.$apply();
      },
      error: function(request, textStatus, errorThrown) { 
        console.log("error " + textStatus + ": " + errorThrown);
        $scope.popLoginNok();
      }
    });
  };

  // Perform the login action when the user submits the login form
  $scope.doSignup = function() {
    console.log('Doing signup', $scope.signupData);
    $.ajax($scope.apiUrl+'/user/insert',
    {
      dataType: "json",
      type: "POST",
      data: $scope.signupData,
      xhrFields: { withCredentials: true},
      success: function(data) { 
        console.log(data); 
        $scope.auth.id = data.id;
        $scope.auth.pseudo = data.pseudo;
        /*$("#menuLogin").hide();
        $("#menuLogout").show();*/
        $scope.closeSignup();
        $scope.popSignupOk();
        //$scope.$apply();
      },
      error: function(request, textStatus, errorThrown) { 
        console.log("error " + textStatus + ": " + errorThrown);
        $scope.popSignupNok();
      }
    });
  };
})

.controller('ImgListCtrl', function($scope,$http) {
  // template = imglist.html
  $scope.imglist = [];
  $http.get($scope.apiUrl+'/image/byuser/'+$scope.auth.id).success(function(data) {
    $scope.imglist = data;
  });
})

.controller('ReviewController', function($scope) {
  this.review = {};
  this.review.content = "";
  this.review.user = {};
  this.review.user.pseudo = $scope.auth.pseudo;
  this.addReview = function(img,reviews) {
    this.review.image = img.id;
    $.ajax($scope.apiUrl+'/commentaire/insert',
    {
      dataType: "json",
      type: "POST",
      data: this.review,
      xhrFields: { withCredentials: true},
      success: function(data) { 
        this.review = data;
        this.review.user = {};
        this.review.user.pseudo = $scope.auth.pseudo;
        reviews.push(this.review);
        this.review = {};
        this.review.content = "";
        this.review.user = {};
        this.review.user.pseudo = $scope.auth.pseudo;
        $scope.$apply();
      },
      error: function(request, textStatus, errorThrown) { 
        console.log("error insert comm " + textStatus + ": " + errorThrown);
      }
    });
  };
})

.controller('BrowseCtrl', ['$scope','$stateParams','$http', function($scope, $stateParams, $http) {
  // TODO populer imglist avec les infos de la BDD
  // template = imglist.html
  $scope.images = [];
  $http.get($scope.apiUrl+'/image/list').success(function(data) {
    $scope.images = data;
  });
}])

.controller('VoteController', ['$scope','$stateParams','$http', function($scope, $stateParams, $http) {
  // Perform the vote action when the user click on vote
  this.voteImg = function(img,v,votes) {
    // vote/insert Create a vote (POST query) Requires 'point' : -1 or 1 'image' : image id to vote on
    var vote = {};
    vote.image = img;
    vote.point = v;
    $.ajax($scope.apiUrl+'/vote/insert',
    {
      dataType: "json",
      type: "POST",
      data: vote,
      xhrFields: { withCredentials: true},
      success: function(data) { 
        console.log(data);
        if(v==1) {
          votes.upvotes.push(data);
        } else {
          votes.downvotes.push(data);
        }
        $scope.$apply();
        $("#voteBar").hide();
      },
      error: function(request, textStatus, errorThrown) { 
        console.log("error " + textStatus + ": " + errorThrown);
        $scope.popLoginNok();
      }
    });
  };

  this.hasVoted = function(votes) {
    var ret = false;
    // vote/insert Create a vote (POST query) Requires 'point' : -1 or 1 'image' : image id to vote on
    angular.forEach(votes, function(value,key){
      if(value.userId==$scope.auth.id) {
        ret = true;
      }
    });
    return ret
  };
}])

.controller('UploadCtrl', ['$scope','$stateParams','$http', function($scope, $stateParams, $http) {
  $scope.doUpload = function(){
    var options = new FileUploadOptions();

    var params = {};
    params.titre = "title";

    options.params = params;
    options.fileKey="image";
    var absURI = imgURI.slice(7);

    var ft = new FileTransfer();
    ft.upload(absURI, 'http://twix.linuxw.info/image/insert', function(r){
        alert("Image uploaded");
        console.log(r.responseCode);
    }, function(err){
        console.log("Error when uploading : " + err.code);
    }, options);
  };
} ])

.controller('ImgDetailCtrl', ['$scope','$stateParams','$http', function($scope, $stateParams, $http) {
  // TODO Récupérer les élements de l'image avec son id passé en paramètres
  // template = imgdetail.html
  $scope.img = [];
  $scope.reviews = [];
  $scope.vote = [];
  $http.get($scope.apiUrl+'/image/get/'+$stateParams.imgId).success(function(data) {
    $scope.img = data;
  });
  $http.get($scope.apiUrl+'/commentaire/byimage/'+$stateParams.imgId).success(function(data) {
    $scope.reviews = data;
  });
  $http.get($scope.apiUrl+'/vote/byimage/'+$stateParams.imgId).success(function(data) {
    $scope.vote = data;
  });

} ]);


