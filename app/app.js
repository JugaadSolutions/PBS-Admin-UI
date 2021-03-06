// =========================================================================
// PBS Admin App Initialization
// =========================================================================

(function () {
    'use strict';

    var app = angular.module('pbs', ['ngSanitize', 'ngAnimate','angular-md5','ngMessages', 'ui.bootstrap', 'ui.router', 'ngTable', 'angular-growl', 'hSweetAlert', 'angular-loading-bar', 'localytics.directives', 'uiGmapgoogle-maps']);

    var __env = {};
    if (window) {
        Object.assign(__env, window.__env);
    }

    app.constant('API', __env.apiUrl);
    app.constant('APINew',__env.apiUrlNew);
    app.constant('GOOGLEMAPURL', __env.googleMapsUrl);

    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }]);

    app.constant('_',
        window._
    );

    app.value('APIEndPoint', {
        login: {
            auth: 'login'
        },
        fleet:
        {
            getAll:'fleet'
        },
        vehicle:
        {
            getAll:'vehicle',
            get:'vehicle',
            save: 'vehicle',
            update:'vehicle'
        },
        member: {
            getAll: 'member/qweuird78fj3498asdjkfhahsysd98y4rsdjhf',
            get: 'member',
            save: 'member/add',
            credit: 'credit',
            topup:'topup',
            debit: 'debit',
            update: 'member',
            membershipForMember: 'assignmembership',
            smartCardForMember: 'assigncard',
            delete: 'member',
           /* memberPaymentTransaction: 'paymenttransaction',*/
         /*   memberPaymentTransaction: 'paymenttransaction',*/
            memberIndividualPaymentTransation:'paymenttransaction/member',
            memberIndividualPaymentTransationBycard:'paymenttransaction/card',
           /* memberTransaction: 'membertransaction/member'*/
            memberTransaction: 'transactions/myrides/member',
            memberTransactionByCard: 'transactions/myrides/card',
         /*   cancel:'cancelmembership',*/
            request:'cancelmemberrequest',
            suspend:'suspendmembership',
            cancel:'cancelmembership',
            otprequest:'requestotp',
            verify:'verifyotp',
            ondemand:'users/ondemand/qweuird78fj3498asdjkfhahsysd98y4rsdjhf',
            edit:'users/ondemand'
        },
        employee: {
            getAll: 'employee',
            get: 'employee',
            smartCardForEmployee: 'assigncard',
            save: 'employee',
            update: 'employee',
            delete: 'employee',
            getAllDept:'employee/departments'
        },

        registrationstaff:{
            save: 'registrationstaff',
            get:'registrationstaff',
            getAll:'registrationstaff/emp'
        },

        membership: {
            getAll: 'membership',
            get: 'membership',
            save: 'membership',
            update: 'membership',
            delete: 'membership'
        },
        upload: {
            post: 'member/test'
        },
        dockingStations: {
            getAll: 'dockstation',
            get: 'dockstation',
            post: 'dockstation',
            sync: 'dockingstation/sync',
            save: 'dockingstation',
            update: 'dockstation',
            delete: 'dockingstation',
            count: 'dockingstation/count',
            testConnection: 'dockingstation/testConnection'
        },
        dockingUnits: {
            getAll: 'dockingunit',
            get: 'dockingunit',
            post: 'dockingunit',
            save: 'dockingunit',
            update: 'dockingunit',
            delete: 'dockingunit'
        },
        dockingPorts: {
            getAll: 'dockport',
            get: 'dockport',
            post: 'dockingport',
            put:'dockport',
            save: 'dockingport',
            update: 'dockport',
            delete: 'dockingport'
        },
        bicycle: {
            getAll: 'bicycle',
            get: 'bicycle',
            save: 'bicycle',
            update: 'bicycle',
            delete: 'bicycle',
            initiateSync: 'bicycleavailability',
            bicycleAvailability: 'bicycleavailability/latest',
          /*  bicycleAvailabilityLocal: 'bicycleavailability/local',*/
            bicycleAvailabilityLocal: 'dockstation',
            moveBicycle: 'bicyclelifecycle',
            bicycleLifeCycle: 'bicycleLifeCycle',
            summary:'vehicle/summery/all',
            hubs:''
        },
        redistributionVehicles: {
            getAll: 'redistributionport',
            save: 'redistributionport',
            get:'redistributionport',
            update: 'redistributionport'
           /* get: 'redistributionvehicle',
            save: 'redistributionvehicle',
            update: 'redistributionvehicle',
            delete: 'redistributionvehicle'*/
        },

        fleets:{
            save:'fleet',
            get:'fleet',
            getAll:'fleet',
            update:'fleet'
        },

        redistributionStations:{
            getAll: 'redistributionvehicle',
        },

        maintenanceStations:{
          getAll:'maintenancecenter'
        },

        HoldingStation:{
            getAll:'holdingarea'
        },

        fleetStations:{
            getAll:'fleetarea'
        },

        farePlan: {
            getAll: 'farePlan',
            get: 'farePlan',
            save: 'farePlan',
            update: 'farePlan',
            delete: 'farePlan'
        },

        /*Registration centre staff assignment*/
        staffSelection:
        {
           /* getAll:'employee/registrationstaff'*/
            getAll:'employee/registrationstaff/emp',
            getAllNew:'employee/moneregstaff/emp'
        },

        redistributionVehicleStaffSelection:
            {
                getAll:'employee/rvstaff/emp'
            },

        holdingArea: {
            getAll: 'holdingport',
            get: 'holdingport',
            save: 'holdingport',
            update: 'holdingport',
            delete: 'holdingport'
        },
        maintenanceCentre: {
            getAll: 'maintenanceport',
            get: 'maintenanceport',
            save: 'maintenanceport',
            update: 'maintenanceport',
            delete: 'maintenancecentre'
        },

        registrationCentre: {
            save:'registrationcenter',
            getAll:'registrationcenter',
            get:'registrationcenter',
            update:'registrationcenter'
        },

        mysuruOneRegistrationCentre:
            {
                getAll:'konecenter',
            },

        dockingStationCleaning:{
            save:'dockstation/cleanstation',
            getAll:'dockstation/cleanstation/info'
        },

        ticketsDetails:{
            save:'tickets',
            get:'tickets',
            getAll:'tickets/ticketinfo',
            update:'tickets',
            reply:'tickets',
            assigned:'tickets/assignedinfo',
        },

        searchmember:{
          send:'member/search'
        },

      fleetDetails:{
            save:'fleetarea',
            get:'',
            getAll:'fleetarea'
      },

        internalMaintenanceCentre:{
            save:'maintenancecenter',
            get:'',
            getAll:'maintenancecenter'
        },

        internalStations:{
            save:'',
            getAll:'stations'
        },

        checkIncheckOut:{
            save:'transactions/checkout/app'
        },

        checkIn:{
            save:'transactions/checkin/app'
        },

        checkOutBridge:{
            save:'transactions/checkout/bridge'
        },

        checkInBridge:{
            save:'transactions/checkin/bridge'
        },

        adminTopups:{
            save:'topup'
        },

        topUp:{
            save:'topups',
            get:'topups',
            getAll:'topups',
            update:'topups',
            delete:'topups'
        },

        registrationDetails:{
            getAll: 'registrationdetails'
        },

        refundDetails:{
            getAll: 'refunddetails'
        },

        cashCollection:{
           getAll:'paymenttransaction/cashcollection'
        },

        daywiseCollection:{
            getAll:'paymenttransaction/daywisecollection'
        },

        totalCashCollection:{
            getAll:'paymenttransaction/totalcollection'
        },

        bankCashDeposit: {
            save:'paymenttransaction/deposit',
            getAll:'deposit'
        },

        bankCashDepositReport:{
            getAll:'paymenttransaction/depositinfo'
        },

        accountClosure:{
            getAll:'paymenttransaction/dayclosure/info',
            save:'paymenttransaction/cashclosure'
        },

        bicycleMaintenance:{
            send:''
        },

        dockingStationClean:{
            send:''
        },

        globalKeyNameValue:{
          save:'keysettings',
            getAll:'keysettings',
            get:'keysettings',
            update:'keysettings',
            delete:'keysettings'
        },

        kpiDetails:{
         getAll:'kpi/dockstation'
        },

        kpiSmartCardDetails:{
            getAll:'kpi/cardreport'
        },

        kpiBicycleAtFleet:{
            getAll:'kpi/hourlyreport'
        },

        kpiDSCleanDetails:{
            getAll:'kpi/stationcleaninfo'
        },

        kpiCycleUsagePerDay:{
            getAll:'kpi/usagestats'
        },

        kpiSmartCardKiosks:{
            getAll:'kpi/kioskreport'
        },

      /*  kpiCycleRepaired:{
            getAll:'kpi/kioskreport'
        },*/

        kpiWebsiteDownTime:
            {
              getAll:'kpi/webinfo/details'
            },

        websiteDownTime:{
           save:'kpi/webinfo',

        },

        kpivalidtickets:{
            getAll:'kpi/ticketsinfo'
        },

        kpiwebsiteDownTime:{
            getAll:'kpi/webinfo/details'
        },

       /* kpiCycleRepaired:{
            getAll:'tickets'
        },*/

        smartCard: {
            getAll: 'card',
            get: 'card',
            save: 'card',
            verifyForMember: 'card/membercardverify',
            verifyForEmployee: 'card/employeecardverify',
            deactivate: 'deactivate',
            update: 'card',
            delete: 'card'
        },
        closeTransaction: {
            post: 'member/temporarycheckin',
        },
        reports: {
            transactions: {
               /* getAll: 'memberTransaction',*/
                getAll: 'transactions',
                get: 'memberTransaction',
                save: 'member/transaction',
                update: 'member/checkin',
                checkOut: 'member/checkOut',
                checkIn: 'member/checkIn',
                complete:'transactions/completed'
            }
        },
        user: {
            user: 'user',
            password: 'password/change',
            forgotPassword: 'users/forgotpassword'
        }
    });

    app.value('loggedInUser', {
        id: "",
        _id: "",
        profileName: "",
        assignedUser: "",
        role: "",
        loggedIn: false,
        /*newly added*/
        email:''
    });


    app.run(function ($rootScope, $state, auth, DataService, growl, loggedInUser) {
        $rootScope.$state = $state;

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.containerClass = toState.containerClass;
            if (!auth.isAuthed() && toState.name.indexOf('login')) {
                event.preventDefault();
                $state.go('login');
                growl.warning("Please login with an authorized account to access this page")
            }
            if (toState.redirectTo) {
                event.preventDefault();
                $state.go('admin');
            }
            if (auth.isAuthed()) {
                loggedInUser.id = auth.returnId();
                loggedInUser._id = auth.returnId();
                loggedInUser.profileName = auth.returnName();
                loggedInUser.role = auth.returnRole();
                loggedInUser.assignedUser = auth.returnUserId();
                loggedInUser.loggedIn = true;
                /*newly added*/
                loggedInUser.email=auth.returnEmail();

                if (toState.name === "admin.employees" || toState.name === "admin.employees.manage" || toState.name === "admin.employees.add" || toState.name === "admin.employees.edit" )
                {
                    if (loggedInUser.role == 'employee') {
                        event.preventDefault();
                        $state.go('403');
                    }
                }

                $rootScope.$broadcast('userInfo', loggedInUser);

                if (!toState.name.indexOf('login')) {
                    event.preventDefault();
                    $state.go('admin');
                    growl.info("You are logged in")
                }
            }
            loggedInUser.role='';
        });
    });

})();