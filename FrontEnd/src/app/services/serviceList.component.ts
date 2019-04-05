import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Service} from "./models/Service";
import {ServiceService} from "./service.service";
import {Observable} from "rxjs";
import {Subscription} from 'rxjs/Subscription';
import {SystemService} from "../system/system.service";
import {SystemPickerDialog} from "../system/systemPicker.dialog";
import {SystemStatus} from "./models/SystemStatus";
import {LoggerService} from 'eds-angular4';
import {Router} from '@angular/router';

@Component({
	templateUrl: './serviceList.html'
})
export class ServiceListComponent implements OnInit, OnDestroy{

	services : Service[];
	timer: Subscription = null;

	//filtering
	filteredServices: Service[];
	allPublisherConfigNames: string[];
	allCcgCodes: string[];

	static $inject = ['$uibModal', 'ServiceService', 'LoggerService','$state'];

	constructor(private $modal : NgbModal,
							private serviceService : ServiceService,
							private log : LoggerService,
              private router: Router) {


	}

	ngOnInit() {
		this.refreshAllServices();
	}

	ngOnDestroy() {
		if (this.timer) {
			this.timer.unsubscribe();
			this.timer = null;
		}
	}

	refreshAllServices() {
		var vm = this;
		vm.serviceService.getAll()
			.subscribe(
				(result) => {
					vm.services = result.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
					vm.startRefreshTimer();
					vm.applyFiltering();
					vm.findAllPublisherConfigNames();
				},
				(error) => vm.log.error('Failed to load services', error, 'Load services')
			)
	}


	add() {
		this.router.navigate(['serviceEdit', 'add', null]);
	}

	edit(item : Service) {
		this.router.navigate(['serviceEdit', 'edit', item.uuid]);
	}

	save(original : Service, edited : Service) {
		var vm = this;
		vm.serviceService.save(edited)
			.subscribe(
				(saved) => {
					if (original.uuid)
						jQuery.extend(true, original, saved);
					else
						vm.services.push(saved);

					vm.log.success('Service saved', original, 'Save service');
				},
				(error) => vm.log.error('Failed to save service', error, 'Save service')
			);
	}


	private selectSystemId(service: Service, callback) {
		var vm = this;

		var endpoints = service.endpoints;
		if (endpoints.length == 0) {
			vm.log.error('No systems in this serviec');

		} else if (endpoints.length == 1) {
			console.log('servvice = ' + service.name + ' only one endpoint');
			var endpoint = endpoints[0];
			var systemId = endpoint.systemUuid;
			callback(service, systemId);

		} else {
			SystemPickerDialog.open(vm.$modal, service, callback);
		}
	}


	/*delete(item : Service) {
	 var vm = this;
	 MessageBoxDialog.open(vm.$modal, 'Delete Service', 'Are you sure you want to delete the Service?', 'Yes', 'No')
	 .result.then(
	 () => vm.doDelete(item),
	 () => vm.log.info('Delete cancelled')
	 );
	 }

	 doDelete(item : Service) {
	 var vm = this;
	 vm.serviceService.delete(item.uuid)
	 .subscribe(
	 () => {
	 var index = vm.services.indexOf(item);
	 vm.services.splice(index, 1);
	 vm.log.success('Service deleted', item, 'Delete Service');
	 },
	 (error) => vm.log.error('Failed to delete Service', error, 'Delete Service')
	 );
	 }*/


	/*deleteData(service: Service) {
		var vm = this;
		vm.selectSystemId(service, function(service: Service, systemId: string) {

			MessageBoxDialog.open(vm.$modal, 'Delete Data', 'Are you sure you want to delete all data for this Service?', 'Yes', 'No')
				.result.then(
				() => vm.doDeleteData(service, systemId),
				() => vm.log.info('Delete data cancelled')
			);
		});
	}


	private doDeleteData(service: Service, systemId: string) {
		var vm = this;
		vm.serviceService.deleteData(service.uuid, systemId)
			.subscribe(
				() => {
					vm.log.success('Data deletion started', service, 'Delete Data');
					vm.refreshService(service);
				},
				(error) => vm.log.error('Failed to delete data', error, 'Delete Data')
			);
	}*/

	private refreshService(oldService : Service) {
		var vm = this;
		vm.serviceService.get(oldService.uuid)
			.subscribe(
				(result) => {
					//sub into the services list
					var index = vm.services.indexOf(oldService);
					if (index > -1) {
						vm.services[index] = result;
					}

					//sub into the filtered services list too
					index = vm.filteredServices.indexOf(oldService);
					if (index > -1) {
						vm.filteredServices[index] = result;
					}
				},
				(error) => vm.log.error('Failed to refresh service', error, 'Refresh Service')
			)
	}

	private startRefreshTimer() {
		var vm = this;
		this.timer = Observable.interval(2000).subscribe(() => vm.refreshServicesWithAdditionalInfo());
	}

	private refreshServicesWithAdditionalInfo() {
		var vm = this;
		var arrayLength = vm.services.length;
		for (var i = 0; i < arrayLength; i++) {
			var service = vm.services[i];
			if (service.additionalInfo) {
				vm.refreshService(service);
			}

			//clear down the cached desc on the system statuses
			if (service.systemStatuses) {
				for (var j=9; j<service.systemStatuses.length; j++) {
					var systemStatus = service.systemStatuses[j];
					systemStatus.cachedLastDataDateDesc = null;
				}
			}
		}
	}

	viewExchanges(service: Service) {

		/*var vm = this;
		vm.selectSystemId(selectedService, vm.viewExchangesForServiceAndSystem);*/

		var vm = this;
		vm.selectSystemId(service, function(service: Service, systemId: string) {
			vm.router.navigate(['exchangeAudit', service.uuid, systemId]);
		});
	}

