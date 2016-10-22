// =========================================================================
// PBS Admin App and Routes Configuration
// =========================================================================

(function () {
    'use strict';

    var app = angular.module('pbs');

    app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

        /* Views Path */
        var adminViewPath = "/PBS-Admin-UI/app/admin/modules/";
        var loginViewPath = "/PBS-Admin-UI/app/login/";

        $urlRouterProvider.otherwise("/login");

        $stateProvider

        /* States for Admin Screens */
            .state('login', {
                url: '/login',
                templateUrl: loginViewPath + 'login.html',
                controller: 'LoginController',
                containerClass: 'login-content ng-scope'
            })

            .state('core', {
                url: '/core',
                redirectTo: 'admin',
                containerClass: 'login-content ng-scope'
            })

            .state('403', {
                url: '/403',
                templateUrl: '/PBS-Admin-UI/app/admin/common/403.html',
                controller: '403Controller',
                containerClass: 'four-zero-content'
            })
            
            .state('admin', {
                url: '/admin',
                templateUrl: adminViewPath + 'admin.html',
                controller: 'AdminController',
                containerClass: 'sw-toggled'
            })

            .state("admin.members", {
                url: "/members",
                templateUrl: adminViewPath + 'members/members.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.members.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'members/manage.html',
                controller: 'ManageMembers',
                containerClass: 'sw-toggled'
            })

            .state("admin.members.add", {
                url: "/add",
                templateUrl: adminViewPath + 'members/add.html',
                controller: 'AddMember',
                containerClass: 'sw-toggled'
            })

            .state("admin.members.edit", {
                url: "/edit/:id",
                templateUrl: adminViewPath + 'members/edit.html',
                controller: 'EditMember',
                containerClass: 'sw-toggled'
            })

            .state("admin.employees", {
                url: "/employees",
                templateUrl: adminViewPath + 'employees/employees.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.employees.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'employees/manage.html',
                controller: 'ManageEmployees',
                containerClass: 'sw-toggled'
            })

            .state("admin.employees.add", {
                url: "/add",
                templateUrl: adminViewPath + 'employees/add.html',
                controller: 'AddEmployees',
                containerClass: 'sw-toggled'
            })

            .state("admin.employees.edit", {
                url: "/edit/:id",
                templateUrl: adminViewPath + 'employees/edit.html',
                controller: 'EditEmployee',
                containerClass: 'sw-toggled'
            })

            .state("admin.profile", {
                url: "/profile",
                templateUrl: adminViewPath + 'profile/profile.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.profile.edit", {
                url: "/edit",
                templateUrl: adminViewPath + 'profile/edit.html',
                controller: 'EditProfile',
                containerClass: 'sw-toggled'
            })
            
            .state("admin.docking-stations", {
                url: "/docking-stations",
                templateUrl: adminViewPath + 'docking-stations/docking-stations.html',
                containerClass: 'sw-toggled'
            })
            .state("admin.docking-stations.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'docking-stations/manage.html',
                controller: 'ManageDockingStation',
                containerClass: 'sw-toggled'
            })
            .state("admin.docking-stations.add", {
                url: "/add",
                templateUrl: adminViewPath + 'docking-stations/add.html',
                controller: 'AddDockingStation',
                containerClass: 'sw-toggled'
            })
            .state("admin.docking-stations.edit", {
                url: "/edit/:id",
                templateUrl: adminViewPath + 'docking-stations/edit.html',
                controller: 'EditDockingStation',
                containerClass: 'sw-toggled'
            })
            .state("admin.docking-units", {
                url: "/docking-units",
                templateUrl: adminViewPath + 'docking-units/docking-units.html',
                containerClass: 'sw-toggled'
            })
            .state("admin.docking-units.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'docking-units/manage.html',
                controller: 'ManageDockingUnit',
                containerClass: 'sw-toggled'
            })
            .state("admin.docking-units.add", {
                url: "/add",
                templateUrl: adminViewPath + 'docking-units/add.html',
                controller: 'AddDockingUnit',
                containerClass: 'sw-toggled'
            })
            .state("admin.docking-units.edit", {
                url: "/edit/:id",
                templateUrl: adminViewPath + 'docking-units/edit.html',
                controller: 'EditDockingUnit',
                containerClass: 'sw-toggled'
            })
            .state("admin.docking-ports", {
                url: "/docking-ports",
                templateUrl: adminViewPath + 'docking-ports/docking-ports.html',
                containerClass: 'sw-toggled'
            })
            .state("admin.docking-ports.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'docking-ports/manage.html',
                controller: 'ManageDockingPort',
                containerClass: 'sw-toggled'
            })
            .state("admin.docking-ports.add", {
                url: "/add",
                templateUrl: adminViewPath + 'docking-ports/add.html',
                controller: 'AddDockingPort',
                containerClass: 'sw-toggled'
            })
            .state("admin.docking-ports.edit", {
                url: "/edit/:id",
                templateUrl: adminViewPath + 'docking-ports/edit.html',
                controller: 'EditDockingPort',
                containerClass: 'sw-toggled'
            })

            .state("admin.membership", {
                url: "/membership",
                templateUrl: adminViewPath + 'membership/membership.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.membership.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'membership/manage.html',
                controller: 'ManageMembership',
                containerClass: 'sw-toggled'
            })

            .state("admin.membership.add", {
                url: "/add",
                templateUrl: adminViewPath + 'membership/add.html',
                controller: 'AddMembership',
                containerClass: 'sw-toggled'
            })

            .state("admin.membership.edit", {
                url: "/edit/:id",
                templateUrl: adminViewPath + 'membership/edit.html',
                controller: 'EditMembership',
                containerClass: 'sw-toggled'
            })

            .state("admin.bicycles", {
                url: "/bicycles",
                templateUrl: adminViewPath + 'bicycles/bicycles.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.bicycles.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'bicycles/manage.html',
                controller: 'ManageBicycles',
                containerClass: 'sw-toggled'
            })

            .state("admin.bicycles.add", {
                url: "/add",
                templateUrl: adminViewPath + 'bicycles/add.html',
                controller: 'AddBicycle',
                containerClass: 'sw-toggled'
            })

            .state("admin.bicycles.edit", {
                url: "/edit/:id",
                templateUrl: adminViewPath + 'bicycles/edit.html',
                controller: 'EditBicycle',
                containerClass: 'sw-toggled'
            })
            .state("admin.redistribution-vehicles", {
                url: "/redistribution-vehicles",
                templateUrl: adminViewPath + 'redistribution-vehicles/redistribution-vehicles.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.redistribution-vehicles.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'redistribution-vehicles/manage.html',
                controller: 'ManageRedistributionVehicles',
                containerClass: 'sw-toggled'
            })

            .state("admin.redistribution-vehicles.add", {
                url: "/add",
                templateUrl: adminViewPath + 'redistribution-vehicles/add.html',
                controller: 'AddRedistributionVehicle',
                containerClass: 'sw-toggled'
            })

            .state("admin.redistribution-vehicles.edit", {
                url: "/edit/:id",
                templateUrl: adminViewPath + 'redistribution-vehicles/edit.html',
                controller: 'EditRedistributionVehicle',
                containerClass: 'sw-toggled'
            })

            .state("admin.fare-plans", {
                url: "/fare-plans",
                templateUrl: adminViewPath + 'fare-plan/fare-plan.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.fare-plans.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'fare-plan/manage.html',
                controller: 'ManageFarePlans',
                containerClass: 'sw-toggled'
            })

            .state("admin.fare-plans.add", {
                url: "/add",
                templateUrl: adminViewPath + 'fare-plan/add.html',
                controller: 'AddFarePlan',
                containerClass: 'sw-toggled'
            })

            .state("admin.fare-plans.edit", {
                url: "/edit/:id",
                templateUrl: adminViewPath + 'fare-plan/edit.html',
                controller: 'EditFarePlan',
                containerClass: 'sw-toggled'
            })
            .state("admin.holding-areas", {
                url: "/holding-areas",
                templateUrl: adminViewPath + 'holding-areas/holding-areas.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.holding-areas.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'holding-areas/manage.html',
                controller: 'ManageHoldingAreas',
                containerClass: 'sw-toggled'
            })

            .state("admin.holding-areas.add", {
                url: "/add",
                templateUrl: adminViewPath + 'holding-areas/add.html',
                controller: 'AddHoldingArea',
                containerClass: 'sw-toggled'
            })

            .state("admin.holding-areas.edit", {
                url: "/edit/:id",
                templateUrl: adminViewPath + 'holding-areas/edit.html',
                controller: 'EditHoldingArea',
                containerClass: 'sw-toggled'
            })
            .state("admin.maintenance-centres", {
                url: "/maintenance-centres",
                templateUrl: adminViewPath + 'maintenance-centres/maintenance-centres.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.maintenance-centres.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'maintenance-centres/manage.html',
                controller: 'ManageMaintenanceCentres',
                containerClass: 'sw-toggled'
            })

            .state("admin.maintenance-centres.add", {
                url: "/add",
                templateUrl: adminViewPath + 'maintenance-centres/add.html',
                controller: 'AddMaintenanceCentre',
                containerClass: 'sw-toggled'
            })

            .state("admin.maintenance-centres.edit", {
                url: "/edit/:id",
                templateUrl: adminViewPath + 'maintenance-centres/edit.html',
                controller: 'EditMaintenanceCentre',
                containerClass: 'sw-toggled'
            })

            /*Registration centres*/
            .state("admin.registration-centres",{
                url:"/registration-centres",
                templateUrl:adminViewPath + 'registration-centres/registration-centres.html',
                containerClass:'sw-toggled'
                })

            .state("admin.registration-centres.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'registration-centres/manage.html',
                controller: 'ManageRegistrationCentres',
                containerClass: 'sw-toggled'
            })

            .state("admin.registration-centres.add", {
                url: "/add",
                templateUrl: adminViewPath + 'registration-centres/add.html',
                controller: 'AddRegistrationCentre',
                containerClass: 'sw-toggled'
            })

            .state("admin.registration-centres.edit", {
                url: "/edit/:id",
                templateUrl: adminViewPath + 'registration-centres/edit.html',
                controller: '',
                containerClass: 'sw-toggled'
            })

            .state("admin.smart-cards", {
                url: "/smart-cards",
                templateUrl: adminViewPath + "smart-cards/smart-cards.html"
            })

            .state("admin.smart-cards.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'smart-cards/manage.html',
                controller: 'ManageSmartCards',
                containerClass: 'sw-toggled'
            })
            
            .state("admin.smart-cards.add", {
                url: "/add",
                templateUrl: adminViewPath + 'smart-cards/add.html',
                controller: 'AddSmartCard',
                containerClass: 'sw-toggled'
            })

            .state("admin.smart-cards.edit", {
                url: "/edit/:id",
                templateUrl: adminViewPath + 'smart-cards/edit.html',
                controller: 'EditSmartCard',
                containerClass: 'sw-toggled'
            })

            .state("admin.reports", {
                url: "/reports",
                templateUrl: adminViewPath + 'reports/reports.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.reports.monitor-transactions", {
                url: "/monitor-transactions",
                templateUrl: adminViewPath + 'reports/monitor-transactions.html',
                controller: 'MonitorTransactions',
                containerClass: 'sw-toggled'
            })

            .state("admin.reports.bicycle-availability", {
                url: "/bicycle-availability",
                templateUrl: adminViewPath + 'reports/bicycle-availability.html',
                controller: 'BicycleAvailability',
                containerClass: 'sw-toggled'
            })

            .state("admin.reports.bicycle-life-cycle", {
                url: "/bicycle-life-cycle",
                templateUrl: adminViewPath + 'reports/bicycle-life-cycle.html',
                controller: 'BicycleLifeCycle',
                containerClass: 'sw-toggled'
            })

            // Temporary Simulator Routes
            .state("checkout", {
                url: "/simulator/checkout",
                templateUrl: '/PBS-Admin-UI/app/simulator/checkout.html',
                controller: 'SimulateCheckout',
                containerClass: 'sw-toggled'
            })

            .state("checkin", {
                url: "/simulator/checkin",
                templateUrl: '/PBS-Admin-UI/app/simulator/checkin.html',
                controller: 'SimulateCheckin',
                containerClass: 'sw-toggled'
            })
    }]);

    // Growl Global Configuration
    app.config(["growlProvider", function (growlProvider) {
        growlProvider.globalPosition('bottom-left');
        growlProvider.globalTimeToLive(10000);
        growlProvider.globalDisableCountDown(true);
    }]);

    // Google Maps Global Configuration
    app.config(function (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyD1lOceuIfGFTiuCPh8_lFM3KhF5pOj_lc',
            v: '3.20',
            libraries: 'weather,geometry,visualization'
        });
    })

})();