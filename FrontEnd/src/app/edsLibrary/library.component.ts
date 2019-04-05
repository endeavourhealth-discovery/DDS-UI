import {Component} from "@angular/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FolderNode} from 'eds-angular4/dist/folder/models/FolderNode';
import {ItemSummaryList} from 'eds-angular4/dist/library/models/ItemSummaryList';
import {ActionMenuItem} from 'eds-angular4/dist/folder/models/ActionMenuItem';
import {LibraryService} from 'eds-angular4/dist/library';
import {LoggerService} from 'eds-angular4';
import {ModuleStateService} from 'eds-angular4/dist/common';
import {ItemType} from 'eds-angular4/dist/folder/models/ItemType';
import {Router} from '@angular/router';
import {FolderItem} from 'eds-angular4/dist/folder/models/FolderItem';
import {LibraryItem} from 'eds-angular4/dist/library/models/LibraryItem';

@Component({
	templateUrl: './library.html'
})
export class LibraryComponent {
	selectedFolder : FolderNode;
	itemSummaryList : ItemSummaryList;
	actionMenuItems : ActionMenuItem[];

	constructor(
		protected libraryService:LibraryService,
		protected log:LoggerService,
		protected moduleStateService : ModuleStateService,
		protected $modal : NgbModal,
		protected router : Router) {
		this.actionMenuItems = [
			{ type: ItemType.System, text: 'Add system' },
			{ type: ItemType.Protocol, text: 'Add data protocol' },
			{ type: ItemType.Query, text: 'Add cohort' },
			{ type: ItemType.DataSet, text: 'Add data set' },
			{ type: ItemType.CodeSet, text: 'Add code set' },
			{ type: ItemType.CountReport, text: 'Add validation report' }
		];
	}

	folderChanged($event) {
		this.selectedFolder = $event.selectedFolder;
		this.refresh();
	}

	refresh() {
		var vm = this;
		vm.libraryService.getFolderContents(vm.selectedFolder.uuid)
			.subscribe(
				(data) => {
					vm.itemSummaryList = data;
					vm.selectedFolder.loading = false;
				});
	}

	getSummaryList() {
		// Todo : Implement sorting
		return (this.itemSummaryList) ? this.itemSummaryList.contents : null;
	}

	saveFolderState() {
		var state = {
			selectedNode : this.selectedFolder
		};
		this.moduleStateService.setState('protocolFolder', state);
	}

	actionItem($event) {
		this.saveFolderState();
		switch ($event.type) {
			case ItemType.System:
				this.router.navigate(['systemEdit', $event.action, $event.uuid]);
				break;
			case ItemType.Protocol:
				this.router.navigate(['protocolEdit', $event.action, $event.uuid]);
				break;
			case ItemType.Query:
				this.router.navigate(['queryEdit', $event.action, $event.uuid]);
				break;
			case ItemType.DataSet:
				this.router.navigate(['dataSetEdit', $event.action, $event.uuid]);
				break;
			case ItemType.CodeSet:
				this.router.navigate(['codeSetEdit', $event.action, $event.uuid]);
				break;
			case ItemType.CountReport:
				this.router.navigate(['countReportEdit', $event.action, $event.uuid]);
				break;
			default:
				this.log.error('Invalid item type', $event.type, 'Item ' + $event.action);
				break;
		}
	}

	deleteItem(item : FolderItem) {
		var vm = this;
		vm.libraryService.deleteLibraryItem(item.uuid)
			.subscribe(
				(result) => {
					var i = vm.itemSummaryList.contents.indexOf(item);
					vm.itemSummaryList.contents.splice(i, 1);
					vm.log.success('Library item deleted', result, 'Delete item');
				},
				(error) => vm.log.error('Error deleting library item', error, 'Delete item')
			);
	}

	cutItem(item : FolderItem) {
		var vm = this;
		vm.libraryService.getLibraryItem(item.uuid)
			.subscribe(
				(libraryItem) => {
					vm.moduleStateService.setState('libraryClipboard', libraryItem);
					vm.log.success('Item cut to clipboard', libraryItem, 'Cut');
				},
				(error) => vm.log.error('Error cutting to clipboard', error, 'Cut')
			);
	}

	copyItem(item : FolderItem) {
		var vm = this;
		vm.libraryService.getLibraryItem(item.uuid)
			.subscribe(
				(libraryItem) => {
					vm.moduleStateService.setState('libraryClipboard', libraryItem);
					libraryItem.uuid = null;		// Force save as new
					vm.log.success('Item copied to clipboard', libraryItem, 'Copy');
				},
				(error) => vm.log.error('Error copying to clipboard', error, 'Copy')
			);
	}

	pasteItem(node : FolderNode) {
		var vm = this;
		var libraryItem : LibraryItem = vm.moduleStateService.getState('libraryClipboard') as LibraryItem;
		if (libraryItem) {
			libraryItem.folderUuid = node.uuid;
			vm.libraryService.saveLibraryItem(libraryItem)
				.subscribe(
					(result) => {
						vm.log.success('Item pasted to folder', libraryItem, 'Paste');
						// reload folder if still selection
						if (vm.selectedFolder.uuid === node.uuid) {
							vm.refresh();
						}
					},
					(error) => vm.log.error('Error pasting clipboard', error, 'Paste')
				);
		}
	}

}
