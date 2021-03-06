// =========================================================================
// PBS Admin Controllers
// =========================================================================

(function () {
    'use strict';

    var app = angular.module('pbs');

    /*newly added*/
    var login_email;
    var login_id;
    var login_role;
    app.controller('PBSController', ['$scope', '$state', 'auth', '$rootScope', function ($scope, $state, auth,$rootScope) {

        $scope.$on('userInfo', function (event, user) {
            $scope.profileName = user.profileName;
           /* $scope.admin = user.role !== 'employee';*/
            $scope.admin = user.role !== 'member';

            $scope.role = user.role;
            /*newly added*/
            $scope.email=user.email;
            login_email = user.email;

            login_id=user.id;

            /*if ($scope.role=="member")
            {
                $state.go("403");
                return false;
            }*/
        });

        $scope.logout = function () {
            auth.logout();
            $state.reload();
        };
    }]);

    //Header Controller
    app.controller('HeaderController', ['$scope', '$state', 'auth', 'growl', '$rootScope', function ($scope, $state, auth, growl, $rootScope) {

        $scope.lvMenuStatFun = function () {
            $scope.lvMenuStat = !$scope.lvMenuStat;
            $rootScope.$broadcast('sideBar', $scope.lvMenuStat);
        };
    }]);

    //Admin Controller
    app.controller('AdminController', ['$scope', '$state', 'auth', 'growl', function ($scope, $state, auth, growl) {

        $scope.$on('sideBar', function (event, data) {
            $scope.sideBar = data;
        })

    }]);
    //403 Controller
    app.controller('403Controller', ['$scope', '$state', 'auth', 'growl', function ($scope, $state, auth, growl) {

    }]);

    //Login Controller
  /*  var _login_id;
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
                        growl.success(response.data.message);
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
            localStorage.LoginID=_login_id;
          /!*  alert(_login_id);*!/
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
                password = md5.createHash(password || '');
            user.login(username, password)
                .then(handleRequest, handleRequest);
            $state.reload();
            }
        }
    }]);*/

    // Manage Members Controller
    app.controller('ManageMembers', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', 'StatusService', '$uibModal', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, StatusService, $uibModal)
    {
        $scope.membersData = [];
        $scope.memberDocument=[];

        var filters = {
            filter: {
                populate: {path: 'membershipId'}
            }
        };

       /* login_email;*/

      /*  $scope.auth(function(response){
            var test=  params.email;
        })*/

        DataService.getMembers(filters).then(function (response) {
            /*login_email;*/
            var j=0;
            if (!response.error) {
                for (var i=0;i<response.data.length;i++)
                {
                    $scope.membersData.push(response.data[i]);
                }
                $scope.membersData.forEach(function (member) {
                    member.status = StatusService.getMemberStatus(member.status);
                    if (!member.profilePic || member.profilePic == '') {
                        member.profilePicUrl = 'assets/images/no-avatar.png'
                    } else {
                        member.profilePicUrl ='https://www.mytrintrin.com/mytrintrin2/Member/' + member.UserID + '/' + member.profilePic + '.png';
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

    app.controller('ViewOnDemandMembers', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', 'StatusService', '$uibModal','$stateParams', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, StatusService, $uibModal,$stateParams)
    {
        $scope.OnDemandMembers = [];

        DataService.getOnDemandMembers().then(function (response) {
            if (!response.error) {
                for(var i=0;i<response.data.length;i++)
                {
                    $scope.OnDemandMembers.push(response.data[i]);
                    $scope.OID=response.data[i].UserID;
                }
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.message);
        });

        $scope.onDemandMembersTable = new NgTableParams(
            {
                count: 20
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.OnDemandMembers, params.filter()) : $scope.OnDemandMembers;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.EditOnDemandMember = function (id) {
            $state.go('admin.ondemand.edit', {'id': id});
        };

    }]);

    var _ondemand_member_id='';
    app.controller('EditOnDemandMember', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', 'StatusService', '$uibModal','$stateParams', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, StatusService, $uibModal,$stateParams)
    {
        $scope.OnDemandMemberID = $stateParams.id;

        $scope.OnDemandMemberDetails={
            Name:'',
            lastName:'',
            sex:'',
            age:'',
            country:'',
            email:'',
            countryCode:'91',
            phoneNumber:'',
            address:'',
            pinCode:'',
            city:'',
            state:'',
            noofDays:'',
            UserID:$scope.OnDemandMemberID,
        };

        $scope.EditOnDemand=function () {
            DataService.updateOnDemandMember($scope.OnDemandMemberDetails).then(function(response) {
                if (!response.error) {
                    growl.success("Record updated successfully");
                    $state.go('admin.ondemand.view-members');
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.message);
            });
        };

        // Get member details by id
        var filters = {
            filter: {
                populate: {path: 'membershipId'}
            }
        };

        $scope.OnDemandMembers=[];
        DataService.getMember($stateParams.id,filters).then(function (response) {
            //$scope.OnDemandMemberDetails={};
            if (!response.error) {
                $scope.OnDemandMemberDetails.Name = response.data.Name;
                $scope.OnDemandMemberDetails.lastName = response.data.lastName;
                $scope.OnDemandMemberDetails.sex = response.data.sex;
                $scope.OnDemandMemberDetails.country = response.data.country;
                $scope.OnDemandMemberDetails.age = response.data.age;
                $scope.OnDemandMemberDetails.email = response.data.email;
                $scope.OnDemandMemberDetails.countryCode = response.data.countryCode;
                $scope.OnDemandMemberDetails.address = response.data.address;
                $scope.OnDemandMemberDetails.phoneNumber = response.data.phoneNumber;
                $scope.OnDemandMemberDetails.pinCode = response.data.pinCode;
                $scope.OnDemandMemberDetails.city = response.data.city;
                $scope.OnDemandMemberDetails.state = response.data.state;
                $scope.OnDemandMemberDetails.validity = response.data.validity;
                $scope.OnDemandMemberDetails.cardNum = response.data.cardNum;
                $scope.OnDemandMemberDetails.creditBalance = response.data.creditBalance;
                $scope.OnDemandMemberDetails.subscriptionType = response.data.membershipId.subscriptionType;
                /*$scope.OnDemandMemberID=$stateParams.id;*/
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description);
        });


        $scope.cancelOnDemand = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.ondemand.view-members');
            });
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
    var _User_ID;
    var _mobile_number;
    var Userid=0;
    app.controller('AddMember', ['$scope', '$state', 'DataService','$uibModal', 'growl', 'sweet', function ($scope, $state, DataService,$uibModal, growl, sweet)
    {
        $scope.loginid=localStorage.LoginID;
        var _logIn_Id=$scope.loginid;

        $scope.Role=localStorage.LoginRole;

        $scope.member = {
            Name: '',
            lastName: '',
            fatherName: '',
            age:'',
            education: '',
            occupation: '',
            sex: '',
            phoneNumber: '',
            email:'',
            address: '',
            city: 'Mysore',
            state: 'Karnataka',
            country: 'India',
            countryCode: '91',
            pinCode: '',
            profilePic: '',
            cardNumber:'',
            emergencyContact: {countryCode: '91',contactName:'',contactNumber:''},
            documents: [],
            smartCardKey:'',
            createdBy:_logIn_Id,
            membershipId:'',
            creditMode:'',
            transactionNumber:'',
            comments:'',
            UserID:'',
        };

        $scope.addNewDocument = function () {
            $scope.member.documents.push({});
            $scope.display=true;
        };

        if($scope.member.country == 'India')
        {
            $scope.Country = 'India';
        }


        if($scope.member.countryCode == 91)
        {
            $scope.countryCode = 91;
        }


        $scope.ShowMemberShipTab = false;

        $scope.selectedCountry=function (data)
        {
              $scope.Country=data;
        };

        $scope.selectedCountryCode=function (data) {
            $scope.CountryCode=data;
        };

        $scope.selectedDocument = function (data) {
            $scope.DocumentType= data.documentType;
            if($scope.DocumentType === 'Aadhar')
            {
                $scope.ShowMemberShipTab = true;
                $scope.ShowOTPTab=false;
            }
            /*$scope.CountryCode == '91'*/
            else if ($scope.DocumentType == 'Drivers license' && $scope.member.countryCode == '91' && $scope.Country == 'India')  // send otp
            {
                $scope.ShowMemberShipTab = false;
            }
            else if ($scope.DocumentType == 'Passport' &&  $scope.member.countryCode == '91' && $scope.Country == 'India')
            {
                $scope.ShowMemberShipTab = false;
            }
            else if ($scope.DocumentType == 'Other' &&  $scope.member.countryCode == '91' && $scope.Country == 'India')
            {
                $scope.ShowMemberShipTab = false;
            }
            //Foreigners
            else if($scope.DocumentType == 'Passport' &&  $scope.member.countryCode != '91' && $scope.Country != 'India')
            {
                $scope.ShowMemberShipTab = true;
            }
            else if ($scope.DocumentType == 'Passport' &&  $scope.member.countryCode == '91' && $scope.Country != 'India')
            {
                $scope.ShowMemberShipTab = false;
            }

        };

        $scope.removeDocument = function ($index) {
            $scope.member.documents.splice($index, 1);
        };

        $scope.addMember = function () {

            $scope.member.UserID = Userid;

            if($scope.member.phoneNumber !== '' || $scope.member.phoneNumber !== null)
            {
                if($scope.member.countryCode === '91')
                {
                    $scope.member.phoneNumber = "91-" + $scope.member.phoneNumber;
                }
                else
                    {
                        $scope.member.phoneNumber = $scope.member.countryCode + '-' + $scope.member.phoneNumber;
                    }
                if($scope.email == '' || $scope.email == null)
                {
                var _email = '';
                }
            }

           if($scope.member.UserID == 0)
           {
               $scope.member.UserID = 0;
           }
           else
           {
               $scope.member.UserID = Userid;
           }
            DataService.saveMember($scope.member).then(function (response) {
                if (!response.error) {
                    Userid = response.data.UserID;
                    var splitNumber= response.data.phoneNumber.split('-');
                    $scope.member.phoneNumber = splitNumber[1];
                     var MemberStatus=response.data.status;
                    growl.success(response.message);
                    Userid = 0;
                } else {
                    growl.error(response.description);
                }
            }, function (response) {
                growl.error(response.data.description);
                if(response.data.data.UserId == undefined)
                {
                    Userid = 0;
                    var SplitNumbers = $scope.member.phoneNumber.split('-');
                    $scope.member.phoneNumber = SplitNumbers[1];
                }
                else
                {
                    Userid = response.data.data.UserId;
                    var SplitNumber = $scope.member.phoneNumber.split('-');
                    $scope.member.phoneNumber = SplitNumber[1];
                }
            })
        };

       /* $scope.isDisabled = false;*/
        $scope.ProspectiveMember=function ()
        {
            $scope.member.UserID = Userid;
            /*var _mobile_no;*/
            if($scope.member.phoneNumber === '' || $scope.member.countryCode === null)
            {
                growl.error("Enter your Mobile Number");
                return;
            }
           else if($scope.member.phoneNumber !== '' || $scope.member.phoneNumber !== null)
            {
                if($scope.member.countryCode === '91')
                {
                    $scope.member.phoneNumber = "91-" + $scope.member.phoneNumber;
                }
                else
                {
                    $scope.member.phoneNumber=$scope.member.countryCode + '-' + $scope.member.phoneNumber;
                }
            }

            DataService.saveProspectiveMember($scope.member).then(function (response) {
                if (!response.error) {
                   $scope.ProsMember=[];
                    $scope.ProsMember = response.data;
                    Userid = response.data.UserID;
                    _User_ID = response.data.UserID;
                    _mobile_number = response.data.phoneNumber;
                   /* $scope.MobileNumber=response.data.phoneNumber;*/
                    var splitNumber= response.data.phoneNumber.split('-');
                    $scope.member.phoneNumber = splitNumber[1];
                    for(var i =0;i<response.data.documents.length;i++)
                    {
                        $scope._Document_Type = response.data.documents[0].documentType;
                    }
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
                if(response.data.data.UserId == undefined)
                {
                    Userid = 0;
                    var Split = $scope.member.phoneNumber.split('-');
                    $scope.member.phoneNumber = Split[1];
                }
                else
                {
                    Userid = response.data.data.UserId;
                    var Splits = $scope.member.phoneNumber.split('-');
                    $scope.member.phoneNumber = Splits[1];
                }
            })

           /* $scope.isDisabled = true;*/
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

        /*OTP*/
        $scope.otpDetails={
            otp:'',
            UserID:''
        };

        $scope.verifyOTP=function () {
            if($scope.otpDetails.otp === '' || $scope.otpDetails.otp === null)
            {
                growl.error("Please enter the OTP number");
                return;
            }
            $scope.otpDetails.UserID = _User_ID;
            DataService.OtpVerify($scope.otpDetails).then(function (response) {
                if (!response.error) {
                    /*$scope.Verified = response.data.otpVerified;*/
                    $scope.otpverify = response.data.otpVerified;
                    $scope.statusType = response.data.status;
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.message);
            })
        };

        $scope.resendOtp={
            UserID:'',
            phoneNumber:''
        }

        $scope.resendOTP=function () {
            $scope.resendOtp.UserID=_User_ID;
            $scope.resendOtp.phoneNumber=_mobile_number;
            DataService.OtpResend($scope.resendOtp).then(function (response) {
                if (!response.error) {
                    growl.success("OTP request sent");
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.message);
            });
        };

    }]);

    // Edit Member Controller
    app.controller('EditMember', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModal','$filter', 'NgTableParams', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModal, $filter, NgTableParams)
    {
        $scope.login_role= localStorage.LoginRole;

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
                /*if ($scope.member.emergencyContact.contactNumber) {
                    $scope.member.emergencyContact.contactNumber = $scope.member.countryCode + '-' + $scope.member.emergencyContact.contactNumber;
                } else {
                    $scope.member.emergencyContact.contactNumber = "";
                }*/
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
                        /*return $scope.member.credit;*/
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

        // ccavenu reponse handling ( when network break downs)
        $scope.ccavenu = function (size) {
            $uibModal.open({
                templateUrl: 'ccavenu.html',
                controller: 'CCavenuCtrl',
                size: size,
                resolve: {
                    items: function () {
                    }
                }
            });
        };

        $scope.cashModeChange = function (size) {
            $uibModal.open({
                templateUrl: 'cashModeChange.html',
                controller: 'CCavenuCtrl',
                size: size,
                resolve: {
                    items: function () {
                    }
                }
            });
        };

       /* $scope.ConfirmCancelMembership = function (size) {
            $uibModal.open({
                templateUrl: 'ConfirmCancelMembership.html',
                controller: 'ConfirmMembershipCancel',
                size: size,
                resolve: {
                    items: function () {
                    }
                }
            });
        };*/

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
                /*$scope.member.status = 1;*/
                /*$scope.member.phoneNumber = $scope.member.countryCode + '-' + $scope.member.phoneNumber;*/
                $scope.member.phoneNumber = $scope.member.phoneNumber;
                /*if ($scope.member.emergencyContact.contactNumber) {
                    $scope.member.emergencyContact.contactNumber = $scope.member.countryCode + '-' + $scope.member.emergencyContact.contactNumber;
                } else {
                    $scope.member.emergencyContact.contactNumber = "";
                }*/
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

/*        $scope.addSmartCard = function () {
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
        };*/

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
               for(var i=0;i<response.data.documents.length;i++)
               {
                   $scope.DocumentType=response.data.documents[i].documentType;
                   $scope.var2=response.data.documents[i].documentCopy;
                   $scope.varm=response.data.documents[i].documentNumber;
               }
                $scope.Country = $scope.member.country;
               $scope.userid = $scope.member.UserID;
                 $scope.otpverify=$scope.member.otpVerified;
                $scope.statusType=$scope.member.status;
                var splitNo=$scope.member.phoneNumber.split("-");
                $scope.member.phoneNumber = splitNo[1];
                $scope.MemberShipID=$scope.member.membershipId;
               /* $scope.member.phoneNumber = phone.split('-').slice(1).join('-');*/

                /*if ($scope.member.emergencyContact.contactNumber) {
                    var contactPhone = $scope.member.emergencyContact.contactNumber;
                    var contactSplit = contactPhone.split("-");
                    /!*$scope.member.emergencyContact.countryCode = contactSplit[0];*!/
                    $scope.member.emergencyContact.contactNumber = contactPhone.split('-').slice(1).join('-');
                } else {
                    $scope.member.emergencyContact.contactNumber = "";
                }*/
                if (!$scope.member.profilePic || $scope.member.profilePic == '') {
                    $scope.profilePicUrl = 'assets/images/no-avatar.png'
                } else {
                    $scope.profilePicUrl = "https://www.mytrintrin.com/mytrintrin/" + 'Member/' + $scope.member.UserID  + '/' + $scope.member.profilePic + '.png';
                }
                $scope.member.documents.forEach(function (document) {
                    /*document.documentProof = "http://www.mytrintrin.com/mytrintrin/" + 'Member/' + $scope.member.UserID + '/' + document.documentCopy + '.png';*/
                    document.documentProof = "https://www.mytrintrin.com/mytrintrin/" + 'Member/' + $scope.member.UserID + '/' + document.documentCopy + '.png';
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
                /*$scope.member.phoneNumber = $scope.member.countryCode + '-' + $scope.member.phoneNumber;*/
                $scope.member.phoneNumber = $scope.member.phoneNumber;

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

        $scope.selecteMembership = function (data) {
            $scope.member.membershipId = data.membershipId;
        };

        $scope.updateMember = function () {
            /*$scope.member.phoneNumber = $scope.member.countryCode + '-' + $scope.member.phoneNumber;*/
            $scope.member.phoneNumber = $scope.member.phoneNumber;
           /* if($scope.member.profilePic !== "" || $scope.member.profilePic !== null)
            {
                $scope.member.profilePic = '';
            }*/
            /*if ($scope.member.emergencyContact.contactNumber) {
                $scope.member.emergencyContact.contactNumber = $scope.member.countryCode + '-' + $scope.member.emergencyContact.contactNumber;
            } else {
                $scope.member.emergencyContact.contactNumber = "";
            }*/

            if($scope.member.phoneNumber !== '' || $scope.member.phoneNumber !== null)
            {
                if($scope.member.countryCode === '91')
                {
                    $scope.member.phoneNumber = "91-" + $scope.member.phoneNumber;
                }
                else
                {
                    $scope.member.phoneNumber=$scope.member.countryCode + '-' + $scope.member.phoneNumber;
                }
            }
            var _age=$scope.member.age;
            DataService.updateMember($scope.member).then(function (response) {
                if (!response.error) {
                    $scope.Country = response.data.country;
/*                    if ($scope.member.membershipChanged) {
                        var membershipData = {
                            _id: $scope.member._id,
                            membershipId: $scope.member.membershipId,
                            createdBy:_login_id
                        };
                        DataService.updateMembershipForMember(membershipData).then(function (response) {
                            if (!response.error) {
                                growl.success(response.message);
                                if ($scope.member.cardChanged) {
                                    var smartCardData = {
                                        _id: $scope.member._id,
                                        cardNumber: $scope.member.smartCardNumber,
                                        membershipId: $scope.member.membershipId,
                                        createdBy:_login_id
                                    };
                                    DataService.updateSmartCardForMember(smartCardData).then(function (response) {
                                        if (!response.error) {
                                            growl.success(response.message);
                                            window.location.reload();
                                        } else {
                                            growl.error(response.message);
                                        }
                                    }, function (response) {
                                        growl.error(response.data.description);
                                    });
                                }
                                window.location.reload();
                            } else {
                                growl.error(response.message);
                            }
                        }, function (response) {
                            growl.error(response.data.description);
                        });
                    } else {
                        if ($scope.member.cardChanged) {
                            var smartCardData = {
                                _id: $scope.member._id,
                                cardNumber: $scope.member.smartCardNumber,
                                membershipId: $scope.member.membershipId
                            };
                            DataService.updateSmartCardForMember(smartCardData).then(function (response) {
                                if (!response.error) {
                                    growl.success(response.message);
                                    $state.reload();
                                } else {
                                    growl.error(response.message);
                                }
                            }, function (response) {
                                growl.error(response.data.description);
                            });
                        }
                        //window.location.reload();

                    }*/
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

        /*var filtersPayments = {
            filter: {
               /!* where: {'member': $stateParams.id},*!/
                where: {'memberId': $stateParams.id},
                order: {'createdAt': -1}
            }
        };*/

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
                count: 50
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
            if(response.data.description == 'No rides found')
            {

            }
            else
            {
                growl.error(response.data.description);
            }

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
        };

        $scope.selectedCountry=function (data) {
            $scope.Country=data;
        };

        $scope.selectedCountryCode=function (data) {
            $scope.CountryCode=data;
        };

        /*new*/
        $scope.ShowMemberShipTab = false;

        $scope.selectedCountry=function (data) {
            $scope.Country=data;
        };

        $scope.selectedCountryCode=function (data) {
            $scope.CountryCode=data;
        };

        $scope.selectedDocument = function (data) {
            $scope.DocumentType= data.documentType;
            if($scope.DocumentType === 'Aadhar')
            {
                    $scope.ShowMemberShipTab = true;
                    $scope.ShowOTPTab = false;
            }
            else if ($scope.DocumentType == 'Drivers license' &&  $scope.CountryCode == '91' && $scope.Country == 'India')  // send otp
            {
                $scope.ShowMemberShipTab = false;
            }
            else if ($scope.DocumentType == 'Passport' &&  $scope.CountryCode == '91' && $scope.Country == 'India')
            {
                $scope.ShowMemberShipTab = false;
            }
            else if ($scope.DocumentType == 'Other' &&  $scope.CountryCode == '91' && $scope.Country == 'India')
            {
                $scope.ShowMemberShipTab = false;
            }
            //Foreigners
            else if($scope.DocumentType == 'Passport' &&  $scope.CountryCode != '91' && $scope.Country != 'India')
            {
                $scope.ShowMemberShipTab = true;
            }
            else if ($scope.DocumentType == 'Passport' &&  $scope.CountryCode == '91' && $scope.Country != 'India')
            {
                $scope.ShowMemberShipTab = false;
            }

        };

        $scope.Register = false;
        $scope.addMember=function () {
            if($scope.member.phoneNumber != null || $scope.member.phoneNumber != '')
            {
                if($scope.member.countryCode == '91')
                {
                    $scope.member.phoneNumber = '91-' + $scope.member.phoneNumber;
                }
                else
                {
                    $scope.member.phoneNumber = $scope.countryCode + $scope.member.phoneNumber
                }
            }
            DataService.saveMember($scope.member).then(function (response) {
                if (!response.error) {
                    $scope.member.UserID = response.data.UserID;
                    var splitNumber= response.data.phoneNumber.split('-');
                    $scope.member.phoneNumber = splitNumber[1];
                    var MemberStatus=response.data.status;
                    growl.success(response.message);
                   /* Userid = 0;*/
                } else {
                    growl.error(response.description);
                }
            }, function (response) {
                growl.error(error.data.description);
                if(error.data.data.UserId == undefined)
                {
                    $scope.member.UserID=error.data.data.UserId;
                    $scope.member.countryCode = $scope.member.country;
                    var SplitNumbers = $scope.member.phoneNumber.split('-');
                    $scope.member.phoneNumber = SplitNumbers[1];
                }
                else
                {
                    $scope.member.UserID = error.data.data.UserId;
                    var SplitNumber = $scope.member.phoneNumber.split('-');
                    $scope.member.phoneNumber = SplitNumber[1];
                }
            })
        }

        $scope.otpDetails={
            otp:'',
            UserID:''
        };

        $scope.verifyOTP=function () {
            if($scope.otpDetails.otp === '' || $scope.otpDetails.otp === null)
            {
                growl.error("Please enter the OTP number");
                return;
            }
            $scope.otpDetails.UserID = $scope.member.UserID;
            DataService.OtpVerify($scope.otpDetails).then(function (response) {
                if (!response.error) {
                    $scope.otpverify = response.data.otpVerified;
                    $scope.statusType = response.data.status;
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.message);
            })
        };

        $scope.resendOtp={
            UserID:'',
            phoneNumber:''
        }

        /*Resend OTP*/
        $scope.resendOTP=function () {
            $scope.resendOtp.UserID=$scope.member.UserID;
            $scope.resendOtp.phoneNumber=$scope.member.phoneNumber;
            DataService.OtpResend($scope.resendOtp).then(function (response) {
                if (!response.error) {
                    growl.success("OTP request sent");
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.message);
            });
        };

        $scope.isDisabled = false;
        $scope.sendOtp=function () {
            if($scope.member.phoneNumber != null || $scope.member.phoneNumber != '')
            {
                if($scope.member.countryCode == '91')
                {
                    $scope.member.phoneNumber = '91-' + $scope.member.phoneNumber;
                }
                else
                {
                    $scope.member.phoneNumber = $scope.countryCode + $scope.member.phoneNumber
                }
            }
            DataService.saveProspectiveMember($scope.member).then(function (response) {
                if (!response.error) {
                    $scope.ProsMember=[];
                    $scope.ProsMember = response.data;
                    $scope.member.UserID=response.data.UserID;
                    var splitNumber= response.data.phoneNumber.split('-');
                    $scope.member.phoneNumber = splitNumber[1];
                    for(var i =0;i<response.data.documents.length;i++)
                    {
                        $scope._Document_Type = response.data.documents[0].documentType;
                    }
                    $scope.isDisabled = true;
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
                if(response.data.data.UserId == undefined)
                {
                    $scope.member.UserID = response.data.data.UserId;
                    var Split = $scope.member.phoneNumber.split('-');
                    $scope.member.phoneNumber = Split[1];
                    $scope.member.countryCode=$scope.member.countryCode;
                }
                else
                {
                    $scope.member.UserID = response.data.data.UserId;
                    var Splits = $scope.member.phoneNumber.split('-');
                    $scope.member.phoneNumber = Splits[1];
                    $scope.member.countryCode=$scope.member.countryCode;
                }
            })
        }


    }]);

    // Membership Plan for member Controller
    app.controller('MembershipForMember', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'member', function ($scope, $state, DataService, growl, sweet, $uibModalInstance, member) {

        $scope.member = member;
        $scope.member.membershipChanged = false;

        /*DataService.getMemberships().then(function (response) {
            if (!response.error) {
                $scope.memberships = response.data;
                if ($scope.member.membershipId) {
                    var membershipName = $scope.member.membershipId.subscriptionType;
                    DataService.getMemberships().then(function (response) {
                        if (!response.error) {
                            $scope.memberships = response.data;
                            $scope.memberships.forEach(function (membership) {
                                if (membership.subscriptionType === membershipName) {
                                    $scope.selectMembershipPlan = membership._id;
                                }
                            });
                        }
                    });
                }
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.message);
        });*/

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

       /* $scope.selectedMembershipPlan = function (data) {
            $scope.memberships.forEach(function (membership) {
                if (membership.membershipId === data.membershipId) {
                    $scope.member.membershipId = membership;
                }
            });
        };*/

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

    // Search member details Controller
    var _searched_member_id;
    var _searched_member_name;
    app.controller('SearchMemberDetails', ['$scope', '$state','$stateParams', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter','$window', '$uibModal','$uibModalInstance', function ($scope, $state,$stateParams, DataService, StatusService, NgTableParams, growl, sweet,$filter,$window, $uibModal,$uibModalInstance)
        {
        $scope.searchMember={
            name:_search_member_name
        };

        $scope.SearchDetails = [];

            DataService.memberSearch($scope.searchMember).then(function (response) {
                if (!response.error) {
                    $scope.SearchDetails = response.data;
                    $scope.SearchMemberDetailsTable = new NgTableParams(
                        {
                            count: 10
                        },
                        {
                            getData: function ($defer, params) {
                                var orderedData = params.filter() ? $filter('filter')($scope.SearchDetails, params.filter()) : $scope.SearchDetails;
                                params.total(orderedData.length);
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        }
                    );
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })

            $scope.cancelSearchMemberDetails = function () {
                $uibModalInstance.dismiss();
            };

            $scope.getDetails=function(event)
            {
                _searched_member_id=event.currentTarget.value;
                _global_search_member_name = event.currentTarget.name;
                $scope.RaiseNewTickets();
            }

            $scope.RaiseNewTickets = function () {
                $uibModal.open({
                    templateUrl: 'raise-tickets.html',
                    controller: 'RaiseTickets',
                    size: 'md',
                    resolve: {
                        items: function () {
                        }
                    }
                });
            };


    }]);

    var _ticket_number;
    app.controller('RaiseTickets', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter','$window', '$uibModal','$uibModalInstance', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter,$window, $uibModal,$uibModalInstance)
    {
        $scope.loginid=localStorage.LoginID;
        var _logIn_Id=$scope.loginid;

        $scope.raiseTicketsDetails = {
            name:_global_search_member_name,
            user:_searched_member_id,
            subject:'',
            description:'',
            channel:1,
            priority:'',
            department:'',
            tickettype:'',
            assignedEmp:'',
            ticketdate:new Date(),
            createdBy:_logIn_Id,
        };

        if($scope.raiseTicketsDetails.department == '' || $scope.raiseTicketsDetails.tickettype || $scope.raiseTicketsDetails.assignedEmp)
        {
            $scope.raiseTicketsDetails = {
                name:_global_search_member_name,
                user:_searched_member_id,
                subject:'',
                description:'',
                channel:1,
                priority:'',
                ticketdate:new Date(),
                createdBy:_logIn_Id,
            };
        }
        else
        {
            $scope.raiseTicketsDetails = {
                name:_global_search_member_name,
                user:_searched_member_id,
                subject:'',
                description:'',
                channel:1,
                priority:'',
                department:'',
                tickettype:'',
                assignedEmp:'',
                ticketdate:new Date(),
                createdBy:_logIn_Id,
            };
        }
        /*var emp_dept;
         $scope.Employees = [];
         $scope.selectedDept =function(department){
         if(department === 'Registration Member Staff')
         {
         emp_dept = 'registrationstaff';
         }
         if(department === 'Redistribution Member Staff')
         {
         emp_dept = 'rvstaff';
         }
         if(department === 'Maintenance Center Staff')
         {
         emp_dept = 'mcstaff';
         }
         if(department === 'Holding Area Staff')
         {
         emp_dept = 'hastaff';
         }
         if(department === 'Operator')
         {
         emp_dept = 'operator';
         }
         if(department === 'Accounts Admin')
         {
         emp_dept = 'accountstaff';
         }
         if(department === 'Monitor Group')
         {
         emp_dept = 'monitorgrp';
         }
         DataService.getEmp(emp_dept).then(function (response) {
         if (!response.error) {
         for(var i=0;i<response.data.length;i++)
         {
         $scope.Employees.push(response.data[i]);
         }
         growl.success(response.message);
         } else {
         growl.error(response.message);
         }
         }, function (response) {
         growl.error(response.data.description['0']);
         })
         };

         $scope.selectedEmp = function (data) {
         $scope.raiseTicketsDetails.assignedEmp = data._id;
         };*/

        $scope.EmpDepartments = [];

        DataService.getEmpDept().then(function (response) {
            if (!response.error) {
                for(var i=0;i<response.data.value.length;i++)
                {
                    $scope.EmpDepartments.push(response.data.value[i]);
                }

            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.selecteDept = function (department) {
            $scope.raiseTicketsDetails.department=department.department;
            var _dept=department.uri;
            $scope.Employees=[];
            DataService.getEmp(_dept).then(function (response) {
                if (!response.error) {
                    for(var i=0;i<response.data.length;i++)
                    {
                        $scope.Employees.push(response.data[i]);
                    }

                    // dataservice to fetch ticket typer based on department
                    if($scope.raiseTicketsDetails.department === 'Registration')
                    {
                        var _ticket_type='Registration-ticket-types';
                    }
                    if($scope.raiseTicketsDetails.department === 'Maintenance')
                    {
                        /*var _ticket_type='MaintenanceDemo';*/
                        var _ticket_type='Maintenance';
                    }
                    if($scope.raiseTicketsDetails.department === 'Redistribution')
                    {
                        var _ticket_type='';
                    }
                    if($scope.raiseTicketsDetails.department === 'Operator')
                    {
                        var _ticket_type='';
                    }
                    if($scope.raiseTicketsDetails.department === 'Monitor-group')
                    {
                        var _ticket_type='';
                    }
                    if($scope.raiseTicketsDetails.department === 'Accounts')
                    {
                        var _ticket_type='';
                    }
                    if($scope.raiseTicketsDetails.department === 'Holding-area')
                    {
                        var _ticket_type='';
                    }
                    $scope.TicketTypes=[];
                    DataService.getTicketTypes(_ticket_type).then(function (response) {
                        if (!response.error) {
                            for(var i=0;i<response.data.value.length;i++)
                            {
                                $scope.TicketTypes.push(response.data.value[i])
                            }
                        } else {
                            growl.error(response.message);
                        }
                    }, function (response) {
                        growl.error(response.data.description['0']);
                    });
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            });
        };

        $scope.selectedEmp = function (data)
        {
            $scope.raiseTicketsDetails.assignedEmp=data._id;
        }

        $scope.selectedType = function (data)
        {
            $scope.raiseTicketsDetails.tickettype=data;
        }


        $scope.addNewTicketDetails = function () {
            DataService.saveTicketDetails($scope.raiseTicketsDetails).then(function (response) {
                if (!response.error)
                {
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };



        $scope.departmentNames = [];
        $scope.valueSelections = [];
        $scope.keyValues = [];
        var Values;

        DataService.getGlobalKeyNameValues().then(function (response)
        {
            if (!response.error) {
                $scope.departmentNames = response.data;
            }
            else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.selectedDepartment =function(data)
        {
            $scope.raiseTicketsDetails.department=data.name;

            for (var i=0;i<data.value.length;i++)
            {
                Values = data.value[i];
                $scope.valueSelections.push(Values);

                $scope.selectedValue=function (Values) {
                    $scope.raiseTicketsDetails.tickettype=Values;
                }
            }
        };

        $scope.cancelRaiseTickets = function () {
            $uibModalInstance.dismiss();
        };

    }]);


    // OTP
    app.controller('OTPNumber', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter','$window', '$uibModal','$uibModalInstance', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter,$window, $uibModal,$uibModalInstance)
    {
        $scope.cancelOTP = function () {
            $uibModalInstance.dismiss();
        };


        $scope.memberwithOTP={
            otp:''
         };

        $scope.saveMember=function () {
            DataService.saveMember($scope.memberwithOTP).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.message);
            });
        }
    }]);

    //  mobile number validation
    app.controller('MobileNumberValidation', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter','$window', '$uibModal','$uibModalInstance', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter,$window, $uibModal,$uibModalInstance)
    {
        $scope.ok = function () {
            $uibModalInstance.dismiss();
        };
    }]);

    // Member Credit Modal
    app.controller('CreditModalCtrl', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'loggedInUser', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModalInstance, loggedInUser)
    {

        $scope.login_role= localStorage.LoginRole

        $scope.loginid=localStorage.LoginID;
        var _logIn_Id=$scope.loginid;

        $scope.topupsDetails = {
            credit:'',
            creditMode: '',
            transactionNumber: '',
            comments: '',
            createdBy: _logIn_Id
        };


        $scope.addTopup = function () {
            DataService.saveTopupForMembership($stateParams.id, $scope.topupsDetails).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    $uibModalInstance.dismiss();
                    $state.reload();
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });
        }

        $scope.TopupDatas = [];

        DataService.getTopups().then(function (response) {
            if (!response.error) {
                for(var i=0;i<response.data.length;i++)
                {
                    $scope.TopupDatas.push(response.data[i]);
                }
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.selecteTopupPlan = function (data)
        {
            $scope.topupsDetails.credit=data.topupId;
        }

        $scope.cancelTopups = function () {
            $uibModalInstance.dismiss();
        };

    }]);

    // Member Debit Modal
    app.controller('DebitModalCtrl', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'loggedInUser', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModalInstance, loggedInUser) {

        $scope.member = {
            debit: 0,
            comments: '',
            /*createdBy: loggedInUser.assignedUser*/
            createdBy:_login_id
        };

        $scope.cancelDebit = function () {
            $uibModalInstance.dismiss();
        };

        $scope.addDebit = function () {
            DataService.addDebit($stateParams.id, $scope.member).then(function (response) {
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
        }

    }]);

    // cancel membership
    app.controller('CancelMembershipModalCtrl', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModalInstance','$uibModal', 'loggedInUser', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModalInstance,$uibModal, loggedInUser) {

        DataService.cancelRequest($stateParams.id).then(function (response) {
            if (!response.error && response.data != null) {

                $scope.Message=response.data.message;
               /* $scope.testing_demo=testing_demo;*/

                growl.success(response.data);
               /* $uibModalInstance.dismiss();*/
                $state.reload();
            }
            else
            {
                growl.error(response.message);
            }
        }, function (response) {
            /* growl.error(response.data.description['0']);*/
            growl.error(response.data.description);
        });
      /*  $scope.member = {
            creditMode: '',
            comments: '',
            transactionNumber:''
           /!* createdBy: loggedInUser.assignedUser*!/
        };

        $scope.cancelMemberShip = function () {
            DataService.cancelMember($stateParams.id, $scope.member).then(function (response) {
              if (!response.error && response.data != null) {
                    growl.success(response.message);
                    $uibModalInstance.dismiss();
                    $state.reload();
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /!* growl.error(response.data.description['0']);*!/
                growl.error(response.data.description);
            });
        }*/

        $scope.cancelMembershipcancel = function () {
            $uibModalInstance.dismiss();
        };

        $scope.ConfirmCancelMembership = function (size) {
            $uibModalInstance.dismiss();
            $uibModal.open({
                templateUrl: 'ConfirmCancelMembership.html',
                controller: 'ConfirmMembershipCancel',
                size: size,
                resolve: {
                    items: function () {
                    }
                }
            });
        };

    }]);

    // cancel membership response
    app.controller('ConfirmMembershipCancel', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'loggedInUser', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModalInstance, loggedInUser) {

        $scope.confirmMembershipInputs={
            modeOfRefund:'',
            transactionNumber:'',
            comments:''
        };

        /*$scope.OkConfirm = function () {
            $uibModalInstance.dismiss();
        };*/
        $scope.ExitRefund = function () {
         $uibModalInstance.dismiss();
         };

        $scope.Refund = function () {

            DataService.cancelMembership($stateParams.id,$scope.confirmMembershipInputs).then(function (response) {
                if (!response.error && response.data != null) {
                    $uibModalInstance.dismiss();
                    growl.success(response.message);
                    $state.reload();
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /* growl.error(response.data.description['0']);*/
                growl.error(response.data.description);
            });
        };
    }]);

    // suspend membership
    app.controller('SuspendMembershipModalCtrl', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'loggedInUser', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModalInstance, loggedInUser) {

        $scope.member = {
            comments: ''
            /* createdBy: loggedInUser.assignedUser*/
        };

        $scope.suspendMemberShip = function () {
            DataService.suspendMember($stateParams.id, $scope.member).then(function (response) {
                if (!response.error && response.data != null) {
                    if(response.data.status === -2)
                    {
                    }
                    else if (response.data.status === 1)
                    {
                    }
                    growl.success(response.message);
                    $uibModalInstance.dismiss();
                    $state.reload();
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });
        };

        $scope.cancelSuspend = function () {
            $uibModalInstance.dismiss();
        };
    }]);

    app.controller('CCavenuCtrl', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'loggedInUser', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModalInstance, loggedInUser)
    {
        $scope.login_role= localStorage.LoginRole

        $scope.loginid=localStorage.LoginID;

        $scope.ccavenuResponse = {
            credit:'',
            creditMode: '',
            transactionNumber: '',
            comments: '',
            createdBy: $scope.loginid
        };


        $scope.addCCAvenuResponse = function () {
            DataService.saveaddCCAvenuResponse($stateParams.id, $scope.ccavenuResponse).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    $uibModalInstance.dismiss();
                    $state.reload();
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });
        };

        $scope.cancelCCAvenu = function () {
            $uibModalInstance.dismiss();
        };

    }]);

    // cash mode change (when network breaks)
    app.controller('CashMode', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'loggedInUser', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModalInstance, loggedInUser)
    {
        $scope.login_role= localStorage.LoginRole

        $scope.loginid=localStorage.LoginID;

        $scope.cashMode = {
            creditMode: '',
            transactionNumber: '',
            createdBy: $scope.loginid
        };


        $scope.addCCAvenuResponse = function () {
            DataService.saveaddCCAvenuResponse($stateParams.id, $scope.ccavenuResponse).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    $uibModalInstance.dismiss();
                    $state.reload();
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });
        };

        $scope.cancelCashMode = function () {
            $uibModalInstance.dismiss();
        };

    }]);

    // Manage Employees Controller
    app.controller('ManageEmployees', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService) {
        $scope.employeesData = [];

        var filters = {
            filter: {
                populate: {path: 'smartCardDetails.smartCardId'}
            }
        };

        DataService.getEmployees(filters).then(function (response) {
            if (!response.error) {
                $scope.employeesData = response.data;
                $scope.employeesData.forEach(function (employee) {
                    employee.status = StatusService.getEmployeeStatus(employee.status);
                    /*for (var i = 0; i < employee.smartCardDetails.length; i++) {
                        employee.smartCardDetails[i].cardLevel = StatusService.getCardLevel(employee.smartCardDetails[i].smartCardId.cardLevel);
                    }*/
                    if (!employee.profilePic || employee.profilePic== '') {
                        employee.profilePicUrl = 'assets/images/no-avatar.png'
                    } else {
                        employee.profilePicUrl = "https://www.mytrintrin.com/mytrintrin2/" + 'Employee/' + employee.UserID + '/' + employee.profilePic + '.png';
                    }
                });
                $scope.employeesTable.reload();
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description);
        });

        $scope.employeesTable = new NgTableParams(
            {
                count: 20
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.employeesData, params.filter()) : $scope.employeesData;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.changeEmployeeStatus = function (id) {
            var selectedEmployee = {};
            $scope.employeesData.forEach(function (employee) {
                if (employee.UserID === id) {
                    selectedEmployee = employee;
                }
            });
            return $uibModal.open({
                templateUrl: 'employee-status-modal.html',
                controller: 'EmployeeStatus',
                size: 'md',
                resolve: {
                    employee: function () {
                        return selectedEmployee;
                    }
                }
            });
        };

        $scope.addNewEmployee = function () {
            $state.go('admin.employees.add');
        };

        $scope.editEmployee = function (id) {
            $state.go('admin.employees.edit', {'id': id});
        };
    }]);

    // Employee Status Controller
    app.controller('EmployeeStatus', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'employee', function ($scope, $state, DataService, growl, sweet, $uibModalInstance, employee) {

        $scope.employee = employee;

        $scope.changeEmployeeStatus = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'Changing the status may have side effects',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change!',
                closeOnConfirm: true
            }, function () {
                $scope.employee.status = parseInt($scope.employee.status);
                DataService.updateEmployee($scope.employee).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $uibModalInstance.dismiss();
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description['0']);
                });
            });
        };

        $scope.cancelEmployeeStatusChange = function () {
            $uibModalInstance.dismiss();
        };

    }]);

    // Add Employees Controller
    app.controller('AddEmployees', ['$scope', '$state', 'DataService', 'growl', 'sweet', function ($scope, $state, DataService, growl, sweet)
    {
        $scope.loginid=localStorage.LoginID;
        var _logIn_Id=$scope.loginid;

        $scope.employee = {
            Name:'',
            lastName: '',
            education: '',
            occupation: '',
            sex: '',
            phoneNumber: '',
            address: '',
            city: 'Mysore',
            state: 'Karnataka',
            country: 'India',
            countryCode: '',
            pinCode: '',
            profilePic: '',
            emergencyContact: {countryCode: '91'},
            documents: [],
            smartCardDetails: [],
            position: '',
            department: '',
            experiance: '',
            joiningDate: '',
            additionalInfo: '',
            createdBy:_logIn_Id
        };

        $scope.addNewDocument = function () {
            $scope.employee.documents.push({});
        };

        $scope.removeDocument = function ($index) {
            $scope.employee.documents.splice($index, 1);
        };

        $scope.addEmployees = function () {
            $scope.employee.phoneNumber = $scope.employee.countryCode + '-' + $scope.employee.phoneNumber;
            if ($scope.employee.emergencyContact.contactNumber) {
                $scope.employee.emergencyContact.contactNumber = $scope.employee.emergencyContact.countryCode + '-' + $scope.employee.emergencyContact.contactNumber;
            } else {
                $scope.employee.emergencyContact.contactNumber = "";
            }
            DataService.saveEmployee($scope.employee).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                } else {
                    growl.error(response.data.description);
                }
            }, function (response) {
                growl.error(response.data.description);
            })
        };

        $scope.cancelAddEmployee = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.employees.manage');
            });
        };
    }]);

    // Edit Member Controller
    app.controller('EditEmployee', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$filter', '$uibModal', function ($scope, $state, $stateParams, DataService, growl, sweet, $filter, $uibModal) {
        $scope.employee = {
            countryCode: '91',
            emergencyContact: {countryCode: '91'}
        };

        $scope.addNewDocument = function () {
            $scope.employee.documents.push({});
        };

        $scope.addNewSmartCard = function () {
            $scope.employee.smartCardDetails.push({});
        };

        $scope.removeSmartCard = function ($index) {
            sweet.show({
                title: 'Are you sure?',
                text: 'You will not be able to recover this record in the future',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, remove it!',
                closeOnConfirm: true
            }, function () {
                var removeSmartCard = $scope.employee.smartCardDetails[$index].smartCardId;
                DataService.deactivateCard(removeSmartCard).then(function (response) {
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

        $scope.verify = function ($index) {
            var smartCard = {
                cardNumber: [$scope.employee.smartCardDetails[$index].smartCardNumber]
            };
            DataService.verifyCardForEmployee(smartCard).then(function (response) {
                if (!response.error) {
                    growl.success(response.message)
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });
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
                $scope.employee.phoneNumber = $scope.employee.countryCode + '-' + $scope.employee.phoneNumber;
/*                if ($scope.employee.emergencyContact.contactNumber) {
                    $scope.employee.emergencyContact.contactNumber = $scope.employee.emergencyContact.countryCode + '-' + $scope.employee.emergencyContact.contactNumber;
                } else {
                    $scope.employee.emergencyContact.contactNumber = "";
                }*/
                $scope.employee.documents.splice($index, 1);
                DataService.updateEmployee($scope.employee).then(function (response) {
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

        $scope.addSmartCard = function () {
            return $uibModal.open({
                templateUrl: 'smartCard-status-modal.html',
                controller: 'SmartCardForEmployee',
                size: 'md',
                resolve: {
                    employee: function () {
                        return $scope.employee;
                    }
                }
            });
        };

        $scope.changeEmployeeStatus = function () {
            return $uibModal.open({
                templateUrl: 'employee-status-modal.html',
                controller: 'EmployeeStatus',
                size: 'md',
                resolve: {
                    employee: function () {
                        return $scope.employee;
                    }
                }
            });
        };

        $scope.verifyDocument = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'This will activate the employee\'s account',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Approve',
                closeOnConfirm: true
            }, function () {
                $scope.employee.phoneNumber = $scope.employee.countryCode + '-' + $scope.employee.phoneNumber;
/*                if ($scope.employee.emergencyContact.contactNumber) {
                    $scope.employee.emergencyContact.contactNumber = $scope.employee.emergencyContact.countryCode + '-' + $scope.employee.emergencyContact.contactNumber;
                } else {
                    $scope.employee.emergencyContact.contactNumber = "";
                }*/
                $scope.employee.status = 1;
                DataService.verifyDocumentEmployee($scope.employee).then(function (response) {
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

        DataService.getEmployee($stateParams.id).then(function (response) {
            if (!response.error) {
                $scope.employee = response.data[0];
                var name = response.data[0].Name;
                var phone = $scope.employee.phoneNumber;
                var splitArr = phone.split("-");
                $scope.employee.countryCode = splitArr[0];
                $scope.employee.phoneNumber = phone.split('-').slice(1).join('-');

               /* if ($scope.employee.emergencyContact.contactNumber) {
                    var contactPhone = $scope.employee.emergencyContact.contactNumber;
                    var contactSplit = contactPhone.split("-");
                    $scope.employee.emergencyContact.countryCode = contactSplit[0];
                    $scope.employee.emergencyContact.contactNumber = contactPhone.split('-').slice(1).join('-');
                } else {
                    $scope.employee.emergencyContact.contactNumber = "";
                }*/
                if (!$scope.employee.profilePic || $scope.employee.profilePic == '') {
                    $scope.profilePicUrl = 'assets/images/no-avatar.png'
                } else {
                    $scope.profilePicUrl = "http://www.mytrintrin.com/mytrintrin/Employee/" + response.data[0].UserID + '/' + response.data[0].profilePic + '.png';
                }
                $scope.employee.documents.forEach(function (document) {
                    document.documentProof =  "http://www.mytrintrin.com/mytrintrin/Employee/" + $scope.employee.UserID + '/' + document.documentCopy + '.png';
                });
                $scope.employee.joiningDate = new Date($scope.employee.joiningDate);
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
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
                $scope.employee.phoneNumber = $scope.employee.countryCode + '-' + $scope.employee.phoneNumber;
/*                if ($scope.employee.emergencyContact.contactNumber) {
                    $scope.employee.emergencyContact.contactNumber = $scope.employee.emergencyContact.countryCode + '-' + $scope.employee.emergencyContact.contactNumber;
                } else {
                    $scope.employee.emergencyContact.contactNumber = "";
                }*/
                $scope.employee.profilePic =  {result:''};
                DataService.updateEmployee($scope.employee).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description['0']);
                });
            });
        };

        $scope.updateEmployee = function () {
            $scope.employee.phoneNumber = $scope.employee.countryCode + '-' + $scope.employee.phoneNumber;
/*            if ($scope.employee.emergencyContact.contactNumber) {
                $scope.employee.emergencyContact.contactNumber =  $scope.employee.emergencyContact.contactNumber;
            } else {
                $scope.employee.emergencyContact.contactNumber = "";
            }*/
            DataService.updateEmployee($scope.employee).then(function (response) {
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

        $scope.cancelUpdateEmployee = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.employees.manage');
            });
        };

    }]);

    // Smart Card  Controller
    app.controller('SmartCardForEmployee', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'employee', function ($scope, $state, DataService, growl, sweet, $uibModalInstance, employee) {

       /* $scope.employee = employee;

        $scope.addNewSmartCard = function () {
            $scope.employee.smartCardDetails.push({});
        };

        $scope.verify = function ($index) {
            var smartCard = {
                cardNumber: [$scope.employee.smartCardDetails[$index].smartCardNumber]
            };
            DataService.verifyCardForEmployee(smartCard).then(function (response) {
                if (!response.error) {
                    growl.success(response.message)
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });
        };

        $scope.AddSmartCard = function () {
            sweet.show({
                title: 'Assign Smart Card?',
                text: 'The employee will be assigned with that smartcard',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change!',
                closeOnConfirm: true
            }, function () {
                var cardNumber = [];
                for (var i = 0; i < $scope.employee.smartCardDetails.length; i++) {
                    if (!$scope.employee.smartCardDetails[i]._id) {
                        cardNumber.push($scope.employee.smartCardDetails[i].smartCardNumber)
                    }
                }
                var smartCardForEmployee = {
                    _id: $scope.employee._id,
                    cardNumber: cardNumber
                };
                DataService.updateSmartCardForEmployee(smartCardForEmployee).then(function (response) {
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

        $scope.cancelSmartCard = function () {
            $uibModalInstance.dismiss();
            $state.reload();
        };*/


        $scope.employee = employee;
        $scope.employee.cardChanged = false;

        $scope.Empcard={
            UserID: $scope.employee.UserID,
            cardNumber: ''
        };


        $scope.verify = function () {
            var smartCard = {
                cardNumber: $scope.employee.smartCardNumber
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

        $scope.AddSmartCard = function () {
            sweet.show({
                title: 'Assign SmartCard?',
                text: 'The member will be assigned with that smartCard',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Add smartCard',
                closeOnConfirm: true
            }, function () {
                /*var data = {
                    _id: $scope.member._id,
                    cardNumber: $scope.member.smartCardNumber,
                    membershipId: $scope.member.membershipId
                };*/

/*
                 $scope.Empcard={
                    _id: $scope.employee._id,
                     cardNumber: ''
                };*/
                DataService.updateSmartCardForEmployee($scope.Empcard).then(function (response) {
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

        $scope.cancelSmartCard = function () {
            $uibModalInstance.dismiss();
            $state.reload();
        };
    }]);

    //Manage Membership
    app.controller('ManageMembership', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', 'NgTableParams', '$filter', '$uibModal', 'StatusService', function ($scope, $state, $stateParams, DataService, growl, sweet, NgTableParams, $filter, $uibModal, StatusService) {
        $scope.membershipData = [];

        var filters = {
            filter: {
                populate: {path: 'farePlan'}
            }
        };

        DataService.getMemberships(filters).then(function (response) {
            if (!response.error) {
                $scope.membershipData = response.data;
                $scope.membershipData.forEach(function (membership) {
                    membership.status = StatusService.getMembershipStatus(membership.status);
                    membership.planName = membership.farePlan.planName;
                    membership.total = membership.userFees + membership.securityDeposit + membership.smartCardFees +
                        membership.processingFees;
                });
                $scope.membershipTable.reload();
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.membershipTable = new NgTableParams(
            {
                count: 6
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.membershipData, params.filter()) : $scope.membershipData;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.editMembership = function (id) {
            $state.go('admin.membership.edit', {'id': id});
        };

        $scope.addNewMembership = function () {
            $state.go('admin.membership.add');
        };

    }]);

    //Add Membership
    app.controller('AddMembership', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', function ($scope, $state, $stateParams, DataService, growl, sweet) {
        $scope.membership = {
            subscriptionType: '',
            validity: '',
            userFees: '',
            securityDeposit: '',
            processingFees: ''
        };

        $scope.farePlans = [];

        DataService.getFarePlans().then(function (response) {
            if (!response.error) {
                $scope.farePlans = response.data;
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.message);
        });

        $scope.selectedFarePlan = function (data) {
            $scope.membership.farePlan = data.id;
        };

        $scope.addMembership = function () {
            DataService.saveMembership($scope.membership).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    $state.go('admin.membership.edit', {'id': response.data._id});
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.cancelAddMembership = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.membership.manage');
            });
        };

    }]);

    //Edit Membership
    app.controller('EditMembership', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModal', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModal)
    {
        $scope.membership = {};

        var filters = {
            filter: {
                populate: {path: 'farePlan'}
            }
        };

        DataService.getMembership($stateParams.id, filters).then(function (response) {
            if (!response.error) {
                $scope.membership = response.data;
                var farePlanName = $scope.membership.farePlan.planName;
                DataService.getFarePlans().then(function (response) {
                    if (!response.error) {
                        $scope.farePlans = response.data;
                        $scope.farePlans.forEach(function (farePlan) {
                            $scope.membership.selectPlan = farePlan.planName;
                            if (farePlan.planName === farePlanName) {
                                $scope.selectPlan = farePlan._id;
                            }
                        });
                    }
                });
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.message);
        });

        $scope.selectedFarePlan = function (id) {
            $scope.farePlans.forEach(function (farePlan) {
                if (farePlan._id === id) {
                    $scope.membership.farePlan = farePlan;
                }
            });
        };

        $scope.updateMembership = function () {
            DataService.updateMembership($scope.membership).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);

                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.cancelUpdateMembership = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.membership.manage');
            });
        };

    }]);

    var Number_of_DockingStations;
    app.controller('ManageDockingStation', ['$scope', 'NgTableParams', '$state', '$uibModal', 'DataService', 'StatusService', 'growl', 'sweet', '$filter', function ($scope, NgTableParams, $state, $uibModal, DataService, StatusService, growl, sweet, $filter) {

        $scope.dockingStations = [];

        DataService.getDockingStations().then(function (response) {
            if (!response.error) {
                $scope.dockingStations = response.data;
                Number_of_DockingStations =  response.data.length;
                $scope.dockingStations.forEach(function (dockingStation) {
                   /* dockingStation.operationStatus = StatusService.getDockingStationStatus(dockingStation.operationStatus);*/
                    dockingStation.operationStatus = StatusService.getDockingStationStatus(dockingStation.operationStatus);
                });
                $scope.dockingStationsTable.reload();
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });


        $scope.dockingStationsTable = new NgTableParams(
            {
                count: 20
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.dockingStations, params.filter()) : $scope.dockingStations;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.changeDockingStationStatus = function (id) {
            var selectedDockingStation = {};
            $scope.dockingStations.forEach(function (dockingStation) {
                if (dockingStation.StationID === id) {
                    selectedDockingStation = dockingStation;
                }
            });
            return $uibModal.open({
                templateUrl: 'docking-station-status-modal.html',
                controller: 'DockingStationStatus',
                size: 'md',
                resolve: {
                    dockingStation: function () {
                        return selectedDockingStation;
                    }
                }
            });
        };

        $scope.addDockingStation = function () {
            $state.go('admin.docking-stations.add');
        };

        $scope.editDockingStation = function (id) {
            $state.go('admin.docking-stations.edit', {'id': id});
        };

        $scope.DockingStationMore = function (id) {
            $state.go('admin.docking-stations.docking-station-more-details', {'id': id});
        };

    }]);

    // Docking Station Status Controller
    app.controller('DockingStationStatus', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'dockingStation', function ($scope, $state, DataService, growl, sweet, $uibModalInstance, dockingStation) {

        $scope.dockingStation = dockingStation;

        $scope.changeStationStatus = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'Changing the status may have side effects',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change!',
                closeOnConfirm: true
            }, function () {
                $scope.dockingStation.operationStatus = parseInt($scope.dockingStation.operationStatus);
                DataService.updateDockingStation($scope.dockingStation).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $uibModalInstance.dismiss();
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description['0']);
                });
            });
        };

        $scope.cancelDockingStationStatusChange = function () {
            $uibModalInstance.dismiss();
        };

    }]);

    app.controller('AddDockingStation', ['$scope', '$state', 'sweet', 'DataService', 'growl', '$uibModal', function ($scope, $state, sweet, DataService, growl, $uibModal) {

        $scope.dockingStation = {
            stationNumber: '',
            noofUnits:'',
            noofPorts:'',
            modelType: '',
            gpsCoordinates: {
                longitude: '',
                latitude: ''
            },
            maxAlert: '',
            minAlert: '',
            name: '',
            dockingUnitIds: [],
            ipAddress: '',

            template:'',
            commissioneddate:'',
            subnet:0,
            zoneId:''

        };

        $scope.cancelAddDockingStation = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.docking-stations.manage');
            });
        };

        var dockingStation = $scope.dockingStation;
        $scope.saveDockingStation = function () {
            return $uibModal.open({
                templateUrl: 'docking-station-sync.html',
                controller: 'DockingStationSync',
                size: 'sm',
                resolve: {
                    dockingStation: function () {
                        return dockingStation;
                    }
                }
            });
        };

    }]);

    // Docking Unit Status Controller
    app.controller('DockingStationSync', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'dockingStation', function ($scope, $state, DataService, growl, sweet, $uibModalInstance, dockingStation) {

        $scope.dockingStation = dockingStation;

        $scope.cancelSync = function () {
            DataService.saveDockingStationWithOutSync($scope.dockingStation).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    $uibModalInstance.dismiss();
                    $state.reload();
                    $state.go('admin.docking-stations.edit', {'id': response.data._id});
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.description);
            });
        };

        $scope.syncNow = function () {
            DataService.saveDockingStation($scope.dockingStation).then(function (response) {
                if (!response.error) {
                    var ipAddress = {
                        ipAddress: $scope.dockingStation.ipAddress
                    };
                    console.log(ipAddress);
                    DataService.saveDockingStationWithSync(ipAddress).then(function (response) {
                        if (!response.error) {
                            growl.success(response.message);
                            $uibModalInstance.dismiss();
                            $state.reload();
                            $state.go('admin.docking-stations.edit', {'id': response.data._id});
                        } else {
                            growl.error(response.message);
                        }
                    }, function (response) {
                        growl.error(response.data.description['0']);
                    });
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            });
        };

    }]);

    app.controller('EditDockingStation', ['$scope', '$state', '$uibModal', '$stateParams', 'DataService', 'StatusService', 'growl','GOOGLEMAPURL', 'sweet', function ($scope, $state, $uibModal, $stateParams, DataService, StatusService, growl, GOOGLEMAPURL,sweet) {

        $scope.dockingStation = {};

        $scope.dockingStationMap = {
            center: {
                latitude:0 ,
                longitude:0
            },
            zoom: 15
        };

        DataService.getDockingStation($stateParams.id).then(function (response) {
            if (!response.error) {
                $scope.dockingStation = response.data;
                $scope.dockingStationStatus = StatusService.getDockingStationStatus($scope.dockingStation.operationStatus);
                $scope.dockingStationMap.center.latitude = parseFloat($scope.dockingStation.gpsCoordinates.latitude);
                $scope.dockingStationMap.center.longitude = parseFloat($scope.dockingStation.gpsCoordinates.longitude);
                var myLatLng = {lat: $scope.dockingStationMap.center.latitude , lng: $scope.dockingStationMap.center.longitude };
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    title: 'Hello World!'
                });
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.message);
        });

      /* $scope.updateDockingStation = function () {
            if (parseInt($scope.dockingStation.noOfDockingUnits) < $scope.dockingStation.dockingUnitIds.length)
            {
                growl.error("Total Units for this Station cannot be lesser than current occupancy, which is " + $scope.dockingStation.dockingUnitIds.length);
            }
            else
            {
                DataService.updateDockingStation($scope.dockingStation).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description);
                })
          }
        };*/

        $scope.updateDockingStation = function () {
                DataService.updateDockingStation($scope.dockingStation).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description);
                })
        };




        $scope.changeDockingStationStatus = function () {
            return $uibModal.open({
                templateUrl: 'docking-station-status-modal.html',
                controller: 'DockingStationStatus',
                size: 'md',
                resolve: {
                    dockingStation: function () {
                        return $scope.dockingStation;
                    }
                }
            });
        };



        $scope.testConnection = function (data) {
            var ipAddress = {
                ipAddress: data
            };
            console.log(ipAddress);
            DataService.testConnectionForIP(ipAddress).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });
        };

        $scope.syncNow = function (data) {
            sweet.show({
                title: 'Are you sure?',
                text: 'Sync data to the Docking Station',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Sync',
                closeOnConfirm: true
            }, function () {
                var ipAddress = {
                    ipAddress: data
                };
                console.log(ipAddress);
                DataService.saveDockingStationWithSync(ipAddress).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description);
                });
            })
        };

        $scope.cancelUpdateDockingStation = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.docking-stations.manage');
            });
        };
    }]);

    // Docking station ( view more details )
    app.controller('DockingStationMoreDetails', ['$scope', '$state', '$uibModal', '$stateParams', 'DataService', 'StatusService', 'growl','GOOGLEMAPURL', 'sweet', function ($scope, $state, $uibModal, $stateParams, DataService, StatusService, growl, GOOGLEMAPURL,sweet) {

        $scope.dockingStation = {};

        $scope.Zone= "";

        DataService.getDockingStation($stateParams.id).then(function (response) {
            if (!response.error) {
                $scope.dockingStation = response.data;
            if( $scope.dockingStation.zoneId==3)
                {
                $scope.Zone ="Zone 3";
                }
                $scope.dockingStationStatus = StatusService.getDockingStationStatus($scope.dockingStation.operationStatus);
                $scope.dockingStationMap.center.latitude = parseFloat($scope.dockingStation.gpsCoordinates.latitude);
                $scope.dockingStationMap.center.longitude = parseFloat($scope.dockingStation.gpsCoordinates.longitude);
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.message);
        });

        $scope.cancelDockingStationMoreDetails = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.docking-stations.manage');
            });
        };

    }]);


    app.controller('ManageDockingUnit', ['$scope', 'NgTableParams', '$state', 'DataService', 'growl', 'sweet', 'constantService', '$filter', 'StatusService', '$uibModal', function ($scope, NgTableParams, $state, DataService, growl, sweet, constantService, $filter, StatusService, $uibModal) {

        /*Docking Units Statuses*/
        $scope.DockUnitStatus = constantService.DockUnitStatus;

        $scope.dockingUnits = [];

        $scope.dockingUnitsTable = new NgTableParams(
            {
                count: 6
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.dockingUnits, params.filter()) : $scope.dockingUnits;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        var filters = {
            filter: {
                populate: [{path: 'dockingStationId'}]
            }
        };

        DataService.getDockingUnits(filters).then(function (response) {
            if (!response.error) {
                $scope.dockingUnits = response.data;
                $scope.dockingUnits.forEach(function (dockingUnit) {
                    dockingUnit.status = StatusService.getDockingUnitsStatus(dockingUnit.status);
                    dockingUnit.name = dockingUnit.dockingStationId.name;
                });
                $scope.dockingUnitsTable.reload();
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.changeDockingUnitStatus = function (id) {
            var selectedDockingUnit = {};
            $scope.dockingUnits.forEach(function (dockingUnit) {
                if (dockingUnit._id === id) {
                    selectedDockingUnit = dockingUnit;
                }
            });
            return $uibModal.open({
                templateUrl: 'docking-unit-status-modal.html',
                controller: 'DockingUnitStatus',
                size: 'md',
                resolve: {
                    dockingUnit: function () {
                        return selectedDockingUnit;
                    }
                }
            });
        };

        $scope.addDockingUnit = function () {
            $state.go('admin.docking-units.add')
        };

        $scope.editDockingUnit = function (id) {
            $state.go('admin.docking-units.edit', {'id': id});
        };

    }]);

    // Docking Unit Status Controller
    app.controller('DockingUnitStatus', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'dockingUnit', function ($scope, $state, DataService, growl, sweet, $uibModalInstance, dockingUnit) {

        $scope.dockingUnit = dockingUnit;

        $scope.changeUnitStatus = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'Changing the status may have side effects',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change!',
                closeOnConfirm: true
            }, function () {
                $scope.dockingUnit.status = parseInt($scope.dockingUnit.status);
                DataService.updateDockingUnit($scope.dockingUnit).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $uibModalInstance.dismiss();
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description['0']);
                });
            });
        };

        $scope.cancelDockingUnitStatusChange = function () {
            $uibModalInstance.dismiss();
        };

    }]);

    app.controller('AddDockingUnit', ['$scope', 'NgTableParams', '$state', 'DataService', 'growl', 'sweet', function ($scope, NgTableParams, $state, DataService, growl, sweet) {

        $scope.dockingUnit = {
            unitNumber: 0,
            modelType: '',
            unitPosition: '',
            dockingStationId: ''
        };

        $scope.dockingStations = [];

        DataService.getDockingStations().then(function (response) {
            if (!response.error) {
                $scope.dockingStations = response.data;
            }
        });


        $scope.selectStationName = function (data) {
            $scope.dockingUnit.dockingStationId = data._id;
        };

        $scope.saveDockingUnit = function () {
            DataService.saveDockingUnit($scope.dockingUnit).then(function (data) {
                if (!data.error) {
                    growl.success(data.message);
                    $scope.savedDockingUnitRecords = data.data;
                    $state.reload();
                    $state.go('admin.docking-units.edit', {'id': data.data._id})
                } else {
                    growl.error(data.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });
        };

        $scope.cancelAddDockingUnit = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.docking-units.manage');
            });
        }

    }]);

    app.controller('EditDockingUnit', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$stateParams', '$uibModal', 'StatusService', function ($scope, $state, DataService, growl, sweet, $stateParams, $uibModal, StatusService) {

        $scope.dockingUnit = {};
        $scope.dockingStations = [];
        var filters = {
            filter: {
                populate: {path: 'dockingStationId'}
            }
        };

        DataService.getDockingUnit($stateParams.id, filters).then(function (response) {
            if (!response.error) {
                var dockingStationName = response.data.dockingStationId.name;
                $scope.dockingUnit = response.data;
                DataService.getDockingStations().then(function (response) {
                    if (!response.error) {
                        $scope.dockingStations = response.data;
                        $scope.dockingStations.forEach(function (dockingStation) {
                            if (dockingStation.name === dockingStationName) {
                                $scope.selectedStationName = dockingStation._id;
                            }
                        });
                    }
                });
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.message);
        });

        $scope.changeDockingUnitStatus = function () {
            return $uibModal.open({
                templateUrl: 'docking-unit-status-modal.html',
                controller: 'DockingUnitStatus',
                size: 'md',
                resolve: {
                    dockingUnit: function () {
                        return $scope.dockingUnit;
                    }
                }
            });
        };

        $scope.selectStationName = function (id) {
            $scope.dockingStations.forEach(function (dockingStation) {
                if (dockingStation._id === id) {
                    $scope.dockingUnit.dockingStationId = dockingStation;
                }
            });
        };

        $scope.updateDockingUnit = function () {
            if ($scope.dockingUnit.dockingPortIds.length > $scope.dockingUnit.noOfPorts) {
                growl.error("Total ports for this unit cannot be lesser than current occupancy, which is " + $scope.dockingUnit.dockingPortIds.length)
            } else {
                DataService.updateDockingUnit($scope.dockingUnit).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description['0']);
                })
            }
        };

        $scope.cancelUpdateDockingUnit = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.docking-units.manage');
            });

        };

    }]);

    app.controller('ManageDockingPort', ['$scope', 'NgTableParams', '$state', 'DataService', 'growl', 'sweet', 'constantService', '$filter', '$uibModal', 'StatusService', function ($scope, NgTableParams, $state, DataService, growl, sweet, constantService, $filter, $uibModal, StatusService) {

        /*Docking Units Statuses*/
        $scope.DockPortStatus = constantService.DockPortStatus;

        $scope.dockingPorts = [];

        var filters = {
            filter: {
                populate: [{path: 'dockingUnitId dockingStationId'}]
            }
        };

        DataService.getDockingPorts(filters).then(function (response) {
            if (!response.error) {
                $scope.dockingPorts = response.data;
                $scope.dockingPorts.forEach(function (dockingPort) {
                    dockingPort.portStatus = StatusService.getDockingPortStatus(dockingPort.portStatus);
                    //dockingPort.unitNumber = dockingPort.dockingUnitId.unitNumber;
                   // dockingPort.name = dockingPort.dockingStationId.name;
                });
                $scope.dockingPortsTable.reload();
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description);
        });

        $scope.cycle = function (data) {
            var BicycleFilters = {
                filter: {
                    where: {cycleRFID: data}
                }
            };

            DataService.getBicycleRFID(BicycleFilters).then(function (response) {
                if (!response.error) {
                    $state.go('admin.bicycles.edit', {'id': response.data[0]._id});
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });
        };

        $scope.dockingPortsTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.dockingPorts, params.filter()) : $scope.dockingPorts;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.changeDockingPortStatus = function (id) {
            var selectedDockingPort = {};
            $scope.dockingPorts.forEach(function (dockingPort) {
                if (dockingPort._id === id) {
                    selectedDockingPort = dockingPort;
                }
            });
            return $uibModal.open({
                templateUrl: 'docking-port-status-modal.html',
                controller: 'DockingPortStatus',
                size: 'md',
                resolve: {
                    dockingPort: function () {
                        return selectedDockingPort;
                    }
                }
            });
        };

        $scope.addDockingPort = function () {
            $state.go('admin.docking-ports.add')
        };

        $scope.editDockingPort = function (id) {
            $state.go('admin.docking-ports.edit', {'id': id});
        };


    }]);

    // Docking Port Status Controller
    app.controller('DockingPortStatus', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'dockingPort', function ($scope, $state, DataService, growl, sweet, $uibModalInstance, dockingPort) {

        $scope.dockingPort = dockingPort;

        $scope.changePortStatus = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'Changing the status may have side effects',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change!',
                closeOnConfirm: true
            }, function () {
               /* $scope.dockingPort.status = parseInt($scope.dockingPort.status);*/
                $scope.dockingPort.portStatus = parseInt($scope.dockingPort.portStatus);
                DataService.updateDockingPort($scope.dockingPort).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $uibModalInstance.dismiss();
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description['0']);
                });
            });
        };

        $scope.cancelDockingPortStatusChange = function () {
            $uibModalInstance.dismiss();
        };

    }]);

    app.controller('AddDockingPort', ['$scope', '$state', 'DataService', 'growl', 'sweet', function ($scope, $state, DataService, growl, sweet) {

        $scope.dockingPort = {
            portNumber: 0,
            modelType: '',
            portPosition: '',
            dockingUnitId: '',
            dockingStationId: '',
            purchaseDetails: {}
        };

        /* Get All Docking Stations */

        $scope.dockingStations = [];
        $scope.dockingUnitIds = [];
        $scope.dockingUnits = [];

        DataService.getDockingStations().then(function (response) {
            if (!response.error) {
                $scope.dockingStations = response.data;
            }
            else {
                growl.error(response.message);
            }
        });

        $scope.selectStationName = function (data) {

            $scope.dockingUnitIds = [];

            for (var i = 0; i < data.dockingUnitIds.length; i++) {
                $scope.dockingUnitIds.push(data.dockingUnitIds[i].dockingUnitId);
            }
            $scope.dockingPort.dockingStationId = data._id;

            var filters = {
                filter: {where: {_id: {$in: $scope.dockingUnitIds}}}
            };


            DataService.getDockingUnits(filters).then(function (response) {
                if (!response.error) {
                    $scope.dockingUnits = response.data;
                }
            });

        };

        $scope.selectedUnitNumber = function (dockingId) {
            $scope.dockingPort.dockingUnitId = dockingId._id;
            $scope.selectedDockingUnitNumber = dockingId.unitNumber;

        };

        $scope.saveDockingPort = function () {
            DataService.saveDockingPort($scope.dockingPort).then(function (data) {
                if (!data.error) {
                    growl.success(data.message);
                    $state.reload();
                    $state.go('admin.docking-ports.edit', {'id': data.data._id})
                } else {
                    growl.error(data.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });
        };

        $scope.cancelAddDockingPort = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.docking-ports.manage');
            });

        }

    }]);

    app.controller('EditDockingPort', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$stateParams', '$uibModal', function ($scope, $state, DataService, growl, sweet, $stateParams, $uibModal) {

      /*  $scope.dockingPort = {};*/
        $scope.dockingStations = [];
        $scope.dockingUnitIds = [];
        $scope.dockingUnits = [];

        var filters = {
            filter: {
                populate: {path: 'dockingUnitId dockingStationId'}
            }
        };

        $scope.dockingPort = {};

        DataService.getDockingPort($stateParams.id, filters).then(function (response) {
            if (!response.error) {
                $scope.dockingPort = response.data[0];
                var dockingStationName = $scope.dockingPort.StationId.name;
                /*DataService.getDockingStations().then(function (response)
                {
                    if (!response.error) {
                        $scope.dockingStations = response.data;
                        $scope.dockingStations.forEach(function (dockingStation) {
                            if (dockingStation.name === dockingStationName) {
                                $scope.selectedStationName = dockingStation._id;
                            }
                        });
                        $scope.selectStationName($scope.selectedStationName);
                    }
                });*/

               /* if ($scope.dockingPort.purchaseDetails) {
                    $scope.dockingPort.purchaseDetails.manufacturingDate = new Date($scope.dockingPort.purchaseDetails.manufacturingDate);
                    $scope.dockingPort.purchaseDetails.invoiceDate = new Date($scope.dockingPort.purchaseDetails.invoiceDate);
                    $scope.dockingPort.purchaseDetails.receivedAt = new Date($scope.dockingPort.purchaseDetails.receivedAt);
                }
*/
            }
            else
                {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.message);
        });

       /* $scope.selectStationName = function (id) {
            $scope.dockingUnitIds = [];

            $scope.dockingStations.forEach(function (dockingStation) {
                if (dockingStation._id == id) {
                    $scope.dockingPort.dockingStationId = dockingStation;

                    for (var i = 0; i < dockingStation.dockingUnitIds.length; i++) {
                        $scope.dockingUnitIds.push(dockingStation.dockingUnitIds[i].dockingUnitId);
                    }

                    var filter = {
                        filter: {where: {_id: {$in: $scope.dockingUnitIds}}}
                    };

                    DataService.getDockingUnits(filter).then(function (response) {
                        if (!response.error) {
                            $scope.dockingUnits = response.data;
                            $scope.dockingUnits.forEach(function (dockingUnit) {
                                if (dockingUnit.unitNumber === $scope.dockingPort.dockingUnitId.unitNumber) {
                                    $scope.dockingPort.dockingUnitId = dockingUnit;
                                    $scope.selectedDockingUnitNumber = dockingUnit._id;
                                }
                            })
                        }
                    });

                }
            });
        };*/

        /*$scope.selectUnitNumber = function (id) {
            $scope.dockingUnits.forEach(function (dockingUnit) {
                if (dockingUnit._id === id) {
                    $scope.dockingPort.dockingUnitId = dockingUnit;
                }
            });
        };
*/
        $scope.updateDockingPort = function () {
            DataService.updateDockingPort($scope.dockingPort).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    $state.reload();
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.cancelUpdateDockingPort = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.docking-ports.manage');
            });
        };

        $scope.changeDockingPortStatus = function () {
            return $uibModal.open({
                templateUrl: 'docking-port-status-modal.html',
                controller: 'DockingPortStatus',
                size: 'md',
                resolve: {
                    dockingPort: function () {
                        return $scope.dockingPort;
                    }
                }
            });
        };

    }]);

    // Manage Bicycles Controller
    app.controller('ManageBicycles', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', 'StatusService', '$uibModal', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, StatusService, $uibModal) {
        $scope.bicyclesData = [];

        DataService.getBicycles().then(function (response) {
            if (!response.error) {
                $scope.bicyclesData = response.data;
                $scope.bicyclesData.forEach(function (bicycle) {
                    bicycle.status = StatusService.getBicycleStatus(bicycle.vehicleStatus);
                    bicycle.location = StatusService.getBicycleLocation(bicycle.location);
                   // if (!bicycle.picture || bicycle.picture == '') {
                        bicycle.profilePicUrl = 'assets/images/bicycle.jpg';
                   // } else {
                   // }
                    if (bicycle.dockingStationId) {
                        bicycle.stationName = bicycle.dockingStationId.name;
                    }
                });
                $scope.bicyclesTable.reload();
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.bicyclesTable = new NgTableParams(
            {
                count: 20
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.bicyclesData, params.filter()) : $scope.bicyclesData;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.moveBicycle = function (id) {
            var selectedBicycle = {};
            $scope.bicyclesData.forEach(function (bicycle) {
                if (bicycle._id === id) {
                    selectedBicycle = bicycle;
                }
            });
            return $uibModal.open({
                templateUrl: 'move-bicycle.html',
                controller: 'MoveBicycle',
                size: 'md',
                resolve: {
                    bicycle: function () {
                        return selectedBicycle;
                    }
                }
            });
        };

        $scope.editBicycle = function (id) {
            $state.go('admin.bicycles.edit', {'id': id});
        };

        $scope.addNewBicycle = function () {
            $state.go('admin.bicycles.add');
        };

    }]);

    // Move Bicycle Controller
    app.controller('MoveBicycle', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'bicycle', 'loggedInUser', 'StatusService', function ($scope, $state, DataService, growl, sweet, $uibModalInstance, bicycle, loggedInUser, StatusService) {

        $scope.bicycle = bicycle;
        $scope.bicyclePlace = 0;
        var whereId;
        var currentLocationName;
        $scope.sendTo = [];
        var location;
        var sendingToServer;
        var unitNumberForServer;
        var portNumberForServer;
        var forNumber;

        $scope.placeSelected = function () {
            location = angular.copy(parseInt($scope.bicyclePlace));
            if (location == 4) {
                $scope.dockingStationShow = false;
                DataService.getMaintenanceCentres().then(function (response) {
                    if (!response.error) {
                        $scope.sendTo = response.data;
                        forNumber = 4;
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description);
                });
            }
            if (location == 2) {
                $scope.dockingStationShow = false;
                DataService.getRedistributionVehicles().then(function (response) {
                    if (!response.error) {
                        $scope.sendTo = response.data;
                        forNumber = 2;
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description);
                });
            }
            if (location == 3) {
                $scope.dockingStationShow = false;
                DataService.getHoldingAreas().then(function (response) {
                    if (!response.error) {
                        $scope.sendTo = response.data;
                        forNumber = 3;
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description);
                });
            }
            if (location == 0) {
                $scope.dockingStationShow = true;
                DataService.getDockingStations().then(function (response) {
                    if (!response.error) {
                        $scope.sendTo = response.data;
                        forNumber = 0;
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description);
                });
            }
        };

        $scope.selectedSendTo = function (data, name) {
            whereId = data.id;
            currentLocationName = name;

            var filters = {
                filter: {
                    where: {'dockingStationId': data.id}
                }
            };
            DataService.getDockingUnits(filters).then(function (response) {
                if (!response.error) {
                    $scope.units = response.data;
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });
        };

        $scope.selectedUnit = function (data) {
            unitNumberForServer = data.id;
            var filters = {
                filter: {
                    where: {'dockingUnitId': data.id, 'status': 1}
                }
            };
            DataService.getDockingPorts(filters).then(function (response) {
                if (!response.error) {
                    $scope.ports = response.data;
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });
        };

        $scope.selectedPort = function (data) {
            portNumberForServer = data.id;
        };

        var fromLocation = StatusService.getBicycleLocationNumber($scope.bicycle.location);

        $scope.moveBicycle = function () {
            sweet.show({
                title: 'Move bicycle?',
                text: 'Are you sure',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, move!',
                closeOnConfirm: true
            }, function () {
                /*if (forNumber == 0)
                {*/
                    sendingToServer = {
                        vehicleId: bicycle.id,
                        toPort: fromLocation,
                        currentLocationName: currentLocationName,
                        to: whereId,
                        toName: currentLocationName,
                        fromName: $scope.bicycle.currentLocationName,
                        from: $scope.bicycle.currentLocation,
                        dockingUnitId: unitNumberForServer,
                        dockingPortId: portNumberForServer,
                        for: forNumber,
                        employee: loggedInUser.assignedUser
                    };
               /*});*/
               /* else {
                    sendingToServer = {
                        bicycleId: bicycle.id,
                        location: fromLocation,
                        from: $scope.bicycle.currentLocation,
                        toName: currentLocationName,
                        fromName: $scope.bicycle.currentLocationName,
                        currentLocationName: currentLocationName,
                        dockingPortId: $scope.bicycle.dockingPortId,
                        to: whereId,
                        for: forNumber,
                        employee: loggedInUser.assignedUser
                    };
                }*/

                console.log(sendingToServer);
                DataService.moveBicycle(sendingToServer).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $uibModalInstance.dismiss();
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description['0']);
                });
            });
        };

        $scope.moveBicycleCancel = function () {
            $uibModalInstance.dismiss();
        };

    }]);

    // Add Bicycle Controller
    app.controller('AddBicycle', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$uibModal', function ($scope, $state, DataService, growl, sweet, $uibModal) {

        $scope.bicycle = {
            vehicleNumber: '',
            vechicleRFID: '',
            vehicleType: ''
            //purchaseDetails: {}
        };

        $scope.addBicycle = function () {
            var bicycle = $scope.bicycle;
            return $uibModal.open({
                templateUrl: 'bicycle-current-position.html',
                controller: 'MoveCurrentPosition',
                size: 'md',
                resolve: {
                    bicycleData: function () {
                        return bicycle;
                    }
                }
            });
        };

        $scope.cancelAddBicycle = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.bicycles.manage');
            });
        };

    }]);

    // Bicycle Current Position Controller
    app.controller('MoveCurrentPosition', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'bicycleData', function ($scope, $state, DataService, growl, sweet, $uibModalInstance, bicycleData) {

        $scope.bicycle = bicycleData;

/*        DataService.getHoldingAreas().then(function (response) {
            if (!response.error) {
                $scope.holdingAreas = response.data;
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description);
        });*/


        DataService.getFleets().then(function (response) {
            if (!response.error) {
                $scope.holdingAreas = response.data;
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description);
        });

        $scope.saveHoldingAreaWithBicycle = function (selectHolding) {
            if (selectHolding) {
                $scope.bicycle.fleetId = selectHolding._id;
                $scope.bicycle.vehicleNumber=$scope.bicycle.bicycleNumber;
                $scope.bicycle.vehicleRFID=$scope.bicycle.cycleRFID;
                console.log($scope.bicycle);
                DataService.saveBicycle($scope.bicycle).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $uibModalInstance.dismiss();
                        $state.go('admin.bicycles.edit', {'id': response.data._id});
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description['0']);
                });
            } else {
                growl.warning("Please select holding area")
            }
        };

        $scope.cancelHoldingAreaSave = function () {
            $uibModalInstance.dismiss();
        };

    }]);

