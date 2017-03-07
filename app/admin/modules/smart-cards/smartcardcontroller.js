(function () {
    'use strict';

    var app = angular.module('pbs');

    app.controller('ManageSmartCards', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService) {
        $scope.smartCards = [];

        var filters = {
            filter: {
                populate: {path: 'assignedTo'}
            }
        };

        DataService.getSmartCards(filters).then(function (response) {
            if (!response.error) {
                $scope.smartCards = response.data;
                $scope.smartCards.forEach(function (smartCard) {
                    smartCard.status = StatusService.getSmartCardStatus(smartCard.status);
                    smartCard.cardType = StatusService.getCardType(smartCard.cardType);
                    if (smartCard.assignedTo) {
                        smartCard.name = smartCard.assignedTo.name;
                        smartCard.lastName = smartCard.assignedTo.lastName;
                    }
                });
                $scope.smartCardsTable.reload();
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.smartCardsTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.smartCards, params.filter()) : $scope.smartCards;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.editSmartCard = function (id) {
            $state.go('admin.smart-cards.edit', {'id': id});
        };

        $scope.addSmartCard = function () {
            $state.go('admin.smart-cards.add');
        };

    }]);

    app.controller('AddSmartCard', ['$scope', '$state', 'DataService', 'growl', 'sweet', function ($scope, $state, DataService, growl, sweet) {

        $scope.smartCard = {
            cardNumber: '',
            cardRFID:''
        };

        $scope.addSmartCard = function () {
            DataService.saveSmartCard($scope.smartCard).then(function (response) {
               /* login_email;*/
                if (!response.error) {
                    growl.success("Smart card successfully");
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.cancelAddSmartCard = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.smart-cards.manage');
            });
        };

    }]);

    app.controller('EditSmartCard', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModal', 'StatusService', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModal, StatusService) {

        $scope.smartCard = {};

        DataService.getSmartCard($stateParams.id).then(function (response) {
            if (!response.error) {
                $scope.smartCard = response.data;
                $scope.smartCard.cardType = StatusService.getCardType($scope.smartCard.cardType);
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description);
        });

        $scope.updateSmartCard = function () {
            DataService.updateSmartCard($scope.smartCard).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    $state.reload();
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.message);
            })
        };

        $scope.cancelUpdateSmartCard = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.smart-cards.manage');
            });
        };

    }]);

}());