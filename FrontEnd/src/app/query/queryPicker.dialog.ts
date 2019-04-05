import {Component, Input} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {QuerySelection} from './models/QuerySelection';
import {FolderNode} from 'eds-angular4/dist/folder/models/FolderNode';
import {ItemSummaryList} from 'eds-angular4/dist/library/models/ItemSummaryList';
import {LibraryService} from 'eds-angular4/dist/library';
import {ItemType} from 'eds-angular4/dist/folder/models/ItemType';
import {FolderItem} from 'eds-angular4/dist/folder/models/FolderItem';

@Component({
    selector: 'ngbd-modal-content',
    templateUrl: './queryPicker.html'
})
export class QueryPickerDialog {
    public static open(modalService: NgbModal,  querySelection : QuerySelection) {
        const modalRef = modalService.open(QueryPickerDialog, { backdrop : "static", size : "lg"});
        modalRef.componentInstance.resultData = querySelection;

        return modalRef;
    }

    @Input() resultData;
    treeData : FolderNode[];
    selectedNode : FolderNode;
    itemSummaryList : ItemSummaryList;

    constructor(
        protected libraryService : LibraryService,
        protected activeModal : NgbActiveModal) {
    }

    folderChanged($event) {
        this.selectNode($event.selectedFolder);
    }

    selectNode(node : FolderNode) {
        if (node === this.selectedNode) { return; }
        var vm = this;

        vm.selectedNode = node;
        node.loading = true;

        vm.libraryService.getFolderContents(node.uuid)
            .subscribe(
              (data) => {
                  data.contents = data.contents.filter((t) => t.type === ItemType.Query);
                vm.itemSummaryList = data;
                node.loading = false;
            });
    }

    actionItem(item : FolderItem, action : string) {
        var vm = this;
        switch (item.type) {
            case ItemType.Query:
                var querySelection: QuerySelection = {
                    id: item.uuid,
                    name: item.name,
                    description: item.description
                }
                vm.resultData = querySelection;
                this.ok();
                break;
        }
    }

    getItemSummaryListContents() {
        // TODO : Reintroduce sort and filter
        if (this.itemSummaryList)
            return this.itemSummaryList.contents;
        else
            return null;
    }

    ok() {
        this.activeModal.close(this.resultData);
        console.log('OK Pressed');
    }

    cancel() {
        this.activeModal.dismiss('cancel');
        console.log('Cancel Pressed');
    }
}
