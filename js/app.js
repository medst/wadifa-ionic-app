// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'ngStorage', 'angularMoment', 'ngCordova', 'ngSanitize', 'admobModule']);

app.constant('public_emploi', 'http://alwadifa-club.com/feed/offre-public/index.')
.constant('private_emploi', 'http://alwadifa-club.com/feed/offre-prive/index.')
.constant('etrange_emploi', 'http://alwadifa-club.com/feed/offre-etranger/index.')
.constant('concours', 'http://alwadifa-club.com/feed/concour-interne/index.')
.constant('concours_example', 'http://alwadifa-club.com/feed/exemple-concour/index.')
.constant('mostajadat', 'http://alwadifa-club.com/feed/%D9%85%D8%B3%D8%AA%D8%AC%D8%AF%D8%A7%D8%AA/index.');

app.run(function(amMoment) {
    amMoment.changeLocale('ar');
});

app.config(function (admobSvcProvider) {
// Optionally you can configure the options here:
  admobSvcProvider.setOptions({
    publisherId:          "ca-app-pub-4034656611274692/3821046365",  
    interstitialAdId:     "ca-app-pub-4034656611274692/6774512766",
    autoShowBanner:       true,
    autoShowInterstitial: false
  });
});

app.run(function (admobSvc, $rootScope) {
      // Also you could configure the options here (or in any controller):
      // admobSvcProvider.setOptions({ ... });

      admobSvc.createBannerView();
      //admobSvc.requestInterstitialAd();
      // You could also call admobSvc.createBannerView(options);


      // Handle events:
      $rootScope.$on(admobSvc.events.onAdOpened, function onAdOpened(evt, e) {
        console.log('adOpened: type of ad:' + e.adType);
      });
});

app.run(function($cordovaSplashscreen, $timeout) {
   $timeout(function() {
    $cordovaSplashscreen.hide();
  }, 5000)
});

app.filter('hrefToJS', function ($sce, $sanitize) {
    return function (text) {
        var regex = /href="([\S]+)"/g;
        var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_system')\"");
        return $sce.trustAsHtml(newString);
    }
});


app.run(function($ionicPlatform, $ionicPopup) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
            $ionicPopup.alert({
                title: 'يوجد خطأ',
                content: '<div style="text-align:center;">لا يوجد إتصال بالإنترنت</div>',
                okText: 'Ok',
                okType:'button-assertive'
            })
            .then(function(result) {
                    //ionic.Platform.exitApp();
            });
        }
    }

    /*var admobid = {};
    // select the right Ad Id according to platform
    if( /(android)/i.test(navigator.userAgent) ) { 
        admobid = { // for Android
            banner: 'ca-app-pub-4034656611274692/3821046365',
            interstitial: 'ca-app-pub-4034656611274692/6774512766'
        };
    } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
        admobid = { // for iOS
            banner: 'ca-app-pub-4034656611274692/5201877960',
            interstitial: 'ca-app-pub-4034656611274692/6678611164'
        };
    } else {
        admobid = { // for Windows Phone
            banner: 'ca-app-pub-4034656611274692/9632077565',
            interstitial: 'ca-app-pub-4034656611274692/2108810767'
        };
    }
 
    if(window.AdMob) AdMob.createBanner( {
        adId:admobid.banner, 
        position:AdMob.AD_POSITION.BOTTOM_CENTER, 
        autoShow:true} 
    );
    if(window.AdMob) AdMob.prepareInterstitial({
            adId:admobid.interstitial,
            //isTesting:true,//comment this out before publishing the app
            autoShow:false
    });*/
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html'
        }
      }
    })
  .state('app.setting', {
      url: '/setting',
      views: {
        'menuContent': {
          templateUrl: 'templates/setting.html',
          controller: 'settingCtrl'
        }
      }
    })
  .state('app.love', {
      url: '/love',
      views: {
        'menuContent': {
          templateUrl: 'templates/love.html',
          controller: 'loveCtrl'
        }
      }
    })
    .state('app.jobs', {
      url: '/jobs',
      views: {
        'menuContent': {
          templateUrl: 'templates/jobs.html',
          controller: 'jobsCtrl'
        }
      }
    })

  .state('app.job', {
    url: '/jobs/:jobId',
    views: {
      'menuContent': {
        templateUrl: 'templates/job.html',
        controller: 'jobCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});