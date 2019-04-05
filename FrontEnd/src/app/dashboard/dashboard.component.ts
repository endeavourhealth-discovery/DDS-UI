import {Component} from "@angular/core";
import {RabbitNode} from "../queueing/models/RabbitNode";
import {RabbitExchange} from "../queueing/models/RabbitExchange";
import {RabbitQueue} from "../queueing/models/RabbitQueue";
import {RabbitService} from "../queueing/rabbit.service";
import {DashboardService} from "./dashboard.service";
import {FolderItem} from 'eds-angular4/dist/folder/models/FolderItem';
import {ItemType} from 'eds-angular4/dist/folder/models/ItemType';
import {Router} from '@angular/router';

@Component({
	templateUrl: './dashboard.html',
})
export class DashboardComponent {
	recentDocumentsData:FolderItem[];
	rabbitNodes:RabbitNode[];
	quickestNode : RabbitNode;
	inboundExchange : RabbitExchange;
	protocolExchange : RabbitExchange;
	transformExchange : RabbitExchange;
	responseExchange : RabbitExchange;
	subscriberExchange : RabbitExchange;
	inboundQueues : RabbitQueue[] = [];
	protocolQueues : RabbitQueue[] = [];
	transformQueues : RabbitQueue[] = [];
	responseQueues : RabbitQueue[] = [];
	subscriberQueues : RabbitQueue[] = [];

	pingWarn : number = 250;

	constructor(private dashboardService:DashboardService,
							private rabbitService : RabbitService,
							private router : Router) {
		this.refresh();
	}

	refresh() {
		this.getRecentDocumentsData();
		this.getRabbitNodes();
	}

	getRecentDocumentsData() {
		var vm = this;
		vm.recentDocumentsData = null;
		vm.dashboardService.getRecentDocumentsData()
			.subscribe(data => vm.recentDocumentsData = data);
	}

	getRabbitNodes() {
		var vm = this;
		vm.rabbitNodes = null;
		vm.rabbitService.getRabbitNodes()
			.subscribe(
				data => {
				vm.rabbitNodes = data;
				vm.getRabbitNodePings();
			});
	}

	getRabbitNodePings() {
		var vm = this;
		vm.quickestNode = null;
		for(var idx in vm.rabbitNodes) {
			vm.rabbitService.pingRabbitNode(vm.rabbitNodes[idx].address)
				.subscribe(
					result => {

					if (vm.quickestNode === null) {
						vm.quickestNode = result;
						vm.getRabbitExchanges();
						vm.getRabbitQueues();
					}

					var rabbitNode : RabbitNode[] = vm.rabbitNodes.filter((n) => n.address === result.address);
					if (rabbitNode.length === 1) {
						rabbitNode[0].ping = result.ping;
					}
				})
		}
	}

	getPingLabelClass(item : RabbitNode) {
		if (item.ping === -1)
			return 'badge-danger';
		if (item.ping === 0)
			return 'badge-default';
		if (item.ping <= this.pingWarn)
			return 'badge-success';
		return 'badge-warning';
	}

	getRabbitExchanges() {
		var vm = this;
		vm.rabbitService.getRabbitExchanges(this.quickestNode.address)
			.subscribe(
				data => {
				// Split queues by type
				vm.inboundExchange = data.filter((e) => e.name.lastIndexOf('EdsInbound',0)===0)[0];
				vm.protocolExchange = data.filter((e) => e.name.lastIndexOf('EdsProtocol',0)===0)[0];
				vm.transformExchange = data.filter((e) => e.name.lastIndexOf('EdsTransform',0)===0)[0];
				vm.responseExchange = data.filter((e) => e.name.lastIndexOf('EdsResponse',0)===0)[0];
				vm.subscriberExchange = data.filter((e) => e.name.lastIndexOf('EdsSubscriber',0)===0)[0];
			});
	}

	getRabbitQueues() {
		var vm = this;

		vm.rabbitService.getRabbitQueues(vm.quickestNode.address)
			.subscribe(
				data => {
				// Split queues by type
				vm.inboundQueues = data.filter((e) => e.name.lastIndexOf('EdsInbound',0)===0);
				vm.protocolQueues = data.filter((e) => e.name.lastIndexOf('EdsProtocol',0)===0);
				vm.transformQueues = data.filter((e) => e.name.lastIndexOf('EdsTransform',0)===0);
				vm.responseQueues = data.filter((e) => e.name.lastIndexOf('EdsResponse',0)===0);
				vm.subscriberQueues = data.filter((e) => e.name.lastIndexOf('EdsSubscriber',0)===0);
			});
	}

	actionItem(item : FolderItem, action : string) {
		switch (item.type) {
			case ItemType.Query:
				this.router.navigate(['queryEdit', action, item.uuid]);
				break;
			case ItemType.DataSet:
				this.router.navigate(['dataSetEdit', action, item.uuid]);
				break;
			case ItemType.CodeSet:
				this.router.navigate(['codeSetEdit', action, item.uuid]);
				break;
			case ItemType.Report:
				this.router.navigate(['reportEdit', action, item.uuid]);
				break;
			case ItemType.Protocol:
				this.router.navigate(['protocolEdit', action, item.uuid]);
				break;
			case ItemType.System:
				this.router.navigate(['systemEdit', action, item.uuid]);
				break;
		}
	}
}
