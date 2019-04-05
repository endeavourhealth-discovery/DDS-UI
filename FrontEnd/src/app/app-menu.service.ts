import {Injectable} from '@angular/core';
import {AbstractMenuProvider} from 'eds-angular4';
import {MenuOption} from 'eds-angular4/dist/layout/models/MenuOption';
import {Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {OrganisationListComponent} from './organisations/organisationList.component';
import {OrganisationEditComponent} from './organisations/organisationEditor.component';
import {ServiceListComponent} from './services/serviceList.component';
import {ServiceEditComponent} from './services/serviceEditor.component';
import {UserListComponent} from './users/userList.component';
import {AuditComponent} from './audit/audit.component';
import {LoggingComponent} from './logging/logging.component';
import {QueueingListComponent} from './queueing/queueingList.component';
import {StatsComponent} from './stats/stats.component';
import {LibraryComponent} from './edsLibrary/library.component';
import {SystemEditComponent} from './system/systemEditor.component';
import {QueryEditComponent} from './query/queryEditor.component';
import {ProtocolEditComponent} from './protocol/protocolEditor.component';
import {DataSetEditComponent} from './dataSet/dataSetEditor.component';
import {CodeSetEditComponent} from './codeSet/codeSetEditor.component';
import {TransformErrorsComponent} from './transformErrors/transformErrors.component';
import {ExchangeAuditComponent} from './exchangeAudit/exchangeAudit.component';
import {CountReportEditComponent} from './countReport/countReport.component';

export class DummyComponent {}

@Injectable()
export class AppMenuService implements  AbstractMenuProvider {
  static getRoutes(): Routes {
    return [
      { path: '', redirectTo : 'dashboard', pathMatch: 'full' },  // Default route
      { path: 'dashboard', component: DashboardComponent},
      { path: 'organisationList', component: OrganisationListComponent},
      { path: 'organisationEdit/:itemAction/:itemUuid',component: OrganisationEditComponent},
      { path: 'serviceList', component: ServiceListComponent},
      { path: 'serviceEdit/:itemAction/:itemUuid', component: ServiceEditComponent},
      { path: 'admin', component: UserListComponent},
      { path: 'audit', component: AuditComponent},
      { path: 'monitoring', component: LoggingComponent},
      { path: 'queueing', component: QueueingListComponent},
      { path: 'stats', component: StatsComponent},
      { path: 'library', component: LibraryComponent},
      { path: 'systemEdit/:itemAction/:itemUuid', component: SystemEditComponent},
      { path: 'queryEdit/:itemAction/:itemUuid', component: QueryEditComponent},
      { path: 'protocolEdit/:itemAction/:itemUuid', component: ProtocolEditComponent},
      { path: 'dataSetEdit/:itemAction/:itemUuid', component: DataSetEditComponent},
      { path: 'codeSetEdit/:itemAction/:itemUuid', component: CodeSetEditComponent},
      { path: 'transformErrors', component: TransformErrorsComponent},
      { path: 'exchangeAudit/:serviceId/:systemId', component: ExchangeAuditComponent},
      { path: 'countReportEdit/:itemAction/:itemUuid', component: CountReportEditComponent},
      { path: 'eds-user-manager', component: DummyComponent }

    ];
  }

  getClientId(): string {
    return 'eds-ui';
  }

  getApplicationTitle(): string {
    return 'Data Service Manager';
  }

  getMenuOptions(): MenuOption[] {
    return [
      {caption: 'Dashboard', state: 'dashboard', icon: 'fa fa-tachometer', role: 'eds-ui:dashboard'},
      {caption: 'Protocols', state: 'library', icon: 'fa fa-share-alt', role: 'eds-ui:protocols'},
      {caption: 'Organisations', state: 'organisationList', icon: 'fa fa-hospital-o', role: 'eds-ui:organisations'},
      {caption: 'Services', state: 'serviceList', icon: 'fa fa-building-o', role: 'eds-ui:services'},
      {caption: 'Queueing', state: 'queueing', icon: 'fa fa-tasks', role: 'eds-ui:queueing'},
      //
      {caption: 'Monitoring', state: 'monitoring', icon: 'fa fa-list-alt', role: 'eds-ui:monitoring'},
      {caption: 'Transform Errors', state: 'transformErrors', icon: 'fa fa-exchange', role: 'eds-ui:transform-errors'},
      {caption: 'Statistics', state: 'stats', icon: 'fa fa-line-chart', role: 'eds-ui:statistics'},
      {caption: 'Audit', state: 'audit', icon: 'fa fa-list-ul', role: 'eds-ui:audit'}
    ];
  }

  useUserManagerForRoles(): boolean {
    return false;
  }
}
