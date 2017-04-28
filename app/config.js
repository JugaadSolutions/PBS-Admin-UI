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

            .state("admin.docking-stations.docking-station-more-details", {
                url: "/docking-station-more-details/:id",
                templateUrl: adminViewPath + 'docking-stations/docking-station-more-details.html',
                controller: 'DockingStationMoreDetails',
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
                controller: 'EditRegistrationCentre',
                containerClass: 'sw-toggled'
            })

            /*Tickets*/
            .state("admin.tickets",{
                url:"/tickets",
                templateUrl:adminViewPath + 'tickets/tickets-details.html',
                containerClass:'sw-toggled'
            })
            .state("admin.tickets.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'tickets/manage.html',
                controller: 'ManageTicketsDetails',
                containerClass: 'sw-toggled'
            })

            .state("admin.tickets.add", {
                url: "/add",
                templateUrl: adminViewPath + 'tickets/add.html',
                controller: 'AddTicketsDetails',
                containerClass: 'sw-toggled'
            })

            .state("admin.tickets.edit", {
                url: "/edit/:id",
                templateUrl: adminViewPath + 'tickets/edit.html',
                controller: 'EditTickets',
                containerClass: 'sw-toggled'
            })

            .state("admin.tickets.adminedit", {
                url: "/adminedit",
                templateUrl: adminViewPath + 'tickets/adminedit.html',
                controller: 'EditTickets',
                containerClass: 'sw-toggled'
            })

            .state("admin.tickets.raise-tickets", {
                url: "/raise-tickets/:id",
                templateUrl: adminViewPath + 'tickets/raise-tickets.html',
                controller: 'SearchMemberRaiseTickets',
                containerClass: 'sw-toggled'
            })

            /*Topup plans*/
            .state("admin.topup-plans",{
                url:"/topup-plans",
                templateUrl:adminViewPath + 'topup-plans/topup.html',
                containerClass:'sw-toggled'
            })

            .state("admin.topup-plans.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'topup-plans/manage.html',
                controller: 'ManageTopupPlans',
                containerClass: 'sw-toggled'
            })

            .state("admin.topup-plans.add", {
                url: "/add",
                templateUrl: adminViewPath + 'topup-plans/add.html',
                controller: 'AddTopupPlans',
                containerClass: 'sw-toggled'
            })

            .state("admin.topup-plans.edit", {
                url: "/edit/:id",
                templateUrl: adminViewPath + 'topup-plans/edit.html',
                controller: 'EditTopupPlans',
                containerClass: 'sw-toggled'
            })

            /*Ports test*/
            .state("admin.ports-testing",{
                url:"/ports-testing",
                templateUrl:adminViewPath + 'ports-testing/porttest-manage.html',
                containerClass:'sw-toggled'
            })

            .state("admin.ports-testing.test", {
                url: "/test",
                templateUrl: adminViewPath + 'ports-testing/test.html',
                controller: 'AddCheckInCheckOut',
                containerClass: 'sw-toggled'
            })

            /*check in check out - bridge*/
            .state("admin.checkincheckout-bridge",{
                url:"/checkincheckout-bridge",
                templateUrl:adminViewPath + 'checkincheckout-bridge/manage.html',
                containerClass:'sw-toggled'
            })

            .state("admin.checkincheckout-bridge.checkincheckout", {
                url: "/checkincheckout",
                templateUrl: adminViewPath + 'checkincheckout-bridge/checkincheckout.html',
                controller: 'CheckInCheckOutBridge',
                containerClass: 'sw-toggled'
            })


            /*KPI*/
            .state("admin.kpi",{
                url:"/kpi",
                templateUrl:adminViewPath+'kpi/kpi-manage.html',
                containerClass:'sw-toggled'
            })

            .state("admin.kpi.dash-board",{
                url:"/dash-board",
                templateUrl: adminViewPath + 'kpi/dash-board.html',
                controller: 'kpiDetails',
                containerClass: 'sw-toggled'
            })

            /*Miantenance*/
            .state("admin.maintenance",{
                url:"/maintenance",
                templateUrl:adminViewPath + 'maintenance/manage.html',
                containerClass:'sw-toggled'
            })

            .state("admin.maintenance.manage-view",{
                url:"/manage-view",
                templateUrl:adminViewPath + 'maintenance/manage-view.html',
                controller:'DockingStationCleanReport',
                containerClass:'sw-toggled'
            })

            .state("admin.maintenance.add",{
                url:"/add",
                templateUrl:adminViewPath + 'maintenance/add.html',
                controller:'AddDockingStationClean',
                containerClass:'sw-toggled'
            })


            .state("admin.maintenance.new-design", {
                url: "/maintenance/new-design",
                templateUrl: adminViewPath + 'maintenance/new-design/manage.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.maintenance.new-design.manageview",{
                url:"/manageview",
                templateUrl:adminViewPath + 'maintenance/new-design/manageview.html',
                controller:'DockingStationStationNewDesign',
                containerClass:'sw-toggled'
            })

            /*.state("admin.maintenance.clean-report", {
                url: "/maintenance/clean-report",
                templateUrl: adminViewPath + 'maintenance/clean-report/clean.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.maintenance.clean-report.manage",{
                url:"/manage",
                templateUrl:adminViewPath + 'maintenance/clean-report/manage.html',
                controller:'DockingStationCleanReport',
                containerClass:'sw-toggled'
            })*/

            /* .state("admin.maintenance.dockingstationcleaning-report",{
                url:"/dockingstationcleaning-report",
                templateUrl:adminViewPath + 'maintenance/dockingstationcleaning-report.html',
                controller:'AddDockingStationCleanReport',
                containerClass:'sw-toggled'
            })*/

          .state("admin.maintenance.dockingstationcleaning-report-print",{
                url:"/dockingstationcleaning-report-print",
                templateUrl:adminViewPath + 'maintenance/dockingstationcleaning-report-print.html',
                controller:'DockingStationCleanReportPrint',
                containerClass:'sw-toggled'
            })

                // global ticket type
            .state("admin.settings",{
                url:"/settings",
                templateUrl:adminViewPath + 'settings/manage.html',
                containerClass:'sw-toggled'
            })

            .state("admin.settings.ticket-type", {
                url: "/settings/ticket-type",
                templateUrl: adminViewPath + 'settings/ticket-type/type.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.settings.ticket-type.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'settings/ticket-type/manage.html',
                controller:'TicketTypeManage',
                containerClass: 'sw-toggled'
            })
            .state("admin.settings.ticket-type.add", {
                url: "/add",
                templateUrl: adminViewPath + 'settings/ticket-type/add.html',
                controller:'TicketTypeAdd',
                containerClass: 'sw-toggled'
            })
            .state("admin.settings.ticket-type.edit", {
                url: "/edit",
                templateUrl: adminViewPath + 'settings/ticket-type/edit.html',
                controller:'SettingTypeEdit',
                containerClass: 'sw-toggled'
            })


            // bicycle maintenance report
            .state("admin.maintenance.bicycle-maintenance",{
                url:"/maintenance/bicycle-manage",
                templateUrl:adminViewPath + 'maintenance/bicycle-maintenance/bicycle-manage.html',
                controller:'BicycleMaintenanceManage',
                containerClass:'sw-toggled'
            })

            .state("admin.maintenance.bicycle-maintenance.report",{
                url:"/report",
                templateUrl:adminViewPath + 'maintenance/bicycle-maintenance/report.html',
                controller:'BicycleMaintenanceReport',
                containerClass:'sw-toggled'
            })
            .state("admin.maintenance.bicycle-maintenance.report-print",{
                url:"/report-print",
                templateUrl:adminViewPath + 'maintenance/bicycle-maintenance/report-print.html',
                controller:'BicycleMaintenanceReportPrint',
                containerClass:'sw-toggled'
            })

            /*Accounts*/
            .state("admin.accounts", {
                url: "/accounts",
                templateUrl: adminViewPath + 'accounts/accounts.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.accounts.cash-collectionsummary", {
                url: "/cash-collectionsummary",
                templateUrl: adminViewPath + 'accounts/cash-collectionsummary.html',
                controller: 'CashCollectionSummary',
                containerClass: 'sw-toggled'
            })

            .state("admin.accounts.daywise-collectionsummary", {
                url: "/daywise-collectionsummary",
                templateUrl: adminViewPath + 'accounts/daywise-collectionsummary.html',
                controller: 'dayWiseCollectionSummary',
                containerClass: 'sw-toggled'
            })

            .state("admin.accounts.refunds", {
                url: "/refunds",
                templateUrl: adminViewPath + 'accounts/refunds.html',
                controller: 'refundsSummary',
                containerClass: 'sw-toggled'
            })

            .state("admin.accounts.totalcash-report", {
                url: "/totalcash-report",
                templateUrl: adminViewPath + 'accounts/totalcash-report.html',
                controller: 'totalCashReport',
                containerClass: 'sw-toggled'
            })

            /*Accounts Closer*/
            .state("admin.accounts-closer", {
                url: "/accounts-closer",
                templateUrl: adminViewPath + 'accounts-closer/closer.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.accounts-closer.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'accounts-closer/manage.html',
                controller: 'AccountsCloser',
                containerClass: 'sw-toggled'
            })


            /*bank*/
            .state("admin.accounts.bankcashdeposits", {
                url: "/accounts/bankcashdeposits",
                templateUrl: adminViewPath + 'accounts/bankcashdeposits/bankcash.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.accounts.bankcashdeposits.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'accounts/bankcashdeposits/manage.html',
                controller: 'ManageBankCashDeposits',
                containerClass: 'sw-toggled'
            })

            .state("admin.accounts.bankcashdeposits.add", {
                url: "/add",
                templateUrl: adminViewPath + 'accounts/bankcashdeposits/add.html',
                controller: 'AddBankCashDeposits',
                containerClass: 'sw-toggled'
            })

            .state("admin.accounts.bankcashdeposits.bankcashdeposit-report", {
            url: "/bankcashdeposit-report",
            templateUrl: adminViewPath + 'accounts/bankcashdeposits/bankcashdeposit-report.html',
            controller: 'BankCashDepositReport',
            containerClass: 'sw-toggled'
            })


            .state("admin.accounts.bankcashdeposits.totalcash-report-print", {
                url: "/totalcash-report-print",
                templateUrl: adminViewPath + 'accounts/bankcashdeposits/totalcash-report-print.html',
                controller: 'totalCashReportPrint',
                containerClass: 'sw-toggled'
            })

            .state("admin.accounts.daywise-collectionsummary-report-print", {
                url: "/daywise-collectionsummary-report-print",
                templateUrl: adminViewPath + 'accounts/daywise-collectionsummary-report-print.html',
                controller: 'DaywsieCollectionSummaryReportPrint',
                containerClass: 'sw-toggled'
            })

            .state("admin.accounts.cash-collectionsummary-print", {
                url: "/cash-collectionsummary-print",
                templateUrl: adminViewPath + 'accounts/cash-collectionsummary-print.html',
                controller: 'CashCollectionSummaryPrint',
                containerClass: 'sw-toggled'
            })

            .state("admin.accounts.bankcashdeposits.bankcashdeposit-report-print", {
                url: "/bankcashdeposit-report-print",
                templateUrl: adminViewPath + 'accounts/bankcashdeposits/bankcashdeposit-report-print.html',
                controller: 'BankCashDepositReportPrint',
                containerClass: 'sw-toggled'
            })


            /*User-Transaction-Statistics*/
            .state("admin.accounts.user-transaction-statistics", {
                url: "/accounts/user-transaction-statistics",
                templateUrl: adminViewPath + 'accounts/user-transaction-statistics/user-transaction.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.accounts.user-transaction-statistics.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'accounts/user-transaction-statistics/manage.html',
                controller: 'UserTransactionStatistics',
                containerClass: 'sw-toggled'
            })

            .state("admin.accounts.user-transaction-statistics.user-transaction-statistics-print", {
                url: "/user-transaction-statistics-print",
                templateUrl: adminViewPath + 'accounts/user-transaction-statistics/user-transaction-statistics-print.html',
                controller: 'UserAccountStatusReportPrint',
                containerClass: 'sw-toggled'
            })

            /*User-Accounts-Status*/
            .state("admin.accounts.user-account-status", {
                url: "/accounts/user-account-status",
                templateUrl: adminViewPath + 'accounts/user-account-status/user-accounts.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.accounts.user-account-status.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'accounts/user-account-status/manage.html',
                controller: 'UserAccountStatus',
                containerClass: 'sw-toggled'
            })

            .state("admin.accounts.user-account-status.user-accounts-report-print", {
                url: "/user-accounts-report-print",
                templateUrl: adminViewPath + 'accounts/user-account-status/user-accounts-report-print.html',
                controller: 'UserAccountStatusReport',
                containerClass: 'sw-toggled'
            })

            /*Registration details*/
            .state("admin.registration-details", {
                url: "/registration-details",
                templateUrl: adminViewPath + 'registration-details/registrationdetails-manage.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.registration-details.registration-details", {
                url: "/registration-details",
                templateUrl: adminViewPath + 'registration-details/registration-details.html',
                controller: 'registrationDetails',
                containerClass: 'sw-toggled'
            })

           /* .state("admin.ports-testing",{
                url:"/ports-testing",
                templateUrl:adminViewPath + 'ports-testing/porttest-manage.html',
                containerClass:'sw-toggled'
            })

            .state("admin.ports-testing.test", {
                url: "/test",
                templateUrl: adminViewPath + 'ports-testing/test.html',
                controller: 'AddCheckInCheckOut',
                containerClass: 'sw-toggled'
            })*/

           /* .state("admin.accounts.bankcashdeposits", {
                url: "/accounts/bankcashdeposits",
                templateUrl: adminViewPath + 'accounts/bankcashdeposits/bankcash.html',
                containerClass: 'sw-toggled'
            })

            .state("admin.accounts.bankcashdeposits.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'accounts/bankcashdeposits/manage.html',
                controller: 'ManageBankCashDeposits',
                containerClass: 'sw-toggled'
            })*/


            .state("admin.kpi.reports", {
                url: "/kpi/reports",
                templateUrl: adminViewPath + "kpi/reports/reports.html"
            })

            .state("admin.kpi.reports.average-cycle-per-day", {
                url: "/average-cycle-per-day",
                templateUrl: adminViewPath + 'kpi/reports/average-cycle-per-day.html',
                controller: 'KpiReportAverageCyclePerDay',
                containerClass: 'sw-toggled'
            })

            .state("admin.kpi.reports.cycles-available-6am", {
                url: "/cycles-available-6am",
                templateUrl: adminViewPath + 'kpi/reports/cycles-available-6am.html',
                controller: 'KpiReportCycleAvailableAt6am',
                containerClass: 'sw-toggled'
            })

            .state("admin.kpi.reports.docking-station-clean", {
                url: "/docking-station-clean",
                templateUrl: adminViewPath + 'kpi/reports/docking-station-clean.html',
                controller: 'KpiReportDockingStationClean',
                containerClass: 'sw-toggled'
            })

            .state("admin.kpi.reports.smart-card-at-hub", {
                url: "/smart-card-at-hub",
                templateUrl: adminViewPath + 'kpi/reports/smart-card-at-hub.html',
                controller: 'KpiReportSmartCardAtHub',
                containerClass: 'sw-toggled'
            })

            .state("admin.kpi.reports.smart-card-at-kiosks", {
                url: "/smart-card-at-kiosks",
                templateUrl: adminViewPath + 'kpi/reports/smart-card-at-kiosks.html',
                controller: 'KpiReportSmartCardAtKiosks',
                containerClass: 'sw-toggled'
            })

            /*empty docking station (major) in peak hours*/
            .state("admin.kpi.reports.empty-major-ds-peak-hours", {
                url: "/empty-major-ds-peak-hours",
                templateUrl: adminViewPath + 'kpi/reports/empty-major-ds-peak-hours.html',
                controller: 'KpiReportEmptyMajorDSPeak',
                containerClass: 'sw-toggled'
            })

            /*empty docking station (minor) in peak hours*/
            .state("admin.kpi.reports.empty-minor-ds-peek-hours", {
                url: "/empty-minor-ds-peek-hours",
                templateUrl: adminViewPath + 'kpi/reports/empty-minor-ds-peek-hours.html',
                controller: 'KpiReportEmptyMinorDSPeak',
                containerClass: 'sw-toggled'
            })

            /*empty docking station (minor) in offpeak hours*/
            .state("admin.kpi.reports.empty-major-ds-offpeek-hours", {
                url: "/empty-major-ds-offpeek-hours",
                templateUrl: adminViewPath + 'kpi/reports/empty-major-ds-offpeek-hours.html',
                controller: 'KpiReportEmptyMajorDSOffPeak',
                containerClass: 'sw-toggled'
            })

            /*empty docking station (minor) in offpeak hours*/
            .state("admin.kpi.reports.empty-minor-ds-offpeek-hours", {
                url: "/empty-minor-ds-offpeek-hours",
                templateUrl: adminViewPath + 'kpi/reports/empty-minor-ds-offpeek-hours.html',
                controller: 'KpiReportEmptyMinorDSOffPeak',
                containerClass: 'sw-toggled'
            })

            /*Station neither empty nor full more than 2 hours*/
            .state("admin.kpi.reports.stations-full-or-empty-more-than-two-hours", {
                url: "/stations-full-or-empty-more-than-two-hours",
                templateUrl: adminViewPath + 'kpi/reports/stations-full-or-empty-more-than-two-hours.html',
                controller: 'KpiReportEmptyFull',
                containerClass: 'sw-toggled'
            })

            .state("admin.kpi.reports.number-of-valid-complaints", {
                url: "/number-of-valid-complaints",
                templateUrl: adminViewPath + 'kpi/reports/number-of-valid-complaints.html',
                controller: 'NumberOfValidComplaints',
                containerClass: 'sw-toggled'
            })

            // website downtime
            .state("admin.website-downtime", {
                url: "/website-downtime",
                templateUrl: adminViewPath + "website-downtime/website.html"
            })

            .state("admin.website-downtime.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'website-downtime/manage.html',
                controller: 'ManageWebsiteDownTime',
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

            // other stations (fleet)
            .state("admin.otherstation-fleet", {
                url: "/otherstation-fleet",
                templateUrl: adminViewPath + "otherstation-fleet/otherstation-fleet.html"
            })

            .state("admin.otherstation-fleet.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'otherstation-fleet/manage.html',
                controller: 'OtherStationFleetManage',
                containerClass: 'sw-toggled'
            })

            .state("admin.otherstation-fleet.add", {
                url: "/add",
                templateUrl: adminViewPath + 'otherstation-fleet/add.html',
                controller: 'OtherStationFleetAdd',
                containerClass: 'sw-toggled'
            })

            // other stations (maintenance centre)
            .state("admin.otherstation-maintenance", {
                url: "/otherstation-maintenance",
                templateUrl: adminViewPath + "otherstation-maintenance/otherstation-maintenance.html"
            })

            .state("admin.otherstation-maintenance.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'otherstation-maintenance/manage.html',
                controller: 'OtherStationMaitenanceCentreManage',
                containerClass: 'sw-toggled'
            })

            .state("admin.otherstation-maintenance.add", {
                url: "/add",
                templateUrl: adminViewPath + 'otherstation-maintenance/add.html',
                controller: 'OtherStationMaintenanceCentretAdd',
                containerClass: 'sw-toggled'
            })

            //internal Stations
            .state("admin.internal-stations", {
                url: "/internal-stations",
                templateUrl: adminViewPath + "internal-stations/internal-stations.html"
            })

            .state("admin.internal-stations.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'internal-stations/manage.html',
                controller: 'InternalStationManage',
                containerClass: 'sw-toggled'
            })

            .state("admin.internal-stations.add", {
                url: "/add",
                templateUrl: adminViewPath + 'internal-stations/add.html',
                controller: 'InternalStationAdd',
                containerClass: 'sw-toggled'
            })

            // fleets
            .state("admin.fleets", {
                url: "/fleets",
                templateUrl: adminViewPath + "fleets/fleets.html"
            })

            .state("admin.fleets.manage", {
                url: "/manage",
                templateUrl: adminViewPath + 'fleets/manage.html',
                controller: 'FleetsManage',
                containerClass: 'sw-toggled'
            })

            .state("admin.fleets.add", {
                url: "/add",
                templateUrl: adminViewPath + 'fleets/add.html',
                controller: 'FleetsAdd',
                containerClass: 'sw-toggled'
            })

            .state("admin.fleets.edit", {
                url: "/edit",
                templateUrl: adminViewPath + 'fleets/edit.html',
                controller: 'EditFleets',
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

            .state("admin.reports.port-status",{
                url:"/port-status",
                templateUrl: adminViewPath + 'reports/port-status.html',
                controller:'PortStatus',
                containerClass:'sw-toggled'
            })

            .state("admin.reports.bicycle-life-cycle", {
                url: "/bicycle-life-cycle",
                templateUrl: adminViewPath + 'reports/bicycle-life-cycle.html',
                controller: 'BicycleLifeCycle',
                containerClass: 'sw-toggled'
            })

            .state("admin.reports.redistribution-vehicle-track", {
                url: "/redistribution-vehicle-track",
                templateUrl: adminViewPath + 'reports/redistribution-vehicle-track.html',
                controller: 'RedistributionVehicleTracking',
                containerClass: 'sw-toggled'
            })

            // bicycle availability summary
            .state("admin.reports.bicycle-summary", {
                url: "/bicycle-summary",
                templateUrl: adminViewPath + 'reports/bicycle-summary.html',
                controller: 'BicycleSummary',
                containerClass: 'sw-toggled'
            })

            // bicycle available in Redistribution vehicle
            .state("admin.reports.redistribution-vehicle", {
                url: "/redistribution-vehicle",
                templateUrl: adminViewPath + 'reports/redistribution-vehicle.html',
                controller: 'RedistributionVehiclesLiveData',
                containerClass: 'sw-toggled'
            })

            // bicycle available in Holding area
            .state("admin.reports.holding-area", {
                url: "/holding-area",
                templateUrl: adminViewPath + 'reports/holding-area.html',
                controller: 'HoldingAreaLiveData',
                containerClass: 'sw-toggled'
            })

            // bicycle available in maintenance centre
            .state("admin.reports.maintenance-centre", {
                url: "/maintenance-centre",
                templateUrl: adminViewPath + 'reports/maintenance-centre.html',
                controller: 'MaintenanceCentreLiveData',
                containerClass: 'sw-toggled'
            })

            // MIS
            .state("admin.reports.mis", {
                url: "/mis",
                templateUrl: adminViewPath + 'reports/mis.html',
                controller: 'MIS',
                containerClass: 'sw-toggled'
            })

            // bicylcle transaction (check out)
            .state("admin.reports.bicycle-transactions", {
                url: "/bicycle-transactions",
                templateUrl: adminViewPath + 'reports/bicycle-transactions.html',
                controller: 'BicycleTransactions',
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