import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {AuditComponent} from "./audit.component";
import {AuditService} from "./audit.service";
import {AuditEventDialog} from "./auditEvent.dialog";
import {CuiControlsModule} from 'eds-angular4/dist/cuicontrols/cuicontrols.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CuiControlsModule
  ],
	declarations:[
		AuditComponent,
		AuditEventDialog,
	],
	entryComponents: [
		AuditEventDialog
	],
	providers:[
		AuditService
	]

})
export class AuditModule {}