// Add Bicycle Controller
    app.controller('EditBicycle', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModal', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModal) {
        $scope.bicycle = {};

        DataService.getBicycle($stateParams.id).then(function (response) {
            if (!response.error) {
                $scope.bicycle = response.data;
             //  if (!$scope.bicycle.picture || $scope.bicycle.picture == '') {
                    $scope.profilePicUrl = 'assets/images/bicycle.jpg';
                /*if ($scope.bicycle.purchaseDetails) {
                    $scope.bicycle.purchaseDetails.manufacturingDate = new Date($scope.bicycle.purchaseDetails.manufacturingDate);
                    $scope.bicycle.purchaseDetails.invoiceDate = new Date($scope.bicycle.purchaseDetails.invoiceDate);
                    $scope.bicycle.purchaseDetails.receivedAt = new Date($scope.bicycle.purchaseDetails.receivedAt);
                }*/
            }
            else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.message);
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
                $scope.bicycle.profilePic = '';
                DataService.updateBicycle($scope.bicycle).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description['0']);
                });
            });
        };

        $scope.updateBicycle = function () {
            DataService.updateBicycle($scope.bicycle).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.cancelUpdateBicycle = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.bicycles.manage');
            });
        };
    }]);

    app.controller('ManageRedistributionVehicles', ['$scope', 'NgTableParams', '$state', 'DataService', 'growl', 'sweet', 'constantService', '$filter', '$uibModal', 'StatusService', function ($scope, NgTableParams, $state, DataService, growl, sweet, constantService, $filter, $uibModal, StatusService) {

        /*Docking Units Statuses*/
        $scope.DockPortStatus = constantService.DockPortStatus;

        $scope.redistributionVehicles = [];

        DataService.getRedistributionVehicles().then(function (response) {
            if (!response.error) {
                $scope.redistributionVehicles = response.data;

                $scope.redistributionVehicles.forEach(function (redistributionVehicle) {
                    redistributionVehicle.status = StatusService.getRedistributionVehicleStatus(redistributionVehicle.status);
                });
                $scope.redistributionVehiclesTable.reload();
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.redistributionVehiclesTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.redistributionVehicles, params.filter()) : $scope.redistributionVehicles;

                    this.vehiclePlate = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.vehicleNumber = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.driverId = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.modelType = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.holdingCapacity = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.noOfBicycle = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.latitude = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    $defer.resolve(this.vehiclePlate, this.vehicleNumber, this.driverId, this.modelType, this.holdingCapacity, this.noOfBicycle, this.latitude);
                }
            }
        );

        $scope.changeRedistributionVehicleStatus = function (id) {
            var selectedRedistributionVehicle = {};
            $scope.redistributionVehicles.forEach(function (redistributionVehicle) {
                if (redistributionVehicle._id === id) {
                    selectedRedistributionVehicle = redistributionVehicle;
                }
            });
            return $uibModal.open({
                templateUrl: 'redistribution-vehicle-status-modal.html',
                controller: 'RedistributionVehicleStatus',
                size: 'md',
                resolve: {
                    redistributionVehicle: function () {
                        return selectedRedistributionVehicle;
                    }
                }
            });
        };

        $scope.addRedistributionVehicle = function () {
            $state.go('admin.redistribution-vehicles.add')
        };

        $scope.editRedistributionVehicle = function (id) {
            $state.go('admin.redistribution-vehicles.edit', {'id': id});
        };


    }]);

