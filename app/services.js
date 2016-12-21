// =========================================================================
// PBS Admin Services
// =========================================================================

(function () {
    'use strict';

    var app = angular.module("pbs");

    app.factory('DataService', ['$http', '$q', 'APIEndPoint', 'API','APINew', function ($http, $q, APIEndPoint, API,APINew) {
        return {
            getMembers: function (filters) {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.member.getAll, {
                    params: filters
                }).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveMember: function (data) {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.member.save, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            verifyDocument: function (data) {
                var deferred = $q.defer();
                $http.put(APINew + APIEndPoint.member.update + '/' + data._id, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateMembershipForMember: function (data) {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.member.update + '/' + data._id + '/' + APIEndPoint.member.membershipForMember, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateSmartCardForMember: function (data) {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.member.update + '/' + data._id + '/' + APIEndPoint.member.smartCardForMember, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            addCredit: function (id, data) {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.member.save + '/' + id + '/' + APIEndPoint.member.credit, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            addDebit: function (id, data) {
                var deferred = $q.defer();
                $http.post(API + APIEndPoint.member.save + '/' + id + '/' + APIEndPoint.member.debit, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

           /* cancelMember:function(id){
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.member.save + '/' + id + '/' + APIEndPoint.member.cancel, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },*/

           /*membership cancel request*/
            cancelRequest: function (id) {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.member.save + '/' + id + '/' + APIEndPoint.member.request, {
                }).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            /*membership cancel*/
            cancelMembership: function (id, data) {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.member.save + '/' + id + '/' + APIEndPoint.member.cancel, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            suspendMember:function(id,data){
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.member.save + '/' + id + '/' + APIEndPoint.member.suspend, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            getMember: function (data, filters) {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.member.get + '/' + data, {
                    params: filters
                }).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateMember: function (data) {
                var deferred = $q.defer();
                $http.put(APINew + APIEndPoint.member.update + '/' + data._id, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getEmployees: function (filters) {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.employee.getAll + '/' , {
                    params: filters
                }).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            testConnectionForIP: function (data) {
                var deferred = $q.defer();
                $http.post(API + APIEndPoint.dockingStations.testConnection, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveDockingStationWithOutSync: function (data) {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.dockingStations.post, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveDockingStationWithSync: function (data) {
                var deferred = $q.defer();
                $http.post(API + APIEndPoint.dockingStations.sync, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getEmployee: function (data) {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.employee.get + '/' + data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveEmployee: function (data) {
                var deferred = $q.defer();
                var _department = data.department;
                var _url;
                if (_department  === 'Registration Member Staff')
                {
                    _url = 'registrationstaff';
                }
                else if (_department === 'Redistribution Member Staff')
                {
                }
                else if (_department === 'Maintenance Center Staff')
                {
                    _url = 'mcstaff';
                }
                else if (_department === 'Information Technology Staff')
                {
                }
                else if (_department === 'Office Staff')
                {
                }
                else if (_department === 'Docking Station Repair Staff')
                {
                }
                else
                {

                }

                $http.post(APINew + APIEndPoint.employee.save + '/' + _url  , data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            verifyDocumentEmployee: function (data) {
                var deferred = $q.defer();
                $http.put(APINew + APIEndPoint.employee.update + '/' + data._id, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateEmployee: function (data) {
                var deferred = $q.defer();
                $http.put(APINew + APIEndPoint.employee.update + '/' + data._id, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveChangePassword: function (data) {
                var deferred = $q.defer();
                $http.put(API + APIEndPoint.user.user + '/' + data._id + '/' + APIEndPoint.user.password, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateSmartCardForEmployee: function (data) {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.employee.update + '/' + data._id + '/' + APIEndPoint.employee.smartCardForEmployee, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getMemberships: function (filters) {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.membership.getAll, {
                    params: filters
                }).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getMembership: function (data, filters) {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.membership.get + '/' + data, {
                    params: filters
                }).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveMembership: function (data) {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.membership.save, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateMembership: function (data) {
                var deferred = $q.defer();
                $http.put(API + APIEndPoint.membership.update + '/' + data._id, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getDockingStations: function () {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.dockingStations.getAll).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getStationsCount: function () {
                var deferred = $q.defer();
                $http.get(API + APIEndPoint.dockingStations.count).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveDockingStation: function (data) {
                var deferred = $q.defer();
                $http.post(API + APIEndPoint.dockingStations.save, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error)
                });
                return deferred.promise;
            },
            getDockingStation: function (data) {
                var deferred = $q.defer();
                $http.get(API + APIEndPoint.dockingStations.get + '/' + data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateDockingStation: function (data) {
                var deferred = $q.defer();
                $http.put(API + APIEndPoint.dockingStations.update + '/' + data._id, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getDockingUnits: function (filters) {
                var deferred = $q.defer();
                $http.get(API + APIEndPoint.dockingUnits.getAll,
                    {
                        params: filters
                    }).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getDockingUnit: function (data, filters) {
                var deferred = $q.defer();
                $http.get(API + APIEndPoint.dockingUnits.get + '/' + data, {
                    params: filters
                }).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveDockingUnit: function (data) {
                var deferred = $q.defer();
                $http.post(API + APIEndPoint.dockingUnits.save, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateDockingUnit: function (data) {
                var deferred = $q.defer();
                $http.put(API + APIEndPoint.dockingUnits.update + '/' + data._id, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getDockingPorts: function (filters) {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.dockingPorts.getAll,
                    {
                        params: filters
                    }).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getDockingPort: function (data, filters) {
                var deferred = $q.defer();
                $http.get(API + APIEndPoint.dockingPorts.get + '/' + data, {
                    params: filters
                }).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveDockingPort: function (data) {
                var deferred = $q.defer();
                $http.post(API + APIEndPoint.dockingPorts.save, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateDockingPort: function (data) {
                var deferred = $q.defer();
                $http.put(API + APIEndPoint.dockingPorts.update + '/' + data._id, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getBicycles: function (filters) {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.vehicle.getAll, {
                    params: filters
                }).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveBicycle: function (data) {
                var deferred = $q.defer();
               /* $http.post(APINew + APIEndPoint.bicycle.save, data).then(function (result) {*/
                 $http.post(APINew + APIEndPoint.vehicle.save, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getBicycle: function (data) {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.vehicle.get + '/' + data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getBicycleRFID: function (filter) {
                var deferred = $q.defer();
                $http.get(API + APIEndPoint.bicycle.get, {
                    params: filter
                }).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateBicycle: function (data) {
                var deferred = $q.defer();
                $http.put(API + APIEndPoint.bicycle.update + '/' + data._id, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getRedistributionVehicles: function () {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.redistributionVehicles.getAll).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveRedistributionVehicle: function (data) {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.redistributionVehicles.save, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getRedistributionVehicle: function (data) {
                var deferred = $q.defer();
                $http.get(API + APIEndPoint.redistributionVehicles.get + '/' + data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateRedistributionVehicle: function (data) {
                var deferred = $q.defer();
                $http.put(API + APIEndPoint.redistributionVehicles.update + '/' + data._id, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getFarePlans: function () {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.farePlan.getAll).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            getStaffs: function () {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.staffSelection.getAll).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },



            saveFarePlan: function (data) {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.farePlan.save, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getFarePlan: function (data) {
                var deferred = $q.defer();
                $http.get(API + APIEndPoint.farePlan.get + '/' + data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateFarePlan: function (data) {
                var deferred = $q.defer();
                $http.put(API + APIEndPoint.farePlan.update + '/' + data._id, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getHoldingAreas: function () {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.holdingArea.getAll).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            getFleets: function () {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.fleet.getAll).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            saveHoldingArea: function (data) {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.holdingArea.save, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getHoldingArea: function (data) {
                var deferred = $q.defer();
                $http.get(API + APIEndPoint.holdingArea.get + '/' + data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateHoldingArea: function (data) {
                var deferred = $q.defer();
                $http.put(API + APIEndPoint.holdingArea.update + '/' + data._id, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getMaintenanceCentres: function () {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.maintenanceCentre.getAll).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveMaintenanceCentre: function (data) {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.maintenanceCentre.save, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            getRegistrationCentres: function () {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.registrationCentre.getAll).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            /*bank cash deposit details*/
            getBankCashDepositDetails: function () {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.bankCashDeposit.getAll).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            /*Registration Centres*/
            saveRegistrationCentre: function (data) {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.registrationCentre.save, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            /*docking station cleaning */
            saveDockingStationCleaning: function (data) {
                var _enteredDate=data.cleaningDate;
                var _enteredTimeFrom = data.cleaningTimeFrom;
                var _enteredTimeTo= data.cleaningTimeTo;

                var _date =_enteredDate.getDate();
                if(_date.toString().length ===1)
                {
                    _date=0 +""+_enteredDate.getDate();
                }
                else
                {
                    _date=_enteredDate.getDate();
                }
                var _month=_enteredDate.getMonth()+1;
                if(_month.toString().length===1)
                {
                    _month=0+""+_enteredDate.getMonth();
                }
                else
                {
                    _month=_enteredDate.getMonth();
                }
                var _year=_enteredDate.getFullYear();
                var Date=_year+"-"+_month+"-"+_date;
                var _timeFrom = Date+"T"+_enteredTimeFrom+":"+"00"+":"+"000"+"Z";
                var _timeTo = Date+"T"+_enteredTimeTo+":"+"00"+":"+"000"+"Z";
                var deferred = $q.defer();
                var CleanDockingStation={
                    stationName:data.stationName,
                    cleaningDate:data.cleaningDate,
                    cleaningTimeFrom:_timeFrom,
                    cleaningTimeTo:_timeTo
                };
                $http.post(APINew + APIEndPoint.dockingStationCleaning.save, CleanDockingStation).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            getDockingStationCleaningDetails: function () {
            var deferred = $q.defer();
            $http.get(APINew + APIEndPoint.dockingstationcleaning.getAll).then(function (result) {
                deferred.resolve(result.data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
            },

            /*Registration details*/
            SendRegistrationDetails:function (data) {
              var deferred = $q.defer();
                $http.post(API + APIEndPoint.registrationDetails.getAll,data).then(function (result) {
                    deferred.resolve(result.data);
                },function (error) {
                    deferred.reject(error)
                });
                return deferred.promise;
            },

            /*Refunds Details (post)*/
            SendRefundDetails:function (data) {
                var deferred = $q.defer();
                $http.post(API + APIEndPoint.refundDetails.getAll,data).then(function (result) {
                    deferred.resolve(result.data);
                },function (error) {
                    deferred.reject(error)
                });
                return deferred.promise;
            },

            /*Cash Collection Details*/
            SendCashCollectionDetails:function (data) {
                var deferred = $q.defer();
                $http.post(API + APIEndPoint.cashCollection.getAll,data).then(function (result) {
                    deferred.resolve(result.data);
                },function (error) {
                    deferred.reject(error)
                });
                return deferred.promise;
            },

            /*Daywise cash collections*/
            SendDaywiseCashCollectionDetails:function (data) {
                var deferred = $q.defer();
                var _transaction_type = data.transactionType;
                var test;
                if (_transaction_type  === 'Registration')
                {
                    test = 'Credit note'
                }
                var daywiseCollection = {
                    fromdate:data.fromdate,
                    todate:data.todate,
                    location:data.location,
                    transactionType : test
                };
                $http.post(APINew + APIEndPoint.daywiseCollection.getAll,daywiseCollection).then(function (result) {
                    deferred.resolve(result.data);
                },function (error) {
                    deferred.reject(error)
                });
                return deferred.promise;
            },

            /*Total Cash Details*/
            SendTotalCashCollectionDetails:function (data) {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.totalCashCollection.getAll,data).then(function (result) {
                    deferred.resolve(result.data);
                },function (error) {
                    deferred.reject(error)
                });
                return deferred.promise;
            },

         /*   /!*Total Cash Details Print*!/
            SendTotalCashCollectionDetailsPrint:function (data) {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.totalCashCollection.getAll,data).then(function (result) {
                    deferred.resolve(result.data);
                },function (error) {
                    deferred.reject(error)
                });
                return deferred.promise;
            },*/

            SendBankCashDepositDetails:function (data) {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.bankCashDepositReport.getAll,data).then(function (result) {
                    deferred.resolve(result.data);
                },function (error) {
                    deferred.reject(error)
                });
                return deferred.promise;
            },

            /*Bank cash deposit details*/
            saveBankCashDepositDetails:function (data) {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.bankCashDeposit.save,data).then(function (result) {
                    deferred.resolve(result.data);
                },function (error) {
                    deferred.reject(error)
                });
                return deferred.promise;
            },


            /*KPI details*/
            SendKPIDetails:function (data) {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.kpiDetails.getAll,data).then(function (result) {
                    deferred.resolve(result.data);
                },function (error) {
                    deferred.reject(error)
                });
                return deferred.promise;
            },

            GetRVDetails:function (data) {
                var deferred = $q.defer();
                 $http.post(APINew + APIEndPoint.kpiDetails.getAll,data).then(function (result) {
                 deferred.resolve(result.data);
                 },function (error) {
                 deferred.reject(error)
                 });
                 return deferred.promise;
            },

            saveTicketDetails:function(data)
            {
                var deferred = $q.defer();
                $http.post(API + APIEndPoint.ticketsDetails.save, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            /*check in check out*/
            saveCheckInCheckOut:function(data)
            {
                var deferred = $q.defer();
                $http.post(APINew + APIEndPoint.checkIncheckOut.save, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            saveCheckIn:function(data)
            {
                var deferred = $q.defer();
                var _toPort = data.fromPort;
                var CheckIn = {
                    cardId:data.cardId,
                    vehicleId:data.vehicleId,
                    toPort:data.fromPort,
                    checkInTime : new Date()
                };
                $http.post(APINew + APIEndPoint.checkIn.save, CheckIn).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            saveCheckOutBridge:function(data)
            {
                var currentDate = data.checkOutTime;
                var enteredDate = data.bridgeDate;
                var enterTime=data.bridgeTime;
                var _Date= enteredDate.getDate();
                if (_Date.toString().length === 1)
                {
                    _Date = 0 + "" + enteredDate.getDate();
                }
                else
                {
                    _Date= enteredDate.getDate();
                }
                var _Month = enteredDate.getMonth()+1;
                if (_Month.toString().length === 1)
                {
                    _Month = 0 + "" + enteredDate.getMonth();
                }
                else
                {
                    _Month= enteredDate.getMonth();
                }
                var _Year=enteredDate.getFullYear();
                var Date= _Year + "-" + _Month + "-" + _Date;
                var _Hour = enteredDate.getHours(2);
                var _Minutes= enteredDate.getMinutes(2);
                var _Seconds=enteredDate.getSeconds(2);
                var _Miliseconds=enteredDate.getMilliseconds();
                var Time=_Hour + ":" + _Minutes + ":" + _Seconds + ":" + _Miliseconds;
                var Date_Time = Date + "T" + enterTime + "Z";
                var deferred = $q.defer();

                var checkOutBridge={
                    vehicleId:data.vehicleId,
                    cardId:data.cardId,
                    fromPort:data.fromPort,
                    checkOutTime:Date_Time
                };
                $http.post(APINew + APIEndPoint.checkOutBridge.save, checkOutBridge).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            saveCheckInBridge:function(data)
            {
                var enteredDate = data.bridgeDate;
                var enterTime=data.bridgeTime;
                var _Date= enteredDate.getDate();
                if (_Date.toString().length === 1)
                {
                    _Date = 0 + "" + enteredDate.getDate();
                }
                else
                {
                    _Date= enteredDate.getDate();
                }
                var _Month = enteredDate.getMonth()+1;
                if (_Month.toString().length === 1)
                {
                    _Month = 0 + "" + enteredDate.getMonth();
                }
                else
                {
                    _Month= enteredDate.getMonth();
                }
                var _Year=enteredDate.getFullYear();
                var Date= _Year + "-" + _Month + "-" + _Date;
                var _Hour = enteredDate.getHours(2);
                var _Minutes= enteredDate.getMinutes(2);
                var _Seconds=enteredDate.getSeconds(2);
                var _Miliseconds=enteredDate.getMilliseconds();
                var Time=_Hour + ":" + _Minutes + ":" + _Seconds + ":" + _Miliseconds;
                var Date_Time = Date + "T" + enterTime + "Z";
                var deferred = $q.defer();
                var _toPort = data.fromPort;
                var CheckIn = {
                    cardId:data.cardId,
                    vehicleId:data.vehicleId,
                    toPort:data.fromPort,
                    checkInTime : Date_Time
                };
                $http.post(APINew + APIEndPoint.checkInBridge.save, CheckIn).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },


            getMaintenanceCentre: function (data) {
                var deferred = $q.defer();
                $http.get(API + APIEndPoint.maintenanceCentre.get + '/' + data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateMaintenanceCentre: function (data) {
                var deferred = $q.defer();
                $http.put(API + APIEndPoint.maintenanceCentre.update + '/' + data._id, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
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
                $http.get(API + APIEndPoint.smartCard.get + '/' + data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateSmartCard: function (data) {
                var deferred = $q.defer();
                $http.put(API + APIEndPoint.smartCard.update + '/' + data.id, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getAllMemberTransactions: function (filters) {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.reports.transactions.getAll, {params: filters}).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getMemberTransaction: function (data) {
                var deferred = $q.defer();
                $http.get(API + APIEndPoint.reports.transactions.get + '/' + data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getRidesAdmin: function (data) {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.member.memberTransaction + '/' + data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getMemberPaymentTransaction: function (filters) {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.member.memberPaymentTransaction, {
                    params: filters
                }).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            getMemberPaymentTransaction1: function (data) {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.member.memberIndividualPaymentTransation + '/' + data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            saveMemberTransaction: function (data) {
                var deferred = $q.defer();
                $http.post(API + APIEndPoint.reports.transactions.checkOut, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            updateMemberTransaction: function (data) {
                var deferred = $q.defer();
                $http.post(API + APIEndPoint.reports.transactions.checkIn, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            initiateSync: function (data) {
                var deferred = $q.defer();
                $http.post(API + APIEndPoint.bicycle.initiateSync, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getBicycleAvailability: function () {
                var deferred = $q.defer();
                $http.get(APINew + APIEndPoint.bicycle.bicycleAvailabilityLocal).then(function (result)
                {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getBicycleLifeCycle: function (filters) {
                var deferred = $q.defer();
                $http.get(API + APIEndPoint.bicycle.bicycleLifeCycle, {
                    params: filters
                }).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            moveBicycle: function (data) {
                var deferred = $q.defer();
                $http.post(API + APIEndPoint.bicycle.moveBicycle, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            postCloseTransaction: function (data) {
                var deferred = $q.defer();
                $http.post(API + APIEndPoint.closeTransaction.post, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            forgotPassword: function (data) {
                var deferred = $q.defer();
                $http.put(API + APIEndPoint.user.forgotPassword, data).then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        }
    }]);

    app.factory('StatusService', ['APINew', function (APINew) {
        return {
            getDockingStationStatus: function (code) {
                var status = '';
                switch (code) {
                    case 0:
                        status = "Operational";
                        break;
                    case 1:
                        status = "Non Operational";
                        break;
                    default:
                        break;
                }
                return status;
            },
            getDockingUnitsStatus: function (code) {
                var status = '';
                switch (code) {
                    case  0:
                        status = "Operational";
                        break;
                    case  1:
                        status = "Non Operational";
                        break;
                    default:
                        break;
                }
                return status;
            },
            getTransactionStatus: function (code) {
                var status = '';
                switch (code) {
                    case  0:
                        status = "In Progress";
                        break;
                    case  1:
                        status = "Completed";
                        break;
                    case  -1:
                        status = "Canceled";
                        break;
                    default:
                        break;
                }
                return status;
            },
            getDockingPortStatus: function (code) {
                var status = '';
                switch (code) {
                    case  0:
                        status = "Bicycle Available";
                        break;
                    case  1:
                        status = "Empty Port";
                        break;
                    case  2:
                        status = "Bicycle Locked";
                        break;
                    case  3:
                        status = "Port Locked";
                        break;
                    case  4:
                        status = "Port Error";
                        break;
                    default:
                        break;
                }
                return status;
            },
            getRedistributionVehicleStatus: function (code) {
                var status = '';
                switch (code) {
                    case  0:
                        status = "On Road";
                        break;
                    case  1:
                        status = "At Brake";
                        break;
                    case  2:
                        status = "At Waiting Area";
                        break;
                    case  3:
                        status = "Miscellaneous Tasks";
                        break;
                    case  -1:
                        status = "Non Operational";
                        break;
                    default:
                        break;
                }
                return status;
            },
            getBicycleStatus: function (code) {
                var status = '';
                switch (code) {
                    case  0:
                        status = "Operational";
                        break;
                    case  1:
                        status = "Non-Operational";
                        break;
                    case  -1:
                        status = "Decommissioned";
                        break;
                    default:
                        break;
                }
                return status;
            },
            getBicycleLocation: function (code) {
                var location = '';
                switch (code) {
                    case  0:
                        location = "Docked";
                        break;
                    case  1:
                        location = "With a User";
                        break;
                    case  2:
                        location = "On Redistribution Vehicle";
                        break;
                    case  3:
                        location = "Holding Area";
                        break;
                    case  4:
                        location = "Out for Maintenance";
                        break;
                    case  5:
                        location = "Temporary Port";
                        break;
                    default:
                        break;
                }
                return location;
            },
            getBicycleLocationNumber: function (code) {
                var location = '';
                switch (code) {
                    case  "Docked":
                        location = 0;
                        break;
                    case  "With a User":
                        location = 1;
                        break;
                    case  "On Redistribution Vehicle":
                        location = 2;
                        break;
                    case  "Holding Area":
                        location = 3;
                        break;
                    case  "Out for Maintenance":
                        location = 4;
                        break;
                    case  "Temporary Port":
                        location = 5;
                        break;
                    default:
                        break;
                }
                return location;
            },
            getHoldingAreaStatus: function (code) {
                var status = '';
                switch (code) {
                    case  0:
                        status = "Operational";
                        break;
                    case  1:
                        status = "Non Operational";
                        break;
                    case -1:
                        status = "Shutdown";
                        break;
                    default:
                        break;
                }
                return status;
            },
            getMaintenanceCentresStatus: function (code) {
                var status = '';
                switch (code) {
                    case  0:
                        status = "Operational";
                        break;
                    case  1:
                        status = "Non Operational";
                        break;
                    case -1:
                        status = "Shutdown";
                        break;
                    default:
                        break;
                }
                return status;
            },
            getRegistrationCentresStatus: function (code) {
                var status = '';
                switch (code) {
                    case  0:
                        status = "Operational";
                        break;
                    case  1:
                        status = "Non Operational";
                        break;
                    case -1:
                        status = "Shutdown";
                        break;
                    default:
                        break;
                }
                return status;
            },
            getSmartCardStatus: function (code) {
                var status = '';
                switch (code) {
                    case  0:
                        status = "Active";
                        break;
                    case -1:
                        status = "Inactive";
                        break;
                    default:
                        break;
                }
                return status;
            },
            getMembershipStatus: function (code) {
                var status = '';
                switch (code) {
                    case  0:
                        status = "Active";
                        break;
                    case -1:
                        status = "Inactive";
                        break;
                    default:
                        break;
                }
                return status;
            },
            getFarePlanStatus: function (code) {
                var status = '';
                switch (code) {
                    case  0:
                        status = "Active";
                        break;
                    case -1:
                        status = "Inactive";
                        break;
                    default:
                        break;
                }
                return status;
            },
            getMemberStatus: function (code) {
                var status = '';
                switch (code) {
                    case  0:
                        status = "Prospective";
                        break;
                    case  1:
                        status = "Registered";
                        break;
                    case  2:
                        status = "Renewed";
                        break;
                    case  -1:
                        status = "Cancelled";
                        break;
                    case  -2:
                        status = "Suspended";
                        break;
                    default:
                        break;
                }
                return status;
            },
            getCardType: function (code) {
                var cardType = '';
                switch (code) {
                    case  0:
                        cardType = "Registered Member";
                        break;
                    case  1:
                        cardType = "Employee Card";
                        break;
                    default:
                        break;
                }
                return cardType;
            },
            getCardLevel: function (code) {
                var cardLevel = '';
                switch (code) {
                    case  0:
                        cardLevel = "Regular Employee Card";
                        break;
                    case  1:
                        cardLevel = "Check Out Card";
                        break;
                    case  2:
                        cardLevel = "Port Close Card";
                        break;
                    case  3:
                        cardLevel = "Bicycle Lock Card";
                        break;
                    case  4:
                        cardLevel = "Port Ready Card";
                        break;
                    default:
                        break;
                }
                return cardLevel;
            },
            getCardTypeToNum: function (code) {
                var cardType = '';
                switch (code) {
                    case  "Registered Member":
                        cardType = 0;
                        break;
                    case  "Employee Card":
                        cardType = 1;
                        break;
                    default:
                        break;
                }
                return cardType;
            },
            getCardLevelToNum: function (code) {
                var cardLevel = '';
                switch (code) {
                    case  "Regular Employee Card":
                        cardLevel = 0;
                        break;
                    case  "Check Out Card":
                        cardLevel = 1;
                        break;
                    case  "Port Close Card":
                        cardLevel = 2;
                        break;
                    case  "Bicycle Lock Card":
                        cardLevel = 3;
                        break;
                    case  "Port Ready Card":
                        cardLevel = 4;
                        break;
                    default:
                        break;
                }
                return cardLevel;
            },
            getEmployeeStatus: function (code) {
                var status = '';
                switch (code) {
                    case  0:
                        status = "Active";
                        break;
                    case  -1:
                        status = "Inactive";
                        break;
                    case  -2:
                        status = "Blocked";
                        break;
                    default:
                        break;
                }
                return status;
            }
        }
    }]);

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


    app.factory('authInterceptor', ['auth', 'API', function (auth, API) {

        return {
            // automatically attach Authorization header
            request: function (config) {
                var token = auth.getToken();
                if (config.url.indexOf(API) === 0 && token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }

                return config;
            }
        }

    }]);

    app.service('user', ['$http', '$q', 'APINew', function ($http, $q, APINew) {

        var self = this;

        self.login = function (username, password) {
                return $http.post(APINew + 'auth/login', {
                    username: username,
                    password: password
                });
            };
    }]);

    app.factory('MyService',function () {
       var saveData={}
        function set(data) {
            saveData=data;
        }
        function get() {
            return savedData;
        }
        return {
            set: set,
            get: get
        }
    });

})();