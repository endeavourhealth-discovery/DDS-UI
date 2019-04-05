import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EdsLibraryItem} from "../edsLibrary/models/EdsLibraryItem";
import {ActivatedRoute, Params} from '@angular/router';
import {LoggerService} from 'eds-angular4';
import {LibraryService} from 'eds-angular4/dist/library';
import {CodePickerDialog, CodingService} from 'eds-angular4/dist/coding';

@Component({
	templateUrl: './codeSetEditor.html'
})
export class CodeSetEditComponent implements OnInit {
	libraryItem : EdsLibraryItem;
	termCache : any;

	constructor(
	  protected route: ActivatedRoute,
		protected libraryService : LibraryService,
		protected logger : LoggerService,
		protected $modal : NgbModal,
		protected location: Location,
		protected codingService : CodingService) {

    this.termCache = {};
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => this.initialise(params)
    );
  }

  initialise(params: Params) {
		this.performAction(params['itemAction'], params['itemUuid']);
	}

	protected performAction(action: string, itemUuid: string) {
		switch (action) {
			case 'add':
				this.create(itemUuid);
				break;
			case 'edit':
				this.load(itemUuid);
				break;
		}
	}

	termShorten(term : string) {
		term = term.replace(' (disorder)', '');
		term = term.replace(' (observable entity)', '');
		term = term.replace(' (finding)', '');
		return term;
	}

	getTerm(code : string) : string {
		var vm = this;
		var term = vm.termCache[code];
		if (term) { return term; }
		vm.termCache[code] = 'Loading...';

		vm.codingService.getPreferredTerm(code)
			.subscribe(
				(concept) => vm.termCache[code] = vm.termShorten(concept.preferredTerm)
			);

		return vm.termCache[code];
	}

	showCodePicker() {
		var vm = this;
		CodePickerDialog.open(vm.$modal, vm.libraryItem.codeSet.codeSetValue)
			.result.then(function(result) {
				vm.libraryItem.codeSet.codeSetValue = result;
		});
	}


	create(folderUuid: string) {
		this.libraryItem = {
			uuid: null,
			name: '',
			description: '',
			folderUuid: folderUuid,
			codeSet: {
				codingSystem: 'SNOMED_CT',
				codeSetValue: []
			}
		} as EdsLibraryItem;
	}

	load(uuid : string) {
		var vm = this;
		this.create(null);
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
						vm.location.back();
					}
				},
				(error) => vm.logger.error('Error saving', error, 'Error')
			);
	}

	close() {
		this.location.back();
	}
}
