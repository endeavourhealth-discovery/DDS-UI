import {Protocol} from "./models/Protocol";
import {ServiceContract} from "./models/ServiceContract";
import {Service} from "../services/models/Service";
import {System} from "../system/models/System";
import {TechnicalInterface} from "../system/models/TechnicalInterface";
import {DataSet} from "../dataSet/models/Dataset";
import {ServiceService} from "../services/service.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Component, OnInit} from '@angular/core';
import {SystemService} from "../system/system.service";
import {DataSetService} from "../dataSet/dataSet.service";
import {ProtocolService} from "./protocol.service";
import {EdsLibraryItem} from "../edsLibrary/models/EdsLibraryItem";
import {ServicePickerDialog} from "../services/servicePicker.dialog";
import {LibraryService} from 'eds-angular4/dist/library';
import {LoggerService} from 'eds-angular4';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
	templateUrl : './protocolEditor.html'
})
export class ProtocolEditComponent implements OnInit {
	libraryItem : EdsLibraryItem;
	protected protocol : Protocol;
	selectedContract : ServiceContract;
	services : Service[];
	systems : System[];
	dataSets : DataSet[];
	protocols : EdsLibraryItem[];
	technicalInterfaces : TechnicalInterface[];

	//hard-code two cohort strings until the cohort editor is implemented
	cohorts: string[];
	//cohorts : Cohort[];

	enabled = ["TRUE", "FALSE"];
	consent = ["OPT-IN", "OPT-OUT"];
	type = ["PUBLISHER", "SUBSCRIBER"];

