
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}


app.controller('AppCtrl', function($scope) {

  $scope.rate = function(){
    window.open('market://details?id=com.job.wadifati', '_system');
  }

})

.controller('jobsCtrl', function($scope, $cordovaToast, $localStorage, $location, $ionicPopup, getFeed, public_emploi, private_emploi, etrange_emploi, concours, concours_example, mostajadat) {
  $scope.jobs = [];

  $scope.jobType = "0";

  $scope.$storage = $localStorage;

  var count = 0;
  $scope.more = true;

  $scope.update = function(x){
    count = 1;
    $scope.more = true;
    $scope.jobs = [];
    var type = sw(x);
    feed(type+count);
  };

  $scope.loadOldFeed = function(x){
    var type = sw(x);
    count++;
    feed(type+count);
  };

  $scope.israte = function(id){
    $scope.$storage = $localStorage;
    if(!$scope.$storage.jobs)
      return false;
    var len = $scope.$storage.jobs.length;
    for(i=0;i<len;i++){
      for(j=0;j<5;j++){
        if($scope.$storage.jobs[i][j] == $scope.jobs[id].link){
          return true;
        }
      }
    }
    return false;
  }

  $scope.open = function(id){
    var myPopup = $ionicPopup.show({
       template: '',
       title: '<h4>'+$scope.jobs[id].title+'</h4>',
       subTitle: '<h5>'+$scope.jobs[id].description+'</h5>',
       scope: $scope,
    
       buttons: [
          { text: 'إلغاء' },
          { text: 'مفضلة',
            type: 'button-energized',
            onTap:function(e){
              var job = [$scope.jobs[id].link, $scope.jobs[id].title, $scope.jobs[id].description,
                       $scope.jobs[id].thumbnail._url, $scope.jobs[id].pubDate];
              $scope.$storage = $localStorage.$default({jobs: []});
              var len = $scope.$storage.jobs.length;
              var exist = false;
              for(i=0;i<len;i++){
                for(j=0;j<5;j++){
                  if($scope.$storage.jobs[i][j] == $scope.jobs[id].link){
                    exist = true;
                    break;
                  }
                }
              }
              if(exist){
                $cordovaToast.show('تمت اضافته مسبقاً إلى قائمة مفضلة', 'short', 'center');
              }
              else{
                $scope.$storage.jobs.push(job);
                $cordovaToast.show('تم الإضافة إلى مفضلة', 'short', 'center');
              }
            } }, {
             text: 'مشاهدة',
             type: 'button-positive',
                onTap: function(e) {
                  $location.path('/app/jobs/'+window.btoa($scope.jobs[id].link));
                }
          }
       ]
    });

    myPopup.then(function(res) {
       //console.log('Tapped!', res);
    });    
  };

  function feed(x){
    getFeed.feed(x).then(function(data){
      $scope.more = true;
      if(data.rss.channel.item == null)
        $scope.more = false;
      $scope.jobs.push.apply($scope.jobs, data.rss.channel.item);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }).catch(function(err){
      var error = err.toString();
      var template = '';
      if((error[0] == '4' || error[0] == '3' || error[0] == '5') && error.length == 3)
        template = 'هناك خطأ في السيرفر، سيتم حل المشكل قريبا. قم بتحديث التطبيق قريباً، فور نزول النسخة الجديدة في المتجر .';
      else
        template = 'تحقق من اتصالك بالأنترنت ومن إعدادات هاتفك';
      $scope.more = false;
      var alertPopup = $ionicPopup.alert({
      title: 'يوجد خطأ',
      template: '<div style="text-align:center;">'+template+'<br>medstdeveloper@gmail.com</div>',
      okText: 'Ok',
      okType:'button-assertive'
      });

      alertPopup.then(function(res) {
        //console.log('Thank you for not eating my delicious ice cream cone');
      });
    });
  }

  function sw(x){
    var type = '';
    if(x == '0')
      return public_emploi;
    if(x == '1')
      return private_emploi;
    if(x == '2')
      return etrange_emploi;
    if(x == '3')
      return concours;
    if(x == '4')
      return concours_example;
    if(x == '5')
      return mostajadat;
  };

})

