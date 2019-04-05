import {Component} from "@angular/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DataSetService} from "./dataSet.service";
import {DataSet} from "./models/Dataset";
import {LoggerService, MessageBoxDialog} from 'eds-angular4';
import {Location} from '@angular/common';
import {Router} from '@angular/router';

@Component({
    templateUrl: './dataSet.html'
})
export class DataSetComponent {
    datasets : DataSet[] = [];

    constructor(
      private router: Router,
      private $modal: NgbModal,
                private dataSetService : DataSetService,
                private log : LoggerService,
                protected location : Location) {
        this.getDataSets();
    }

    getDataSets() {

        var vm = this;
        vm.dataSetService.getAllDataSets()
            .subscribe(
                result => vm.datasets = result,
                error => vm.log.error('Failed to load data flows', error, 'Load data flows')
            );
    }

    add() {
        this.router.navigate(['dataSetEditor', 'add', null]);
    }

    edit(item : DataSet) {
        this.router.navigate(['dataSetEditor', 'edit', item.uuid]);
    }

    delete(item : DataSet) {
        var vm = this;
        MessageBoxDialog.open(vm.$modal, 'Delete Data Set', 'Are you sure you want to delete the data set?', 'Yes', 'No')
            .result.then(
            () => vm.doDelete(item),
            () => vm.log.info('Delete cancelled')
        );
    }

    doDelete(item : DataSet) {
        var vm = this;
        vm.dataSetService.deleteDataSet(item.uuid)
            .subscribe(
                () => {
                    var index = vm.datasets.indexOf(item);
                    vm.datasets.splice(index, 1);
                    vm.log.success('Data set deleted', item, 'Delete Data set');
                },
                (error) => vm.log.error('Failed to delete Data set', error, 'Delete Data flow')
            );
    }

    close() {
        this.location.go('dataSharingSummaryOverview');
    }
}
