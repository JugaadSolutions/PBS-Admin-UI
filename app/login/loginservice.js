(function () {
    'use strict';

    var app = angular.module("pbs");

// Login Auth
app.service('auth', ['$window', '$location', function ($window, $location) {

    var self = this;

    self.saveToken = function (token) {
        $window.localStorage['PBSToken'] = token;
    };

    self.parseToken = function (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
    };

    self.getToken = function () {
        return $window.localStorage['PBSToken'];
    };

    self.isAuthed = function () {
        var token = self.getToken();
        if (token) {
            var params = self.parseToken(token);
            return Math.round(new Date().getTime() / 1000) <= params.exp;
        } else {
            return false;
        }
    };

    self.returnRole = function () {
        var token = self.getToken();
        if (token) {
            var params = self.parseToken(token);
            /*return params.role;*/
            return params._type;
            return params.email;
        } else {
            return false;
        }
    };

    /*newly added*/
    self.returnEmail=function(){
        var token = self.getToken();
        if (token) {
            var params = self.parseToken(token);
            return params.email;
        } else {
            return false;
        }
    };

    self.returnName = function () {
        var token = self.getToken();
        if (token) {
            var params = self.parseToken(token);
            return params.profileName;
        } else {
            return false;
        }
    };

    self.returnUserId = function () {
        var token = self.getToken();
        if (token) {
            var params = self.parseToken(token);
            return params.assignedUser;
        } else {
            return false;
        }
    };

    self.returnId = function () {
        var token = self.getToken();
        if (token) {
            var params = self.parseToken(token);
            return params.userId;
        } else {
            return false;
        }
    };

    self.logout = function () {
        $window.localStorage.removeItem('PBSToken');
        $window.location.reload();
    };


}]);

})();
