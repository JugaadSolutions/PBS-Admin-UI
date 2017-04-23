(function () {
    'use strict';

    var app = angular.module('pbs');

    //Login Controller
    var _login_id;
    var _login_role;
    app.controller('LoginController', ['$state', '$scope', '$rootScope', '$timeout', 'growl', 'user', 'auth', 'DataService','md5', function ($state, $scope, $rootScope, $timeout, growl, user, auth, DataService,md5)
    {
        $scope.login = true;

        $scope.reg = function () {
            $scope.login = false;
            $scope.forget = false;
        };
        $scope.for = function () {
            $scope.login = false;
            $scope.forget = true;

            $scope.forgot = function (email) {
                var data = {
                    email: email
                };
                DataService.forgotPassword(data).then(function (response) {
                    if (!response.error) {
                        $scope.successForgot = true;
                        $scope.forget = false;
                        /*growl.success(response.message);*/
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description);
                })
            };
        };
        $scope.log = function () {
            $scope.login = true;
            $scope.forget = false;
        };

        $rootScope.$emit('auth');
        $scope.isAuthed = auth.isAuthed();

        var self = this;

        $scope.username = "";
        $scope.password = "";

        function handleRequest(res) {
            var token = res.data.data.token;
            _login_id=res.data.data.uid;
            _login_role=res.data.data.role;
            localStorage.LoginID=_login_id;
            localStorage.LoginRole=_login_role;
            /*  alert(_login_id);*/
            if (token) {
                auth.saveToken(token);
                $state.reload();
            } else {
                growl.error(res.data.message);
            }
        }


        $scope.loginUser = function (username, password)
        {
            if(username == "" || username == null || password == "" || password == null)
            {
                growl.error("Please enter username and password");
            }
            else
            {
              /*  password = md5.createHash(password || '');*/
                user.login(username, password)
                    .then(handleRequest, handleRequest);
                $state.reload();
            }
        }
    }]);

}());