	applyFiltering() {
		var vm = this;
		vm.filteredServices = vm.serviceService.applyFiltering(vm.services);
	}

	toggleFilters() {
		var vm = this;
		vm.serviceService.toggleFiltering();

		//call the filtered changed method to remove the applied filtering
		vm.applyFiltering();
	}

	private findAllPublisherConfigNames() {
		var vm = this;
		vm.allPublisherConfigNames = [];
		vm.allCcgCodes = [];

		var arrayLength = vm.services.length;
		for (var i = 0; i < arrayLength; i++) {
			var service = vm.services[i];
			var publisherConfigName = service.publisherConfigName;
			if (publisherConfigName) {
				var index = vm.allPublisherConfigNames.indexOf(publisherConfigName);
				if (index == -1) {
					vm.allPublisherConfigNames.push(publisherConfigName);
				}
			}

			var ccgCode = service.ccgCode;
			if (ccgCode) {
				var index = vm.allCcgCodes.indexOf(ccgCode);
				if (index == -1) {
					vm.allCcgCodes.push(ccgCode);
				}
			}
		}

		vm.allPublisherConfigNames.sort();
		vm.allCcgCodes.sort();
	}

	getNotesPrefix(service: Service) : string {

		if (service.notes
			&& service.notes.length > 10) {
			return service.notes.substr(0, 10) + '...';

		} else {
			return service.notes;
		}
	}

	formatLastDataTooltip(service: Service, status: SystemStatus) : string {

		var lastDate = new Date();
		lastDate.setTime(status.lastDataDate);

		var lastDataReceived = new Date();
		lastDataReceived.setTime(status.lastDataReceived);

		return 'Last data from ' + this.formatDate(lastDate) + ', ' + 'received on ' + this.formatDate(lastDataReceived);
	}

	formatLastData(service: Service, status: SystemStatus) : string {

		//if we've a cached value, return that
		if (status.cachedLastDataDateDesc) {
			return status.cachedLastDataDateDesc;
		}

		var ret = '';

		//only show system name if more than one status
		if (service.systemStatuses.length > 1) {
			ret += status.systemName;
			ret += ': ';
		}

		var lastDate = new Date();
		lastDate.setTime(status.lastDataDate);

		var today = new Date();

		var diffMs = today.getTime() - lastDate.getTime();

		var durSec = 1000;
		var durMin = durSec * 60;
		var durHour = durMin * 60;
		var durDay = durHour * 25;
		var durWeek = durDay * 7;
		var durYear = durDay * 365.25;

		var toks = [];

		if (toks.length < 2) {
			var years = Math.floor(diffMs / durYear);
			if (years > 0) {
				toks.push('' + years + 'y');
				diffMs -= years * durYear;
			}
		}

		if (toks.length < 2) {
			var weeks = Math.floor(diffMs / durWeek);
			if (weeks > 0) {
				toks.push('' + weeks + 'w');
				diffMs -= weeks * durWeek;
			}
		}

		if (toks.length < 2) {
			var days = Math.floor(diffMs / durDay);
			if (days > 0) {
				toks.push('' + days + 'd');
				diffMs -= days * durDay;
			}
		}

		if (toks.length < 2) {
			var hours = Math.floor(diffMs / durHour);
			if (hours > 0) {
				toks.push('' + hours + 'h');
				diffMs -= hours * durHour;
			}
		}

		if (toks.length < 2) {
			var mins = Math.floor(diffMs / durMin);
			if (mins > 0 ) {
				toks.push('' + mins + 'm');
				diffMs -= mins * durMin;
			}
		}

		if (toks.length < 2) {
			var secs = Math.floor(diffMs / durSec);
			if (secs > 0 ) {
				toks.push('' + secs + 's');
				diffMs -= secs * durSec;
			}
		}

		if (toks.length < 2) {
			if (diffMs > 0) {
				toks.push('' + diffMs + 'ms');
			}
		}

		if (toks.length == 0) {
			toks.push('0s');
		}

		ret += toks.join(' ');

		//cache it in the status so we don't need to work it out again
		status.cachedLastDataDateDesc = ret;

		return ret;
	}

	formatProcessingStatusTooltip(service: Service, status: SystemStatus) : string {
		if (status.lastDateSuccessfullyProcessed) {

			var d = new Date();
			d.setTime(status.lastDateSuccessfullyProcessed);
			return 'Last successfully processed on ' + this.formatDate(d);

		} else {
			return 'Not successfully processed any data yet';
		}
	}

	formatProcessingStatus(service: Service, status: SystemStatus) : string {

		var ret = '';

		//only show system name if more than one status
		//don't need to show the system since this is in the previous column
		/*if (service.systemStatuses.length > 1) {
			ret += status.systemName;
			ret += ': '
		}*/

		if (status.processingInError) {
			ret += 'ERROR';

		} else if (status.processingUpToDate) {
			ret += 'OK';

		} else {
			ret += 'Behind';
		}

		return ret;
	}

	formatDate(d: Date) : string {

		var year = '' + d.getFullYear();
		var month = '' + (d.getMonth() + 1);
		var day = '' + d.getDate();

		var hour = '' + d.getHours();
		var minute = '' + d.getMinutes();
		var seconds = '' + d.getSeconds();

		if (month.length < 2) {
			month = '0' + month;
		}
		if (day.length < 2) {
			day = '0' + day;
		}
		if (hour.length < 2) {
			hour = '0' + hour;
		}
		if (minute.length < 2) {
			minute = '0' + minute;
		}
		if (seconds.length < 2) {
			seconds = '0' + minute;
		}

		return day + '/' + month + '/' + year + ' ' + hour + ':' + minute + ':' + seconds;
	}

}