.controller('jobCtrl', function($scope, $stateParams, getFeed, $ionicPopup, admobSvc) {

  $scope.$on('$ionicView.beforeEnter', function(e) {
        // console.log("Entering");
        admobSvc.requestInterstitialAd();
        //if (window.AdMob) AdMob.showInterstitial();
  });
  $scope.$on('$ionicView.beforeLeave', function(e) {
      // console.log("leaving");
      //if (window.AdMob) AdMob.showInterstitial();
      admobSvc.showInterstitialAd();
  });

  $scope.load = true;

  var url = window.atob($stateParams.jobId);
  var parser = document.createElement('a');
  parser.href = url;
  var link = parser.origin+'/mobile'+parser.pathname;
  $scope.html = '';
  getFeed.job(link).then(function(data){
      var prsr = new DOMParser(),
      doc = prsr.parseFromString(data, "text/xml");
      doc.getElementsByTagName("img")[1].parentNode.removeChild(doc.getElementsByTagName("img")[1]);
      $scope.load = false;
      $scope.title = '<h3 class="balanced">' + doc.getElementsByTagName("h1")[0].innerHTML + '</h3><br>';
      $scope.pubd = doc.getElementsByClassName("article_metadata")[0].innerHTML;
      $scope.html = doc.getElementById("article_body").innerHTML;
  }).catch(function(err){
    var error = err.toString();
    var template = '';
    if((error[0] == '4' || error[0] == '3' || error[0] == '5') && error.length == 3)
      template = 'هناك خطأ في السيرفر، سيتم حل المشكل قريبا. قم بتحديث التطبيق قريباً، فور نزول النسخة الجديدة في المتجر .';
    else
      template = 'تحقق من اتصالك بالأنترنت ومن إعدادات هاتفك';
    var alertPopup = $ionicPopup.alert({
      title: 'يوجد خطأ',
      template: '<div style="text-align:center;">'+template+'<br>medstdeveloper@gmail.com</div>',
      okText: 'Ok',
      okType:'button-assertive'
      });

      alertPopup.then(function(res) {
        $scope.load = false;
      });
  });
  
})
.controller('loveCtrl', function($scope, $localStorage, $ionicPopup, $location, $cordovaToast){
  $scope.$storage = $localStorage;

  $scope.open = function(job){
    var myPopup = $ionicPopup.show({
       template: '',
       title: '<h4>'+job[1]+'</h4>',
       subTitle: '<h5>'+job[2]+'</h5>',
       scope: $scope,
    
       buttons: [
          { text: 'إلغاء' },
          { text: 'حذف',
            type: 'button-assertive',
            onTap:function(e){
              $scope.$storage.jobs.splice($scope.$storage.jobs.indexOf(job), 1);
              $cordovaToast.show('تم حذفها من مفضلة', 'short', 'center');
            } }, {
             text: 'مشاهدة',
             type: 'button-positive',
                onTap: function(e) {
                  $location.path('/app/jobs/'+Base64.encode(job[0]));
                }
          }
       ]
    });
  };
})
.controller('settingCtrl', function($scope, $localStorage, $ionicPopup, $cordovaToast){
  $scope.facebook = function(){
    window.open('https://www.facebook.com/wadifatiapp', '_system');
  }

  $scope.reset = function(){
    var confirmPopup = $ionicPopup.confirm({
       title: 'إعادة تعيين البرنامج',
       template: 'هل تريد مسح إعداداتك الإفتراضية و قائمة مفضلة ؟',
       cancelText: 'إلغاء',
       okText: 'نعم'
     });

     confirmPopup.then(function(res) {
       if(res) {
         $localStorage.$reset();
         $cordovaToast.show('تم تعين الإعدادات بنجاح', 'short', 'center');
       } else {
         //console.log('You are not sure');
       }
     });
   };
});
