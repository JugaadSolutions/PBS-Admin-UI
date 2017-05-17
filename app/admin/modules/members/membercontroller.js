(function () {
    'use strict';

    var app = angular.module('pbs');

    // Manage Members Controller
    var login_email;
    var login_id;
    var login_role;
    app.controller('ManageMembers', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', 'StatusService', '$uibModal', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, StatusService, $uibModal)
    {

        $scope.membersData = [];
        $scope.memberDocument=[];

        var filters = {
            filter: {
                populate: {path: 'membershipId'}
            }
        };

        /*login_email;*/

        DataService.getMembers(filters).then(function (response) {
            /*login_email;*/
            if (!response.error) {
                var i=0;
                $scope.membersData = response.data;
                $scope.membersData.forEach(function (member) {
                    member.status = StatusService.getMemberStatus(member.status);
                    if (!member.profilePic || member.profilePic == '') {
                        member.profilePicUrl = 'assets/images/no-avatar.png'
                    } else {
                        member.profilePicUrl ='http://www.mytrintrin.com/mytrintrin/Member/' + member.UserID + '/' + member.profilePic + '.png';
                    }
                    if (member.membershipId) {
                        member.subscriptionType = member.membershipId.subscriptionType;
                        //member.documentNumber = member.documents[i].documentNumber;
                    }
                });
                $scope.membersTable.reload();
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.membersTable = new NgTableParams(
            {
                count: 20
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.membersData, params.filter()) : $scope.membersData;

                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.changeMemberStatus = function (id) {
            var selectedMember = {};
            $scope.membersData.forEach(function (member) {
                if (member.UserID === id) {
                    selectedMember = member;
                }
            });
            return $uibModal.open({
                templateUrl: 'member-status-modal.html',
                controller: 'MemberStatus',
                size: 'md',
                resolve: {
                    member: function () {
                        return selectedMember;
                    }
                }
            });
        };

        $scope.editMember = function (id) {
            $state.go('admin.members.edit', {'id': id});
        };

        $scope.addNewMember = function () {
            $state.go('admin.members.add');
        };

        $scope.auth=function(){

        };


    }]);

    // Member Status Controller
    app.controller('MemberStatus', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'member', function ($scope, $state, DataService, growl, sweet, $uibModalInstance, member) {

        $scope.member = member;

        $scope.changeMemberStatus = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'Changing the status may have side effects',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change!',
                closeOnConfirm: true
            }, function () {
                $scope.member.status = parseInt($scope.member.status);
                DataService.updateMember($scope.member).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $uibModalInstance.dismiss();
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description);
                });
            });
        };

        $scope.cancelMemberStatusChange = function () {
            $uibModalInstance.dismiss();
        };

    }]);

    // Add Member Controller
    app.controller('AddMember', ['$scope', '$state', 'DataService', 'growl', 'sweet', function ($scope, $state, DataService, growl, sweet)
    {
        $scope.loginid=localStorage.LoginID;
        var _logIn_Id=$scope.loginid;

        $scope.member = {
            Name: '',
            lastName: '',
            /* givenName: '',*/
            fatherName: '',
            education: '',
            occupation: '',
            sex: '',
            phoneNumber: '',
            address: '',
            city: 'Mysore',
            state: 'Karnataka',
            country: 'India',
            countryCode: '91',
            pinCode: '',
            /* smartCardNumber: '',*/
            profilePic: '',
            cardNumber:'',
            emergencyContact: {countryCode: '91'},
            documents: [],
            smartCardKey:'',
            createdBy:_logIn_Id,
            membershipId:'',
            creditMode:'',
            transactionNumber:'',
            comments:'',
            UserID:0
        };

        $scope.panCardRegex = '/[A-Z]{5}\d{4}[A-Z]{1}/i';

        $scope.addNewDocument = function () {
            $scope.member.documents.push({});
        };

        $scope.removeDocument = function ($index) {
            $scope.member.documents.splice($index, 1);
        };

        $scope.addMember = function () {
            DataService.saveMember($scope.member).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    /*   $state.go('admin.members.edit', {'id': response.data._id});*/
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.message);
            })
        };

        $scope.cancelAddMember = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.members.manage');
            });
        };

        $scope.memberships = [];

        DataService.getMemberships().then(function (response) {
            if (!response.error) {
                for(var i=0;i<response.data.length;i++)
                {
                    $scope.memberships.push(response.data[i]);
                }
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.message);
        });

        $scope.selecteMembership = function (data) {
            $scope.member.membershipId = data.membershipId;
        };

    }]);

    // Edit Member Controller
    app.controller('EditMember', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModal','$filter', 'NgTableParams', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModal, $filter, NgTableParams) {
        $scope.member = {
            countryCode: '91',
            emergencyContact: {countryCode: '91'}
        };

        $scope.addNewDocument = function () {
            $scope.member.documents.push({});
        };



        $scope.removeDocument = function ($index) {
            sweet.show({
                title: 'Are you sure?',
                text: 'You will not be able to recover this record in the future',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                closeOnConfirm: true
            }, function () {
                $scope.member.phoneNumber = $scope.member.countryCode + '-' + $scope.member.phoneNumber;
                $scope.member.documents.splice($index, 1);
                DataService.updateMember($scope.member).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description);
                })
            });
        };



        $scope.addCredit = function (size) {
            $uibModal.open({
                templateUrl: 'memberCreditModal.html',
                controller: 'CreditModalCtrl',
                size: size,
                resolve: {
                    items: function () {
                    }
                }
            });
        };


        $scope.cancelMembership = function (size) {
            $uibModal.open({
                templateUrl: 'cancelMembership.html',
                controller: 'CancelMembershipModalCtrl',
                size: size,
                resolve: {
                    items: function () {
                    }
                }
            });
        };



        $scope.Suspend = function (size) {
            $uibModal.open({
                templateUrl: 'suspendMembership.html',
                controller: 'SuspendMembershipModalCtrl',
                size: size,
                resolve: {
                    items: function () {
                        /* return $scope.member.credit;*/
                    }
                }
            });
        };

        $scope.debit = function (size) {
            $uibModal.open({
                templateUrl: 'memberDebitModal.html',
                controller: 'DebitModalCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.member.debit;
                    }
                }
            });
        };

        $scope.verify = function () {
            var smartCard = {
                cardNumber: $scope.member.smartCardNumber
            };
            DataService.verifyCardForMember(smartCard).then(function (response) {
                if (!response.error) {
                    growl.success(response.message)
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });
        };

        $scope.verifyDocument = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'This will confirm registration for the member',
                type: 'info',
                showCancelButton: true,
                confirmButtonText: 'Yes, Approve',
                closeOnConfirm: true
            }, function () {
                $scope.member.status = 1;
                $scope.member.phoneNumber = $scope.member.countryCode + '-' + $scope.member.phoneNumber;

                DataService.verifyDocument($scope.member).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description);
                });
            });
        };

        $scope.addMembership = function () {
            return $uibModal.open({
                templateUrl: 'membership-modal.html',
                controller: 'MembershipForMember',
                size: 'md',
                resolve: {
                    member: function () {
                        return $scope.member;
                    }
                }
            });
        };

        $scope.addSmartCard = function () {
            return $uibModal.open({
                templateUrl: 'smartCard-modal.html',
                controller: 'SmartCardForMember',
                size: 'md',
                resolve: {
                    member: function () {
                        return $scope.member;
                    }
                }
            });
        };



        var filters = {
            filter: {
                populate: {path: 'membershipId'}
            }
        };

        $scope.changeMemberStatus = function () {
            return $uibModal.open({
                templateUrl: 'member-status-modal.html',
                controller: 'MemberStatus',
                size: 'md',
                resolve: {
                    member: function () {
                        return $scope.member;
                    }
                }
            });
        };

        DataService.getMember($stateParams.id, filters).then(function (response) {
            if (!response.error) {
                $scope.member = response.data;
                var phone = $scope.member.phoneNumber;
                var splitArr = phone.split("-");
                $scope.member.countryCode = splitArr[0];
                $scope.member.phoneNumber = phone.split('-').slice(1).join('-');


                if (!$scope.member.profilePic || $scope.member.profilePic == '') {
                    $scope.profilePicUrl = 'assets/images/no-avatar.png'
                } else {
                    $scope.profilePicUrl = "http://www.mytrintrin.com/mytrintrin/" + 'Member/' + $scope.member.UserID  + '/' + $scope.member.profilePic + '.png';
                }
                $scope.member.documents.forEach(function (document) {
                    document.documentProof = "http://www.mytrintrin.com/mytrintrin/" + 'Member/' + $scope.member.UserID + '/' + document.documentCopy + '.png';
                });
                if ($scope.member.membershipId) {
                    var membershipName = $scope.member.membershipId.subscriptionType;
                    DataService.getMemberships().then(function (response) {
                        if (!response.error) {
                            $scope.memberships = response.data;
                            $scope.memberships.forEach(function (membership) {
                                if (membership.subscriptionType === membershipName) {
                                    $scope.selectMembershipPlan = membership.membershipId;
                                }
                            });
                        }
                    });
                }
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description);
        });

        $scope.removeProfilePic = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You will not be able to recover this record in the future',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, remove it!',
                closeOnConfirm: true
            }, function () {
                $scope.member.phoneNumber = $scope.member.countryCode + '-' + $scope.member.phoneNumber;
                /* if ($scope.member.emergencyContact.contactNumber) {
                 $scope.member.emergencyContact.contactNumber =$scope.member.countryCode + '-' + $scope.member.emergencyContact.contactNumber;
                 } else {
                 $scope.member.emergencyContact.contactNumber = "";
                 }*/
                $scope.member.profilePic = {result:''};
                DataService.updateMember($scope.member).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description);
                })
            });
        };
        $scope.memberships=[];

        DataService.getMemberships().then(function (response) {
            if (!response.error) {
                for(var i=0;i<response.data.length;i++)
                {
                    $scope.memberships.push(response.data[i]);
                }
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.message);
        });

        $scope.selectedMembershipPlan = function (data) {
            $scope.member.membershipId = data.membershipId;
        };

        $scope.updateMember = function () {
            $scope.member.phoneNumber = $scope.member.countryCode + '-' + $scope.member.phoneNumber;



            DataService.updateMember($scope.member).then(function (response) {
                if (!response.error) {

                    growl.success(response.message);
                    $state.reload();
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });
        };

        $scope.cancelUpdateMember = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.members.manage');
            });
        };

        $scope.paymentsData = [];

        DataService.getMemberPaymentTransaction1($stateParams.id).then(function (response) {
            if (!response.error) {
                $scope.paymentsData = response.data;
                $scope.transactionCount = response.data.length;
                $scope.paymentsTable.reload();
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description);
        });

        $scope.paymentsTable = new NgTableParams(
            {
                count: 20
            },
            {
                counts: [],
                getData: function ($defer, params) {
                    params.total($scope.paymentsData.length);
                    $defer.resolve($scope.paymentsData);
                }
            }
        );

        $scope.ridesData = [];

        DataService.getRidesAdmin($stateParams.id).then(function (response) {
            if (!response.error) {
                $scope.ridesData = response.data;
                $scope.ridesCount = response.data.length;
                $scope.ridesTable.reload();
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description);
        });

        $scope.ridesTable = new NgTableParams(
            {
                count: 20
            },
            {
                counts: [],
                getData: function ($defer, params) {
                    params.total($scope.ridesData.length);
                    $defer.resolve($scope.ridesData);
                }
            }
        );

        $scope.addMember=function () {
            DataService.saveMember($scope.member).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    /*   $state.go('admin.members.edit', {'id': response.data._id});*/
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.message);
            })
        }


    }]);

    // Membership Plan for member Controller
    app.controller('MembershipForMember', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'member', function ($scope, $state, DataService, growl, sweet, $uibModalInstance, member) {

        $scope.member = member;
        $scope.member.membershipChanged = false;



        $scope.memberships=[];

        DataService.getMemberships().then(function (response) {
            if (!response.error) {
                $scope.memberships = response.data;
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.message);
        });

        $scope.selectedMembershipPlan = function (data)
        {

        };



        $scope.membershipPlanOtherDetails={
            creditMode:'',
            transactionNumber:'',
            comments:''
        }

        var _creditMode=$scope.membershipPlanOtherDetails.creditMode;
        var _transaction_number=$scope.membershipPlanOtherDetails.transactionNumber;
        var _comments=$scope.membershipPlanOtherDetails.comments;

        $scope.changeMembership = function () {
            sweet.show({
                title: 'Assign Membership?',
                text: 'The member will be assigned with that membership',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Add membership',
                closeOnConfirm: true
            }, function () {
                $scope.membershipData = {
                    _id: $scope.member._id,
                    membershipId: $scope.member.membershipId._id,
                    creditMode:$scope.membershipPlanOtherDetails.creditMode,
                    transactionNumber:_transaction_number,
                    comments:_comments
                };
                DataService.updateMembershipForMember($scope.membershipData).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $uibModalInstance.dismiss();
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description);
                });
            });
        };

        $scope.cancelMembershipChange = function () {
            $uibModalInstance.dismiss();
        };

    }]);

    // Smart Card for member Controller
    app.controller('SmartCardForMember', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'member', function ($scope, $state, DataService, growl, sweet, $uibModalInstance, member) {

        $scope.member = member;
        $scope.member.cardChanged = false;

        $scope.verify = function () {
            var smartCard = {
                cardNumber: $scope.member.smartCardNumber
            };
            DataService.verifyCardForMember(smartCard).then(function (response) {
                if (!response.error) {
                    growl.success(response.message)
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });
        };

        $scope.changeSmartCard = function () {
            sweet.show({
                title: 'Assign SmartCard?',
                text: 'The member will be assigned with that smartCard',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Add smartCard',
                closeOnConfirm: true
            }, function () {
                var data = {
                    UserID:$scope.member.UserID,
                    cardNumber: $scope.member.smartCardNumber,
                    membershipId: $scope.member.membershipId,
                    createdBy:_login_id
                };
                DataService.updateSmartCardForMember(data).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $uibModalInstance.dismiss();
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description);
                });
            });
        };

        $scope.cancelSmartCardChange = function () {
            $uibModalInstance.dismiss();
        };

    }]);

}());