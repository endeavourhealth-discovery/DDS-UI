import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CountReport} from "./models/CountReport";
import {CountReportService} from "./countReport.service";
import {EdsLibraryItem} from "../edsLibrary/models/EdsLibraryItem";
import {LibraryService} from 'eds-angular4/dist/library';
import {LoggerService, MessageBoxDialog} from 'eds-angular4';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
	templateUrl: './countReportEditor.html'
})
export class CountReportEditComponent implements OnInit {
	libraryItem : EdsLibraryItem;
	termCache : any;

	constructor(
	  protected route: ActivatedRoute,
		protected libraryService : LibraryService,
		protected countReportService : CountReportService,
		protected logger : LoggerService,
		protected $modal : NgbModal,
		protected state : Router,
		protected location : Location) {

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

	runQuery() {
		var vm = this;
		let query = vm.libraryItem.countReport.query;
		// vm.countReportService.runReport()
		MessageBoxDialog.open(
			this.$modal,
			'Count Report : ' + this.libraryItem.name,
			'Execution successful - (n) patients counted.  Would you like to export their NHS Numbers?',
			'Yes',
			'No'
		);
	}

	create(folderUuid: string) {
		this.libraryItem = {
			uuid: null,
			name: '',
			description: '',
			folderUuid: folderUuid,
			countReport: {
				fields : '',
				tables : '',
				query : '',
				count : 0,
				status : 'Not Run'
			} as CountReport
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
