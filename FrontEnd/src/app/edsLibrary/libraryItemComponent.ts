import {EdsLibraryItem} from "./models/EdsLibraryItem";
import {LibraryService} from 'eds-angular4/dist/library';
import {LoggerService} from 'eds-angular4';
import {AfterViewInit, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Location} from '@angular/common';

export class LibraryItemComponent implements OnInit {
	protected libraryItem : EdsLibraryItem = <EdsLibraryItem>{};

	constructor(
		protected libraryService : LibraryService,
		protected log : LoggerService,
		protected route : ActivatedRoute,
		protected location : Location) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params) => this.initialise(params)
    );
  }

  initialise(params: Params) {
    this.performAction(params['itemAction'], params['itemUuid']);
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

	create(folderUuid : string) {
		this.libraryItem = {
			uuid : null,
			name : '',
			description : '',
			folderUuid : folderUuid,
		} as EdsLibraryItem;
	}

	load(uuid : string) {
		var vm = this;
		vm.libraryService.getLibraryItem<EdsLibraryItem>(uuid)
			.subscribe(
				(libraryItem) => vm.libraryItem = libraryItem,
				(error) => vm.log.error('Error loading', error, 'Error')
			);
	}

	save(close : boolean) {
		var vm = this;
		vm.libraryService.saveLibraryItem(vm.libraryItem)
			.subscribe(
				(libraryItem) => {
					vm.libraryItem.uuid = libraryItem.uuid;
					vm.log.success('Item saved', vm.libraryItem, 'Saved');
					if (close) {
						vm.location.back();
					}
				},
				(error) => vm.log.error('Error saving', error, 'Error')
			);
	}

	close() {
		this.location.back();
	}

}
