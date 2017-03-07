(function () {
    'use strict';

    var app = angular.module("pbs");

    app.factory('DataService', ['$http', '$q', 'APIEndPoint', 'API','APINew', function ($http, $q, APIEndPoint, API,APINew) {
        return {
            getSmartCards: function (filters) {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.smartCard.getAll, {
                    params: filters
                }).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            verifyCardForMember: function (data) {
                var deferred = $q.defer();
                $http.post(API + APIEndPoint.smartCard.verifyForMember, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            verifyCardForEmployee: function (data) {
                var deferred = $q.defer();
                $http.post(API + APIEndPoint.smartCard.verifyForEmployee, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            deactivateCard: function (data) {
                var deferred = $q.defer();
                $http.post(API + APIEndPoint.smartCard.update + '/' + data + '/' + APIEndPoint.smartCard.deactivate).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveSmartCard: function (data) {

                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.smartCard.save, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getSmartCard: function (data) {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.smartCard.get + '/' + data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateSmartCard: function (data) {
                var deferred = $q.defer();
                $http.put(APINew + APIEndPoint.smartCard.update + '/' + data.cardUid, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
        }
    }]);

    app.factory('StatusService', ['APINew', function (APINew) {
        return {
            getSmartCardStatus: function (code) {
                var status = '';
                switch (code) {
                    case 1:
                        status = "Availabel";
                        break;
                    case 2:
                        status = "Assigned";
                        break;
                    case 3:
                        status = "Damaged";
                        break;
                    case 4:
                        status = "Blocked";
                        break;
                    default:
                        break;
                }
                return status;
            },
        }
    }]);

})();