	constructor(
    private route: ActivatedRoute,
		protected libraryService : LibraryService,
		protected serviceService : ServiceService,
		protected systemService : SystemService,
		protected dataSetService : DataSetService,
		protected protocolService : ProtocolService,
		protected logger : LoggerService,
		protected $modal : NgbModal,
		protected state : Router,
		protected location: Location) {

    this.libraryItem = <EdsLibraryItem>{
      protocol: {}
    };
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => this.initialise(params)
    );
  }

  initialise(params: Params) {
		this.performAction(params['itemAction'], params['itemUuid']);

		this.loadServices();
		this.loadSystems();

		this.cohorts = ['All Patients', 'Explicit Patients', 'Defining Services'];
		//this.cohorts = ['All Patients', 'Explicit Patients'];
		//this.loadCohorts(); //hard-coding these for now
		console.log('Cohorts = ' + this.cohorts);
		console.log('Cohorts = ' + this.cohorts.length);

		this.loadDatasets();
	}

	protected performAction(action:string, itemUuid:string) {
		switch (action) {
			case 'add':
				this.create(itemUuid);
				break;
			case 'edit':
				this.load(itemUuid);
				break;
		}
	}

	load(uuid : string) {
		var vm = this;
		vm.libraryService.getLibraryItem<EdsLibraryItem>(uuid)
			.subscribe(
				(libraryItem) => vm.libraryItem = libraryItem,
				(data) => vm.logger.error('Error loading', data, 'Error')
			);
	}

	save(close : boolean) {
		var vm = this;
		vm.libraryService.saveLibraryItem(vm.libraryItem)
			.subscribe(
				(libraryItem) => {
					vm.libraryItem.uuid = libraryItem.uuid;
					vm.logger.success('Item saved', vm.libraryItem, 'Saved');
					if (close) {
						this.location.back();
					}
				},
				(error) => vm.logger.error('Error saving', error, 'Error')
			);
	}

	close() {
		this.location.back();
	}

	create(folderUuid : string) {
		this.protocol = {
			enabled: 'TRUE',
			patientConsent: 'OPT-IN',
			cohort: '0',
			dataSet: '0',
			serviceContract: []
		} as Protocol;

		this.libraryItem = {
			uuid: null,
			name: '',
			description: '',
			folderUuid: folderUuid,
			protocol: this.protocol
		} as EdsLibraryItem;

	}

	addContract() {
		this.selectedContract = {
			type: '',
			service: new Service(),
			system: new System(),
			technicalInterface: new TechnicalInterface(),
			active: 'TRUE'
		} as ServiceContract;

		//ensure the service contract array isn't null, which it will be if we're amending a protocol with no contracts in it
		if (!this.libraryItem.protocol.serviceContract) {
			this.libraryItem.protocol.serviceContract = [];
		}

		this.libraryItem.protocol.serviceContract.push(this.selectedContract);
	}

	removeContract(index: number, scope : any) {
		this.libraryItem.protocol.serviceContract.splice(index, 1);
		if (this.selectedContract === scope.item) {
			this.selectedContract = null;
		}
	}

	setService() {

		//the combo includes the ODS code now, so we can't just carry over the combo display text
		/*var serviceName = $("#service>option:selected").html()
		this.selectedContract.service.name = serviceName;*/

		var vm = this;

		vm.selectedContract.service.name = null;

		var selectedServiceUuid = vm.selectedContract.service.uuid;
		if (selectedServiceUuid) {
			var i;
			for (i=0; i<vm.services.length; i++) {
				var service = vm.services[i];
				if (service.uuid == selectedServiceUuid) {

					this.selectedContract.service.name = service.name;
					break;
				}
			}
		}
	}

	setSystem() {
		var systemName = $("#system>option:selected").html()
		this.selectedContract.system.name = systemName;
	}

	setTechnicalInterface() {
		var technicalInterfaceName = $("#technicalInterface>option:selected").html()
		this.selectedContract.technicalInterface.name = technicalInterfaceName;
	}

	loadServices() {
		var vm = this;
		vm.serviceService.getAll()
			.subscribe(
				(result) => vm.services = result.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
				(error) => vm.logger.error('Failed to load services', error, 'Load services')
			);
	}

	/*loadCohorts() {
		var vm = this;
		vm.protocolService.getCohorts()
			.subscribe(
				(result) => vm.cohorts = result,
				(error) => vm.logger.error('Failed to load cohorts', error, 'Load cohorts')
			);
	}*/

	loadDatasets() {
		var vm = this;
		vm.dataSetService.getDatasets()
			.subscribe(
				(result) => vm.dataSets = result.sort((a,b) => a.name.localeCompare(b.name)),
				(error) => vm.logger.error('Failed to load dataSets', error, 'Load dataSets')
			);

		/*vm.libraryService.getProtocols("edf5ac83-1491-4631-97ff-5c7a283c73b1")
		 .then(function(result) {
		 vm.protocols = result;
		 })
		 .catch(function (error) {
		 vm.logger.error('Failed to load protocols', error, 'Load protocols');
		 });*/
	}

	loadSystems() {
		var vm = this;
		vm.systemService.getSystems()
			.subscribe(
				(result) => vm.processSystems(result),
				(error) => vm.logger.error('Failed to load systems', error, 'Load systems')
			);
	}

	private processSystems(systems:System[]) {
		var vm = this;
		vm.systems = systems.sort((a,b) => a.name.localeCompare(b.name));
		vm.technicalInterfaces = [];
		console.log(vm.systems[0].technicalInterface.length);
		console.log(vm.systems[0].technicalInterface[0].name);

		for (var i = 0; i < vm.systems.length; ++i) {
			for (var j = 0; j < vm.systems[i].technicalInterface.length; ++j) {
				var technicalInterface = {
					uuid: vm.systems[i].technicalInterface[j].uuid,
					name: vm.systems[i].technicalInterface[j].name,
					messageType: vm.systems[i].technicalInterface[j].messageType,
					messageFormat: vm.systems[i].technicalInterface[j].messageFormat,
					messageFormatVersion: vm.systems[i].technicalInterface[j].messageFormatVersion
				} as TechnicalInterface;
				vm.technicalInterfaces.push(technicalInterface);
			}
		}
		vm.technicalInterfaces = vm.technicalInterfaces.sort((a,b) => a.name.localeCompare(b.name))
	}

	isCohortDefinedByServices(): boolean {
		var p = this.libraryItem.protocol;
		var cohort = p.cohort;
		return cohort == 'Defining Services';
	}

	getServiceContracts() {

		//awful syntax to handle the service being undefined when adding new service contrals
    return this.libraryItem.protocol.serviceContract.sort((a,b) => {
      let r = a.type.localeCompare(b.type);
      if (r != 0)
        return r;

      if (!a.service.name)
        return 1;

      if (!b.service.name)
        return -1;

      return a.service.name.localeCompare(b.service.name);
    });

		/*return linq(this.libraryItem.protocol.serviceContract)
			.OrderBy(sc => sc.type)
			.ThenBy(sc => sc.service.name.toLowerCase())
			.ToArray();*/
	}

	publisherCount(): number {
		return this.getServiceContractCount("PUBLISHER");
	}

	subscriberCount(): number {
		return this.getServiceContractCount("SUBSCRIBER");
	}

	private getServiceContractCount(typeToCheck: string): number {
		var contracts = this.getServiceContracts();
		var count = 0;

		for (var i=0; i<contracts.length; i++) {
			var contract = contracts[i];
			if (contract.type == typeToCheck) {
				count ++;
			}
		}

		return count;
	}

	searchForService() {
		var vm = this;

		//don't bother passing in the current selection
		var currentSelection = [];

		ServicePickerDialog.open(vm.$modal, currentSelection)
			.result.then(function (result : Service[]) {
				//the dialog allows multiple selection, so just handle it with an error rather than hack at that
				if (result.length > 1) {
					vm.logger.error('Multiple services selected');
				} else {
					var selectedService = result[0];
					vm.selectedContract.service.name = selectedService.name;
					vm.selectedContract.service.uuid = selectedService.uuid;
				}
			}
		);
	}
}
