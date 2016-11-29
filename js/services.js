
app.factory('getFeed', function($http, $q) {
	var jobs = [];

	return {
		feed: function(x){
			var deferred = $q.defer();
			$http.get(x)
			.success(function (data, status, headers, config) {
					var x2js = new X2JS();
    				var json = x2js.xml_str2json(data);
                    deferred.resolve(json);
                }).error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
		},
		job: function(x){
			var deferred = $q.defer();
			$http.get(x)
			.success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
		}
	}
});
