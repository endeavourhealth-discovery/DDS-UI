import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {ProtocolEditComponent} from "./protocolEditor.component";
import {ProtocolService} from "./protocol.service";
@NgModule({
	imports : [
		BrowserModule,
		FormsModule,
	],
	declarations : [
		ProtocolEditComponent
	],
	providers : [
		ProtocolService
	]
})
export class ProtocolModule {}
