import {Component} from "@angular/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Organisation} from "./models/Organisation";
import {OrganisationService} from "./organisation.service";
import {LoggerService, MessageBoxDialog} from 'eds-angular4';
import {Location} from '@angular/common';
import {Router} from '@angular/router';

@Component({
	templateUrl: './organisationList.html'
})
export class OrganisationListComponent {
	organisations : Organisation[];

	constructor(private $modal: NgbModal,
							private router: Router,
							private organisationService : OrganisationService,
							private log : LoggerService,
							protected location: Location) {
		this.getOrganisations();
	}

	getOrganisations() {
		var vm = this;
		vm.organisationService.getOrganisations()
			.subscribe(
				result => {
					vm.organisations = result.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
				},
				error => vm.log.error('Failed to load organisations', error, 'Load organisations')
			);
		console.log(vm.organisations);
	}

	add() {
		this.router.navigate(['organisationEdit', 'add', null]);
	}

	edit(item : Organisation) {
		console.log(item);
		this.router.navigate(['organisationEdit', 'edit', item.uuid]);
	}

	save(original : Organisation, edited : Organisation) {
		var vm = this;
		vm.organisationService.saveOrganisation(edited)
			.subscribe(
				saved =>  {
					if (original.uuid)
						jQuery.extend(true, original, saved);
					else
						vm.organisations.push(saved);

					vm.log.success('Organisation saved', original, 'Save organisation');
				},
				error => vm.log.error('Failed to save organisation', error, 'Save organisation')
			);
	}

	delete(item : Organisation) {
		var vm = this;
		MessageBoxDialog.open(vm.$modal, 'Delete Organisation', 'Are you sure you want to delete the Organisation?', 'Yes', 'No')
			.result.then(
				() => vm.doDelete(item),
				() => vm.log.info('Delete cancelled')
		);
	}

	doDelete(item : Organisation) {
		var vm = this;
		vm.organisationService.deleteOrganisation(item.uuid)
			.subscribe(
				() => {
					var index = vm.organisations.indexOf(item);
					vm.organisations.splice(index, 1);
					vm.log.success('Organisation deleted', item, 'Delete Organisation');
				},
				(error) => vm.log.error('Failed to delete Organisation', error, 'Delete Organisation')
			);
	}
}
