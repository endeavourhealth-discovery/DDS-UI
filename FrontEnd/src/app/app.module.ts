import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {Http, HttpModule, RequestOptions, XHRBackend} from '@angular/http';
import {AppMenuService} from './app-menu.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {KeycloakService} from 'eds-angular4/dist/keycloak/keycloak.service';
import {keycloakHttpFactory} from 'eds-angular4/dist/keycloak/keycloak.http';
import {AbstractMenuProvider, DialogsModule, LayoutModule, LoggerModule, UserManagerNotificationService} from 'eds-angular4';
import {LayoutComponent} from 'eds-angular4/dist/layout/layout.component';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ModuleStateService} from 'eds-angular4/dist/common';
import {DashboardModule} from './dashboard/dashboard.module';
import {EdsLibraryModule} from './edsLibrary/library.module';
import {OrganisationsModule} from './organisations/organisations.module';
import {ServicesModule} from './services/services.module';
import {QueueingModule} from './queueing/queueing.module';
import {LoggingModule} from './logging/logging.module';
import {TransformErrorsModule} from './transformErrors/transformErrors.module';
import {StatsModule} from './stats/stats.module';
import {AuditModule} from './audit/audit.module';
import {DataSetModule} from './dataSet/dataSet.module';
import {UserModule} from './users/user.module';
import {SystemModule} from './system/system.module';
import {QueryModule} from './query/query.module';
import {ProtocolModule} from './protocol/protocol.module';
import {CodeSetModule} from './codeSet/codeSet.module';
import {CountReportModule} from './countReport/countReport.module';
import {ExchangeAuditModule} from './exchangeAudit/exchangeAudit.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,

    LoggerModule,
    LayoutModule,

    DashboardModule,
    EdsLibraryModule,
    OrganisationsModule,
    ServicesModule,
    QueueingModule,
    LoggingModule,
    TransformErrorsModule,
    StatsModule,
    AuditModule,
    DataSetModule,
    UserModule,
    SystemModule,
    QueryModule,
    ProtocolModule,
    CodeSetModule,
    CountReportModule,
    ExchangeAuditModule,

    RouterModule.forRoot(AppMenuService.getRoutes(), {useHash: true}),
    NgbModule.forRoot(),
    ToastModule.forRoot()
  ],
  providers: [
    KeycloakService,
    ModuleStateService,
    { provide: AbstractMenuProvider, useClass : AppMenuService },
    { provide: Http, useFactory: keycloakHttpFactory, deps: [XHRBackend, RequestOptions, KeycloakService, AbstractMenuProvider, UserManagerNotificationService] }
  ],
  bootstrap: [LayoutComponent]
})
export class AppModule {}