// Docking Station Status Controller
    app.controller('RedistributionVehicleStatus', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'redistributionVehicle', function ($scope, $state, DataService, growl, sweet, $uibModalInstance, redistributionVehicle) {

        $scope.redistributionVehicle = redistributionVehicle;

        $scope.changeRedistributionVehicleStatus = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'Changing the status may have side effects',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change!',
                closeOnConfirm: true
            }, function () {
                $scope.redistributionVehicle.status = parseInt($scope.redistributionVehicle.status);
                DataService.updateRedistributionVehicle($scope.redistributionVehicle).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $uibModalInstance.dismiss();
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description['0']);
                });
            });
        };

        $scope.cancelRedistributionVehicleStatusChange = function () {
            $uibModalInstance.dismiss();
        };

    }]);

    app.controller('AddRedistributionVehicle', ['$scope', '$state', 'DataService', 'growl', 'sweet', function ($scope, $state, DataService, growl, sweet) {

        $scope.redistributionVehicle = {
           /* Name: '',*/
            /*name:'',*/
            StationId:'',
            vehiclePlate: '',
            driverId: '',
            assignedTo:'',
            zoneId:'',
         /*   modelType: '',*/
            portCapacity: '',
        /*    noOfBicycle: '',*/
          /*  purchaseDetails: {},*/
            gpsCoordinates: {
                longitude: '',
                latitude: ''
            }

        };

        $scope.saveRedistributionVehicle = function () {
            DataService.saveRedistributionVehicle($scope.redistributionVehicle).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    $state.go('admin.redistribution-vehicles.edit', {'id': response.data._id});
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.RedistributionStations = [];

        DataService.getRedistributionStations().then(function (response)
            {
                if (!response.error)
                {
                    $scope.RedistributionStations = response.data;
                } else
                {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedRedistributionCentre =function(data){
            $scope.redistributionVehicle.StationId=data.id;
        };

        $scope.cancelAddRedistributionVehicle = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.redistribution-vehicles.manage');
            });
        };

        $scope.RVstaffSelections = [];

        DataService.getRedistributionVehicleStaff().then(function (response) {
                if (!response.error) {
                    $scope.RVstaffSelections = response.data;
                } else {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedStaff = function (data) {
            $scope.redistributionVehicle.assignedTo = data._id;
        };


    }]);

    app.controller('EditRedistributionVehicle', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModal', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModal) {

        $scope.redistributionVehicle = {};
        $scope.redistributionVehicles=[];


        $scope.redistributionVehicleMap = {
            center: {
                latitude: 0,
                longitude: 0
            },
            zoom: 15
        };

        DataService.getRedistributionVehicle($stateParams.id).then(function (response) {
            if (!response.error) {
                $scope.redistributionVehicle = response.data;
                $scope.redistributionVehicles = response.data;
                $scope.redistributionVehicleMap.center.latitude = parseFloat($scope.redistributionVehicle.gpsCoordinates.latitude);
                $scope.redistributionVehicleMap.center.longitude = parseFloat($scope.redistributionVehicle.gpsCoordinates.longitude);

                /*if ($scope.redistributionVehicle.purchaseDetails) {
                    $scope.redistributionVehicle.purchaseDetails.manufacturingDate = new Date($scope.redistributionVehicle.purchaseDetails.manufacturingDate);
                    $scope.redistributionVehicle.purchaseDetails.invoiceDate = new Date($scope.redistributionVehicle.purchaseDetails.invoiceDate);
                    $scope.redistributionVehicle.purchaseDetails.receivedAt = new Date($scope.redistributionVehicle.purchaseDetails.receivedAt);
                }*/
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.updateRedistributionVehicle = function () {
            DataService.updateRedistributionVehicle($scope.redistributionVehicle).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    $state.reload();
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.cancelUpdateRedistributionVehicle = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.redistribution-vehicles.manage');
            });
        };

        $scope.changeRedistributionVehicleStatus = function () {
            return $uibModal.open({
                templateUrl: 'redistribution-vehicle-status-modal.html',
                controller: 'RedistributionVehicleStatus',
                size: 'md',
                resolve: {
                    redistributionVehicle: function () {
                        return $scope.redistributionVehicle;
                    }
                }
            });
        };

        $scope.RedistributionStations = [];

        DataService.getRedistributionStations().then(function (response)
            {
                if (!response.error)
                {
                    $scope.RedistributionStations = response.data;
                } else
                {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedRedistributionCentre =function(data){
            $scope.redistributionVehicle.StationId=data.id;
        };

        $scope.RVstaffSelections = [];

        DataService.getRedistributionVehicleStaff().then(function (response) {
                if (!response.error) {
                    $scope.RVstaffSelections = response.data;
                } else {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedStaff = function (data) {
            $scope.redistributionVehicle.assignedTo = data._id;
        };

    }]);


// Manage FarePlans Controller
    app.controller('ManageFarePlans', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService) {
        $scope.farePlansData = [];

        DataService.getFarePlans().then(function (response) {
            if (!response.error) {
                $scope.farePlansData = response.data;
                $scope.farePlansData.forEach(function (farePlan) {
                    farePlan.status = StatusService.getFarePlanStatus(farePlan.status);
                });
                $scope.farePlansTable.reload();
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.farePlansTable = new NgTableParams(
            {
                count: 6
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.farePlansData, params.filter()) : $scope.farePlansData;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.editFarePlan = function (id) {
            $state.go('admin.fare-plans.edit', {'id': id});
        };

        $scope.addNewFarePlan = function () {
            $state.go('admin.fare-plans.add');
        };

    }]);

// Add FarePlan Controller
    app.controller('AddFarePlan', ['$scope', '$state', 'DataService', 'growl', 'sweet', function ($scope, $state, DataService, growl, sweet) {

        $scope.farePlan = {
            planName: '',
            plans: []
        };

        $scope.addFarePlanDetails = function () {
            $scope.farePlan.plans.push({})
        };

        $scope.removePlan = function ($index) {
            sweet.show({
                title: 'Are you sure?',
                text: 'You will not be able to recover this record in the future',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                closeOnConfirm: true
            });
            $scope.farePlan.plans.splice($index, 1);
        };

        $scope.addFarePlan = function () {
            DataService.saveFarePlan($scope.farePlan).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    $state.go('admin.fare-plans.edit', {'id': response.data._id});
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.cancelAddFarePlan = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.fare-plans.manage');
            });
        };

    }]);

// Add FarePlan Controller
    app.controller('EditFarePlan', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModal', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModal) {
        $scope.farePlan = {};

        $scope.addFarePlanDetails = function () {
            $scope.farePlan.plans.push({})
        };

        $scope.removePlan = function ($index) {
            sweet.show({
                title: 'Are you sure?',
                text: 'You will not be able to recover this record in the future',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                closeOnConfirm: true
            });
            $scope.farePlan.plans.splice($index, 1);
        };

        DataService.getFarePlan($stateParams.id).then(function (response) {
            if (!response.error) {
                $scope.farePlan = response.data;
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.updateFarePlan = function () {
            DataService.updateFarePlan($scope.farePlan).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                   /* window.location.reload();*/
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.cancelUpdateFarePlan = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.fare-plans.manage');
            });
        };

    }]);

    /*Holding Area Management*/

    app.controller('ManageHoldingAreas', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService) {
        $scope.holdingAreas = [];

        DataService.getHoldingAreas().then(function (response) {
            if (!response.error) {
                $scope.holdingAreas = response.data;
                $scope.holdingAreas.forEach(function (holdingArea) {
                    holdingArea.status = StatusService.getHoldingAreaStatus(holdingArea.status);
                    holdingArea.longitude = holdingArea.gpsCoordinates.longitude;
                    holdingArea.latitude = holdingArea.gpsCoordinates.latitude;
                });
                $scope.holdingAreasTable.reload();
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.holdingAreasTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.holdingAreas, params.filter()) : $scope.holdingAreas;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.changeHoldingAreaStatus = function (id) {
            var selectedHoldingArea = {};
            $scope.holdingAreas.forEach(function (holdingArea) {
                if (holdingArea._id === id) {
                    selectedHoldingArea = holdingArea;
                }
            });
            return $uibModal.open({
                templateUrl: 'holding-area-status-modal.html',
                controller: 'HoldingAreaStatus',
                size: 'md',
                resolve: {
                    holdingArea: function () {
                        return selectedHoldingArea;
                    }
                }
            });
        };

        $scope.editHoldingArea = function (id) {
            $state.go('admin.holding-areas.edit', {'id': id});
        };

        $scope.addNewHoldingArea = function () {
            $state.go('admin.holding-areas.add');
        };

    }]);

// Holding Area Status Controller
    app.controller('HoldingAreaStatus', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'holdingArea', function ($scope, $state, DataService, growl, sweet, $uibModalInstance, holdingArea) {

        $scope.holdingArea = holdingArea;

        $scope.changeHoldingAreaStatus = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'Changing the status may have side effects',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change!',
                closeOnConfirm: true
            }, function () {
                $scope.holdingArea.status = parseInt($scope.holdingArea.status);
                DataService.updateHoldingArea($scope.holdingArea).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $uibModalInstance.dismiss();
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description['0']);
                });
            });
        };

        $scope.cancelHoldingAreaStatusChange = function () {
            $uibModalInstance.dismiss();
        };

    }]);


    app.controller('AddHoldingArea', ['$scope', '$state', 'DataService', 'growl', 'sweet', function ($scope, $state, DataService, growl, sweet) {

        $scope.holdingArea = {
            StationId:'',
            Name: '',
            portCapacity: 0,
          /*  modelType: '',
            minCyclesAlert: 0,*/
            status: 0,
           /* maxCyclesAlert: 0,*/
            gpsCoordinates: {
                latitude: '',
                longitude: ''
            }

        };

        $scope.addHoldingArea = function () {
            $scope.holdingArea.status = parseInt($scope.holdingArea.status);
            DataService.saveHoldingArea($scope.holdingArea).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    $state.go('admin.holding-areas.edit', {'id': response.data._id});
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.HoldingStations = [];

        DataService.getHoldingStations().then(function (response)
            {
                if (!response.error)
                {
                    $scope.HoldingStations = response.data;
                } else
                {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedHoldingStation =function(data){
            $scope.holdingArea.StationId=data.id;
        };

        $scope.cancelAddHoldingArea = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.holding-areas.manage');
            });
        };

    }]);

    app.controller('EditHoldingArea', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModal', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModal) {
        $scope.holdingArea = {};

        $scope.holdingAreaMap = {
            center: {
                latitude: 0,
                longitude: 0
            },
            zoom: 15
        };

        DataService.getHoldingArea($stateParams.id).then(function (response) {
            if (!response.error) {
                $scope.holdingArea = response.data;
                $scope.holdingAreaMap.center.latitude = parseFloat($scope.holdingArea.gpsCoordinates.latitude);
                $scope.holdingAreaMap.center.longitude = parseFloat($scope.holdingArea.gpsCoordinates.longitude);
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.changeHoldingAreaStatus = function () {
            return $uibModal.open({
                templateUrl: 'holding-area-status-modal.html',
                controller: 'HoldingAreaStatus',
                size: 'md',
                resolve: {
                    holdingArea: function () {
                        return $scope.holdingArea;
                    }
                }
            });
        };

        $scope.updateHoldingArea = function () {
            DataService.updateHoldingArea($scope.holdingArea).then(function (response) {
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

        $scope.cancelUpdateHoldingArea = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.holding-areas.manage');
            });
        };

        $scope.HoldingStations = [];

        DataService.getHoldingStations().then(function (response)
            {
                if (!response.error)
                {
                    $scope.HoldingStations = response.data;
                } else
                {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedHoldingStation =function(data){
            $scope.holdingArea.StationId=data.id;
        };


    }]);

    app.controller('ManageMaintenanceCentres', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService) {
        $scope.maintenanceCentres = [];

        DataService.getMaintenanceCentres().then(function (response) {
            if (!response.error) {
                $scope.maintenanceCentres = response.data;
                $scope.maintenanceCentres.forEach(function (maintenanceCentre) {
                    maintenanceCentre.status = StatusService.getMaintenanceCentresStatus(maintenanceCentre.status);
                    maintenanceCentre.longitude = maintenanceCentre.gpsCoordinates.longitude;
                    maintenanceCentre.latitude = maintenanceCentre.gpsCoordinates.latitude;
                });
                $scope.maintenanceCentresTable.reload();
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.maintenanceCentresTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.maintenanceCentres, params.filter()) : $scope.maintenanceCentres;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.changeMaintenanceCentreStatus = function (id) {
            var selectedMaintenanceCentre = {};
            $scope.maintenanceCentres.forEach(function (maintenanceCentre) {
                if (maintenanceCentre._id === id) {
                    selectedMaintenanceCentre = maintenanceCentre;
                }
            });
            return $uibModal.open({
                templateUrl: 'maintenance-centre-status-modal.html',
                controller: 'MaintenanceCentreStatus',
                size: 'md',
                resolve: {
                    maintenanceCentre: function () {
                        return selectedMaintenanceCentre;
                    }
                }
            });
        };

        $scope.editMaintenanceCentre = function (id) {
            $state.go('admin.maintenance-centres.edit', {'id': id});
        };

        $scope.addNewMaintenanceCentre = function () {
            $state.go('admin.maintenance-centres.add');
        };

    }]);

    // Registratiob Centres
    app.controller('ManageRegistrationCentres', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.registrationCentres = [];

        /*fetching registration center table details*/
        DataService.getRegistrationCentres().then(function (response) {
            if (!response.error) {
                $scope.registrationCentres = response.data;
                $scope.registrationCentres.forEach(function (registrationCentre) {
                    registrationCentre.status = StatusService.getRegistrationCentresStatus(registrationCentre.status);
                    registrationCentre.longitude = registrationCentre.gpsCoordinates.longitude;
                    registrationCentre.latitude = registrationCentre.gpsCoordinates.latitude;
                });
                $scope.registrationCentresTable.reload();
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.registrationCentresTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.registrationCentres, params.filter()) : $scope.registrationCentres;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.editRegistrationCentre = function (_id) {
            $state.go('admin.registration-centres.edit', {'id': _id});
        };


        $scope.addNewRegistrationCentre = function () {
            $state.go('admin.registration-centres.add');
        };
    }]);

    app.controller('AddRegistrationCentre', ['$scope', '$state', 'DataService', 'growl', 'sweet', function ($scope, $state, DataService, growl, sweet)
    {
        $scope.registrationCentre = {
            name: '',
            location: '',
            assignedTo: '',
            gpsCoordinates: {
                latitude: '',
                longitude: ''
            },
            status: 0
        };

        /*$scope.staffSelections = [];

        DataService.getStaffs().then(function (response) {
                if (!response.error) {
                    $scope.staffSelections = response.data;
                } else {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedStaff = function (data) {
            $scope.registrationCentre.assignedTo = data.id;
        };*/

        $scope.staffSelections = [];

        DataService.getStaffsNew().then(function (response) {
                if (!response.error) {
                    $scope.staffSelections = response.data;
                } else {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedStaff = function (data) {
            $scope.registrationCentre.assignedTo = data.id;
        };

        $scope.cancelAddRegistrationCentre = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.registration-centres.manage');
            });
        };

        $scope.addRegistrationCentre = function () {
            DataService.saveRegistrationCentre($scope.registrationCentre).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    $state.go('admin.registration-centres.edit', {'id': response.data._id});
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };
    }]);

    app.controller('EditRegistrationCentre', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModal', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModal) {

        $scope.registrations = {};

        $scope.registrationCentreMap = {
            center: {
                latitude: 0,
                longitude: 0
            },
            zoom: 15
        };

        DataService.getRegistrationCentre($stateParams.id).then(function (response) {
            if (!response.error)
            {
                $scope.registrations = response.data[0];
                $scope.Name =  response.data[0].assignedTo.Name;
               /* $scope.registrationCentreMap.center.latitude = parseFloat($scope.registrations[0].gpsCoordinates.latitude);
                $scope.registrationCentreMap.center.longitude = parseFloat($scope.registrations[0].gpsCoordinates.longitude);*/
            }
            else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        /*$scope.changeMaintenanceCentreStatus = function () {
            return $uibModal.open({
                templateUrl: 'maintenance-centre-status-modal.html',
                controller: 'MaintenanceCentreStatus',
                size: 'md',
                resolve: {
                    maintenanceCentre: function () {
                        return $scope.maintenanceCentre;
                    }
                }
            });
        };*/

        $scope.updateRegistrationCentre = function () {
            DataService.updateRegistrationCentre($scope.registrations).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                   /* $state.reload();*/
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.message);
            })
        };

        $scope.cancelUpdateRegistrationCentre = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.registration-centres.manage');
            });
        };

        $scope.staffSelections = [];

        DataService.getStaffsNew().then(function (response) {
                if (!response.error) {
                    $scope.staffSelections = response.data;
                } else {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedStaff = function (data) {
            $scope.registrations.assignedTo = data.id;
        };

    }]);

    /*Tickets*/
    var _compliant_type;
    app.controller('ManageTicketsDetails', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.loginid=localStorage.LoginID;
        var _logIn_Id=$scope.loginid;

        $scope.loginRole=localStorage.LoginRole;
        var _login_role=$scope.loginRole;

        $scope.addNewTicketDetails = function () {
            $state.go('admin.tickets.add');
        };

        // new process loading the tickets which is created by the employee
        $scope.GetTickets=function (created,assign,status)
        {
            if(created == 'LoginId')
            {
                created = _logIn_Id;
                if (_login_role == 'admin')
                {
                    created = "All";
                }
            }
            if(assign == 'LoginId')
            {
                assign = _logIn_Id;

            }
            var _dept_admin="All";
            var _ticket_type_admin="All";
            var _to_date_admin=new Date();
            var _from_date_admin = new Date();
            _from_date_admin.setDate(_from_date_admin.getDate() - 15);

            $scope.ticketsCreatedAll={
                createdBy:created,
                assignedEmp:assign,
                status:status,
                todate:_to_date_admin,
                fromdate:_from_date_admin,
                department:_dept_admin,
                tickettype:_ticket_type_admin,
                user:'All'
            };

            DataService.getRaisedTickets($scope.ticketsCreatedAll).then(function (response) {
                if (!response.error) {
                    $scope.RaisedTickets = [];
                    $scope.RaisedTickets = response.data;
                    for(var i=0;i<response.data.length;i++)
                    {
                        if(response.data[i].user)
                        {
                            response.data[i].name = response.data[i].user.Name;
                        }
                        else
                        {

                        }
                    }
                    $scope.RaisedTickets.push(response.data[i]);

                    $scope.GeneralTable = new NgTableParams(
                        {
                            count: 10
                        },
                        {
                            getData: function ($defer, params) {
                                var orderedData = params.filter() ? $filter('filter')($scope.RaisedTickets, params.filter()) : $scope.RaisedTickets;
                                /* params.total(orderedData.length);
                                 $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));*/
                            }
                        }
                    );

                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            });
        }

        if(_login_role == 'admin')
        {
            // on load
            var _dept_admin = "All";
            var _ticket_type_admin = "All";
            var _to_date_admin = new Date();
            var _from_date_admin = new Date();
            _from_date_admin.setDate(_from_date_admin.getDate() - 15);

            $scope.ticketsCreatedAll = {
                createdBy: 'All',
                assignedEmp: 'All',
                status: 'Open',
                todate: _to_date_admin,
                fromdate: _from_date_admin,
                department: _dept_admin,
                tickettype: _ticket_type_admin,
                user: 'All'
            };

            DataService.getRaisedTickets($scope.ticketsCreatedAll).then(function (response) {
                if (!response.error) {
                    $scope.RaisedTickets = [];
                    $scope.RaisedTickets = response.data;
                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].user) {
                            response.data[i].name = response.data[i].user.Name;
                        }
                        else {

                        }
                    }
                    $scope.RaisedTickets.push(response.data[i]);

                    $scope.GeneralTable = new NgTableParams(
                        {
                            count: 10
                        },
                        {
                            getData: function ($defer, params) {
                                var orderedData = params.filter() ? $filter('filter')($scope.RaisedTickets, params.filter()) : $scope.RaisedTickets;
                                /* params.total(orderedData.length);
                                 $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));*/
                            }
                        }
                    );

                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            });
        }

        else if(_login_role == 'Operator')
        {
                var _dept_admin = "All";
                var _ticket_type_admin = "All";
                var _to_date_admin = new Date();
                var _from_date_admin = new Date();
                _from_date_admin.setDate(_from_date_admin.getDate() - 15);

                $scope.ticketsCreatedAll = {
                    createdBy: $scope.loginid,
                    assignedEmp: 'All',
                    status: 'Open',
                    todate: _to_date_admin,
                    fromdate: _from_date_admin,
                    department: _dept_admin,
                    tickettype: _ticket_type_admin,
                    user: 'All'
                };

                DataService.getRaisedTickets($scope.ticketsCreatedAll).then(function (response) {
                    if (!response.error) {
                        $scope.RaisedTickets = [];
                        $scope.RaisedTickets = response.data;
                        for (var i = 0; i < response.data.length; i++) {
                            if (response.data[i].user) {
                                response.data[i].name = response.data[i].user.Name;
                            }
                            else {

                            }
                        }
                        $scope.RaisedTickets.push(response.data[i]);

                        $scope.GeneralTable = new NgTableParams(
                            {
                                count: 10
                            },
                            {
                                getData: function ($defer, params) {
                                    var orderedData = params.filter() ? $filter('filter')($scope.RaisedTickets, params.filter()) : $scope.RaisedTickets;
                                    /* params.total(orderedData.length);
                                     $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));*/
                                }
                            }
                        );

                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description['0']);
                });
            }
    }]);

    var _search_member_name;
    var _global_search_member_name;
    var _non_member_ticket_number;
    app.controller('AddTicketsDetails',  ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', 'StatusService', '$uibModal', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, StatusService, $uibModal)
    {
        $scope.loginid=localStorage.LoginID;
        var _logIn_Id=$scope.loginid;

        $scope.ticketsDetails = {
            name:'',
            subject:'',
            description:'',
            priority:'',
            department:'',
            assignedEmp:'',
            tickettype:'',
            createdBy:_logIn_Id,
            email:'',
            phoneNumber:'',
            channel:1,
        };

        $scope.cancelAddTickets = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.tickets.manage');
            });
        };


        $scope.addNewTicketDetails = function () {
            // Non member ticket raising
            DataService.saveTicketDetails($scope.ticketsDetails).then(function (response) {
                if (!response.error) {
                    _non_member_ticket_number = response.data.uuId;
                    $uibModal.open({
                        templateUrl: 'TicketNumber.html',
                        controller: 'NonMemberTicketNumber',
                        resolve: {
                            items: function () {
                            }
                        }
                    });
                    $state.go("admin.tickets.manage");
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.searchMember={
            name:''
        }

        $scope.SearchDetails = [];

        $scope.SearchMember = function () {
            DataService.memberSearch($scope.searchMember).then(function (response) {
                if (!response.error) {
                    $scope.SearchDetails = [];
                    for(var i=0;i<response.data.length;i++)
                    {
                        $scope.SearchDetails.push(response.data[i]);
                    }
                    $scope.SearchedMembersTable = new NgTableParams(
                        {
                            count: 10
                        },
                        {
                            getData: function ($defer, params) {
                                var orderedData = params.filter() ? $filter('filter')($scope.SearchDetails, params.filter()) : $scope.SearchDetails;
                                /*params.total(orderedData.length);
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));*/
                            }
                        }
                    );

                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.searchMemberRaiseTickets = function (id) {
            $state.go('admin.tickets.raise-tickets', {'id': id});
        };

        $scope.EmpDepartments = [];

        DataService.getEmpDept().then(function (response) {
            if (!response.error) {
                for(var i=0;i<response.data.value.length;i++)
                {
                    $scope.EmpDepartments.push(response.data.value[i]);
                }

            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.selecteDept = function (department) {
            $scope.ticketsDetails.department=department.department;
            var _dept=department.uri;
            $scope.Employees=[];
            DataService.getEmp(_dept).then(function (response) {
                if (!response.error) {
                    for(var i=0;i<response.data.length;i++)
                    {
                        $scope.Employees.push(response.data[i]);
                    }
                    $scope.TicketTypes=[];
                    // dataservice to fetch ticket typer based on department
                    if($scope.ticketsDetails.department === 'Registration')
                    {
                        var _ticket_type='Registration-ticket-types';
                    }
                    if($scope.ticketsDetails.department === 'Maintenance')
                    {
                        var _ticket_type='Maintenance';
                    }
                    if($scope.ticketsDetails.department === 'Redistribution')
                    {
                        var _ticket_type='';
                    }
                    if($scope.ticketsDetails.department === 'Operator')
                    {
                        var _ticket_type='';
                    }
                    if($scope.ticketsDetails.department === 'Monitor-group')
                    {
                        var _ticket_type='';
                    }
                    if($scope.ticketsDetails.department === 'Accounts')
                    {
                        var _ticket_type='';
                    }
                    if($scope.ticketsDetails.department === 'Holding-area')
                    {
                        var _ticket_type='';
                    }

                    DataService.getTicketTypes(_ticket_type).then(function (response) {
                        if (!response.error) {
                            for(var i=0;i<response.data.value.length;i++)
                            {
                                $scope.TicketTypes.push(response.data.value[i])
                            }
                        } else {
                            growl.error(response.message);
                        }
                    }, function (response) {
                        growl.error(response.data.description['0']);
                    });

                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            });
        };

        $scope.selectedEmp = function (data)
        {
            $scope.ticketsDetails.assignedEmp=data._id;
        }

        $scope.selectedType = function (data)
        {
            $scope.ticketsDetails.tickettype=data;
        }

    }]);

    // non member raised tickets number
    app.controller('NonMemberTicketNumber', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'loggedInUser', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModalInstance, loggedInUser)
    {

        $scope.TicketNumber = _non_member_ticket_number;

        $scope.ok = function () {
            $uibModalInstance.dismiss();
        };
    }]);

    var _ticket_id;
    var assigned_emp;
    var _com_type;
    app.controller('EditTickets', ['$scope', '$state','$stateParams', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state,$stateParams, DataService, NgTableParams, growl, sweet, $filter, $uibModal,StatusService)
    {
        $scope.loginid=localStorage.LoginID;
        var _logIn_Id=$scope.loginid;
        /*var complaint_type_valid_invalid;*/

        $scope.RaisedTicket = {};
        $scope.ReplyDescriptions=[];
        $scope.ReplyFromanddates=[];

        _ticket_id = $stateParams.id;


        DataService.getRaisedTicket($stateParams.id).then(function (response) {

            if (!response.error)
            {
                $scope.RaisedTicket = response.data[0];
                /*if(response.data[0].assignedEmp.UserID == '' || response.data[0].assignedEmp.UserID == null || response.data[0].assignedEmp.UserID == undefined)*/
                if(response.data[0].assignedEmp == '' || response.data[0].assignedEmp == null || response.data[0].assignedEmp == undefined)
                {
                    assigned_emp = '';
                }
                else
                {
                    assigned_emp = response.data[0].assignedEmp.UserID;
                }
                $scope.complaint_type_valid_invalid= response.data[0].complaintType;
                _com_type = $scope.complaint_type_valid_invalid;
                alert(_com_type);
                if(response.data[0].assignedEmp == '' ||  response.data[0].assignedEmp == null ||  response.data[0].assignedEmp == undefined)
                {
                    $scope.AssignedTo ='';
                }
                else
                {
                    $scope.AssignedTo = response.data[0].assignedEmp.Name;
                }
                for(var i=0;i<response.data[0].transactions.length;i++)
                {
                    $scope.ReplyDescriptions.push(response.data[0].transactions[i]);
                    $scope.ReplyFromanddates.push(response.data[0].transactions[i].replierId)
                }


                if(response.data[0].priority == 1)
                {
                    $scope.Priority="Normal";
                }
                if(response.data[0].priority == 2)
                {
                    $scope.Priority="Medium";
                }
                if(response.data[0].priority == 3)
                {
                    $scope.Priority="Urgent";
                }
                if(response.data[0].priority == 4)
                {
                    $scope.Priority="Criticle";
                }
            }
            else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.EditTicketDetails = {
            name:'',
            subject:'',
            description:'',
            priority:'',
            status:'',
            assignedEmp:'',
            comments: []
        };

        $scope.addComments = function () {
            $scope.EditTicketDetails.comments.push({})
        };

        $scope.replyDetails={
            ticketid:_ticket_id,
            replydate:new Date(),
            description:'',
            replierId:_logIn_Id,
            status:'',
            internal:''
        };

        if($scope.replyDetails.status == '')
        {
            var _ticketstatus="Open";

            $scope.replyDetails={
                ticketid:_ticket_id,
                replydate:new Date(),
                description:'',
                replierId:_logIn_Id,
                status:_ticketstatus,
                internal:''
            };
        }
        else {
            $scope.replyDetails={
                ticketid:_ticket_id,
                replydate:new Date(),
                description:'',
                replierId:_logIn_Id,
                status:'',
                internal:''
            };
        }

        $scope.addReply=function () {
            DataService.saveTicketReply($scope.replyDetails).then(function (response) {
                if (!response.error) {
                    growl.success("Replied successfully");
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            });
        };

        $scope.cancelUpdateTickets = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.tickets.manage');
            });
        };

        $scope.ReassignEmployee=function (size) {
            $uibModal.open({
                templateUrl: 'employee-reassign-for-ticket.html',
                controller: 'EmployeeReassign',
                size: size,
                resolve: {
                    items: function () {
                    }
                }
            });
        };

        $scope.TestTest = _com_type;
        $scope.Valid = function ()
        {
            if($scope.ValidTickets == true)
            {
                var ObjAssignEmp =
                    {
                        assignedEmp:assigned_emp
                    };

                if(ObjAssignEmp.assignedEmp == "")
                {
                    $scope.UpdateDetails=
                        {
                            ticketid:_ticket_id,
                            complaintType:1
                        };
                }
                else
                {
                    $scope.UpdateDetails=
                        {
                            assignedEmp:assigned_emp,
                            ticketid:_ticket_id,
                            complaintType:1
                        };
                }
            }
            else
            {
                $uibModal.open({
                    templateUrl: 'ErrorValidateTickets.html',
                    controller: 'UpdateValidComplaints',
                    resolve: {
                        items: function () {
                        }
                    }
                });
                return;
            }

            //$scope.SetValue = false;
            DataService.UpdateValidTicketDetails($scope.UpdateDetails).then(function (response) {
                if (!response.error) {
                    growl.success("Validated successfully");
                    if(response.data.complaintType == 1)
                    {
                        //$scope.SetValue = true;
                        $scope.complaint_type_valid_invalid = response.data.complaintType;
                    }
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                //growl.error(response.data.description['0']);
            });

        };

    }]);

    app.controller('UpdateValidComplaints', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'loggedInUser', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModalInstance, loggedInUser)
    {
        $scope.ok = function () {
            $uibModalInstance.dismiss();
        };
    }]);

    var _member_email;
    var _member_mobile;
    app.controller('SearchMemberRaiseTickets', ['$scope', '$state','$stateParams', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state,$stateParams, DataService, NgTableParams, growl, sweet, $filter, $uibModal,StatusService)
    {
        $scope.memberDetails = [];

        var _mem_id=$stateParams.id;

        $scope.raiseTicketsDetails = {
            /*name:,*/
            user:_mem_id,
            subject:'',
            description:'',
            channel:1,
            priority:'',
            department:'',
            tickettype:'',
            assignedEmp:'',
            ticketdate:new Date(),
            createdBy:$scope.loginid,
            email:'',
            phoneNumber:''
        };

        DataService.getMember($stateParams.id).then(function (response) {
            if (!response.error) {
                $scope.memberDetails = response.data;
                $scope.MemberName=response.data.Name;
                $scope.raiseTicketsDetails.email = response.data.email;
                $scope.raiseTicketsDetails.phoneNumber = response.data.phoneNumber;
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description);
        });

        $scope.loginid=localStorage.LoginID;

        if($scope.raiseTicketsDetails.department == '' || $scope.raiseTicketsDetails.tickettype || $scope.raiseTicketsDetails.assignedEmp)
        {
            $scope.raiseTicketsDetails = {
                user:_mem_id,
                subject:'',
                description:'',
                channel:1,
                priority:'',
                department:'',
                tickettype:'',
                assignedEmp:'',
                ticketdate:new Date(),
                createdBy:$scope.loginid,
                email:$scope.raiseTicketsDetails.email,
                phoneNumber:$scope.raiseTicketsDetails.phoneNumber
            };
        }
        else
        {
            $scope.raiseTicketsDetails = {
                user:_mem_id,
                subject:'',
                description:'',
                channel:1,
                priority:'',
                department:'',
                tickettype:'',
                assignedEmp:'',
                ticketdate:new Date(),
                createdBy:$scope.loginid,
                email:$scope.raiseTicketsDetails.email,
                phoneNumber:$scope.raiseTicketsDetails.phoneNumber
            };
        }

        $scope.EmpDepartments = [];

        DataService.getEmpDept().then(function (response) {
            if (!response.error) {
                for(var i=0;i<response.data.value.length;i++)
                {
                    $scope.EmpDepartments.push(response.data.value[i]);
                }

            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.selecteDept = function (department) {
            $scope.raiseTicketsDetails.department=department.department;
            var _dept=department.uri;
            $scope.Employees=[];
            DataService.getEmp(_dept).then(function (response) {
                if (!response.error) {
                    for(var i=0;i<response.data.length;i++)
                    {
                        $scope.Employees.push(response.data[i]);
                    }

                    // dataservice to fetch ticket typer based on department
                    if($scope.raiseTicketsDetails.department === 'Registration')
                    {
                        var _ticket_type='Registration-ticket-types';
                    }
                    if($scope.raiseTicketsDetails.department === 'Maintenance')
                    {
                        var _ticket_type='Maintenance';
                    }
                    if($scope.raiseTicketsDetails.department === 'Redistribution')
                    {
                        var _ticket_type='';
                    }
                    if($scope.raiseTicketsDetails.department === 'Operator')
                    {
                        var _ticket_type='';
                    }
                    if($scope.raiseTicketsDetails.department === 'Monitor-group')
                    {
                        var _ticket_type='';
                    }
                    if($scope.raiseTicketsDetails.department === 'Accounts')
                    {
                        var _ticket_type='';
                    }
                    if($scope.raiseTicketsDetails.department === 'Holding-area')
                    {
                        var _ticket_type='';
                    }
                    $scope.TicketTypes=[];
                    DataService.getTicketTypes(_ticket_type).then(function (response) {
                        if (!response.error) {
                            for(var i=0;i<response.data.length;i++)
                            {
                                $scope.TicketTypes.push(response.data.value[i])
                            }
                        } else {
                            growl.error(response.message);
                        }
                    }, function (response) {
                        growl.error(response.data.description['0']);
                    });
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description['0']);*/
            });
        };

        $scope.selectedEmp = function (data)
        {
          $scope.raiseTicketsDetails.assignedEmp=data._id;
        }

        $scope.selectedType = function (data)
        {
            $scope.raiseTicketsDetails.tickettype=data;
        }


        $scope.addNewTicketDetails = function () {
            DataService.saveTicketDetails($scope.raiseTicketsDetails).then(function (response) {
                if (!response.error) {
                    _ticket_number = response.data.uuId;
                    $uibModal.open({
                        templateUrl: 'TicketNumber.html',
                        controller: 'TicketNo',
                        resolve: {
                            items: function () {
                            }
                        }
                    });
                    $state.go("admin.tickets.manage");
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.cancelRaiseTickets = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.tickets.add');
            });
        };
    }]);

    app.controller('TicketNo', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'loggedInUser', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModalInstance, loggedInUser)
    {

        $scope.TicketNumber = _ticket_number;

        $scope.ok = function () {
            $uibModalInstance.dismiss();
        };
    }]);

    // employee reassign for tickets
    app.controller('EmployeeReassign', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal','$uibModalInstance', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal,$uibModalInstance, StatusService)
    {
        $scope.loginid=localStorage.LoginID;
        var _logIn_Id=$scope.loginid;

        $scope.UpdateRaisedTicket={
            ticketid:_ticket_id,
            assignedEmp:''
        };

        $scope.EmpDepartments = [];
        DataService.getEmpDept().then(function (response) {
            if (!response.error) {
                for(var i=0;i<response.data.value.length;i++)
                {
                    $scope.EmpDepartments.push(response.data.value[i]);
                }

            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.selecteDept = function (dept) {
            var _dept=dept.uri;
            $scope.Employees=[];
            DataService.getEmp(_dept).then(function (response) {
                if (!response.error) {
                    for(var i=0;i<response.data.length;i++)
                    {
                        $scope.Employees.push(response.data[i]);
                    }
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            });
        };

        $scope.selectedEmp = function (data)
        {
            $scope.UpdateRaisedTicket.assignedEmp=data._id;
        }



        var _internal_value=0;
        $scope.reAssignEmployeeDetails={
            ticketid:_ticket_id,
            replierId:_logIn_Id,
            internal:_internal_value,
            replydate:new Date(),
            description:''
        };


        $scope.ReassignEmp=function () {
            DataService.saveReassignEmployee($scope.reAssignEmployeeDetails).then(function (response) {
                if (!response.error) {
                    growl.success("Reassigned Successfully");
                    $uibModalInstance.dismiss();
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error("");
            });

            DataService.updateRaised_Ticket($scope.UpdateRaisedTicket).then(function (response) {
                if (!response.error) {
                    growl.success("Updated successfully");
                    $uibModalInstance.dismiss();
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.message);
            })
        };

        $scope.cancelReassignEmployee=function () {
            $uibModalInstance.dismiss();
        }
    }]);

    /*TopUp*/
    app.controller('ManageTopupPlans', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.TopupData = [];

        DataService.getTopups().then(function (response) {
            if (!response.error) {
                $scope.TopupData = response.data;
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.topupTable = new NgTableParams(
            {
                count: 6
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.TopupData, params.filter()) : $scope.TopupData;
                 /*   params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));*/
                }
            }
        );

        $scope.editTopup = function (id) {
            $state.go('admin.topup-plans.edit', {'id': id});
        };

        $scope.deleteTopup = function (id) {
            DataService.Delete_topup(id).then(function (response) {
                if (!response.error) {
                    $scope.TopupData = response.data;
                    DataService.getTopups().then(function (response) {
                        if (!response.error) {
                            $scope.TopupData = response.data;
                        } else {
                            growl.error(response.message);
                        }
                    }, function (response) {
                        growl.error(response.data.description['0']);
                    });

                    $scope.topupTable = new NgTableParams(
                        {
                            count: 6
                        },
                        {
                            getData: function ($defer, params) {
                                var orderedData = params.filter() ? $filter('filter')($scope.TopupData, params.filter()) : $scope.TopupData;
                                /*   params.total(orderedData.length);
                                 $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));*/
                            }
                        }
                    );
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            });
        };

        $scope.addNewTopup = function () {
            $state.go('admin.topup-plans.add');
        };

    }]);

    app.controller('AddTopupPlans', ['$scope', '$state', 'DataService', 'growl', 'sweet', function ($scope, $state, DataService, growl, sweet)
    {
        $scope.loginid=localStorage.LoginID;
        var _loginId=$scope.loginid;

        $scope.TopupDetails={
            topupName:'',
            validity:'',
            userFees:'',
            createdBy:_loginId
        };

        $scope.addTopup = function () {
            DataService.saveTopup($scope.TopupDetails).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.cancelAddTopup = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.topup-plans.manage');
            });
        };
    }]);

    app.controller('EditTopupPlans', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModal', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModal)
    {
        $scope.topups = {};

        DataService.gettopup($stateParams.id).then(function (response) {
            if (!response.error)
            {
                $scope.topups = response.data;
            }
            else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

       /* $scope.topupUpdateDetails={
            topupName:'',
            validity:'',
            userFees:''
        }*/

        $scope.updateTopupDetails = function () {
            DataService.updateTopup($scope.topups).then(function (response) {
                if (!response.error) {
                    growl.success("Record updated successfully");
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.message);
            })
        };

        $scope.cancelUpdateTopup = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.topup-plans.manage');
            });
        };
    }]);



    //check in check out
    app.controller('ManagePortsTest', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        /*$scope.checkIncheckOut = [];*/
        $scope.checkIncheckOut = [];

        $scope.addCheckInCheckOut = function ()
        {
        };
        $scope.addCheckIn = function ()
        {
        };
    }]);

    app.controller('AddCheckInCheckOut', ['$scope', '$state', 'DataService', 'growl', 'sweet', function ($scope, $state, DataService, growl, sweet)
    {
        var datetime = new Date();

       /* var myDate=new Date(datetime).toLocaleString();*/

        var myDate= new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        var Mydate = myDate.toString();

        $scope.checkInOut = {
            vehicleId:'',
            cardId:'',
            fromPort:'',
            checkOutTime : Mydate
        };

        $scope.members =[];
        $scope.bicycleNums=[];
        $scope.dockingStationSelections = [];
        $scope.portSelections =[];


        DataService.getDockingStations().then(function (response)
            {
                if (!response.error)
                {
                    $scope.dockingStationSelections = response.data;
                } else
                {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

       /* DataService.getDockingPorts().then(function (response) {
                if (!response.error) {
                    $scope.portSelections = response.data;
                } else {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });*/

       /* DataService.getMembers().then(function (response) {*/
        DataService.getUsers().then(function (response) {
            if (!response.error) {
                $scope.members = response.data;
            }
            else {
                growl.error(response.message);
            }
        },
            function (response)
            {
                growl.error(response.data);
        });

        DataService.getBicycles().then(function (response) {
            if (!response.error) {
                $scope.bicycleNums = response.data;
            }
            else {
                growl.error(response.message)
            }
        },
            function(response)
            {
                growl.error(response.data);
        });

        $scope.selectedDockingStation = function (data)
        {
            for(var i = 0; i < data.portIds.length ; i++)
            {
                var portInfo = {
                    Name:data.portIds[i].dockingPortId.Name,
                    _id:data.portIds[i].dockingPortId._id
                };
          var a= $scope.portSelections.push(portInfo);

                $scope.selectedPort=function (a) {
                    $scope.checkInOut.fromPort=a._id;
                }
            }
        };



        $scope.selectedMembers =function(data){
            $scope.checkInOut.cardId=data.cardNum;
        };

        $scope.selectedBicycleNumber = function (data) {
            $scope.checkInOut.vehicleId=data.vehicleNumber;
        };



        $scope.addCheckInCheckOut = function ()
        {
                DataService.saveCheckInCheckOut($scope.checkInOut).then(function (response) {
                    var test = $scope.checkInOut.cardId;
                    if (!response.error)
                    {
                        growl.success(response.message);
                        $scope.checkMember=$scope.members[0].value;
                        $scope.bicycleNo=$scope.bicycleNums[0].value;
                        $scope.dockingStationName=$scope.dockingStationSelections[0].value;
                        $scope.portsName=$scope.portSelections[0].value;
                    }
                    else
                    {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description['0']);
                })
        };

        $scope.addCheckIn = function ()
        {
            DataService.saveCheckIn($scope.checkInOut).then(function (response)
            {
                if (!response.error)
                {
                    growl.success(response.message);
                    $scope.checkMember=$scope.members[0].value;
                    $scope.bicycleNo=$scope.bicycleNums[0].value;
                    $scope.dockingStationName=$scope.dockingStationSelections[0].value;
                    $scope.portsName=$scope.portSelections[0].value;
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };
    }]);

    /*check in check out - bridge*/
    app.controller('CheckInCheckOutBridge', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.checkInOutBridge = {
            vehicleId:'',
            cardId:'',
            fromPort:'',
            bridgeDate:'',
            bridgeTime:'',
           /* checkOutTime : $filter('datetime')(new Date(),'HH:mm:ss:SSS')*/
             checkOutTime : new Date()
        };

        $scope.members =[];

        DataService.getMembers().then(function (response) {
                if (!response.error) {
                    $scope.members = response.data;
                }
                else {
                    growl.error(response.message);
                }
            },
            function (response)
            {
                growl.error(response.data);
            });

        $scope.selectedUserID = function (data) {
            $scope.checkInOutBridge.cardId=data.UserID;
        };

        $scope.bicycleNums=[];

        DataService.getBicycles().then(function (response) {
                if (!response.error) {
                    $scope.bicycleNums = response.data;
                }
                else {
                    growl.error(response.message)
                }
            },
            function(response)
            {
                growl.error(response.data);
            });

        $scope.selectedBicycle = function (data) {
            $scope.checkInOutBridge.vehicleId=data.vehicleUid;
        };

        $scope.dockingStationSelections = [];

        DataService.getDockingStations().then(function (response)
            {
                if (!response.error)
                {
                    $scope.dockingStationSelections = response.data;
                } else
                {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.portSelections =[];

        $scope.selectedDockingStation = function (data)
        {
            for(var i = 0; i < data.portIds.length ; i++)
            {
                var portInfo = {
                    PortID:data.portIds[i].dockingPortId.PortID
                  /*  _id:data.portIds[i].dockingPortId._id*/
                };
                $scope.portSelections.push(portInfo);
            }
        };

        $scope.selectedPort = function (data) {
            $scope.checkInOutBridge.fromPort = data.PortID;
        };

        $scope.addCheckInCheckOutBridge = function ()
        {
            DataService.saveCheckOutBridge($scope.checkInOutBridge).then(function (response) {
                if (!response.error)
                {
                    growl.success(response.message);
                    $scope.userId=$scope.members[0].value;
                    $scope.bicycleNo=$scope.bicycleNums[0].value;
                    $scope.dockingStationName=$scope.dockingStationSelections[0].value;
                    $scope.portsName=$scope.portSelections[0].value;
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.addCheckInBridge = function ()
        {
            DataService.saveCheckInBridge($scope.checkInOutBridge).then(function (response)
            {
                if (!response.error)
                {
                    growl.success(response.message);
                    $scope.userId=$scope.members[0].value;
                    $scope.bicycleNo=$scope.bicycleNums[0].value;
                    $scope.dockingStationName=$scope.dockingStationSelections[0].value;
                    $scope.portsName=$scope.portSelections[0].value;
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

    }]);


    //kpi
    app.controller('ManageKPI', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {

    }]);

    var percentage_value=0;
    var percentage_points=0;

    var percentage_value_major_empty=0;
    var percentage_points_total_major_empty=0;
    var percentage_value_major_empty_offpeek=0;
    var percentage_points_total_major_empty_offpeek=0;

    var percentage_value_minor_empty=0;
    var percentage_points_total_minor_empty=0;
    var percentage_value_minor_empty_offpeek=0;
    var percentage_points_total_minor_empty_offpeek=0;

    var _no_of_days;
    var docking_station_count;
    app.controller('kpiDetails', ['$scope', '$state', 'DataService', 'growl','$uibModal','NgTableParams', 'sweet', function ($scope, $state, DataService, growl,$uibModal,NgTableParams,sweet)
    {
        /*alert(Number_of_DockingStations);*/

        $scope.toDateKPI = new Date();

       var CurrentDate = new Date();
       var test = CurrentDate.getMonth() + 1;
       var demo = CurrentDate.getDate();

        if(test == 10)
        {
            var aa= new Date(CurrentDate.setDate(CurrentDate.getDate() - demo));
            $scope.fromDateKPI  = new Date(CurrentDate.setMonth(CurrentDate.getMonth()));
        }

        else if(test == 11)
        {
            var aa1= new Date(CurrentDate.setDate(CurrentDate.getDate() - demo));
            $scope.fromDateKPI  = new Date(CurrentDate.setMonth(CurrentDate.getMonth() - 1));
        }
        else {
            $scope.fromDateKPI   = new Date(CurrentDate.setMonth(CurrentDate.getMonth() - 2));
        }

        $scope.press = function (size) {
            $uibModal.open({
                templateUrl: 'details.html',
                controller: 'RVDetails',
                size: size,
                resolve: {
                    items: function () {
                        /*return $scope.member.debit;*/
                    }
                }
            });
        };

        $scope.details={
            fromdate:'',
            todate:'',
            stationState:0,
            duration:0
        };

        $scope.GetDetails = function ()
        {
            DataService.GetRVDetails($scope.details).then(function (response)
            {
                var one_day = 24*60*60*1000;

                var _from_date = $scope.details.fromdate.getDate();
                var _from_month = $scope.details.fromdate.getMonth();
                var _from_year = $scope.details.fromdate.getFullYear();
                var from_date=new Date(_from_year,_from_month,_from_date);

                var _to_date =$scope.details.todate.getDate();
                var _to_month =$scope.details.todate.getMonth();
                var _to_year =$scope.details.todate.getFullYear();
                var to_date=new Date(_to_year,_to_month,_to_date);

                 _no_of_days=Math.round(Math.abs((from_date.getTime()-to_date.getTime())/(one_day)))+1;
                /*_no_of_days = (_to_date) - (_from_date) + 1 ;*/
                /*var _working_hours = _no_of_days * 16 * 60 * Number_of_DockingStations;*/
                var _working_hours = _no_of_days * 16 * 60 * 48;
                var i=0;
                var total=0;
                var total_major_empty_peak=0;
                var total_major_empty_offpeak=0;
                var total_minor_empty_peak=0;
                var total_minor_empty_offpeak=0;

                for(var i = 0; i < response.data.length; i++)
                {
                    var total_duration = response.data[i].timeduration;
                    var peakduration_empty = response.data[i].peekduration;
                    var offpeakduration_empty = response.data[i].offpeekduration;
                    //var bicycle_clean=response.data[i].stationid.name;
                    if(response.data[i].stationid == null)
                    {
                        var bicycle_clean = "";
                    }
                    else
                    {
                        var bicycle_clean=response.data[i].stationid.name;
                    }

                    // calculation for stations neither empty nor full for more then 1 minute
                    /*if(total_duration > 1)*/

                    if(total_duration > 120)
                    {
                    total += total_duration;
                    }

                    // calculation for major stations empty during peak hour
                    if(response.data[i].stationtype === "Major" || response.data[i].modelType == "Major")
                    {
                     if(response.data[i].status===2)
                     {
                         total_major_empty_peak += peakduration_empty;
                         total_major_empty_offpeak += offpeakduration_empty;
                     }
                    }

                    // calculation for minor stations empty during peak and off peak hours
                    if(response.data[i].stationtype === "Minor")
                    {
                        if(response.data[i].status===2)
                        {
                            total_minor_empty_peak += peakduration_empty;
                            total_minor_empty_offpeak += offpeakduration_empty;
                        }
                    }
                }

                percentage_value =  ((_working_hours - total)/(_working_hours) * 100).toFixed(2);

                percentage_value_major_empty =  ((total_major_empty_peak)/(_working_hours) * 100).toFixed(2);
                percentage_value_major_empty_offpeek =  ((total_major_empty_offpeak)/(_working_hours) * 100).toFixed(2);

                percentage_value_minor_empty=((total_minor_empty_peak)/(_working_hours) * 100).toFixed(2);
                percentage_value_minor_empty_offpeek=((total_minor_empty_offpeak)/(_working_hours) * 100).toFixed(2);

                // condition for neither empty nor full for a period of longer than 2 hours
                if(percentage_value > 98)
                {
                percentage_points=10;
                }
                else if (percentage_value >= 95 && percentage_value < 98)
                {
                    percentage_points=5;
                }
                else if(percentage_value >=90 && percentage_value <95)
                {
                    percentage_points=-5;
                }
                else if(percentage_value < 90)
                {
                    percentage_points=-10;
                }
                else
                {
                    percentage_value = 0;
                    percentage_points =0;
                }


                // condition for major docking staions are empty during peak hours
                if (percentage_value_major_empty < 3)
                {
                    percentage_points_total_major_empty = 10;
                }
                else if(percentage_value_major_empty >= 3 && percentage_value_major_empty <5)
                {
                    percentage_points_total_major_empty=5;
                }
                else if(percentage_value_major_empty >= 5 && percentage_value_major_empty <8)
                {
                    percentage_points_total_major_empty=-5;
                }
                else if(percentage_value_major_empty >= 8)
                {
                    percentage_points_total_major_empty=-10;
                }
                else
                {
                    percentage_value_major_empty = 0;
                    percentage_points_total_major_empty = 0;
                }

                // condition for major docking staions are empty during off peak hours
                if (percentage_value_major_empty_offpeek < 2)
                {
                    percentage_points_total_major_empty_offpeek = 10;
                }
                else if(percentage_value_major_empty_offpeek >= 2 && percentage_value_major_empty_offpeek <3)
                {
                    percentage_points_total_major_empty_offpeek=5;
                }
                else if(percentage_value_major_empty_offpeek >= 3 && percentage_value_major_empty_offpeek <5)
                {
                    percentage_points_total_major_empty_offpeek=-5;
                }
                else if(percentage_value_major_empty_offpeek >= 5)
                {
                    percentage_points_total_major_empty_offpeek=-10;
                }
                else
                {
                    percentage_value_major_empty_offpeek = 0;
                    percentage_points_total_major_empty_offpeek = 0;
                }

                // condition for minor docking staions are empty during peak hours
                if (percentage_value_minor_empty < 10)
                {
                    percentage_points_total_minor_empty = 10;
                }
                else if(percentage_value_minor_empty >= 10 && percentage_value_minor_empty <20)
                {
                    percentage_points_total_minor_empty=5;
                }
                else if(percentage_value_minor_empty >= 20 && percentage_value_minor_empty <25)
                {
                    percentage_points_total_minor_empty=-5;
                }
                else if(percentage_value_minor_empty >= 25)
                {
                    percentage_points_total_minor_empty=-10;
                }
                else
                {
                    percentage_value_minor_empty = 0;
                    percentage_points_total_minor_empty = 0;
                }

                // condition for minor docking staions are empty during off peak hours
                if (percentage_value_minor_empty_offpeek < 5)
                {
                    percentage_points_total_minor_empty_offpeek = 10;
                }
                else if(percentage_value_minor_empty_offpeek > 5 && percentage_value_minor_empty_offpeek <=8)
                {
                    percentage_points_total_minor_empty_offpeek=5;
                }
                else if(percentage_value_minor_empty_offpeek >8 && percentage_value_minor_empty_offpeek <=10)
                {
                    percentage_points_total_minor_empty_offpeek=-5;
                }
                else if(percentage_value_minor_empty_offpeek >= 10)
                {
                    percentage_points_total_minor_empty_offpeek=-10;
                }
                else
                {
                    percentage_value_minor_empty_offpeek = 0;
                    percentage_points_total_minor_empty_offpeek = 0;
                }


                $scope.RVDetails={
                    percentage:percentage_value + "%",
                    points:percentage_points,
                    percentage_total_major_empty:percentage_value_major_empty + "%",
                    points_total_major_empty:percentage_points_total_major_empty,
                    percentage_total_major_empty_offpeek:percentage_value_major_empty_offpeek + "%",
                    points_total_major_empty_offpeek:percentage_points_total_major_empty_offpeek,
                    percentage_total_minor_empty:percentage_value_minor_empty + "%",
                    points_total_minor_empty:percentage_points_total_minor_empty,
                    percentage_total_minor_empty_offpeek:percentage_value_minor_empty_offpeek + "%",
                    points_total_minor_empty_offpeek:percentage_points_total_minor_empty_offpeek
                };

                var All_Redistribution_Indicators_Points = percentage_points + percentage_points_total_major_empty + percentage_points_total_major_empty_offpeek + percentage_points_total_minor_empty + percentage_points_total_minor_empty_offpeek;

                if (!response.error) {
                    growl.success(response.message);

                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })

            // Smart card performance at the dock (taking out a cycle from docking station
            var percentage_data;
            var percentage_points;
            DataService.GetKPISmartCardReport($scope.details).then(function (response)
            {
                percentage_data = response.data.total;

                if(percentage_data > 99)
                {
                    percentage_points= 10;
                }
                else if(percentage_data <99)
                {
                    percentage_points=-10;
                }
               /* else if (percentage_data == null || percentage_data == NaN)
                 {
                 percentage_data = 0;
                 percentage_points = 0;
                 }*/
                else
                {
                    percentage_data = 0;
                    percentage_points = 0;
                }

                var ToFixedValue = (percentage_data).toFixed(2);
                var ToRoundOffValue = Math.round(ToFixedValue);

                $scope.SmartCardInfo={
                   value:ToRoundOffValue + "%",
                    points:percentage_points
                };


                if (!response.error)
                {
                    growl.success(response.message);
                }
                else
                    {
                    growl.error(response.message);
                }
            }, function (response) {
            });

            // smart card at kiosks
            var _smart_card_kiosk_data;
            var _smart_card_kiosk_points;
            DataService.GetSmartCardAtKiosks($scope.details).then(function (response)
            {
                _smart_card_kiosk_data = response.data.total;

                if(_smart_card_kiosk_data > 99)
                {
                    _smart_card_kiosk_points=10;
                }
                else if(_smart_card_kiosk_data < 99)
                {
                    _smart_card_kiosk_points = -10;
                }
                else
                {
                    _smart_card_kiosk_data = 0;
                    _smart_card_kiosk_points = 0;
                }

                $scope.SmartCardKiosk={
                    kiosk_value:_smart_card_kiosk_data + "%",
                    kiosk_point:_smart_card_kiosk_points
                }


                if (!response.error)
                {
                    growl.success(response.message);
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });

            // get bicycle fleet @ 6 am
            var percentage_data;
            var percentage_points;
            var fleet_percentage;
            var fleet_points;
            DataService.GetBicycleDetailsAtFleet($scope.details).then(function (response)
            {
                var port_with_cycle = 0;
                var cycles_with_rv =0;
                var cycles_with_ha=0;
                var cycles_with_member=0;
                var fleet_size=0;
                for(var i = 0; i < response.data.length; i++)
                {
                    var _cycle_in_port_count = response.data[i].cyclesInPort;
                    var _cycle_with_rv = response.data[i].cyclesWithRv;
                    var _cycle_with_Ha = response.data[i].cyclesWithHa;
                    var _cycle_with_member=response.data[i].cyclesWithMembers;
                    var _fleet_size = response.data[i].requiredFleetSize;

                    port_with_cycle += _cycle_in_port_count;
                    cycles_with_rv +=_cycle_with_rv;
                    cycles_with_ha += _cycle_with_Ha;
                    cycles_with_member += _cycle_with_member;
                    fleet_size += _fleet_size;
                }

                fleet_percentage = ((port_with_cycle + cycles_with_rv + cycles_with_ha + cycles_with_member)/(fleet_size) * 100).toFixed(2);

                if(fleet_percentage > 95 && fleet_percentage <= 98)
                {
                    fleet_points = 5;
                }
                else if(fleet_percentage > 98)
                {
                    fleet_points = 10;
                }

                else if(fleet_percentage > 90 && fleet_percentage <= 95)
                {
                    fleet_points = -5;
                }

                else if(fleet_percentage < 90)
                {
                    fleet_points = -10;
                }
                else
                {
                    fleet_percentage = 0;
                    fleet_points = 0;
                }

                $scope.bicycleFleet={
                    bicycleFleetValue:fleet_percentage + "%",
                    bicycleFleetPoints:fleet_points
                };

                if (!response.error)
                {
                    growl.success(response.message);
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });

            // get docking station clean details
            var _docking_station_clean_count=0;
            var clean_percentage_value=0;
            var clean_percentage_points=0;
            DataService.GetDockingStationKPIDetails($scope.details).then(function (response)
            {
                if (!response.error)
                {
                    for(var i=0;i<response.data.length;i++)
                    {
                        _docking_station_clean_count += response.data[i].cleanCount;
                    }
                    /*_docking_station_clean_count = response.data.length;*/

                    /*clean_percentage_value = ((_docking_station_clean_count)/(_no_of_days * Number_of_DockingStations) * 100).toFixed(2);*/
                    clean_percentage_value = ((_docking_station_clean_count)/(_no_of_days * 49) * 100).toFixed(2);

                    if(clean_percentage_value >= 100)
                    {
                        clean_percentage_points = 10;
                    }
                    else if (clean_percentage_value >= 50 && clean_percentage_value < 75)
                    {
                        clean_percentage_points =5;
                    }
                    else if (clean_percentage_value >= 25 && clean_percentage_value <50 )
                    {
                        clean_percentage_points =-5;
                    }
                    else if (clean_percentage_value <= 25)
                    {
                        clean_percentage_points =-10;
                    }
                    else
                    {
                        clean_percentage_value = 0;
                        clean_percentage_points = 0;
                    }

                    $scope.KPIStationClean={
                        CleanValue:clean_percentage_value + "%",
                        CleanPoints:clean_percentage_points
                    };
                    growl.success(response.message);
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });

            // get average cycle use per cycle per day
            var _No_of_trips;
            var _No_of_cycles_required;
            var total_trips=0;
            var total_cycles=0;
            var trip_percentage;
            var trip_points;
            DataService.GetCycleUsagePerDay($scope.details).then(function (response)
            {
                for(var i=0;i<response.data.length;i++)
                {
                    _No_of_trips = response.data[i].noOfTrips;
                    _No_of_cycles_required = response.data[i].requiredNoOfCycles;

                    total_trips += _No_of_trips;
                    total_cycles += _No_of_cycles_required;
                }

                trip_percentage = ((total_trips/total_cycles)*100).toFixed(2);

                if(trip_percentage >= 3)
                {
                    trip_points = 10;
                }
                else if(trip_percentage < 3)
                {
                    trip_points = -10;
                }
                else
                {
                    trip_percentage = 0;
                    trip_points = 0;
                }


                $scope.CycleTrips={
                    trip_value:trip_percentage + "%",
                    trip_points:trip_points
                }

                if (!response.error)
                {
                    growl.success(response.message);
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });


            // Website Downtime
            var _duration=0;
            var final_value = 0;
            var downtime_points;
            DataService.GetWebsiteDownTimeDetails($scope.details).then(function (response)
            {
                for(var i=0;i<response.data.length;i++)
                {
                    _duration += response.data[i].duration;
                }

                 final_value = 100 - ( _duration * 100) / (_no_of_days * 24* 60)

                if(final_value > 98)
                {
                    downtime_points = 10;
                }
                else if(final_value > 95 && final_value <= 98)
                {
                    downtime_points = 5;
                }
                else if(final_value > 90 && final_value <= 95)
                {
                    downtime_points = -5;
                }
                else if(final_value <= 90 )
                {
                    downtime_points = -10;
                }
                else
                {
                    final_value = 0;
                    downtime_points = 0;
                }


                $scope.WebsiteDownTime={
                    downTime_value:final_value + "%",
                    downTime_points:downtime_points
                }


                if (!response.error)
                {
                    growl.success(response.message);
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });



            // customer complaints
            var _total_complaints=0;
            var _total_complaint_points;
            $scope.details.complaintType=2;
            $scope.CustomerComplaints = [];
            DataService.getTickets($scope.details).then(function (response)
            {
                if (!response.error)
                {
                   /* var _complaintType=0;*/
                    var _count=0;
                    $scope.CustomerComplaints = response.data;
                    for(var i=0;i<response.data.length;i++)
                    {
                        var _complaintType = response.data[i].complaintType;
                        var _channel= response.data[i].channel;
                      if(_channel == 1)
                      {
                          /*if(_complaintType == 2)*/
                          if(_complaintType == 1)
                          {
                              _total_complaints ++;
                          }
                      }
                    }

                    if(_total_complaints < 5)
                    {
                        _total_complaint_points = 10;
                    }
                    else if(_total_complaints >5 && _total_complaints <= 10)
                    {
                        _total_complaint_points = 5;
                    }
                    else if(_total_complaints>10 && _total_complaints<=15)
                    {
                        _total_complaint_points = -5;
                    }
                    else if(_total_complaints > 15)
                    {
                        _total_complaint_points = -10;
                    }
                    else
                    {
                        _total_complaints = 0;
                        _total_complaint_points = 0;
                    }
                    $scope.CustomerComplaints={
                        complaints:_total_complaints,
                        points:_total_complaint_points
                    };


                    growl.success(response.message);
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });

            // cycle repaired within the duration of 4 hours
            var cycle_repaired_value;
            var cycle_repaired_ponits;
            $scope.CycleRepair = [];
            DataService.getTickets().then(function (response)
            {
                if (!response.error)
                {
                    var _cycle_repaire_count=0;
                    var _cycle_repaire_value=0;
                    var _cycle_repaire_points;
                    var _closed_duration = 0;
                    $scope.CycleRepair = response.data;
                    for(var i=0;i<response.data.length;i++)
                    {
                        var _complaintType = response.data[i].tickettype;
                        var _status = response.data[i].status;
                        var _duration = response.data[i].closedDuration;
                        if(_complaintType == 'Cycle Repaire')
                        {
                            _cycle_repaire_count ++;

                            if(_status == 'close')
                            {
                                _closed_duration += _duration;
                            }
                        }
                    }
                       if(_closed_duration <240)
                       {
                           _cycle_repaire_value = (_closed_duration/_cycle_repaire_count)*100;
                       }
                       else
                       {
                           _cycle_repaire_value = 0;
                           _cycle_repaire_points = 0;
                       }

                    if(_cycle_repaire_value > 98)
                    {
                        _cycle_repaire_points = 10;
                    }
                    else if(_cycle_repaire_value >95 && _cycle_repaire_value <= 98)
                    {
                        _cycle_repaire_points = 5;
                    }
                    else if(_cycle_repaire_value < 95 && _cycle_repaire_value >= 90)
                    {
                        _cycle_repaire_points = -5;
                    }
                    else if(_cycle_repaire_value <= 90)
                    {
                        _cycle_repaire_points = -10;
                    }
                    else
                    {
                        _cycle_repaire_value = 0;
                        _cycle_repaire_points = 0;
                    }
                    $scope.CycleRepair={
                        repaire:_cycle_repaire_value,
                        points:_cycle_repaire_points
                    };



                    growl.success(response.message);
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });
            /*alert(All_Redistribution_Indicators_Points + percentage_points + _smart_card_kiosk_points + fleet_points + clean_percentage_points
                + trip_points + downtime_points + _total_complaint_points + _cycle_repaire_points);*/
        }
    }]);


    app.controller('RVDetails', ['$scope', '$state', 'DataService', 'growl','$uibModal', 'sweet', function ($scope, $state, DataService, growl,$uibModal,sweet)
    {

    }]);

    // global ticket type manage
    app.controller('TicketTypeManage', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter','$window', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter,$window, $uibModal)
    {
        $scope.addGlobalKeyNameValue = function () {
            $state.go('admin.settings.ticket-type.add');
        };

        $scope.GlobalNameValue = [];

        DataService.getGlobalKeyNameValues().then(function (response)
        {
            if (!response.error) {
                $scope.GlobalNameValue = response.data;
            }
            else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.NameValueTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.GlobalNameValue, params.filter()) : $scope.GlobalNameValue;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );


    }]);

    // global ticket type add
    app.controller('TicketTypeAdd', ['$scope', '$state', 'DataService', 'growl','$uibModal', 'sweet', function ($scope, $state, DataService, growl,$uibModal,sweet)
    {
        $scope.globalKeyValues={
            name: '',
            value: []
        };

        $scope.addGlobalTypeDetails = function () {
            $scope.globalKeyValues.value.push({});
        };

        $scope.removeValue = function ($index) {
            sweet.show({
                title: 'Are you sure?',
                text: 'You will not be able to recover this record in the future',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                closeOnConfirm: true
            });
            $scope.globalKeyValues.value.splice($index, 1);
        };

        $scope.globalKeyValues;


        $scope.saveGlobalNameValue = function () {
            DataService.saveGlobalKeyNameValue($scope.globalKeyValues).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.cancelAddTicketType = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.settings.ticket-type.manage');
            });
        };
    }]);

    // setting type edit
    app.controller('SettingTypeEdit', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModal', 'StatusService', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModal, StatusService)
    {
        $scope.globalKeyValues = {};

        $scope.addGlobalTypeDetails = function () {
            $scope.globalKeyValues.value.push({});
        };

        $scope.removePlan = function ($index) {
            sweet.show({
                title: 'Are you sure?',
                text: 'You will not be able to recover this record in the future',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                closeOnConfirm: true
            });
            $scope.globalKeyValues.value.splice($index, 1);
        };

        DataService.getSettingType($stateParams.id).then(function (response) {
            if (!response.error) {
                $scope.globalKeyValues = response.data;
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });


        $scope.cancelUpdateSettingtype = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.settings.ticket-type.manage');
            });
        };
    }]);



// Maintenance Centre Status Controller
    app.controller('MaintenanceCentreStatus', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'maintenanceCentre', function ($scope, $state, DataService, growl, sweet, $uibModalInstance, maintenanceCentre) {

        $scope.maintenanceCentre = maintenanceCentre;

        $scope.changeMaintenanceCentreStatus = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'Changing the status may have side effects',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change!',
                closeOnConfirm: true
            }, function () {
                $scope.maintenanceCentre.status = parseInt($scope.maintenanceCentre.status);
                DataService.updateMaintenanceCentre($scope.maintenanceCentre).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $uibModalInstance.dismiss();
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description['0']);
                });
            });
        };

        $scope.cancelMaintenanceCentreStatusChange = function () {
            $uibModalInstance.dismiss();
        };

    }]);

    app.controller('AddMaintenanceCentre', ['$scope', '$state', 'DataService', 'growl', 'sweet', function ($scope, $state, DataService, growl, sweet) {

        $scope.maintenanceCentre = {
            Name: '',
            portCapacity: 0,
        /*    noOfCycles: 0,*/
            StationId:'',
            gpsCoordinates: {
                latitude: '',
                longitude: ''
            },
            status: 0

        };

        $scope.addMaintenanceCentre = function () {
            DataService.saveMaintenanceCentre($scope.maintenanceCentre).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    $state.go('admin.maintenance-centres.edit', {'id': response.data._id});
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.MaintenanceStations = [];

        DataService.getMaintenanceStations().then(function (response)
            {
                if (!response.error)
                {
                    $scope.MaintenanceStations = response.data;
                } else
                {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedMaintenanceStation =function(data){
            $scope.maintenanceCentre.StationId=data.id;
        };

        $scope.cancelAddMaintenanceCentre = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.maintenance-centres.manage');
            });
        };

    }]);

    app.controller('EditMaintenanceCentre', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModal', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModal) {
        $scope.maintenanceCentre = {};

        $scope.maintenanceCentreMap = {
            center: {
                latitude: 0,
                longitude: 0
            },
            zoom: 15
        };

        DataService.getMaintenanceCentre($stateParams.id).then(function (response) {
            if (!response.error) {
                $scope.maintenanceCentre = response.data;
                $scope.maintenanceCentreMap.center.latitude = parseFloat($scope.maintenanceCentre.gpsCoordinates.latitude);
                $scope.maintenanceCentreMap.center.longitude = parseFloat($scope.maintenanceCentre.gpsCoordinates.longitude);
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.changeMaintenanceCentreStatus = function () {
            return $uibModal.open({
                templateUrl: 'maintenance-centre-status-modal.html',
                controller: 'MaintenanceCentreStatus',
                size: 'md',
                resolve: {
                    maintenanceCentre: function () {
                        return $scope.maintenanceCentre;
                    }
                }
            });
        };

        $scope.updateMaintenanceCentre = function () {
            DataService.updateMaintenanceCentre($scope.maintenanceCentre).then(function (response) {
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

        $scope.cancelUpdateMaintenanceCentre = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.maintenance-centres.manage');
            });
        };

        $scope.MaintenanceStations = [];

        DataService.getMaintenanceStations().then(function (response)
            {
                if (!response.error)
                {
                    $scope.MaintenanceStations = response.data;
                } else
                {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedMaintenanceStation =function(data){
            $scope.maintenanceCentre.StationId=data.id;
        };

    }]);

    app.controller('ManageWebsiteDownTime', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.loginid=localStorage.LoginID;

        $scope.downTime=
            {
                dateTime:'',
                duration:'',
                reason:'',
                comments:'',
                createdBy:$scope.loginid
            };
        $scope.addWebsiteDowntime=function () {
            DataService.saveDowntime($scope.downTime).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            });
        }
    }]);

    /*sla report - average cycle use per cycle per day */
    var _selected_month;
    var _selected_year;
    var average_cycle_print =[];
    app.controller('KpiReportAverageCyclePerDay', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.AverageCycle={
           /* fromdate:'',
            todate:'',*/
           month:'',
            year:'',
            stationState:0,
            duration:0
        };

        // get average cycle use per cycle per day
        $scope.AverageCycleDetails=function ()
        {
            var _fromdate = new Date($scope.AverageCycle.year,($scope.AverageCycle.month - 1), 1);
            var _todate = new Date($scope.AverageCycle.year,$scope.AverageCycle.month, 1);

            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            $scope.SelectedMonth =  monthNames[_fromdate.getMonth()];
            $scope.SelectedYear= $scope.AverageCycle.year;

            $scope.Averagecycle=[];

            $scope.AverageCycle.fromdate = _fromdate;
            $scope.AverageCycle.todate = _todate;

            DataService.GetCycleUsagePerDay($scope.AverageCycle).then(function (response)
            {
                _selected_month = $scope.SelectedMonth;
                _selected_year = $scope.SelectedYear;

                if (!response.error)
                {
                    for(var i=0;i<response.data.length;i++)
                    {
                        $scope.Averagecycle.push(response.data[i]);
                        average_cycle_print.push(response.data[i]);
                    }

                    $scope.AverageCycleTable = new NgTableParams(
                        {
                            count: 10
                        },
                        {
                            getData: function ($defer, params) {
                                var orderedData = params.filter() ? $filter('filter')($scope.Averagecycle, params.filter()) : $scope.Averagecycle;
                                params.total(orderedData.length);
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        }
                    );
                  /*  growl.success(response.message);*/
                    $scope.AverageCycle.month = '';
                    $scope.AverageCycle.year='';
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });
        }
    }]);

    app.controller('KpiReportAverageCyclePerDayPrint', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {

        $scope.CyclePerDayDetails={
            month:_selected_month,
            year:_selected_year,
        };

        $scope.AveragecyclePrint=[];
        $scope.AveragecyclePrint = average_cycle_print


                $scope.AverageCyclePrintTable = new NgTableParams(
                    {
                        count: 10
                    },
                    {
                        getData: function ($defer, params) {
                            var orderedData = params.filter() ? $filter('filter')($scope.AveragecyclePrint, params.filter()) : $scope.AveragecyclePrint;
                            /*params.total(orderedData.length);*/
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                );

        $scope.Print = function ()
        {
            window.print();
        };
    }]);

    var _cycle_available_6am_month;
    var _cycle_availablr_6am_year;
    var Cycle_Available = [];
    app.controller('KpiReportCycleAvailableAt6am', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.CycleAvailable={
           /* fromdate:'',
            todate:'',*/
            month:'',
            year:'',
            stationState:0,
            duration:0
        };

        $scope.CycleAvailableDetails=function ()
        {

            var _fromdate = new Date($scope.CycleAvailable.year,$scope.CycleAvailable.month - 1, 1);
            var _todate = new Date( $scope.CycleAvailable.year,$scope.CycleAvailable.month, 1);

            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            $scope.SelectedMonth =  monthNames[_fromdate.getMonth()];
            $scope.SelectedYear= $scope.CycleAvailable.year;

            $scope.CycleAvailable.fromdate = _fromdate;
            $scope.CycleAvailable.todate = _todate;
            // get bicycle fleet @ 6 am
            DataService.GetBicycleDetailsAtFleet($scope.CycleAvailable).then(function (response)
            {
                _cycle_available_6am_month=$scope.SelectedMonth;
                _cycle_availablr_6am_year=$scope.SelectedYear;

                if (!response.error)
                {
                    $scope.CyclesAvailable=[];

                    for(var i=0;i<response.data.length;i++)
                    {
                        $scope.CyclesAvailable.push(response.data[i]);
                        Cycle_Available.push(response.data[i]);
                    }

                    $scope.CycleAvailableTable = new NgTableParams(
                        {
                            count: 10
                        },
                        {
                            getData: function ($defer, params) {
                                var orderedData = params.filter() ? $filter('filter')($scope.CyclesAvailable, params.filter()) : $scope.CyclesAvailable;
                                params.total(orderedData.length);
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        }
                    );
                    /*growl.success(response.message);*/
                    $scope.CycleAvailable.month='';
                    $scope.CycleAvailable.year='';
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });
        }

        // to get all Docking stations
        $scope.DockingHubs = [];

        DataService.getDockingStations().then(function (response) {
                if (!response.error) {
                    for(var i=0;i<response.data.length;i++)
                    {
                        $scope.DockingHubs.push(response.data[i]);
                    }
                }
                else {
                    growl.error(response.message)
                }
            },
            function(response)
            {
                growl.error(response.data);
            });

        $scope.selectedDockingHub = function (data) {
            $scope.details.stationId = data._id;
        };

    }]);

    app.controller('KpiReportCycleAvailableAt6amPrint', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.CycleAvailableDetails={
            month:_cycle_available_6am_month,
            year:_cycle_availablr_6am_year
        };

        $scope.CycleAvailablePrint=[];
        $scope.CycleAvailablePrint = Cycle_Available;


        $scope.CycleAvailablePrintTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.CycleAvailablePrint, params.filter()) : $scope.CycleAvailablePrint;
                    /*params.total(orderedData.length);*/
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.Print = function ()
        {
            window.print();
        };

    }]);

    var _station_clean_month;
    var _station_clean_year;
    var StationClean =[];
    app.controller('KpiReportDockingStationClean', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.StationClean={
           /* fromdate:'',
            todate:'',*/
            month:'',
            year:'',
            stationState:0,
            duration:0
        };

        $scope.stationClean=[];

        $scope.StationCleanDetails=function () {

            var _fromdate = new Date($scope.StationClean.year,$scope.StationClean.month - 1, 1);
            var _todate = new Date( $scope.StationClean.year,$scope.StationClean.month, 1);

            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            $scope.SelectedMonth =  monthNames[_fromdate.getMonth()];
            $scope.SelectedYear= $scope.StationClean.year;

            $scope.StationClean.fromdate = _fromdate;
            $scope.StationClean.todate = _todate;

            DataService.GetDockingStationKPIDetails($scope.StationClean).then(function (response)
            {
                _station_clean_month = $scope.SelectedMonth;
                _station_clean_year = $scope.SelectedYear;

                if (!response.error)
                {
                    for(var i=0;i<response.data.length;i++)
                    {
                        $scope.stationClean.push(response.data[i]);
                        StationClean.push(response.data[i]);
                    }

                    $scope.StationCleanTable = new NgTableParams(
                        {
                            count: 10
                        },
                        {
                            getData: function ($defer, params) {
                                var orderedData = params.filter() ? $filter('filter')($scope.stationClean, params.filter()) : $scope.stationClean;
                                params.total(orderedData.length);
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        }
                    );
                    growl.success(response.message);
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });

        }

        // to get all Docking stations
        $scope.DockingHubs = [];

        DataService.getDockingStations().then(function (response) {
                if (!response.error) {
                    for(var i=0;i<response.data.length;i++)
                    {
                        $scope.DockingHubs.push(response.data[i]);
                    }
                }
                else {
                    growl.error(response.message)
                }
            },
            function(response)
            {
                growl.error(response.data);
            });

        $scope.selectedDockingHub = function (data) {
            $scope.details.stationId = data._id;
        };
    }]);

    app.controller('KpiReportDockingStationCleanPrint', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.StationCleanDetails={
          month:_station_clean_month,
            year:_station_clean_year
        };

        $scope.StationCleanData =[];
        $scope.StationCleanData = StationClean;

        $scope.StationCleanPrintTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.StationCleanData, params.filter()) : $scope.StationCleanData;
                    /*params.total(orderedData.length);*/
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.Print = function ()
        {
            window.print();
        };

    }]);

    /*SLA - smart card performance at docking hub*/
    var _perforamnce_at_docking_hub_month;
    var _perforamnce_at_docking_hub_year;
    var PerformanceAtDockingHub = [];
    app.controller('KpiReportSmartCardAtHub', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.details={
          /*  fromdate:'',
            todate:'',*/
            month:'',
            year:'',
            stationState:0,
            duration:0
        };
        $scope.smartCardAtHub =function ()
        {
            var _fromdate = new Date($scope.details.year,$scope.details.month - 1, 1);
            var _todate = new Date( $scope.details.year,$scope.details.month, 1);

            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            $scope.SelectedMonth =  monthNames[_fromdate.getMonth()];
            $scope.SelectedYear= $scope.details.year;

            $scope.details.fromdate = _fromdate;
            $scope.details.todate = _todate;

            DataService.GetKPISmartCardReport($scope.details).then(function (response)
            {
                 _perforamnce_at_docking_hub_month = $scope.SelectedMonth;
                 _perforamnce_at_docking_hub_year=$scope.SelectedYear;

                if (!response.error)
                {
                    $scope.SmartCardAtHub=[];

                        $scope.Value=response.data.total;

                        for(var i=0;i<response.data.checkouts.length;i++)
                        {
                            $scope.SmartCardAtHub.push(response.data.checkouts[i]);
                            PerformanceAtDockingHub.push(response.data.checkouts[i]);
                        }

                    $scope.SmartCardAtHubTable = new NgTableParams(
                        {
                            count: 10
                        },
                        {
                            getData: function ($defer, params) {
                                var orderedData = params.filter() ? $filter('filter')($scope.SmartCardAtHub, params.filter()) : $scope.SmartCardAtHub;
                                params.total(orderedData.length);
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        }
                    );
                    $scope.details.month ='';
                    $scope.details.year='';
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
            });
        }
    }]);

    app.controller('KpiReportSmartCardAtHubPrint', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.SmartCardPerformanceAtHubDetails={
            month:_perforamnce_at_docking_hub_month,
            year:_perforamnce_at_docking_hub_year
        };

        $scope.SmartCardPerformanceAtHub=[];
        $scope.SmartCardPerformanceAtHub = PerformanceAtDockingHub;


        $scope.SmartCardPerformanceAtHubPrintTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.SmartCardPerformanceAtHub, params.filter()) : $scope.SmartCardPerformanceAtHub;
                    /*params.total(orderedData.length);*/
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.Print = function ()
        {
            window.print();
        };

    }]);

    /*SLA - smart card performance at kiosks*/
    app.controller('KpiReportSmartCardAtKiosks', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.SmartCardKiosksDetails={
           /* fromdate:'',
            todate:'',*/
           month:'',
            year:'',
            stationState:0,
            duration:0
        };

        $scope.smartCardKiosks=function ()
        {
            var _fromdate = new Date($scope.SmartCardKiosksDetails.year,$scope.SmartCardKiosksDetails.month - 1, 1);
            var _todate = new Date( $scope.SmartCardKiosksDetails.year,$scope.SmartCardKiosksDetails.month, 1);

            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            $scope.SelectedMonth =  monthNames[ _fromdate.getMonth()];
            $scope.SelectedYear= $scope.SmartCardKiosksDetails.year;

            $scope.SmartCardKiosksDetails.fromdate = _fromdate;
            $scope.SmartCardKiosksDetails.todate = _todate;

            DataService.GetSmartCardAtKiosks($scope.SmartCardKiosksDetails).then(function (response)
            {
                if (!response.error)
                {
                    $scope.cardKiosks=[];

                    $scope.Value = response.data.total;

                    for(var i=0;i<response.data.kiosks.length;i++)
                    {
                        $scope.cardKiosks.push(response.data.kiosks[i]);
                    }

                    $scope.SmartCardKiosksTable = new NgTableParams(
                        {
                            count: 10
                        },
                        {
                            getData: function ($defer, params) {
                                var orderedData = params.filter() ? $filter('filter')($scope.cardKiosks, params.filter()) : $scope.cardKiosks;
                                params.total(orderedData.length);
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        }
                    );
                    $scope.SmartCardKiosksDetails.month =='';
                    $scope.SmartCardKiosksDetails.year='';
                    /*growl.success(response.message);*/
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });
        }

    }]);

    var _empty_major_hub_peak_month;
    var _empty_major_hub_peak_year;
    var EmptyMajorHubPeak=[];
    app.controller('KpiReportEmptyMajorDSPeak', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.details={
           /* fromdate:'',
            todate:'',*/
           month :'',
            year:'',
            stationState:0,
            duration:0
        };

        $scope.GetDetails = function ()
        {
            var _fromdate = new Date($scope.details.year,$scope.details.month - 1, 1);
            var _todate = new Date( $scope.details.year,$scope.details.month, 1);

            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            $scope.SelectedMonth =  monthNames[_fromdate.getMonth()];
            $scope.SelectedYear= $scope.details.year;

            /*$scope.details.fromdate = _fromdate;
            $scope.details.todate = _todate;*/


            if(_station_id == '' || _station_id == null || _station_id == undefined)
            {
                $scope.details={
                    fromdate:_fromdate,
                    todate:_todate,
                    stationState:0,
                    duration:0
                };
            }
            else
                {
                    $scope.details={
                        fromdate:_fromdate,
                        todate:_todate,
                        stationState:0,
                        duration:0,
                        stationId:_station_id
                    };
                }

            DataService.GetRVDetails($scope.details).then(function (response)
            {
                _empty_major_hub_peak_month=$scope.SelectedMonth;
                _empty_major_hub_peak_year=$scope.SelectedYear;

                $scope.EmptyMojorDSPeak=[];
                if (!response.error) {
                    /*$scope.StartDate =  $scope.details.fromdate;*/
                    for(var i=0;i<response.data.length;i++)
                    {
                        if(response.data[i].stationtype == "Major" || response.data[i].modelType == "Major")
                        {
                            if(response.data[i].peekduration > 0)
                            {
                                $scope.EmptyMojorDSPeak.push(response.data[i])
                                EmptyMajorHubPeak.push(response.data[i]);
                            }
                        }
                    }
                    /*growl.success(response.message);*/
                    $scope.details.month ='';
                    $scope.details.year='';
                    $scope.details.stationId='';
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })

            $scope.EmptyMojorDSPeakTable = new NgTableParams(
                {
                    count: 10
                },
                {
                    getData: function ($defer, params) {
                        var orderedData = params.filter() ? $filter('filter')($scope.EmptyMojorDSPeak, params.filter()) : $scope.EmptyMojorDSPeak;
                        params.total(orderedData.length);
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }
            );
        }

        // to get all Docking stations
        $scope.DockingHubs = [];

        DataService.getDockingStations().then(function (response) {
                if (!response.error) {
                    for(var i=0;i<response.data.length;i++)
                    {
                        $scope.DockingHubs.push(response.data[i]);
                    }
                }
                else {
                    growl.error(response.message)
                }
            },
            function(response)
            {
                growl.error(response.data);
            });

        var _station_id;
        $scope.selectedDockingHub = function (data) {
            _station_id = data._id;
        };


    }]);

    app.controller('KpiReportEmptyMajorDSPeakPrint', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.EmptyMajorHubPeak={
            month:_empty_major_hub_peak_month,
            year:_empty_major_hub_peak_year
        };

        $scope.EmptyMajorHubPeakPrint=[];
        $scope.EmptyMajorHubPeakPrint=EmptyMajorHubPeak;

        $scope.EmptyMojorDSPeakPrintTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.EmptyMajorHubPeakPrint, params.filter()) : $scope.EmptyMajorHubPeakPrint;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.Print = function ()
        {
            window.print();
        };
    }]);

    var _empty_minor_peak_month;
    var _empty_minor_peak_year;
    var EmptyMinorPeak =[];
    app.controller('KpiReportEmptyMinorDSPeak', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.details={
          /*  fromdate:'',
            todate:'',*/
          month:'',
            year:'',
            stationState:0,
            duration:0
        };

        $scope.GetDetails = function ()
        {
           // var _fromdate = new Date($scope.details.year,$scope.details.month - 1, 1,5,30,0,0);
            var _fromdate = new Date($scope.details.year,$scope.details.month - 1,1,5,30,0);
        //   var _todate = new Date( $scope.details.year,$scope.details.month, 1);
            var _todate = new Date( $scope.details.year,$scope.details.month , 0,5,30,0);

            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            $scope.SelectedMonth =  monthNames[_fromdate.getMonth()];
            $scope.SelectedYear= $scope.details.year;

            $scope.details.fromdate = _fromdate;
            $scope.details.todate = _todate;

            if(_station_id == '' || _station_id == null || _station_id == undefined)
            {
                $scope.details={
                    fromdate:_fromdate,
                    todate:_todate,
                    stationState:0,
                    duration:0
                };
            }
            else
            {
                $scope.details={
                    fromdate:_fromdate,
                    todate:_todate,
                    stationState:0,
                    duration:0,
                    stationId:_station_id
                };
            }

            DataService.GetRVDetails($scope.details).then(function (response)
            {
                 _empty_minor_peak_month= $scope.SelectedMonth;
                 _empty_minor_peak_year=$scope.SelectedYear;

                $scope.EmptyMinorDSPeak=[];
                if (!response.error)
                {
                    for(var i=0;i<response.data.length;i++)
                    {
                            if (response.data[i].stationtype == "Minor")
                            {
                                if(response.data[i].peekduration > 0)
                                {
                                    $scope.EmptyMinorDSPeak.push(response.data[i]);
                                    EmptyMinorPeak.push(response.data[i]);
                                }
                            }
                    }
                    $scope.details.month = '';
                    $scope.details.year = '';

                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })

            $scope.EmptyMinorDSPeakTable = new NgTableParams(
                {
                    count: 10
                },
                {
                    getData: function ($defer, params) {
                        var orderedData = params.filter() ? $filter('filter')($scope.EmptyMinorDSPeak, params.filter()) : $scope.EmptyMinorDSPeak;
                        params.total(orderedData.length);
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }
            );
        }
        // to get all Docking stations
        $scope.DockingHubs = [];

        DataService.getDockingStations().then(function (response) {
                if (!response.error) {
                    for(var i=0;i<response.data.length;i++)
                    {
                        $scope.DockingHubs.push(response.data[i]);
                    }
                }
                else {
                    growl.error(response.message)
                }
            },
            function(response)
            {
                growl.error(response.data);
            });

        var _station_id;
        $scope.selectedDockingHub = function (data) {
            _station_id = data._id;
        };


    }]);

    app.controller('KpiReportEmptyMinorDSPeakPrint', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.EmptyMinorDSPeakDetails={
            month:_empty_minor_peak_month,
            year:_empty_minor_peak_year
        };

        $scope.EmptyMinorPeak=[];
        $scope.EmptyMinorPeak = EmptyMinorPeak;

        $scope.EmptyMinorDSPeakPrintTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.EmptyMinorPeak, params.filter()) : $scope.EmptyMinorPeak;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );
        $scope.Print = function ()
        {
            window.print();
        };

    }]);

    var _empty_major_offpeak_month;
    var _empty_major_offpeak_year;
    var EmptyMajorOffPeak=[];
    app.controller('KpiReportEmptyMajorDSOffPeak', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.details={
           /* fromdate:'',
            todate:'',*/
           month:'',
            year:'',
            stationState:0,
            duration:0
        };

        $scope.GetDetails = function ()
        {
            var _fromdate = new Date($scope.details.year,$scope.details.month - 1, 1);
            var _todate = new Date( $scope.details.year,$scope.details.month, 1);

            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            $scope.SelectedMonth =  monthNames[_fromdate.getMonth()];
            $scope.SelectedYear= $scope.details.year;

            $scope.details.fromdate = _fromdate;
            $scope.details.todate = _todate;

            DataService.GetRVDetails($scope.details).then(function (response)
            {
                _empty_major_offpeak_month=$scope.SelectedMonth;
                _empty_major_offpeak_year=$scope.SelectedYear;

                $scope.EmptyMajorDSOffPeak=[];
                if (!response.error) {
                    for(var i=0;i<response.data.length;i++)
                    {
                        if(response.data[i].stationtype == "Major")
                        {
                            if(response.data[i].offpeekduration > 0)
                            {
                            $scope.EmptyMajorDSOffPeak.push(response.data[i]);
                            EmptyMajorOffPeak.push(response.data[i]);
                            }
                        }
                    }
                    /*growl.success(response.message);*/
                    $scope.details.month = '';
                    $scope.details.year = '';

                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })

            $scope.EmptyMajorDSOffPeakTable = new NgTableParams(
                {
                    count: 10
                },
                {
                    getData: function ($defer, params) {
                        var orderedData = params.filter() ? $filter('filter')($scope.EmptyMajorDSOffPeak, params.filter()) : $scope.EmptyMajorDSOffPeak;
                        params.total(orderedData.length);
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }
            );
        }
    }]);

    app.controller('KpiReportEmptyMajorDSOffPeakPrint', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.EmptyMajorOffPeakDetails={
            month:_empty_major_offpeak_month,
            year:_empty_major_offpeak_year
        };

        $scope.EmptyMajorOffPeak=[];
        $scope.EmptyMajorOffPeak = EmptyMajorOffPeak;

        $scope.EmptyMajorDSOffPeakPrintTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.EmptyMajorOffPeak, params.filter()) : $scope.EmptyMajorOffPeak;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.Print = function ()
        {
            window.print();
        };

    }]);

    var _empty_minor_offpeak_month;
    var _empty_minor_offpeak_year;
    var EmptyMinorOffPeak=[];
    app.controller('KpiReportEmptyMinorDSOffPeak', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.details={
          /*  fromdate:'',
            todate:'',*/
          month:'',
            year:'',
            stationState:0,
            duration:0
        };

        $scope.GetDetails = function ()
        {
            var _fromdate = new Date($scope.details.year,$scope.details.month - 1, 1);
            var _todate = new Date( $scope.details.year,$scope.details.month, 1);

            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            $scope.SelectedMonth =  monthNames[_fromdate.getMonth()];
            $scope.SelectedYear= $scope.details.year;

            $scope.details.fromdate = _fromdate;
            $scope.details.todate = _todate;

            DataService.GetRVDetails($scope.details).then(function (response)
            {
                _empty_minor_offpeak_month = $scope.SelectedMonth;
                _empty_minor_offpeak_year =$scope.SelectedYear;

                $scope.EmptyMinorDSOffPeek=[];
                if (!response.error) {
                    for(var i=0;i<response.data.length;i++)
                    {
                        if(response.data[i].stationtype == 'Minor')
                        {
                            if(response.data[i].offpeekduration > 0)
                            {
                                $scope.EmptyMinorDSOffPeek.push(response.data[i]);
                                EmptyMinorOffPeak.push(response.data[i]);
                            }
                        }
                    }
                    /*growl.success(response.message);*/
                    $scope.details.month = '';
                    $scope.details.year = '';
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })

            $scope.EmptyMinorDSOffPeekTable = new NgTableParams(
                {
                    count: 10
                },
                {
                    getData: function ($defer, params) {
                        var orderedData = params.filter() ? $filter('filter')($scope.EmptyMinorDSOffPeek, params.filter()) : $scope.EmptyMinorDSOffPeek;
                        params.total(orderedData.length);
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }
            );
        }
    }]);

    app.controller('KpiReportEmptyMinorDSOffPeakPrint', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.EmptyMinorOffPeakDetails={
          month:_empty_minor_offpeak_month,
          year:_empty_minor_offpeak_year
        };

        $scope.EmptyMinorOffPeak=[];
        $scope.EmptyMinorOffPeak = EmptyMinorOffPeak;

        $scope.EmptyMinorDSOffPeekPrintTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.EmptyMinorOffPeak, params.filter()) : $scope.EmptyMinorOffPeak;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );
        $scope.Print = function ()
        {
            window.print();
        };
    }]);

    var _station_empty_full_month;
    var _station_empty_full_year;
    var StationEmptyFull =[];
    app.controller('KpiReportEmptyFull', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.details={
           /* fromdate:'',
            todate:'',*/
           month:'',
            year:'',
            stationState:0,
            duration:120
        };

        $scope.GetDetails = function ()
        {
            var _fromdate = new Date($scope.details.year,$scope.details.month - 1, 1);
            var _todate = new Date( $scope.details.year,$scope.details.month, 1);

            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            $scope.SelectedMonth =  monthNames[_fromdate.getMonth()];
            $scope.SelectedYear= $scope.details.year;

            $scope.details.fromdate = _fromdate;
            $scope.details.todate = _todate;

            if($scope.details.stationId == '' || $scope.details.stationId == null || $scope.details.stationId == undefined)
            {
                var objStationEmptyFull ={
                    fromdate:$scope.details.fromdate,
                    todate:$scope.details.todate,
                    stationState:$scope.details.stationState,
                    duration:$scope.details.duration
                };
            }
            else
            {
                var objStationEmptyFull ={
                    fromdate:$scope.details.fromdate,
                    todate:$scope.details.todate,
                    stationState:$scope.details.stationState,
                    duration:$scope.details.duration,
                    stationId:$scope.details.stationId
                };
            }

            DataService.GetRVDetails(objStationEmptyFull).then(function (response)
            {
                 _station_empty_full_month = $scope.SelectedMonth;
                 _station_empty_full_year=$scope.SelectedYear;

                $scope.DSEmptyFull=[];
                if (!response.error) {
                    for(var i=0;i<response.data.length;i++)
                    {
                       var Start_Month = new Date(response.data[i].starttime).getMonth() + 1;
                       if( Start_Month == $scope.details.month)
                       {
                           $scope.DSEmptyFull.push(response.data[i]);
                           StationEmptyFull.push(response.data[i]);
                       }
                    }
                    $scope.details.month='';
                    $scope.details.year ='';
                    $scope.details.stationId ='';
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })

            $scope.DSEmptyFullTable = new NgTableParams(
                {
                    count: 10
                },
                {
                    getData: function ($defer, params) {
                        var orderedData = params.filter() ? $filter('filter')($scope.DSEmptyFull, params.filter()) : $scope.DSEmptyFull;
                        params.total(orderedData.length);
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }
            );
        }

        // to get all Docking stations
        $scope.DockingHubs = [];

        DataService.getDockingStations().then(function (response) {
                if (!response.error) {
                    for(var i=0;i<response.data.length;i++)
                    {
                        $scope.DockingHubs.push(response.data[i]);
                    }
                }
                else {
                    growl.error(response.message)
                }
            },
            function(response)
            {
                growl.error(response.data);
            });

        $scope.selectedDockingHub = function (data) {
            $scope.details.stationId = data._id;
        };

    }]);

    app.controller('KpiReportEmptyFullPrint', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.StationFullEmptyDetails={
            month:_station_empty_full_month,
            year:_station_empty_full_year
        };

        $scope.StationEmptyFullTwoHours=[];
        $scope.StationEmptyFullTwoHours=StationEmptyFull;

        $scope.DSEmptyFullPrintTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.StationEmptyFullTwoHours, params.filter()) : $scope.StationEmptyFullTwoHours;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );
        $scope.Print = function ()
        {
            window.print();
        };

    }]);

    app.controller('NumberOfValidComplaints', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.details={
           /* fromdate:'',
            todate:'',*/
            month:'',
            year:''
        };

        $scope.GetDetails = function ()
        {

           var _fromdate = new Date($scope.details.year,$scope.details.month - 1, 1);
            var _todate = new Date( $scope.details.year,$scope.details.month, 1);

            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            $scope.SelectedMonth =  monthNames[_fromdate.getMonth()];
            $scope.SelectedYear= $scope.details.year;

            $scope.details.fromdate = _fromdate;
            $scope.details.todate = _todate;
            $scope.details.complaintType = 1;

            DataService.getValidTickets($scope.details).then(function (response)
            {
                $scope.ValidComplaints = [];
                if (!response.error)
                {
                    for(var i=0;i<response.data.length;i++)
                    {
                        var _complaint_type = response.data[i].complaintType;
                        var _channel = response.data[i].channel;
                        /*var _status = response.data[i].status;*/
                        if(_channel == 1)
                        {
                            if(_complaint_type == 1)
                            {
                            $scope.ValidComplaints.push(response.data[i]);
                            }
                        }
                    }
                    /*growl.success(response.message);*/
                    $scope.details.month = '';
                    $scope.details.year = '';
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })

            $scope.ValidComplaintsTable = new NgTableParams(
                {
                    count: 10
                },
                {
                    getData: function ($defer, params) {
                        var orderedData = params.filter() ? $filter('filter')($scope.ValidComplaints, params.filter()) : $scope.ValidComplaints;
                        params.total(orderedData.length);
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }
            );
        }

    }]);

    app.controller('BicycleRepairWithinFourHours', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.details={
         /*   fromdate:'',
            todate:'',*/
            month:'',
            year:'',
            complaintType:2
        };

        $scope.GetDetails = function ()
        {
            var _fromdate = new Date($scope.details.year,$scope.details.month - 1, 1);
            var _todate = new Date( $scope.details.year,$scope.details.month, 1);

            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            $scope.SelectedMonth =  monthNames[_fromdate.getMonth()];
            $scope.SelectedYear= $scope.details.year;

            $scope.details.fromdate = _fromdate;
            $scope.details.todate = _todate;
            // Bicycle repair with in 4 hours
            DataService.getCycleRepairedWithinFourHours($scope.details).then(function (response)
            {
                $scope.BicycleRepair = [];
                if (!response.error) {
                    for(var i=0;i<response.data.length;i++)
                    {
                        var _complaintType = response.data[i].tickettype;
                        var _status = response.data[i].status;
                        var _duration = response.data[i].closedDuration;
                        if(_complaintType == "Cycle Repaire")
                        {
                                if(_status == 'Close')
                                {
                                   /* if(_duration < 0)
                                    {*/
                                        $scope.BicycleRepair.push(response.data[i]);
                                    /*}*/
                                }
                        }
                    }
                    /*growl.success(response.message);*/
                    $scope.details.month = '';
                    $scope.details.year = '';
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })

            $scope.BicycleRepairTable = new NgTableParams(
                {
                    count: 10
                },
                {
                    getData: function ($defer, params) {
                        var orderedData = params.filter() ? $filter('filter')($scope.BicycleRepair, params.filter()) : $scope.BicycleRepair;
                        params.total(orderedData.length);
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }
            );
        }

    }]);

    app.controller('SLAWebsiteDownTime', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.details={
           /* fromdate:'',
            todate:'',*/
           month:'',
            year:''
        };

        $scope.GetDetails = function ()
        {

            var _fromdate = new Date($scope.details.year,$scope.details.month - 1, 1);
            var _todate = new Date( $scope.details.year,$scope.details.month, 1);

            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            $scope.SelectedMonth =  monthNames[_fromdate.getMonth()];
            $scope.SelectedYear= $scope.details.year;

            $scope.details.fromdate = _fromdate;
            $scope.details.todate = _todate;

            DataService.getWebsiteDownTime($scope.details).then(function (response)
            {
                $scope.WesiteDownTime = [];
                if (!response.error) {
                    for(var i=0;i<response.data.length;i++)
                    {
                     $scope.WesiteDownTime.push(response.data[i]);
                    }
                    $scope.details.year='';
                    $scope.details.month = '';
                    /*growl.success(response.message);*/
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })

            $scope.WesiteDownTimeTable = new NgTableParams(
                {
                    count: 10
                },
                {
                    getData: function ($defer, params) {
                        var orderedData = params.filter() ? $filter('filter')($scope.WesiteDownTime, params.filter()) : $scope.WesiteDownTime;
                        params.total(orderedData.length);
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }
            );
        }

    }]);

    var percentage_value_report=0;
    var percentage_points_report=0;

    var percentage_value_major_empty_report=0;
    var percentage_points_total_major_empty_report=0;
    var percentage_value_major_empty_offpeek_report=0;
    var percentage_points_total_major_empty_offpeek_report=0;

    var percentage_value_minor_empty_report=0;
    var percentage_points_total_minor_empty_report=0;
    var percentage_value_minor_empty_offpeek_report=0;
    var percentage_points_total_minor_empty_offpeek_report=0;

    //values
   var smartcard_at_hub_value=0;
   var smartcard_at_kiosks_value=0;
    var average_cycle_per_day_value=0;
    var majorEmptyPeekValue=0;
    var majorEmptyOffPeekValue=0;
    var minorEmptyPeekValue=0;
    var minorEmptyOffPeekValue=0;
    var EmptyFullValue=0;
    var stationCleanValue = 0;
    var cycleRepairValue=0;
    var cycleFleetValue=0;
    var websiteDowntimeValue=0;
    var customerComplaintsValue=0;

    // points
    var All_Redistribution_Indicators_Points_report=0;
    var majorEmptyPeekPoints=0;
    var majorEmptyOffpeekPoints= 0;
    var minorEmptyPeekPoints=0;
    var monirEmptyOffpeekPoints=0;
    var stationEmptyFull = 0;
    var percentage_points_at_hub=0;
    var smart_card_points_at_kisok=0;
    var fleet_points_report=0;
    var docking_hub_clean_report=0;
    var average_cycle_per_day_report=0;
    var website_down_time_report=0;
    var customer_valid_complaints_report=0;
    var cycle_repair_withinFourHours_report=0;
    var Total_Points=0;

    var _no_of_days_report;
    var docking_station_count_report;

    var kpi_from_date;
    var kpi_to_date;
    var kpi_points;
    app.controller('KpiReports', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        /*alert(Number_of_DockingStations);*/

        $scope.toDateKPI = new Date();

        var CurrentDate = new Date();
        var test = CurrentDate.getMonth() + 1;
        var demo = CurrentDate.getDate();

        if(test == 10)
        {
            var aa= new Date(CurrentDate.setDate(CurrentDate.getDate() - demo));
            $scope.fromDateKPI  = new Date(CurrentDate.setMonth(CurrentDate.getMonth()));
        }

        else if(test == 11)
        {
            var aa1= new Date(CurrentDate.setDate(CurrentDate.getDate() - demo));
            $scope.fromDateKPI  = new Date(CurrentDate.setMonth(CurrentDate.getMonth() - 1));
        }
        else {
            // var test2;
            $scope.fromDateKPI   = new Date(CurrentDate.setMonth(CurrentDate.getMonth() - 2));
        }


        /*  $scope.kpiDetails={
         fromDateKPI:'',
         toDateKPI:''
         };

         $scope.sendKpiDetails = function () {
         DataService.SendKPIDetails($scope.kpiDetails).then(function (response) {
         if (!response.error) {
         growl.success(response.message);
         } else {
         growl.error(response.message);
         }
         }, function (response) {
         growl.error(response.data.description['0']);
         })
         };*/

        $scope.press = function (size) {
            $uibModal.open({
                templateUrl: 'details.html',
                controller: 'RVDetails',
                size: size,
                resolve: {
                    items: function () {
                        /*return $scope.member.debit;*/
                    }
                }
            });
        };



        /*$scope.selectedPeriod=function (data) {
         $scope.kpiPeriod=data;

         if($scope.kpiPeriod == 0 )
         {
         $scope.New={
         fromdate:'',
         todate:new Date(),
         stationState:0,
         duration:0
         };
         }
         };*/

        $scope.details={
            fromdate:'',
            todate:'',
            stationState:0,
            duration:0
        };

        $scope.GetDetails = function ()
        {
            DataService.GetRVDetails($scope.details).then(function (response)
            {
                kpi_from_date = $scope.details.fromdate;
                kpi_to_date = $scope.details.todate;

                var one_day = 24*60*60*1000;

                var _from_date = $scope.details.fromdate.getDate();
                var _from_month = $scope.details.fromdate.getMonth();
                var _from_year = $scope.details.fromdate.getFullYear();
                var from_date=new Date(_from_year,_from_month,_from_date);

                var _to_date =$scope.details.todate.getDate();
                var _to_month =$scope.details.todate.getMonth();
                var _to_year =$scope.details.todate.getFullYear();
                var to_date=new Date(_to_year,_to_month,_to_date);

                _no_of_days=Math.round(Math.abs((from_date.getTime()-to_date.getTime())/(one_day)))+1;
                /*_no_of_days = (_to_date) - (_from_date) + 1 ;*/
                /*var _working_hours = _no_of_days * 16 * 60 * Number_of_DockingStations;*/
                var _working_hours = _no_of_days * 16 * 60 * 49;
                var i=0;
                var total=0;
                var total_major_empty_peak=0;
                var total_major_empty_offpeak=0;
                var total_minor_empty_peak=0;
                var total_minor_empty_offpeak=0;

                for(var i = 0; i < response.data.length; i++)
                {
                    var total_duration = response.data[i].timeduration;
                    var peakduration_empty = response.data[i].peekduration;
                    var offpeakduration_empty = response.data[i].offpeekduration;
                    if(response.data[i].stationid == null)
                    {
                        var bicycle_clean = "";
                    }
                    else
                    {
                        var bicycle_clean=response.data[i].stationid.name;
                    }

                    // calculation for stations neither empty nor full for more then 1 minute
                    /*if(total_duration > 1)*/
                    if(total_duration > 120)
                    {
                        total += total_duration;
                    }

                    // calculation for major stations empty during peak hour
                    if(response.data[i].stationtype === "Major")
                    {
                        if(response.data[i].status===2)
                        {
                            total_major_empty_peak += peakduration_empty;
                            total_major_empty_offpeak += offpeakduration_empty;
                        }
                    }

                    // calculation for minor stations empty during peak and off peak hours
                    if(response.data[i].stationtype === "Minor")
                    {
                        if(response.data[i].status===2)
                        {
                            total_minor_empty_peak += peakduration_empty;
                            total_minor_empty_offpeak += offpeakduration_empty;
                        }
                    }
                }

                percentage_value_report =  ((_working_hours - total)/(_working_hours) * 100).toFixed(2);

                percentage_value_major_empty_report =  ((total_major_empty_peak)/(_working_hours) * 100).toFixed(2);
                percentage_value_major_empty_offpeek_report =  ((total_major_empty_offpeak)/(_working_hours) * 100).toFixed(2);

                percentage_value_minor_empty_report=((total_minor_empty_peak)/(_working_hours) * 100).toFixed(2);
                percentage_value_minor_empty_offpeek_report=((total_minor_empty_offpeak)/(_working_hours) * 100).toFixed(2);

                // condition for neither empty nor full for a period of longer than 2 hours
                if(percentage_value_report > 98)
                {
                    percentage_points_report=10;
                }
                else if (percentage_value_report >= 95 && percentage_value_report < 98)
                {
                    percentage_points_report=5;
                }
                else if(percentage_value_report >=90 && percentage_value_report <95)
                {
                    percentage_points_report=-5;
                }
                else if(percentage_value_report < 90)
                {
                    percentage_points_report=-10;
                }
                else
                {
                    percentage_value_report = 0;
                    percentage_points_report =0;
                }


                // condition for major docking staions are empty during peak hours
                if (percentage_value_major_empty_report < 3)
                {
                    percentage_points_total_major_empty_report = 10;
                }
                else if(percentage_value_major_empty_report >= 3 && percentage_value_major_empty_report <5)
                {
                    percentage_points_total_major_empty_report=5;
                }
                else if(percentage_value_major_empty_report >= 5 && percentage_value_major_empty_report <8)
                {
                    percentage_points_total_major_empty_report=-5;
                }
                else if(percentage_value_major_empty_report >= 8)
                {
                    percentage_points_total_major_empty_report=-10;
                }
                else
                {
                    percentage_value_major_empty_report = 0;
                    percentage_points_total_major_empty_report = 0;
                }

                // condition for major docking staions are empty during off peak hours
                if (percentage_value_major_empty_offpeek_report < 2)
                {
                    percentage_points_total_major_empty_offpeek_report = 10;
                }
                else if(percentage_value_major_empty_offpeek_report >= 2 && percentage_value_major_empty_offpeek_report <3)
                {
                    percentage_points_total_major_empty_offpeek_report=5;
                }
                else if(percentage_value_major_empty_offpeek_report >= 3 && percentage_value_major_empty_offpeek_report <5)
                {
                    percentage_points_total_major_empty_offpeek_report=-5;
                }
                else if(percentage_value_major_empty_offpeek_report >= 5)
                {
                    percentage_points_total_major_empty_offpeek_report=-10;
                }
                else
                {
                    percentage_value_major_empty_offpeek_report = 0;
                    percentage_points_total_major_empty_offpeek_report = 0;
                }

                // condition for minor docking staions are empty during peak hours
                if (percentage_value_minor_empty_report < 10)
                {
                    percentage_points_total_minor_empty_report = 10;
                }
                else if(percentage_value_minor_empty_report >= 10 && percentage_value_minor_empty_report <20)
                {
                    percentage_points_total_minor_empty_report=5;
                }
                else if(percentage_value_minor_empty_report >= 20 && percentage_value_minor_empty_report <25)
                {
                    percentage_points_total_minor_empty_report=-5;
                }
                else if(percentage_value_minor_empty_report >= 25)
                {
                    percentage_points_total_minor_empty_report=-10;
                }
                else
                {
                    percentage_value_minor_empty_report = 0;
                    percentage_points_total_minor_empty_report = 0;
                }

                // condition for minor docking staions are empty during off peak hours
                if (percentage_value_minor_empty_offpeek_report < 5)
                {
                    percentage_points_total_minor_empty_offpeek_report = 10;
                }
                else if(percentage_value_minor_empty_offpeek_report > 5 && percentage_value_minor_empty_offpeek_report <=8)
                {
                    percentage_points_total_minor_empty_offpeek_report=5;
                }
                else if(percentage_value_minor_empty_offpeek_report >8 && percentage_value_minor_empty_offpeek_report <=10)
                {
                    percentage_points_total_minor_empty_offpeek_report=-5;
                }
                else if(percentage_value_minor_empty_offpeek_report >= 10)
                {
                    percentage_points_total_minor_empty_offpeek_report=-10;
                }
                else
                {
                    percentage_value_minor_empty_offpeek_report = 0;
                    percentage_points_total_minor_empty_offpeek_report = 0;
                }


                $scope.RVDetails={
                    percentage:percentage_value_report + "%",
                    points:percentage_points_report,
                    percentage_total_major_empty:percentage_value_major_empty_report + "%",
                    points_total_major_empty:percentage_points_total_major_empty_report,
                    percentage_total_major_empty_offpeek:percentage_value_major_empty_offpeek_report + "%",
                    points_total_major_empty_offpeek:percentage_points_total_major_empty_report,
                    percentage_total_minor_empty:percentage_value_minor_empty_report + "%",
                    points_total_minor_empty:percentage_points_total_minor_empty_report,
                    percentage_total_minor_empty_offpeek:percentage_value_minor_empty_offpeek_report + "%",
                    points_total_minor_empty_offpeek:percentage_points_total_minor_empty_offpeek_report
                };

                majorEmptyPeekValue=percentage_value_major_empty_report;
                majorEmptyPeekPoints=percentage_points_total_major_empty_report;

                majorEmptyOffPeekValue = percentage_value_major_empty_offpeek_report;
                majorEmptyOffpeekPoints= percentage_points_total_major_empty_report;

                minorEmptyPeekValue = percentage_value_minor_empty_report;
                 minorEmptyPeekPoints=percentage_points_total_minor_empty_report;

                minorEmptyOffPeekValue = percentage_value_minor_empty_offpeek_report;
                monirEmptyOffpeekPoints=percentage_points_total_minor_empty_offpeek_report;

                EmptyFullValue = percentage_value_report;
                stationEmptyFull = percentage_points_report;

                All_Redistribution_Indicators_Points_report = percentage_points_report + percentage_points_total_major_empty_report + percentage_points_total_major_empty_report +
                    percentage_points_total_minor_empty_report + percentage_points_total_minor_empty_offpeek_report;

                 Total_Points = ((All_Redistribution_Indicators_Points_report) +(percentage_points_at_hub)  + (smart_card_points_at_kisok) + (fleet_points_report) +
                (docking_hub_clean_report) + (average_cycle_per_day_report) + (website_down_time_report) + (customer_valid_complaints_report) +
                (cycle_repair_withinFourHours_report));

                kpi_points = Total_Points;

                $scope.Total_Points = Total_Points;
                if (!response.error) {
                    growl.success(response.message);

                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })


            // Smart card performance at the dock (taking out a cycle from docking station
            var percentage_data;
            var percentage_points;
            DataService.GetKPISmartCardReport($scope.details).then(function (response)
            {
                percentage_data = response.data.total;

                if(percentage_data > 99)
                {
                    percentage_points= 10;
                }
                else if(percentage_data <99)
                {
                    percentage_points=-10;
                }
                /* else if (percentage_data == null || percentage_data == NaN)
                 {
                 percentage_data = 0;
                 percentage_points = 0;
                 }*/
                else
                {
                    percentage_data = 0;
                    percentage_points = 0;
                }

                $scope.SmartCardInfo={
                    value:percentage_data + "%",
                    points:percentage_points
                };

                  smartcard_at_hub_value = percentage_data;
                percentage_points_at_hub = percentage_points;

                if (!response.error)
                {
                    growl.success(response.message);
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });



            // smart card at kiosks
            var _smart_card_kiosk_data;
            var _smart_card_kiosk_points;
            DataService.GetSmartCardAtKiosks($scope.details).then(function (response)
            {
                _smart_card_kiosk_data = response.data.total;

                if(_smart_card_kiosk_data > 99)
                {
                    _smart_card_kiosk_points=10;
                }
                else if(_smart_card_kiosk_data < 99)
                {
                    _smart_card_kiosk_points = -10;
                }
                else
                {
                    _smart_card_kiosk_data = 0;
                    _smart_card_kiosk_points = 0;
                }

                $scope.SmartCardKiosk={
                    kiosk_value:_smart_card_kiosk_data + "%",
                    kiosk_point:_smart_card_kiosk_points
                };

                smartcard_at_kiosks_value = _smart_card_kiosk_data;
                smart_card_points_at_kisok = _smart_card_kiosk_points;

                if (!response.error)
                {
                    growl.success(response.message);
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });

            // get bicycle fleet @ 6 am
            var percentage_data;
            var percentage_points;
            var fleet_percentage;
            var fleet_points;
            DataService.GetBicycleDetailsAtFleet($scope.details).then(function (response)
            {
                var port_with_cycle = 0;
                var cycles_with_rv =0;
                var cycles_with_ha=0;
                var cycles_with_member=0;
                var fleet_size=0;
                for(var i = 0; i < response.data.length; i++)
                {
                    var _cycle_in_port_count = response.data[i].cyclesInPort;
                    var _cycle_with_rv = response.data[i].cyclesWithRv;
                    var _cycle_with_Ha = response.data[i].cyclesWithHa;
                    var _cycle_with_member=response.data[i].cyclesWithMembers;
                    var _fleet_size = response.data[i].requiredFleetSize;

                    port_with_cycle += _cycle_in_port_count;
                    cycles_with_rv +=_cycle_with_rv;
                    cycles_with_ha += _cycle_with_Ha;
                    cycles_with_member += _cycle_with_member;
                    fleet_size += _fleet_size;
                }

                fleet_percentage = ((port_with_cycle + cycles_with_rv + cycles_with_ha + cycles_with_member)/(fleet_size) * 100).toFixed(2);

                if(fleet_percentage > 95 && fleet_percentage <= 98)
                {
                    fleet_points = 5;
                }
                else if(fleet_percentage > 98)
                {
                    fleet_points = 10;
                }

                else if(fleet_percentage > 90 && fleet_percentage <= 95)
                {
                    fleet_points = -5;
                }

                else if(fleet_percentage < 90)
                {
                    fleet_points = -10;
                }
                else
                {
                    fleet_percentage = 0;
                    fleet_points = 0;
                }

                $scope.bicycleFleet={
                    bicycleFleetValue:fleet_percentage + "%",
                    bicycleFleetPoints:fleet_points
                };

                cycleFleetValue=fleet_percentage;
                fleet_points_report = fleet_points;

                if (!response.error)
                {
                    growl.success(response.message);
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });

            // get docking station clean details
            var _docking_station_clean_count = 0;
            var clean_percentage_value=0;
            var clean_percentage_points=0;
            DataService.GetDockingStationKPIDetails($scope.details).then(function (response)
            {
                for(var i = 0; i<response.data.length; i++)
                {
                    _docking_station_clean_count += response.data[i].cleanCount;
                }
                /*clean_percentage_value = ((_docking_station_clean_count)/(_no_of_days * Number_of_DockingStations) * 100).toFixed(2);*/
                clean_percentage_value = ((_docking_station_clean_count)/(_no_of_days * 48) * 100).toFixed(2);

                if(clean_percentage_value >= 100)
                {
                    clean_percentage_points = 10;
                }
                else if (clean_percentage_value >= 50 && clean_percentage_value < 75)
                {
                    clean_percentage_points =5;
                }
                else if (clean_percentage_value >= 25 && clean_percentage_value < 50)
                {
                    clean_percentage_points =-5;
                }
                else if (clean_percentage_value <= 25)
                {
                    clean_percentage_points =-10;
                }
                else
                {
                    clean_percentage_value = 0;
                    clean_percentage_points = 0;
                }

                $scope.KPIStationClean={
                    CleanValue:clean_percentage_value + "%",
                    CleanPoints:clean_percentage_points
                };

                stationCleanValue = clean_percentage_value;
                docking_hub_clean_report = clean_percentage_points;

                if (!response.error)
                {
                    growl.success(response.message);
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });

            // get average cycle use per cycle per day
            var _No_of_trips;
            var _No_of_cycles_required;
            var total_trips=0;
            var total_cycles=0;
            var trip_percentage;
            var trip_points;
            DataService.GetCycleUsagePerDay($scope.details).then(function (response)
            {
                for(var i=0;i<response.data.length;i++)
                {
                    _No_of_trips = response.data[i].noOfTrips;
                    _No_of_cycles_required = response.data[i].requiredNoOfCycles;

                    total_trips += _No_of_trips;
                    total_cycles += _No_of_cycles_required;
                }

                trip_percentage = ((total_trips/total_cycles)*100).toFixed(2);

                if(trip_percentage >= 3)
                {
                    trip_points = 10;
                }
                else if(trip_percentage < 3)
                {
                    trip_points = -10;
                }
                else
                {
                    trip_percentage = 0;
                    trip_points = 0;
                }


                $scope.CycleTrips={
                    trip_value:trip_percentage + "%",
                    trip_points:trip_points
                }

                average_cycle_per_day_value = trip_percentage;
                average_cycle_per_day_report = trip_points;

                if (!response.error)
                {
                    growl.success(response.message);
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });


            // Website Downtime
            var _duration=0;
            var final_value = 0;
            var downtime_points;
            DataService.GetWebsiteDownTimeDetails($scope.details).then(function (response)
            {
                for(var i=0;i<response.data.length;i++)
                {
                    _duration += response.data[i].duration;
                }

                final_value = 100 - ( _duration * 100) / (_no_of_days * 24* 60)

                if(final_value > 98)
                {
                    downtime_points = 10;
                }
                else if(final_value > 95 && final_value <= 98)
                {
                    downtime_points = 5;
                }
                else if(final_value > 90 && final_value <= 95)
                {
                    downtime_points = -5;
                }
                else if(final_value <= 90 )
                {
                    downtime_points = -10;
                }
                else
                {
                    final_value = 0;
                    downtime_points = 0;
                }


                $scope.WebsiteDownTime={
                    downTime_value:final_value + "%",
                    downTime_points:downtime_points
                }

                websiteDowntimeValue = final_value;
                website_down_time_report = downtime_points;

                if (!response.error)
                {
                    growl.success(response.message);
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });



            // customer complaints
            var _total_complaints=0;
            var _total_complaint_points;
            $scope.details.complaintType=2;
            $scope.CustomerComplaints = [];
            DataService.getTickets($scope.details).then(function (response)
            {
                if (!response.error)
                {
                    /* var _complaintType=0;*/
                    var _count=0;
                    $scope.CustomerComplaints = response.data;
                    for(var i=0;i<response.data.length;i++)
                    {
                        var _complaintType = response.data[i].complaintType;
                        var _channel= response.data[i].channel;
                        if(_channel == 1)
                        {
                           /* if(_complaintType == 2)*/
                            if(_complaintType == 1)
                            {
                                _total_complaints ++;
                            }
                        }
                    }

                    if(_total_complaints < 5)
                    {
                        _total_complaint_points = 10;
                    }
                    else if(_total_complaints >5 && _total_complaints <= 10)
                    {
                        _total_complaint_points = 5;
                    }
                    else if(_total_complaints>10 && _total_complaints<=15)
                    {
                        _total_complaint_points = -5;
                    }
                    else if(_total_complaints > 15)
                    {
                        _total_complaint_points = -10;
                    }
                    else
                    {
                        _total_complaints = 0;
                        _total_complaint_points = 0;
                    }
                    $scope.CustomerComplaints={
                        complaints:_total_complaints,
                        points:_total_complaint_points
                    };

                    customerComplaintsValue = _total_complaints;
                    customer_valid_complaints_report = _total_complaint_points;

                    growl.success(response.message);
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });

            // cycle repaired within the duration of 4 hours
            var cycle_repaired_value;
            var cycle_repaired_ponits;
            $scope.CycleRepair = [];
            DataService.getTickets().then(function (response)
            {
                if (!response.error)
                {
                    var _cycle_repaire_count=0;
                    var _cycle_repaire_value=0;
                    var _cycle_repaire_points;
                    var _closed_duration = 0;
                    $scope.CycleRepair = response.data;
                    for(var i=0;i<response.data.length;i++)
                    {
                        var _complaintType = response.data[i].tickettype;
                        var _status = response.data[i].status;
                        var _duration = response.data[i].closedDuration;
                        if(_complaintType == 'Cycle Repaire')
                        {
                            _cycle_repaire_count ++;

                            if(_status == 'close')
                            {
                                _closed_duration += _duration;
                            }
                        }
                    }
                    /* alert(_cycle_repaire_count);*/
                    if(_closed_duration <240)
                    {
                        _cycle_repaire_value = (_closed_duration/_cycle_repaire_count)*100;
                    }
                    else
                    {
                        _cycle_repaire_value = 0;
                        _cycle_repaire_points = 0;
                    }

                    if(_cycle_repaire_value > 98)
                    {
                        _cycle_repaire_points = 10;
                    }
                    else if(_cycle_repaire_value >95 && _cycle_repaire_value <= 98)
                    {
                        _cycle_repaire_points = 5;
                    }
                    else if(_cycle_repaire_value < 95 && _cycle_repaire_value >= 90)
                    {
                        _cycle_repaire_points = -5;
                    }
                    else if(_cycle_repaire_value <= 90)
                    {
                        _cycle_repaire_points = -10;
                    }
                    else
                    {
                        _cycle_repaire_value = 0;
                        _cycle_repaire_points = 0;
                    }
                    $scope.CycleRepair={
                        repaire:_cycle_repaire_value,
                        points:_cycle_repaire_points
                    };

                        cycle_repair_withinFourHours_report = _cycle_repaire_points;

                    growl.success(response.message);
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description);*/
            });
        }
    }]);

    app.controller('KpiReportPrint', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {

        $scope.KpiReportPrintDetails={
            fromdate:kpi_from_date,
            todate:kpi_to_date,
            points:kpi_points,
            complaints_value:customerComplaintsValue,
            complaints:customer_valid_complaints_report,
            websiteDownTimevalue: websiteDowntimeValue,
            websiteDowntime:website_down_time_report,
            smartcardAtHubValue:smartcard_at_hub_value,
            smartcardAtHub:percentage_points_at_hub,
            smartcardAtKioskValue:smartcard_at_kiosks_value,
            smartcardAtKiosks:smart_card_points_at_kisok,
            stationCleanvalue:stationCleanValue,
            stationClean:docking_hub_clean_report,
            cycleRepairvalue:cycleRepairValue,
            cycleRepair:cycle_repair_withinFourHours_report,
            cycleAt6amValue:cycleFleetValue,
            cycleAt6am:fleet_points_report,
            majorpeek_value:majorEmptyPeekValue,
            majorpeak:majorEmptyPeekPoints,
            majoroffpeek_value:majorEmptyOffPeekValue,
            majoroffpeak:majorEmptyOffpeekPoints,
            minorpeek_value:minorEmptyPeekValue,
            minorpeak:minorEmptyPeekPoints,
            minoroffpeek_value:minorEmptyOffPeekValue,
            minoroffpeak:monirEmptyOffpeekPoints,
            emptyfullValue:EmptyFullValue,
            emptyfull:stationEmptyFull,
            cyclePerDayValue:average_cycle_per_day_value,
            cyclePerDay:average_cycle_per_day_report
        };

        $scope.myFun = function ()
        {
            window.print();
        };

    }]);


    // dash board details
    app.controller('Details', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {
        $scope.daywiseCollection={
            fromdate:'',
            todate:'',
            location:'',
            transactionType:''
        };

        $scope.RegDetails =[];

        $scope.RegDetails = function ()
        {
            DataService.SendDaywiseCashCollectionDetails($scope.daywiseCollection).then(function (response) {
                if (!response.error)
                {
                    _daywise_fromDate=$scope.daywiseCollection.fromdate;
                    _daywise_toDate=$scope.daywiseCollection.todate;
                    _location=$scope.daywiseCollection.location.location;
                    _transaction_type=$scope.daywiseCollection.transactionType;

                    $scope.RegDetails = response.data;

                    var _ccAvenuRegCount = 0;
                    var _totalRegistrations =0;
                    var _registration_center_cash =0;     // our registation centers
                    var _mysuru_one_cash =0;


                    for(var i =0;i<response.data.length;i++)
                    {
                     if(response.data[i].credit == 360)
                     {
                         _ccAvenuRegCount ++;
                     }
                     if(response.data[i].memberId.status == 1)
                     {
                         if(response.data[i].memberId.securityDeposit == 250)
                         {
                             _totalRegistrations ++;
                         }
                     }
                     if(response.data[i].paymentMode == "Cash")
                     {
                         _registration_center_cash ++;
                     }
                        if(response.data[i].paymentMode == "mone-cash")
                        {
                            _mysuru_one_cash ++;
                        }
                    }
                    $scope.OnlineCount = _onlineCount;
                    $scope.TotalRegistration = _totalRegistrations;
                    $scope.RegistationCenterCash = _registration_center_cash;
                    $scope.MysuruOneCash = _mysuru_one_cash;

                    DayWise=response.data;

                    $scope.RegDetailsTable = new NgTableParams(
                        {
                            count: 20,
                            nopager:true,
                        },
                        {
                            getData: function ($defer, params) {
                                var orderedData = params.filter() ? $filter('filter')($scope.RegDetails, params.filter()) : $scope.RegDetails;
                               /* params.total(orderedData.length);*/
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        }
                    );
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.RegistrationCenters=[];

        DataService.getRegistrationCentres().then(function (response)
            {
                if (!response.error)
                {
                    $scope.RegistrationCenters = response.data;
                } else
                {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedRegistrationCenters = function (data) {
            $scope.daywiseCollection.location = data;
        };

        $scope.SelectedTransaction = function (data) {
            $scope.daywiseCollection.transactionType = data;
        };

    }]);



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
                    //smartCard.cardLevel = StatusService.getCardLevel(smartCard.cardLevel);
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
            cardRFID:''/*,
            cardType: '',
            cardLevel: ''
*/        };

        $scope.addSmartCard = function () {
           /* $scope.smartCard.cardLevel = parseInt($scope.smartCard.cardLevel);
            $scope.smartCard.cardType = parseInt($scope.smartCard.cardType);*/
            DataService.saveSmartCard($scope.smartCard).then(function (response) {
                login_email;
                if (!response.error) {
                    growl.success(response.message);
                    $state.go('admin.smart-cards.edit', {'id': response.data._id});
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
               // $scope.smartCard.cardLevel = StatusService.getCardLevel($scope.smartCard.cardLevel);
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description);
        });

        $scope.updateSmartCard = function () {
           /* $scope.smartCard.cardType = StatusService.getCardTypeToNum($scope.smartCard.cardType);*/
           /* $scope.smartCard.cardLevel = StatusService.getCardLevelToNum($scope.smartCard.cardLevel);*/
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


    app.controller('InternalStationManage', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {

        $scope.InternalStations =[];

        DataService.getInternalStations().then(function (response) {
            if (!response.error)
            {
                growl.success(response.message);
                $scope.InternalStations = response.data;
                $scope.internalStationsTable = new NgTableParams(
                    {
                        count: 10
                    },
                    {
                        getData: function ($defer, params) {
                            var orderedData = params.filter() ? $filter('filter')($scope.InternalStations, params.filter()) : $scope.InternalStations;
                            params.total(orderedData.length);
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                );
            }
            else
            {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        })

        $scope.addNewInternalStations = function () {
            $state.go('admin.internal-stations.add');
        };
    }]);

    app.controller('InternalStationAdd', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {

        $scope.internalStationsDetails = {
            name: '',
            type:'',
            gpsCoordinates: {
                latitude: '',
                longitude: ''
            }

        };

        $scope.SaveInternalStations = function () {
            DataService.saveInternalstaions($scope.internalStationsDetails).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    /* $state.go('admin.holding-areas.edit', {'id': response.data._id});*/
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.cancelAddInternalStations = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.internal-stations.manage');
            });
        };
    }]);


    app.controller('FleetsManage', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', 'StatusService','$stateParams', '$uibModal', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, StatusService,$stateParams,$uibModal)
    {
        $scope.FleetsAreas = [];

        DataService.getFleetAreas().then(function (response) {
            if (!response.error) {
                for(var i=0;i<response.data.length;i++)
                {
                    $scope.FleetsAreas.push(response.data[i]);
                }
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.FleetsTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.FleetsAreas, params.filter()) : $scope.FleetsAreas;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.editFleets = function (_id) {
            $state.go('admin.fleets.edit', {'id': _id});
        };

        $scope.addNewFleets = function () {
            $state.go('admin.fleets.add');
        };

    }]);

    app.controller('FleetsAdd', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {

        $scope.fleetDetails = {
            Name: '',
            portCapacity:'',
            StationId:''
        };

        $scope.SaveFleetDetails = function () {
            DataService.saveFleets($scope.fleetDetails).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    /* $state.go('admin.holding-areas.edit', {'id': response.data._id});*/
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.FleetStations = [];

        DataService.getFleetsStations().then(function (response)
            {
                if (!response.error)
                {
                    $scope.FleetStations = response.data;
                } else
                {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedFleetStation =function(data){
            $scope.fleetDetails.StationId=data.StationID;
        };

        $scope.cancelAddNewFleets = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.fleets.manage');
            });
        };
    }]);

    app.controller('EditFleets', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$uibModal','$filter', 'NgTableParams', function ($scope, $state, $stateParams, DataService, growl, sweet, $uibModal, $filter, NgTableParams)
    {

        $scope.edit_Fleets = {};

        DataService.getFleet($stateParams.id).then(function (response) {
            if (!response.error)
            {
                $scope.edit_Fleets = response.data;
            }
            else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.message);
        });

        $scope.cancelUpdateFleets = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.fleets.manage');
            });
        };

    }]);

    app.controller('ManageReports', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter) {
        $scope.stations = {};

        DataService.getStationsCount().then(function (response) {
            if (!response.error) {
                $scope.stations.count = response.data;
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.message);
        })

    }]);

    app.controller('MonitorTransactions', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', 'StatusService', '$uibModal', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, StatusService, $uibModal)
    {
        var filters = {
            filter: {
                populate: {path: 'bicycle fromPort member'}
            }
        };
        $scope.transactions = [];

        DataService.getAllMemberTransactions(filters).then(function (response) {
            if (!response.error) {
                $scope.transactions = response.data;
                //var ToDate = transaction.toPort;
                $scope.transactions.forEach(function (transaction) {
                    transaction.vehicleNumber = transaction.vehicle.vehicleNumber;
                    $scope.SmartCard = transaction.user.cardNum;
                    transaction.Name = transaction.user.Name+ ' ' + transaction.user.lastName;
                    transaction.checkOutTime = new Date(transaction.checkOutTime);
                    //transaction.checkOutTime = transaction.checkOutTime.toLocaleDateString();
                    if (transaction.checkInTime!='-') {
                        transaction.checkInTime = new Date(transaction.checkInTime);
                        //transaction.checkInTime = transaction.checkInTime.toLocaleDateString();
                    }
                    //transaction.status = StatusService.getTransactionStatus(transaction.status);
                });
                $scope.transactionsTable.reload();
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.message);
        });

        $scope.loadTransactions = function () {
            $state.reload();
        };

        $scope.transactionsTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    params.total($scope.transactions.length);
                    $defer.resolve($scope.transactions.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.transactionDetails = function (data) {
            return $uibModal.open({
                templateUrl: 'transaction-details-modal.html',
                controller: 'TransactionDetails',
                size: 'md',
                resolve: {
                    transactionId: function () {
                        return data;
                    }
                }
            });
        };

        $scope.closeTransaction = function (data) {
            return $uibModal.open({
                templateUrl: 'close-transaction-modal.html',
                controller: 'CloseTransaction',
                size: 'md',
                resolve: {
                    transactionId: function () {
                        return data;
                    }
                }
            });
        };

    }]);

    /*Accounts*/
    var _from_date;
    var _to_date;
    var _loc;
    var CashCollections =[];
    app.controller('CashCollectionSummary', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter, $uibModal)
    {
        $scope.cashCollection={
            fromdate:'',
            todate:'',
            location:''
        };

            $scope.TableWithRegistration = false;
            $scope.TableWithOutRegistration = false;

            $scope.sendDetails = function ()
            {
                if ($scope.cashCollection.location == "" ||$scope.cashCollection.location == null || $scope.cashCollection.location == 'All')
                {
                    $scope.TableWithRegistration = false;
                    $scope.TableWithOutRegistration = true;
                    $scope.cashBalance = [];
                    DataService.SendCashCollectionDetails1($scope.cashCollection).then(function (response)
                    {
                        if (!response.error) {
                            $scope.cashBalance = response.data;

                            _from_date = $scope.cashCollection.fromdate;
                            _to_date = $scope.cashCollection.todate;
                            _loc = $scope.cashCollection.location;
                            CashCollections = response.data;

                            $scope.CashBalanceTable = new NgTableParams(
                                {
                                    count: 10
                                },
                                {
                                    getData: function ($defer, params) {
                                        var orderedData = params.filter() ? $filter('filter')($scope.cashBalance, params.filter()) : $scope.cashBalance;
                                        params.total(orderedData.length);
                                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                                    }
                                }
                            );
                           /* $scope.cashCollection.fromdate = '';
                            $scope.cashCollection.todate='';*/
                            growl.success(response.message);
                        } else {
                            growl.error(response.message);
                        }
                    }, function (response) {
                        growl.error(response.data.description['0']);
                    });
                }

                else
                    {
                        $scope.TableWithRegistration = true;
                        $scope.TableWithOutRegistration = false;
                    $scope.CashCollection = [];

                        DataService.SendCashCollectionDetails($scope.cashCollection).then(function (response)
                        {
                            if (!response.error)
                            {
                                $scope.CashCollection = response.data;

                                CashCollections=response.data;
                                 _from_date=$scope.cashCollection.fromdate;
                                 _to_date=$scope.cashCollection.todate;
                                 _loc=$scope.cashCollection.location;
                                var CashCollection = response.data;
                                $scope.cashCollectionTable = new NgTableParams(
                                    {
                                        count: 10
                                    },
                                    {
                                        getData: function ($defer, params) {
                                            var orderedData = params.filter() ? $filter('filter')($scope.CashCollection, params.filter()) : $scope.CashCollection;
                                            params.total(orderedData.length);
                                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                                        }
                                    }
                                );
                                growl.success(response.message);
                            } else {
                                growl.error(response.message);
                            }
                        }, function (response) {
                            growl.error(response.data.description['0']);
                        })

                }
            };

        $scope.RegistrationCenters=[];

        DataService.getRegistrationCentres().then(function (response)
            {
                if (!response.error)
                {
                    $scope.RegistrationCenters = response.data;
                } else
                {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedRegistrationCenters = function (data) {
            $scope.cashCollection.location = data.location;
        };
    }]);

    app.controller('CashCollectionSummaryPrint', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter','$window', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter,$window, $uibModal)
    {
        $scope.cashCollectionSummeryInputs=
            {
                cashCollectionfromdate:_from_date,
                cashCollectiontodate:_to_date,
                cashCollectionlocation:_loc,
            };

        $scope.CashCollectionSummaryWithOutRegistrationCentre = false;
        $scope.CashCollectionSummaryWithRegistrationCentre = false;

        if ($scope.cashCollectionSummeryInputs.cashCollectionlocation == '' || $scope.cashCollectionSummeryInputs.cashCollectionlocation == null || $scope.cashCollectionSummeryInputs.cashCollectionlocation == undefined)
        {
            $scope.CashCollectionSummaryWithOutRegistrationCentre = true;

            $scope.cashCollectionSummaryPrint=[];

            $scope.cashCollectionSummaryPrint=CashCollections;

            $scope.CashCollectionSummaryPrintTable = new NgTableParams(
                {
                    count: 500,
                    noPager: true
                },
                {
                    getData: function ($defer, params) {
                        var orderedData = params.filter() ? $filter('filter')($scope.cashCollectionSummaryPrint, params.filter()) : $scope.cashCollectionSummaryPrint;
                        /*params.total(orderedData.length);*/
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }
            );
        }

        else
        {
            $scope.CashCollectionSummaryWithRegistrationCentre = true;

            $scope.cashCollectionSummaryPrintWithReg=[];

            $scope.cashCollectionSummaryPrintWithReg=CashCollections;

            $scope.CashCollectionSummaryPrintWithRegTable = new NgTableParams(
                {
                    count: 500,
                    noPager: true
                },
                {
                    getData: function ($defer, params) {
                        var orderedData = params.filter() ? $filter('filter')($scope.cashCollectionSummaryPrintWithReg, params.filter()) : $scope.cashCollectionSummaryPrintWithReg;
                        /*params.total(orderedData.length);*/
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }
            );
        }


        $scope.myFun = function ()
        {
            window.print();
        };

        $scope.myFun = function ()
        {
            window.print();
        };

    }]);

    var DayWise=[];
    var _daywise_fromDate;
    var _daywise_toDate;
    var _location;
    var _transaction_type;
    app.controller('dayWiseCollectionSummary', ['$scope', '$state','DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter, $uibModal)
    {
        $scope.daywiseCollection={
            fromdate:'',
            todate:'',
            location:'',
            transactionType:''
        };


        $scope.daywises =[];

        $scope.sendDaywiseDetails = function ()
        {
            DataService.SendDaywiseCashCollectionDetails($scope.daywiseCollection).then(function (response) {
                if (!response.error)
                {
                _daywise_fromDate=$scope.daywiseCollection.fromdate;
                _daywise_toDate=$scope.daywiseCollection.todate;
                _location=$scope.daywiseCollection.location.location;
                _transaction_type=$scope.daywiseCollection.transactionType;

                 $scope.daywises = response.data;

                 $scope.TotalCount = response.data.length;

                 DayWise=response.data;

                  $scope.daywiseTable = new NgTableParams(
                        {
                            count: 20
                        },
                        {
                            getData: function ($defer, params) {
                                var orderedData = params.filter() ? $filter('filter')($scope.daywises, params.filter()) : $scope.daywises;
                                params.total(orderedData.length);
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        }
                    );
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.RegistrationCenters=[];

        DataService.getRegistrationCentres().then(function (response)
            {
                if (!response.error)
                {
                    $scope.RegistrationCenters = response.data;

                } else
                {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedRegistrationCenters = function (data) {
            $scope.daywiseCollection.location = data;
        };

        $scope.SelectedTransaction = function (data) {
            $scope.daywiseCollection.transactionType = data;
        };
    }]);

    // daywise-collection summary report print
    app.controller('DaywsieCollectionSummaryReportPrint', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter','$window', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter,$window, $uibModal)
    {
        $scope.daywiseCollectionSummaryInput=
            {
                DayWisefromdate:_daywise_fromDate,
                DayWisetodate:_daywise_toDate,
                DayWiselocation:_location,
                DayWiseTransactionType:_transaction_type
            };

        $scope.DayWiseSummaryPrint=[];
        $scope.DayWiseSummaryPrint=DayWise;

        $scope.DayWiseCollectionSummaryPrintTable = new NgTableParams(
            {
                count: 5000,
                noPager: true
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.DayWiseSummaryPrint, params.filter()) : $scope.DayWiseSummaryPrint;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.myFun = function ()
        {
            window.print();
        };

    }]);

    app.controller('refundsSummary', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter, $uibModal)
    {
        $scope.RegistrationCenters=[];

        $scope.refundDetails={
            fromDate:'',
            toDate:'',
            RegCenter:''
        };

        DataService.getRegistrationCentres().then(function (response)
            {
                if (!response.error)
                {
                    $scope.RegistrationCenters = response.data;
                } else
                {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedRegistrationCenters = function (data) {
            $scope.refundDetails.RegCenter = data.location;
        };


    }]);


    var _totalcash_fromdate;
    var _total_cash_todate;
    var _totalcash_location;
    var TotalCash =[];
    app.controller('totalCashReport', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter','$window', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter,$window, $uibModal)
    {
        $scope.totalCashInput=
        {
            fromdate:'',
            todate:'',
            location:''
        };

        $scope.cashTotals =[];

        $scope.sendTotalCashDetails = function ()
        {
            DataService.SendTotalCashCollectionDetails($scope.totalCashInput).then(function (response) {
                if (!response.error)
                    {
                   /* growl.success(response.message);*/
                        _totalcash_fromdate=$scope.totalCashInput.fromdate;
                        _total_cash_todate=$scope.totalCashInput.todate;
                        _totalcash_location=$scope.totalCashInput.location;
                    $scope.cashTotals = response.data;

                        TotalCash = response.data;

                        $scope.totalCashTable = new NgTableParams(
                        {
                            count: 30
                        },
                        {
                            getData: function ($defer, params) {
                                var orderedData = params.filter() ? $filter('filter')($scope.cashTotals, params.filter()) : $scope.cashTotals;
                                params.total(orderedData.length);
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        }
                    );
                    }
                    else
                    {
                    growl.error(response.message);
                    }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.RegistrationCenters=[];

        DataService.getRegistrationCentres().then(function (response)
            {
                if (!response.error)
                {
                    $scope.RegistrationCenters = response.data;
                } else
                {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedRegistrationCenters = function (data) {
            $scope.totalCashInput.location = data.location;
        };

    }]);


    app.controller('totalCashReportPrint', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter','$window', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter,$window, $uibModal)
    {
        $scope.totalCashPrintInput=
        {
            TotalCashfromdate:_totalcash_fromdate,
            TotalCashtodate:_total_cash_todate,
            TotalCashlocation:_totalcash_location
        };

        $scope.TotalCashPrint=[];
        $scope.TotalCashPrint=TotalCash;

       /* $scope.totalCashTable =$scope.New1;*/


        $scope.totalCashTable = new NgTableParams(
                        {
                            count: 500,
                            noPager: true
                        },
                        {
                            getData: function ($defer, params) {
                                var orderedData = params.filter() ? $filter('filter')($scope.TotalCashPrint, params.filter()) : $scope.TotalCashPrint;
                              /*params.total(orderedData.length);*/
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        }
                    );

        $scope.myFun = function ()
        {
             window.print();
        };
        $scope.myFun1 = function ()
        {
            $state.go('admin.accounts.totalcash-report');
        };
    }]);

    // bank cash deposit deposit report print
    app.controller('BankCashDepositReportPrint', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter','$window', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter,$window, $uibModal)
    {
        $scope.bankCashDepositInput=
            {
                bankCashDepositfromdate:_bankcashdeposit_fromdate,
                bankCashDeposittodate:_bankcashdeposit_todate,
                bankCashDepositlocation:_bankcashdeposit_location,
            };

        $scope.BankCashDepositPrint=[];
        $scope.BankCashDepositPrint=BankcashDeposit;

        $scope.BankCashDepositPrintTable = new NgTableParams(
            {
                count: 500,
                noPager: true
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.BankCashDepositPrint, params.filter()) : $scope.BankCashDepositPrint;
                    /*params.total(orderedData.length);*/
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.myFun = function ()
        {
            window.print();
        };

    }]);

    var _clean_from_date;
    var _clean_to_date;
    var StationCleanData = [];
    app.controller('DockingStationCleanReport', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter','$window', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter,$window, $uibModal)
    {
        $scope.hubsCleaningDetails ={
            fromdate:'',
            todate:''
        }

        $scope.DockingStationCleanReport=[];

        $scope.sendHubsCleaningDetails =function () {
            DataService.getDockingStationCleaningDetails($scope.hubsCleaningDetails).then(function (response) {
                if (!response.error) {
                    _clean_from_date =$scope.hubsCleaningDetails.fromdate;
                    _clean_to_date =$scope.hubsCleaningDetails.todate;
                    StationCleanData= response.data;
                    for(var i=0;i<response.data.length;i++)
                    {
                        $scope.DockingStationCleanReport.push(response.data[i]);
                    }
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });
        }

        $scope.CleanReportTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    params.total($scope.DockingStationCleanReport.length);
                    $defer.resolve($scope.DockingStationCleanReport.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

    }]);


    app.controller('AddDockingStationClean', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter','$window', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter,$window, $uibModal)
    {
        $scope.dockingStationCleanInput={
            stationId:'',
            cleaneddate:'',
            fromtime:'',
            totime:'',
            empId:'',
            description:'',
            createdBy:_login_id,
        };

        $scope.addDockingStationClean = function () {
            DataService.saveDockingStationCleaning($scope.dockingStationCleanInput).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                   /* $state.go('admin.registration-centres.edit', {'id': response.data._id});*/
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.dockingStationSelections = [];

        DataService.getDockingStations().then(function (response) {
                if (!response.error) {

                    $scope.dockingStationSelections = response.data;
                }
                else {
                    growl.error(response.message)
                }
            },
            function(response)
            {
                growl.error(response.data);
            });

        $scope.selectedDockingStation = function (data) {
            $scope.dockingStationCleanInput.stationId = data._id;
        };

        $scope.employeeSelections = [];

        DataService.getStaffs().then(function (response) {
                if (!response.error) {

                    $scope.employeeSelections = response.data;
                }
                else {
                    growl.error(response.message)
                }
            },
            function(response)
            {
                growl.error(response.data);
            });

        $scope.selectedEmployee = function (data) {
            $scope.dockingStationCleanInput.empId = data.id;
        };

        $scope.cancelAddDockingStationCleaning = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.maintenance.manage-view');
            });
        };


        $scope.dockingStationCleanReport = function () {
            $state.go('admin.maintenance.dockingstationcleaning-report');
        };

    }]);

    app.controller('AddDockingStationCleanReport', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter','$window', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter,$window, $uibModal)
    {
        $scope.dockingStationCleaningInputs={
            cleanFromDate:'',
            cleanToDate:'',
            dockingStation:''
        };

        $scope.sendDockingStationCleaningDetails = function () {
            DataService.getDockingStationCleaningDetails($scope.dockingStationCleaningInputs).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.dockingStationSelections = [];

        DataService.getDockingStations().then(function (response) {
                if (!response.error) {
                    $scope.dockingStationSelections = response.data;
                }
                else {
                    growl.error(response.message)
                }
            },
            function(response)
            {
                growl.error(response.data);
            });

        $scope.selectedDockingStation = function (data) {
            $scope.dockingStationCleaningInputs.dockingStation = data.name;
        };

            $scope.dockingStationCleaningReportPrint = function () {
            $state.go('admin.maintenance.dockingstationcleaning-report-print');
        };
    }]);

    app.controller('DockingStationCleanReportPrint', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter','$window', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter,$window, $uibModal)
    {
        $scope.cleanInputsDetails={
            from_date:_clean_from_date,
            to_date:_clean_to_date
        };

       $scope.StationCleanPrint =[];
        $scope.StationCleanPrint = StationCleanData;

        $scope.StationCleanPrintTable = new NgTableParams(
            {
                count: 500,
                noPager: true
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.StationCleanPrint, params.filter()) : $scope.StationCleanPrint;
                    /*params.total(orderedData.length);*/
                    /*$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));*/
                }
            }
        );

        $scope.Print = function ()
        {
            window.print();
        };
    }]);


var _station_name;
var _station_id;
    app.controller('DockingStationStationNewDesign', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet','$window', '$uibModal','$filter', 'NgTableParams', function ($scope, $state, $stateParams, DataService, growl, sweet,$window, $uibModal, $filter, NgTableParams)
    {
        $scope.dockingStations = [];

        DataService.getDockingStations().then(function (response) {
                if (!response.error)
                {
                    $scope.dockingStations = response.data;
                   /* _No_of_DockingStations =  $scope.dockingStations.length;*/
                    for(var i=0;i<response.data.length;i++)
                    {
                       /* _station_name = response.data[i].name;
                        _station_id= response.data[i]._id;*/
                    }
                }
                else {
                    growl.error(response.message)
                }
            },
            function(response)
            {
                growl.error(response.data);
            });


        $scope.getVal=function(event){
            _station_id=event.currentTarget.value;
            _station_name = event.currentTarget.name;
            $scope.AddDockingStationCleanDetails();
        }


        $scope.AddDockingStationCleanDetails = function (size) {
            $uibModal.open({
                templateUrl: 'docking-station-clean.html',
                controller: 'DockingStationStationNewDesign1',
                size: size,
                resolve: {
                    items: function () {
                    }
                }
            });
        };

    }]);

    app.controller('DockingStationStationNewDesign1', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter','$window', '$uibModal','$uibModalInstance', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter,$window, $uibModal,$uibModalInstance)
    {
        $scope.loginid=localStorage.LoginID;
        var _logIn_Id=$scope.loginid;

        $scope.dockingStationCleanInput={
            stationId:_station_name,
            stationIdnew:_station_id,
            cleaneddate:'',
            fromtime:'',
            totime:'',
            empId:'',
            description:'',
            createdBy:_logIn_Id,
        };

        $scope.addDockingStationClean = function () {
            DataService.saveDockingStationCleaning($scope.dockingStationCleanInput).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        /*$scope.employeeSelections = [];

      DataService.getStaffs().then(function (response) {
                if (!response.error) {

                    $scope.employeeSelections = response.data;
                }
                else {
                    growl.error(response.message)
                }
            },
            function(response)
            {
                growl.error(response.data);
            });*/

        $scope.Department = "mcstaff";

        $scope.EmployeeSelections = [];

        DataService.getEmp($scope.Department).then(function (response) {
            if (!response.error) {
                $scope.EmployeeSelections = response.data;
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.selectedEmployee = function (data) {
            $scope.dockingStationCleanInput.empId = data._id;
        };

        $scope.cancelAddNewDocknckingStationClean = function () {
            $uibModalInstance.dismiss();
        };

    }]);

    // Bicycle Maintenance Manage
    app.controller('BicycleMaintenanceManage', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter','$window', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter,$window, $uibModal)
    {

    }]);

    // bicycle Maintenance Report
    app.controller('BicycleMaintenanceReport', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter','$window', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter,$window, $uibModal)
    {
        $scope.bicyleMaintenanceInputs={
          from_date:'',
            to_date:''
        };

        $scope.sendBicyleMaintenanceInputs = function () {
            DataService.sendBicycleMaintenanceDetails($scope.bicyleMaintenanceInputs).then(function (response)
            {
                if (!response.error) {
                    growl.success(response.message);
                } else
                    {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.printBicycleMaintenanceReport = function () {
            $state.go('admin.maintenance.bicycle-maintenance.report-print');
        }
    }]);

    app.controller('BicycleMaintenanceReportPrint', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter','$window', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter,$window, $uibModal)
    {
        $scope.print = function ()
        {
            window.print();
        };

    }]);

    /*app.controller('BaskCashDeposits', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter, $uibModal)
    {

    }]);*/

    // Manage Members Controller
    app.controller('ManageBankCashDeposits', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', 'StatusService', '$uibModal', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, StatusService, $uibModal)
    {

        $scope.bankcashdepositsDetails = [];

        /*fetching registration center table details*/
        DataService.getBankCashDepositDetails().then(function (response) {
            if (!response.error) {
                $scope.bankcashdepositsDetails = response.data;
                $scope.bankcashdepositsDetails.forEach(function (bankCashDeposit)
                {
                    bankCashDeposit.status = StatusService.getRegistrationCentresStatus(bankCashDeposit.status);
                    bankCashDeposit.longitude = bankCashDeposit.gpsCoordinates.longitude;
                    bankCashDeposit.latitude = bankCashDeposit.gpsCoordinates.latitude;
                });
                $scope.bankCashDepositTable.reload();
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.bankCashDepositTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.bankcashdepositsDetails, params.filter()) : $scope.bankcashdepositsDetails;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );


        $scope.addNewRegistrationCentre = function () {
            $state.go('admin.registration-centres.add');
        };


        $scope.addNewBankCashDetails = function () {
            $state.go('admin.accounts.bankcashdeposits.add');
        };
    }]);


    // Mysuru one cash collection report
    app.controller('MysuruOneCashCollectionReport', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', 'StatusService', '$uibModal', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, StatusService, $uibModal)
    {
        $scope.cashCollectionInputs=
            {
                fromdate:'',
                todate:'',
                location:''
            };

        $scope.MoneCashCollections =[];

        $scope.sendCashCollectionDetails = function ()
        {
            DataService.SendTotalCashCollectionDetails($scope.cashCollectionInputs).then(function (response) {
                if (!response.error)
                {
                    $scope.MoneCashCollections = response.data;

                    TotalCash = response.data;

                    $scope.totalCashTable = new NgTableParams(
                        {
                            count: 10
                        },
                        {
                            getData: function ($defer, params) {
                                var orderedData = params.filter() ? $filter('filter')($scope.MoneCashCollections, params.filter()) : $scope.MoneCashCollections;
                                /*  params.total(orderedData.length);*/
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        }
                    );
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.RegistrationCenters=[];

        DataService.getMysuruRegistrationCentres().then(function (response)
            {
                if (!response.error)
                {
                    $scope.RegistrationCenters = response.data;
                } else
                {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedRegistrationCenters = function (data) {
            $scope.cashCollectionInputs.location = data.location;
        };


    }]);

    // Accounts Closer
    app.controller('AccountsCloser', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', 'StatusService', '$uibModal','$window', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, StatusService, $uibModal,$window)
    {
        $scope.loginid=localStorage.LoginID;
      /*  var _logIn_Id=$scope.loginid;*/

        $scope.AccountClosure = [];

        DataService.GetDayClosureDetails().then(function (response) {
            if (!response.error) {

                    $scope.AccountClosure.push(response.data);

                $scope.dayClosureDetails={
                    dateTime:response.data.dateTime,
                    bankDeposits:response.data.bankDeposits,
                    cashCollected:response.data.cashcollected,
                    openingBalance:response.data.openingBalance,
                    refunds:response.data.refunds,
                    closingBalance:response.data.closingBalance,
                    createdBy:$scope.loginid,
                    depositStatus:response.data.depositStatus
                };

                $scope.VerifyClosureDetails=function () {
                    DataService.saveDayClosureDetails($scope.dayClosureDetails).then(function (response) {
                        if (!response.error) {
                            /*$scope.isDisabled = true;*/
                            growl.success(response.message);
                            $window.location.reload();
                        } else {
                            growl.error(response.data.description);
                        }
                    }, function (response) {
                        growl.error(response.data.description);
                    })
                };

                $scope.accountClosureTable = new NgTableParams(
                    {
                        count: 10
                    },
                    {
                        getData: function ($defer, params) {
                            params.total($scope.AccountClosure.length);
                            $defer.resolve($scope.AccountClosure.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                );
                /*growl.success(response.message);*/
            } else {
                growl.error(response.data.description);
            }
        }, function (response) {
            growl.error(response.data.description);
        });

    }]);

    app.controller('AddBankCashDeposits', ['$scope', '$state', 'DataService', 'growl', 'sweet', function ($scope, $state, DataService, growl, sweet)
    {
        $scope.loginid=localStorage.LoginID;
        var _logIn_Id=$scope.loginid;

        $scope.bankCashDeposit =
        {
            cashCollectionDate:'',
            depositDate:'',
            amount:'',
            bankName:'',
            branch:'',
            transactionId:'',
            depositedBy:'',
            remarks:'',
            location:'',
            createdBy:_logIn_Id
        };


        $scope.addNewBankCashDetails = function () {
            DataService.saveBankCashDepositDetails($scope.bankCashDeposit).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.cancelAddBankCashDeposits = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'You may have unsaved data',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave!',
                closeOnConfirm: true
            }, function () {
                $state.go('admin.accounts.bankcashdeposits.manage');
            });
        };


        $scope.RegistrationCenters=[];

        DataService.getRegistrationCentres().then(function (response)
            {
                if (!response.error)
                {
                    for(var i=0;i<response.data.length;i++)
                    {
                        $scope.RegistrationCenters.push(response.data[i]);
                    }
                } else
                {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedRegistrationCenters = function (data) {
            $scope.bankCashDeposit.location = data.location;
        };

    }]);

    var _bankcashdeposit_fromdate;
    var _bankcashdeposit_todate;
    var _bankcashdeposit_location;
    var BankcashDeposit=[];
    app.controller('BankCashDepositReport', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', 'StatusService', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, $uibModal, StatusService)
    {

        $scope.bankDepositsInput=
        {
            fromdate:'',
            todate:'',
            location:''
        };

        $scope.bankDeposits =[];

        $scope.sendBankCaskDetails = function () {
            DataService.SendBankCashDepositDetails($scope.bankDepositsInput).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);

                    var _total_amount = 0;
                    for(var i=0;i<response.data.length;i++)
                    {
                        _total_amount += response.data[i].amount;
                    }
                    $scope.TotalAmountDeposited = _total_amount;

                    _bankcashdeposit_fromdate =$scope.bankDepositsInput.fromdate;
                    _bankcashdeposit_todate =$scope.bankDepositsInput.todate;
                    _bankcashdeposit_location = $scope.bankDepositsInput.location;

                    $scope.bankDeposits = response.data;

                    BankcashDeposit = response.data;

                    $scope.bankDepositsTable = new NgTableParams(
                        {
                            count: 10
                        },
                        {
                            getData: function ($defer, params) {
                                var orderedData = params.filter() ? $filter('filter')($scope.bankDeposits, params.filter()) : $scope.bankDeposits;
                                params.total(orderedData.length);
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        }
                    );

                }else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.MyFunction = function ()
        {
            window.print();
        };

        $scope.RegistrationCenters=[];

        DataService.getRegistrationCentres().then(function (response)
            {
                if (!response.error)
                {
                    $scope.RegistrationCenters = response.data;
                } else
                {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedRegistrationCenters = function (data) {
            $scope.bankDepositsInput.location = data.location;
        };

    }]);

    // User User Account
    var _smart_card_number;
    var UserAccounts =[];
    app.controller('UserAccountStatus', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', 'StatusService', '$uibModal', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, StatusService, $uibModal)
    {
        $scope.userTransactionDetials={
            userid:'',
            /*fromDate:'',
             toDate:''*/
        };

        $scope.Payments=[];

        $scope.transactionStatisticsDetails = function () {
            DataService.getMemberPaymentTransactionByCard($scope.userTransactionDetials.userid).then(function (response) {
                if (!response.error) {
                    _smart_card_number = $scope.userTransactionDetials.userid;
                    UserAccounts = response.data;
                    $scope.Payments=[];
                    for(var i=0;i<response.data.length;i++)
                    {
                        $scope.Payments.push(response.data[i]);
                    }
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

        $scope.memberPaymentTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.Payments, params.filter()) : $scope.Payments;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );


    }]);

    app.controller('UserAccountStatusReport', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', 'StatusService', '$uibModal', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, StatusService, $uibModal)
    {
        $scope.SmartCardNo=_smart_card_number;

        $scope.UserAccountDetails=[];
        $scope.UserAccountDetails=UserAccounts;

        $scope.UserAccountDetailsTable = new NgTableParams(
            {
                count: 500,
                noPager: true
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.UserAccountDetails, params.filter()) : $scope.UserAccountDetails;
                    /*params.total(orderedData.length);*/
                   /* $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));*/
                }
            }
        );

        $scope.myFun = function ()
        {
            window.print();
        };

    }]);

    // User Transcation Statistics
    var _smart_card_no;
    var UserRidess =[];
    app.controller('UserTransactionStatistics', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', 'StatusService', '$uibModal', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, StatusService, $uibModal)
    {
        $scope.userTransactionDetials={
            userid:'',
           /* fromDate:'',
            toDate:''*/
        };

        $scope.Rides = [];

        $scope.transactionStatisticsDetails =function () {
            DataService.getMemberRidesByCard($scope.userTransactionDetials.userid).then(function (response) {
                if (!response.error) {
                    _smart_card_no = $scope.userTransactionDetials.userid;
                    UserRidess = response.data;
                    $scope.Rides = [];
                    for(var i=0;i<response.data.length;i++)
                    {
                        $scope.Rides.push(response.data[i]);
                    }
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });
        }


        $scope.memberRidesTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.Rides, params.filter()) : $scope.Rides;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

    }]);

    app.controller('UserAccountStatusReportPrint', ['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', 'StatusService', '$uibModal', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, StatusService, $uibModal)
    {
        $scope.SmartCardNo=_smart_card_no;

        $scope.UserRidesDetails=[];
        $scope.UserRidesDetails=UserRidess;

        $scope.UserRidesDetailsTable = new NgTableParams(
            {
                count: 500,
                noPager: true
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.UserRidesDetails, params.filter()) : $scope.UserRidesDetails;
                    /*params.total(orderedData.length);*/
                    /* $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));*/
                }
            }
        );

        $scope.myFun = function ()
        {
            window.print();
        };
    }]);


    app.controller('registrationDetails', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter, $uibModal)
    {
        /*$scope.registrationDetails=[];*/

        $scope.registrationDetails = {
            FromDateRegDetails: '',
            ToDateRegDetails: '',
            RegCenters: ''
        };

        $scope.RegistrationCenters=[];

        DataService.getRegistrationCentres().then(function (response)
            {
                if (!response.error)
                {
                    $scope.RegistrationCenters = response.data;
                } else
                {
                    growl.error(response.message);
                }
            },
            function (response) {
                growl.error(response.message);
            });

        $scope.selectedRegistrationCenter = function (data) {
            $scope.registrationDetails.RegCenters = data.location;
        };

        $scope.sendDetails = function () {
            DataService.SendRegistrationDetails($scope.registrationDetails).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

    }]);



    // Smart Card Status Controller
    app.controller('TransactionDetails', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'transactionId', function ($scope, $state, DataService, growl, sweet, $uibModalInstance, transactionId) {

        $scope.transactionId = transactionId;

        DataService.getMemberTransaction($scope.transactionId).then(function (response) {
            if (!response.error) {
                $scope.transaction = response.data;
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.closeTransactionDetails = function () {
            $uibModalInstance.dismiss();
        };

    }]);

    // Close Transaction Controller
    app.controller('CloseTransaction', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$uibModalInstance', 'transactionId', function ($scope, $state, DataService, growl, sweet, $uibModalInstance, transactionId) {

        $scope.transactionData = {
            checkInDate: '',
            checkInTime: new Date(),
            hstep: 1,
            mstep: 1,
            ismeridian: '12H'
        };

        $scope.postTransaction = function () {
            var data = {
                checkInDate: $scope.transactionData.checkInDate,
                checkInTime: $scope.transactionData.checkInTime,
                cycleRFID: transactionId.bicycle.cycleRFID
            };
            console.log(data);
            DataService.postCloseTransaction(data).then(function (response) {
                if (!response.error) {
                    $uibModalInstance.dismiss();
                    growl.success(response.message);
                    $state.reload();
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });
        };

        $scope.closePostTransaction = function () {
            $uibModalInstance.dismiss();
        };

    }]);


    app.controller('SimulateCheckout', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter) {
        $scope.members = [];
        $scope.dockingStations = [];
        $scope.dockingUnits = [];
        $scope.dockingPorts = [];
        var bicycles = [];

        $scope.transaction = {
            member: '',
            cycleRFID: '',
            fromPort: '',
            cardNumber: '',
            checkOutTime: ''
        };

        DataService.getMembers().then(function (response) {
            if (!response.error) {
                $scope.members = response.data;
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        DataService.getDockingStations().then(function (response) {
            if (!response.error) {
                $scope.dockingStations = response.data;
            }
            else {
                growl.error(response.message);
            }
        });

        $scope.selectStationName = function (data) {
            $scope.dockingUnitIds = [];

            for (var i = 0; i < data.dockingUnitIds.length; i++) {
                $scope.dockingUnitIds.push(data.dockingUnitIds[i].dockingUnitId);
            }

            var filters = {
                filter: {where: {_id: {$in: $scope.dockingUnitIds}}}
            };

            DataService.getDockingUnits(filters).then(function (response) {
                if (!response.error) {
                    $scope.dockingUnits = response.data;
                }
            });
        };

        $scope.selectUnit = function (data) {
            $scope.dockingPortIds = [];

            for (var i = 0; i < data.dockingPortIds.length; i++) {
                $scope.dockingPortIds.push(data.dockingPortIds[i].dockingPortId);
            }

            var filters = {
                filter: {where: {_id: {$in: $scope.dockingPortIds}}}
            };

            DataService.getDockingPorts(filters).then(function (response) {
                if (!response.error) {
                    $scope.dockingPorts = response.data;

                    DataService.getBicycles().then(function (response) {
                        if (!response.error) {
                            bicycles = response.data;
                        } else {
                            growl.error(response.message);
                        }
                    }, function (response) {
                        growl.error(response.data.description['0']);
                    });
                }
            });
        };

        $scope.selectPort = function () {
            var bicycleRFID = '';
            $scope.dockingPorts.forEach(function (dockingPort) {
                if (dockingPort._id === $scope.transaction.fromPort) {
                    bicycleRFID = dockingPort.cycleRFID;
                }
            });
            bicycles.forEach(function (bicycle) {
                if (bicycle.cycleRFID === bicycleRFID) {
                    $scope.transaction.cycleRFID = bicycle.cycleRFID;
                }
            });
        };

        $scope.checkout = function () {
            $scope.members.forEach(function (member) {
                if (member._id === $scope.transaction.member) {
                    $scope.transaction.cardNumber = member.smartCardNumber;
                }
            });
            $scope.transaction.checkOutTime = new Date().toISOString();

            console.log($scope.transaction);
            DataService.saveMemberTransaction($scope.transaction).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            })
        };

    }]);

    app.controller('SimulateCheckin', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter) {
        $scope.memberTransactions = [];
        $scope.bicycles = [];
        $scope.dockingStations = [];
        $scope.dockingUnits = [];
        $scope.dockingPorts = [];
        var bicycles = [];
        var filters = {
            filter: {
                populate: {path: 'member'}
            }
        };

        $scope.transaction = {
            memberTransactionId: '',
            cycleRFID: '',
            toPort: '',
            cardNumber: '',
            checkInTime: ''
        };

        DataService.getAllMemberTransactions(filters).then(function (response) {
            if (!response.error) {
                $scope.memberTransactions = response.data;
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        DataService.getDockingStations().then(function (response) {
            if (!response.error) {
                $scope.dockingStations = response.data;
            }
            else {
                growl.error(response.message);
            }
        });

        $scope.selectTransaction = function () {
            $scope.memberTransactions.forEach(function (memberTransaction) {
                if (memberTransaction._id === $scope.transaction.memberTransactionId) {
                    $scope.transaction.cardNumber = memberTransaction.member.smartCardNumber;
                    $scope.transaction.cycleRFID = memberTransaction.bicycle.cycleRFID;
                }
            });
        };

        $scope.selectStationName = function (data) {
            $scope.dockingUnitIds = [];

            for (var i = 0; i < data.dockingUnitIds.length; i++) {
                $scope.dockingUnitIds.push(data.dockingUnitIds[i].dockingUnitId);
            }

            var filters = {
                filter: {where: {_id: {$in: $scope.dockingUnitIds}}}
            };

            DataService.getDockingUnits(filters).then(function (response) {
                if (!response.error) {
                    $scope.dockingUnits = response.data;
                }
            });
        };

        $scope.selectUnit = function (data) {
            $scope.dockingPortIds = [];

            for (var i = 0; i < data.dockingPortIds.length; i++) {
                $scope.dockingPortIds.push(data.dockingPortIds[i].dockingPortId);
            }

            var filters = {
                filter: {where: {_id: {$in: $scope.dockingPortIds}}}
            };

            DataService.getDockingPorts(filters).then(function (response) {
                if (!response.error) {
                    $scope.dockingPorts = response.data;

                    DataService.getBicycles().then(function (response) {
                        if (!response.error) {
                            bicycles = response.data;
                        } else {
                            growl.error(response.message);
                        }
                    }, function (response) {
                        growl.error(response.data.description['0']);
                    });
                }
            });
        };

        $scope.selectPort = function () {
            var bicycleRFID = '';
            $scope.dockingPorts.forEach(function (dockingPort) {
                if (dockingPort._id === $scope.transaction.toPort) {
                    bicycleRFID = dockingPort.cycleRFID;
                }
            });
        };

        $scope.checkin = function () {
            $scope.transaction.checkInTime = new Date().toISOString();

            console.log($scope.transaction);
            DataService.updateMemberTransaction($scope.transaction).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            });
        };

    }]);


// Edit Member Controller
    app.controller('EditProfile', ['$scope', '$state', '$stateParams', 'DataService', 'growl', 'sweet', '$filter', 'loggedInUser', '$uibModal', function ($scope, $state, $stateParams, DataService, growl, sweet, $filter, loggedInUser, $uibModal) {
        $scope.employee = {};

        $scope.addNewDocument = function () {
            $scope.employee.documents.push({});
        };

        $scope.changePassword = function () {
            return $uibModal.open({
                templateUrl: 'changePassword-modal.html',
                controller: 'ChangePassword',
                size: 'md',
                resolve: {
                    employee: function () {
                        return $scope.employee;
                    }
                }
            });
        };

        var userId = loggedInUser.assignedUser;

        DataService.getEmployee(userId).then(function (response) {
            if (!response.error) {
                $scope.employee = response.data;
                var phone = $scope.employee.phoneNumber;
                var splitArr = phone.split("-");
                $scope.employee.countryCode = splitArr[0];
                $scope.employee.phoneNumber = phone.split('-').slice(1).join('-');

                if ($scope.employee.emergencyContact.contactNumber) {
                    var contactPhone = $scope.employee.emergencyContact.contactNumber;
                    var contactSplit = contactPhone.split("-");
                    $scope.employee.emergencyContact.countryCode = contactSplit[0];
                    $scope.employee.emergencyContact.contactNumber = contactPhone.split('-').slice(1).join('-');
                } else {
                    $scope.employee.emergencyContact.contactNumber = "";
                }
                if (!$scope.employee.profilePic || $scope.employee.profilePic== '') {
                    $scope.profilePicUrl = 'assets/images/no-avatar.png'
                } else {
                    $scope.profilePicUrl = "http://www.mytrintrin.com/mytrintrin/Employee/" + response.data._id + '/' + response.data.profilePic + '.png';
                }
                $scope.employee.documents.forEach(function (document) {
                    document.documentProof ="http://www.mytrintrin.com/mytrintrin/Employee/" + $scope.employee._id + '/' + document.documentCopy + '.png';
                });
                $scope.employee.joiningDate = new Date($scope.employee.joiningDate);
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
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
                $scope.employee.phoneNumber = $scope.employee.countryCode + '-' + $scope.employee.phoneNumber;
                if ($scope.employee.emergencyContact.contactNumber) {
                    $scope.employee.emergencyContact.contactNumber = $scope.employee.emergencyContact.countryCode + '-' + $scope.employee.emergencyContact.contactNumber;
                } else {
                    $scope.employee.emergencyContact.contactNumber = "";
                }
                $scope.employee.profilePic = '';
                DataService.updateEmployee($scope.employee).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                        $state.reload();
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description['0']);
                });
            });
        };

        $scope.updateEmployee = function () {
            $scope.employee.phoneNumber = $scope.employee.countryCode + '-' + $scope.employee.phoneNumber;
/*            if ($scope.employee.emergencyContact.contactNumber) {
                $scope.employee.emergencyContact.contactNumber = $scope.employee.emergencyContact.countryCode + '-' + $scope.employee.emergencyContact.contactNumber;
            } else {
                $scope.employee.emergencyContact.contactNumber = "";
            }*/
            DataService.updateEmployee($scope.employee).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    window.location.reload();
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.message);
            })
        };

    }]);

    app.controller('ChangePassword', ['$scope', '$state', 'DataService', 'growl', 'sweet', '$stateParams', '$uibModalInstance', 'loggedInUser', function ($scope, $state, DataService, growl, sweet, $stateParams, $uibModalInstance, loggedInUser) {

        $scope.stations = [];

        $scope.employee = {
            currentPassword: '',
            newPassword: '',
            _id: loggedInUser._id
        };

        $scope.changePassword = function () {
            DataService.saveChangePassword($scope.employee).then(function (response) {
                if (!response.error) {
                    growl.success(response.message);
                    $uibModalInstance.dismiss();
                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            })
        };

        $scope.cancelChangePassword = function () {
            $uibModalInstance.dismiss();
        };

    }]);

    app.controller('BicycleAvailability', ['$scope','$interval', 'DataService', 'growl', 'StatusService', 'NgTableParams', '$filter', 'sweet', 'loggedInUser', '$state', 'GOOGLEMAPURL', function ($scope,$interval, DataService, growl, StatusService, NgTableParams, $filter, sweet, loggedInUser, $state, GOOGLEMAPURL)
    {
        var multiDockingStations = [];

        //new
      /*  $scope.date;
        var c=0;
        $scope.message=" This DIV is refreshed "+c+" time.";
        $interval(function () {
            $scope.date=new Date();
            $scope.message=" This DIV is refreshed "+c+" time.";
            c++;
            },1000);*/
        //new


        $scope.view = 0;
        $scope.dockingStationsData = [];

//         $interval(function () {
           /*  $state.reload();*/
            DataService.getDockingStations().then(function (response) {

                if (!response.error) {
                    $scope.dockingStationsData = response.data;
                    $scope.dockingStations = response.data;
                    for (var i = 0; i < $scope.dockingStations.length; i++) {
                        var longAndLat = {
                            longitude: $scope.dockingStations[i].gpsCoordinates.longitude,
                            latitude: $scope.dockingStations[i].gpsCoordinates.latitude,
                            mapUrl: GOOGLEMAPURL,
                            show: false,
                            title: $scope.dockingStations[i].name,
                            bicycleCount: $scope.dockingStations[i].bicycleCount,
                            bicycleCapacity: $scope.dockingStations[i].bicycleCapacity,
                            dockingStationStatus: StatusService.getDockingStationStatus($scope.dockingStations[i].operationStatus),
                            id: i
                        };
                        multiDockingStations.push(longAndLat);
                    }

                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });


        $scope.map = {
            center: {
                latitude: 12.3024314,
                longitude: 76.6615633
            }, zoom: 13
        };

        $scope.options = {scrollwheel: true};
        $scope.markers = multiDockingStations;

        $scope.windowOptions = {
            visible: false
        };

        $scope.onClick = function (marker, eventName, model) {
            model.show = !model.show;
        };

        $scope.closeClick = function () {
            $scope.windowOptions.visible = false;
        };

        $scope.swapView = function (viewType) {
            $scope.view = viewType;
        };
       /* $interval(function () {
            $scope.map.control.refresh();
        },40000);*/
        $scope.initiateSync = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'Initiating a sync is a performance-intensive operation. Use this sparingly!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, initiate sync!',
                closeOnConfirm: true
            }, function () {
                var data = {
                    employeeId: loggedInUser.assignedUser
                };
                DataService.initiateSync(data).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description);
                });
            });
        };

        $scope.stations = [];

        $scope.test1 =[];

        $scope.dockingStationDetails =[];


        DataService.getBicycleAvailability().then(function (response) {
            if (!response.error) {
                // if (response.data.requests) {
                if (!response.error) {
                    $scope.stations = response.data;
                    /* $scope.test1= $filter('orderBy')($scope.stations.portIds,'dockingPortId.FPGA');*/
                    $scope.stations.forEach(function (requests) {
                        requests.status = StatusService.getDockingStationStatus(requests.stationStatus);
                    });
                    var lastModifiedAt = new Date(response.data.lastModifiedAt);
                    $scope.stations.lastModifiedAt = lastModifiedAt.getDate() + '-' + lastModifiedAt.getMonth() + '-' + lastModifiedAt.getFullYear();
                    $scope.stations.forEach(function (station) {
                        station.portIds.forEach(function (dockingPortId) {
                            /*if (dockingPortId.dockingPortId.portStatus == 0) {
                             dockingPortId.tooltipMessage = dockingPortId.vehicleRFID;
                             }*/

                            if (dockingPortId.dockingPortId.portStatus == 1) {
                                dockingPortId.tooltipMessage = dockingPortId.vehicleRFID;
                            }

                            if (dockingPortId.dockingPortId.portStatus== 2) {
                                dockingPortId.tooltipMessage = "Empty";
                            }

                            /* if(dockingPortId.dockingPortId.FPGA == 3 || dockingPortId.dockingPortId.FPGA == 4)
                             {
                             dockingPortId.tooltipMessage = "FPGA";
                             }*/
                            /* if (dockingPortId.dockingPortId.portStatus == 3) {
                             dockingPortId.tooltipMessage = "Port Locked";
                             }

                             if (dockingPortId.dockingPortId.portStatus == 4) {
                             dockingPortId.tooltipMessage = "Non Operational";
                             }*/
                        })
                    });
                    $scope.dockingStationsTable.reload();
                }
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            /*growl.error(response.data.description);*/
        });


        $scope.dockingStationsTable = new NgTableParams(
            {
                count: 50
            },
            {
                getData: function ($defer, params) {
                    params.total($scope.stations.length);
                    $defer.resolve($scope.stations.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

//         },40000);

        $scope.loadBicycleAvaliability = function () {
            $state.reload();
        };


    }]);

    // bicycle usage
    app.controller('BicycleUsage', ['$scope','$interval', 'DataService', 'growl', 'StatusService', 'NgTableParams', '$filter', 'sweet', 'loggedInUser', '$state', 'GOOGLEMAPURL', function ($scope,$interval, DataService, growl, StatusService, NgTableParams, $filter, sweet, loggedInUser, $state, GOOGLEMAPURL)
    {
        $scope.cycleUsage={
            fromdate:'',
            todate:''
        };

        $scope.bicycleUsageDetails =function () {
            $scope.BicycleUsage = [];

            DataService.getBicycleUsage($scope.cycleUsage).then(function (response) {
                if (!response.error) {
                    var _one_hour=0;
                    var _two_hour=0;
                    /*var _three_hour=0;
                    var _more_than_four_hour = 0;*/
                    for(var i=0;i<response.data.length;i++)
                    {
                        if(response.data[i].duration > 60)
                        {
                            $scope.OneHourCount =_one_hour ++;
                        }
                      else if(response.data[i].duration > 120)
                        {
                            $scope.TwoHourCount = _two_hour ++;
                        }
                        /*  else if(response.data[i].duration > 180)
                        {
                            $scope.ThreeHourCount = _three_hour ++;
                        }
                        else if(respone.data[i].duration > 240)
                        {
                            $scope.MoreThenFourHourCount = _more_than_four_hour ++;
                        }
                        else
                        {

                        }*/
                    }

                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description['0']);
            });
        };

        $scope.bicycleUsageTable = new NgTableParams(
            {
                count: 1
            },
            {
                getData: function ($defer, params) {
                    params.total($scope.BicycleUsage.length);
                    $defer.resolve($scope.BicycleUsage.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

    }]);

    app.controller('BicycleSummary', ['$scope','$interval', 'DataService', 'growl', 'StatusService', 'NgTableParams', '$filter', 'sweet', 'loggedInUser', '$state', 'GOOGLEMAPURL', function ($scope,$interval, DataService, growl, StatusService, NgTableParams, $filter, sweet, loggedInUser, $state, GOOGLEMAPURL)
    {
        $scope.BicycleSummary={};

        DataService.getBicycleSummary().then(function (response) {
            if (!response.error) {

                    $scope.BicycleSummary=response.data;

            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.bicycleSummaryTable = new NgTableParams(
            {
                count: 1
            },
            {
                getData: function ($defer, params) {
                    params.total($scope.BicycleSummary.length);
                    $defer.resolve($scope.BicycleSummary.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

    }]);

    app.controller('RedistributionVehiclesLiveData', ['$scope','$interval', 'DataService', 'growl', 'StatusService', 'NgTableParams', '$filter', 'sweet', 'loggedInUser', '$state', 'GOOGLEMAPURL', function ($scope,$interval, DataService, growl, StatusService, NgTableParams, $filter, sweet, loggedInUser, $state, GOOGLEMAPURL)
    {
        $scope.redistributionVehicle=[];

        DataService.getredistributionVehicleLiveData().then(function (response) {
            if (!response.error) {
            for(var i=0;i<response.data.length;i++)
            {
                var rvdetails={
                    Name:'',
                    portCapacity:0,
                    available:0
                };

                    rvdetails.Name=response.data[i].Name;
                    rvdetails.portCapacity=response.data[i].portCapacity;
                    rvdetails.available=response.data[i].vehicleId.length;

                $scope.redistributionVehicle.push(rvdetails);
            }
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.rvTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    params.total($scope.redistributionVehicle.length);
                    $defer.resolve($scope.redistributionVehicle.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

    }]);

    app.controller('HoldingAreaLiveData', ['$scope','$interval', 'DataService', 'growl', 'StatusService', 'NgTableParams', '$filter', 'sweet', 'loggedInUser', '$state', 'GOOGLEMAPURL', function ($scope,$interval, DataService, growl, StatusService, NgTableParams, $filter, sweet, loggedInUser, $state, GOOGLEMAPURL)
    {
        $scope.holdingArea=[];

        DataService.getholdingAreaLiveData().then(function (response) {
            if (!response.error) {
                for(var i=0;i<response.data.length;i++)
                {
                    var haDetails={
                        Name:'',
                        portCapacity:0,
                        available:0
                    };

                    haDetails.Name=response.data[i].Name;
                    haDetails.portCapacity=response.data[i].portCapacity;
                    haDetails.available=response.data[i].vehicleId.length;

                    $scope.holdingArea.push(haDetails);
                }
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.holdingAreaTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    params.total($scope.holdingArea.length);
                    $defer.resolve($scope.holdingArea.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

    }]);

    app.controller('MaintenanceCentreLiveData', ['$scope','$interval', 'DataService', 'growl', 'StatusService', 'NgTableParams', '$filter', 'sweet', 'loggedInUser', '$state', 'GOOGLEMAPURL', function ($scope,$interval, DataService, growl, StatusService, NgTableParams, $filter, sweet, loggedInUser, $state, GOOGLEMAPURL)
    {
        $scope.maintenanceCentre=[];

        DataService.getmaintenanceCentreaLiveData().then(function (response) {
            if (!response.error) {
                for(var i=0;i<response.data.length;i++)
                {
                    var mcDetails={
                        Name:'',
                        portCapacity:0,
                        available:0
                    };

                    mcDetails.Name=response.data[i].Name;
                    mcDetails.portCapacity=response.data[i].portCapacity;
                    mcDetails.available=response.data[i].vehicleId.length;

                    $scope.maintenanceCentre.push(mcDetails);
                }
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.maintenanceCentreTable = new NgTableParams(
            {
                count: 10
            },
            {
                getData: function ($defer, params) {
                    params.total($scope.maintenanceCentre.length);
                    $defer.resolve($scope.maintenanceCentre.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

    }]);


    app.controller('MIS', ['$scope','$interval', 'DataService', 'growl', 'StatusService', 'NgTableParams', '$filter', 'sweet', 'loggedInUser', '$state', 'GOOGLEMAPURL', function ($scope,$interval, DataService, growl, StatusService, NgTableParams, $filter, sweet, loggedInUser, $state, GOOGLEMAPURL)
    {

    }]);

    var _bicycle_transaction_from_date;
    var _bicycle_transaction_to_date;
    var _bicycle_number;
    var _smart_card_no;
    var _min_duration;
    var _max_duration;
    var BicycleTransactionPrint =[];
    app.controller('BicycleTransactions',['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', 'StatusService', '$uibModal', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, StatusService, $uibModal)
    {
        $scope.bicycleTrans={
            fromdate:'',
            todate:'',
           /* dockingstation:'',*/
            vehicle:'',
            user:'',
            minDuration:'',
            maxDuration:''
        }

        $scope.BicycleTrasaction=[];

        $scope.bicycleTransactionDetails=function () {
            DataService.getBicycleTransactions($scope.bicycleTrans).then(function (response) {
                if (!response.error)
                {
                    if($scope.bicycleTrans.minDuration == '')
                    {
                        $scope.bicycleTrans.minDuration = 0;
                    }
                    if($scope.bicycleTrans.maxDuration == '')
                    {
                        $scope.bicycleTrans.maxDuration = 99999;
                    }
                    for(var i=0;i<response.data.length;i++)
                    {
                        if(response.data[i].duration > $scope.bicycleTrans.minDuration && response.data[i].duration < $scope.bicycleTrans.maxDuration)
                        {
                            $scope.BicycleTrasaction.push(response.data[i]);
                            $scope.Num1 = response.data[i].cardNum;
                            BicycleTransactionPrint = $scope.BicycleTrasaction;
                        }
                    }
                    var _transaction_from = new Date($scope.bicycleTrans.fromdate);
                    var transaction_from_date = _transaction_from.getDate();
                    var transaction_from_month = _transaction_from.getMonth() + 1;
                    var transaction_from_year = _transaction_from.getFullYear();
                    var _date_from = transaction_from_date + '-' + transaction_from_month + '-' + transaction_from_year;

                    var _transaction_to = new Date($scope.bicycleTrans.todate);
                    var transaction_to_date = _transaction_to.getDate();
                    var transaction_to_month = _transaction_to.getMonth() + 1;
                    var transaction_to_year = _transaction_to.getFullYear();
                    var _date_to = transaction_to_date + '-' + transaction_to_month + '-' + transaction_to_year;

                    $scope.ResultSummary = 'We found ' + $scope.BicycleTrasaction.length + ' bicycle transactions from ' + _date_from + ' to ' + _date_to + '  with a duration between '+ $scope.bicycleTrans.minDuration+' minutes to '+ $scope.bicycleTrans.maxDuration+' minutes.';

                    _bicycle_transaction_from_date = $scope.bicycleTrans.fromdate;
                    _bicycle_transaction_to_date = $scope.bicycleTrans.todate;
                     _bicycle_number = $scope.bicycleTrans.vehicle;
                     _smart_card_no = $scope.bicycleTrans.user;
                     _min_duration = $scope.bicycleTrans.minDuration;
                     _max_duration = $scope.bicycleTrans.maxDuration;

                } else {
                    growl.error(response.description);
                }
            }, function (response) {
                growl.error(response.description);
            });
        }

        $scope.bicycleTransactionTable = new NgTableParams(
            {
                count: 25
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.BicycleTrasaction, params.filter()) : $scope.BicycleTrasaction;
                       params.total(orderedData.length);
                     $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

        $scope.dockingStations = [];

        DataService.getDockingStations().then(function (response) {
            if (!response.error) {
                $scope.dockingStations = response.data;
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description['0']);
        });

        $scope.selectedDockingStation = function (data)
        {
            $scope.bicycleTrans.dockingstation=data.name;
        }

    }]);

    // Bicycle Transaction Print
    app.controller('BicycleTransactionsPrint',['$scope', '$state', 'DataService', 'NgTableParams', 'growl', 'sweet', '$filter', 'StatusService', '$uibModal', function ($scope, $state, DataService, NgTableParams, growl, sweet, $filter, StatusService, $uibModal)
    {
        
        $scope.BicycleTransactionPrintDetails={
            fromdate:_bicycle_transaction_from_date,
            todate:_bicycle_transaction_to_date,
            bicycleNo:_bicycle_number,
            smartCardNo:_smart_card_no,
            minDuration:_min_duration,
            maxDuration:_max_duration
        };

        if($scope.BicycleTransactionPrintDetails.smartCardNo == '')
        {
            $scope.CardNumber='';
        }
        else
            {
                $scope.CardNumber = $scope.BicycleTransactionPrintDetails.smartCardNo;
            }

        $scope.BicycleTransactionPrint = BicycleTransactionPrint;

        $scope.bicycleTransactionPrintTable = new NgTableParams(
            {
                count: 5000,
                noPager: true
            },
            {
                getData: function ($defer, params) {
                    var orderedData = params.filter() ? $filter('filter')($scope.BicycleTransactionPrint, params.filter()) : $scope.BicycleTransactionPrint;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );


    }]);

    app.controller('PortStatus', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter, $uibModal)
    {
        var multiDockingStations = [];

        $scope.view = 0;
        $scope.dockingStationsData = [];

        DataService.getDockingStations().then(function (response) {
            if (!response.error) {
                $scope.dockingStationsData = response.data;
                $scope.dockingStations = response.data;
                for (var i = 0; i < $scope.dockingStations.length; i++) {
                    var longAndLat = {
                        longitude: $scope.dockingStations[i].gpsCoordinates.longitude,
                        latitude: $scope.dockingStations[i].gpsCoordinates.latitude,
                        mapUrl: GOOGLEMAPURL,
                        show: false,
                        title: $scope.dockingStations[i].name,
                        bicycleCount: $scope.dockingStations[i].bicycleCount,
                        bicycleCapacity: $scope.dockingStations[i].bicycleCapacity,
                        dockingStationStatus: StatusService.getDockingStationStatus($scope.dockingStations[i].operationStatus),
                        id: i
                    };
                    multiDockingStations.push(longAndLat);
                }

            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.data.description);
        });

        $scope.map = {
            center: {
                latitude: 12.3024314,
                longitude: 76.6615633
            }, zoom: 12
        };

        $scope.options = {scrollwheel: false};
        $scope.markers = multiDockingStations;

        $scope.windowOptions = {
            visible: false
        };

        $scope.onClick = function (marker, eventName, model) {
            model.show = !model.show;
        };

        $scope.closeClick = function () {
            $scope.windowOptions.visible = false;
        };

        $scope.swapView = function (viewType) {
            $scope.view = viewType;
        };

        $scope.initiateSync = function () {
            sweet.show({
                title: 'Are you sure?',
                text: 'Initiating a sync is a performance-intensive operation. Use this sparingly!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, initiate sync!',
                closeOnConfirm: true
            }, function () {
                var data = {
                    employeeId: loggedInUser.assignedUser
                };
                DataService.initiateSync(data).then(function (response) {
                    if (!response.error) {
                        growl.success(response.message);
                    } else {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description);
                });
            });
        };

        $scope.stations = [];

        $scope.test1 =[];

        $scope.dockingStationDetails =[];

        DataService.getBicycleAvailability().then(function (response) {
            if (!response.error) {
                // if (response.data.requests) {
                if (!response.error) {
                    $scope.stations = response.data;
                    /* $scope.test1= $filter('orderBy')($scope.stations.portIds,'dockingPortId.FPGA');*/
                    $scope.stations.forEach(function (requests) {
                        requests.status = StatusService.getDockingStationStatus(requests.stationStatus);
                    });
                    var lastModifiedAt = new Date(response.data.lastModifiedAt);
                    $scope.stations.lastModifiedAt = lastModifiedAt.getDate() + '-' + lastModifiedAt.getMonth() + '-' + lastModifiedAt.getFullYear();
                    $scope.stations.forEach(function (station) {
                        station.portIds.forEach(function (dockingPortId) {
                            /*if (dockingPortId.dockingPortId.portStatus == 0) {
                             dockingPortId.tooltipMessage = dockingPortId.vehicleRFID;
                             }*/
                            if (dockingPortId.dockingPortId.portStatus == 1) {
                                var _data= {};
                                _data=dockingPortId.dockingPortId.vehicleId;
                                dockingPortId.tooltipMessage = _data[0].vehicleid.vehicleNumber;
                            }

                            if (dockingPortId.dockingPortId.portStatus== 2) {
                                dockingPortId.tooltipMessage = "Empty";
                            }
                            if (dockingPortId.dockingPortId.portStatus== -1) {
                                dockingPortId.tooltipMessage = "Port Error";
                            }

                            /* if(dockingPortId.dockingPortId.FPGA == 3 || dockingPortId.dockingPortId.FPGA == 4)
                             {
                             dockingPortId.tooltipMessage = "FPGA";
                             }*/
                            /* if (dockingPortId.dockingPortId.portStatus == 3) {
                             dockingPortId.tooltipMessage = "Port Locked";
                             }

                             if (dockingPortId.dockingPortId.portStatus == 4) {
                             dockingPortId.tooltipMessage = "Non Operational";
                             }*/
                        })
                    });
                    $scope.dockingStationsTable.reload();
                }
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            /*growl.error(response.data.description);*/
        });
        $scope.loadPorts = function () {
         $state.reload();
         };
        $scope.dockingStationsTable = new NgTableParams(
            {
                count: 50
            },
            {
                getData: function ($defer, params) {
                    params.total($scope.stations.length);
                    $defer.resolve($scope.stations.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );
    }]);

    app.controller('BicycleLifeCycle', ['$scope', '$state', 'DataService', 'StatusService', 'NgTableParams', 'growl', 'sweet', '$filter', '$uibModal', function ($scope, $state, DataService, StatusService, NgTableParams, growl, sweet, $filter, $uibModal) {
        $scope.bicycleLifeCycle = [];

        var filters = {
            filter: {
                populate: {path: 'bicycleId'}
            }
        };

        DataService.getBicycleLifeCycle(filters).then(function (response) {
            if (!response.error) {
                $scope.bicycleLifeCycle = response.data;
                $scope.bicycleLifeCycleTable.reload();
            } else {
                growl.error(response.message);
            }
        }, function (response) {
            growl.error(response.message);
        });

        $scope.loadBicycleLifeCycle = function () {
            $state.reload();
        };

        $scope.bicycleLifeCycleTable = new NgTableParams(
            {
                count: 6
            },
            {
                getData: function ($defer, params) {
                    params.total($scope.bicycleLifeCycle.length);
                    $defer.resolve($scope.bicycleLifeCycle.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        );

    }]);

    app.controller('RedistributionVehicleTracking',  ['$scope','$interval', 'DataService', 'growl', 'StatusService', 'NgTableParams', '$filter', 'sweet', 'loggedInUser', '$state', 'GOOGLEMAPURL', function ($scope,$interval, DataService, growl, StatusService, NgTableParams, $filter, sweet, loggedInUser, $state, GOOGLEMAPURL)
    {
        // Redistribution vehicle tracking
        var multiRedistributionVehicle = [];
        var DockingStations = [];

        $scope.redistributionVehicleData = [];

        $scope.RefreshMapView=function ()
        {
            var interval = $interval(function ()
            {
                DataService.getRedistributionVehicles().then(function (response) {
                    if (!response.error) {
                        $scope.RDV(response);
                        /*$scope.redistributionVehicleData = response.data;*/
                       /* $scope.redistributionVehicles = response.data;*/
                    }
                    else
                    {
                        growl.error(response.message);
                    }
                }, function (response) {
                    growl.error(response.data.description);
                });
            },45000);
            }
        $scope.RDV=function (response) {
            $scope.redistributionVehicles = response.data;
            multiRedistributionVehicle = [];
            for (var i = 0; i < $scope.redistributionVehicles.length; i++) {
                if ($scope.redistributionVehicles[i].tracking == true) {
                    var longAndLat = {
                        longitude: $scope.redistributionVehicles[i].gpsCoordinates.longitude,
                        latitude: $scope.redistributionVehicles[i].gpsCoordinates.latitude,
                        mapUrl: GOOGLEMAPURL,
                        show: false,
                        icon: 'assets/images/redistributionVehicle.png',
                        title: $scope.redistributionVehicles[i].Name,
                        bicycleCount: $scope.redistributionVehicles[i].vehicleId.length,
                        bicycleCapacity: $scope.redistributionVehicles[i].portCapacity,
                        dockingStationStatus: StatusService.getRedistributionVehicleStatus($scope.redistributionVehicles[i].portStatus),
                        id: i
                    };
                    multiRedistributionVehicle.push(longAndLat);
                }
            }
            $scope.markers = multiRedistributionVehicle;
        }
            // Get All Docking Stations
            DataService.getDockingStations().then(function (response) {
                if (!response.error) {
                    $scope.dockingStationsData = response.data;
                    $scope.dockingStations = response.data;
                    for (var i = 0; i < $scope.dockingStations.length; i++) {
                        var longAndLat = {
                            longitude: $scope.dockingStations[i].gpsCoordinates.longitude,
                            latitude: $scope.dockingStations[i].gpsCoordinates.latitude,
                            mapUrl: GOOGLEMAPURL,
                            show: false,
                            icon: 'assets/images/cycle.png',
                            title: $scope.dockingStations[i].name,
                            bicycleCount: $scope.dockingStations[i].bicycleCount,
                            bicycleCapacity: $scope.dockingStations[i].bicycleCapacity,
                            dockingStationStatus: StatusService.getDockingStationStatus($scope.dockingStations[i].operationStatus),
                            id: i
                        };
                        DockingStations.push(longAndLat);
                    }

                } else {
                    growl.error(response.message);
                }
            }, function (response) {
                growl.error(response.data.description);
            });


        $scope.RefreshMapView();

            $scope.map = {
                center: {
                    latitude: 12.292103,
                    longitude: 76.63796
                }, zoom: 15
            };

            $scope.options = {scrollwheel: true};

        $scope.markers = multiRedistributionVehicle;
            $scope.markersDockingHub = DockingStations;

            $scope.windowOptions = {
                visible: false
            };

            $scope.onClick = function (marker, eventName, model) {
                model.show = !model.show;
            };

            $scope.closeClick = function () {
                $scope.windowOptions.visible = false;
            };

            $scope.swapView = function (viewType) {
                $scope.view = viewType;
            };
    }]);


    // Mis_Summary hourlycheckout
    app.controller('MISHourlyCheckOut', ['$scope', '$state', 'DataService', 'growl','$uibModal', 'sweet', function ($scope, $state, DataService, growl,$uibModal,sweet)
    {
        $scope.HourlyCheckOut={
            fromdate:'',
            todate:''
        };

        $scope.Hourlycheckout =[];

        $scope.sendMisHourlycheckout = function ()
        {
            DataService.SendMisHourlycheckoutDetails($scope.HourlyCheckOut).then(function (response) {
                if (!response.error)
                {
                    for(var i=0;i<response.data.length;i++)
                    {
                        $scope.Hourlycheckout.push(response.data[i]);
                    }
                    $scope.daywiseTable = new NgTableParams(
                        {
                            count: 20
                        },
                        {
                            getData: function ($defer, params) {
                                var orderedData = params.filter() ? $filter('filter')($scope.daywises, params.filter()) : $scope.daywises;
                                params.total(orderedData.length);
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        }
                    );
                }
                else
                {
                    growl.error(response.message);
                }
            }, function (response) {
                /*growl.error(response.data.description['0']);*/
            })

            // Dataservice
        };

    }]);




    app.controller('headerCtrl',  ['$timeout','messageService', function ($timeout,messageService) {
        // Top Search
        this.openSearch = function () {
            angular.element('#header').addClass('search-toggled');
            angular.element('#top-search-wrap').find('input').focus();
        };

        this.closeSearch = function () {
            angular.element('#header').removeClass('search-toggled');
        };
    }])

}());

