import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {QueryEditComponent} from "./queryEditor.component";
import {QueryPickerDialog} from "./queryPicker.dialog";
import {TestsModule} from "../tests/tests.module";
import {ExpressionsModule} from "../expressions/expressions.module";
import {LibraryModule} from 'eds-angular4/dist/library';
import {FolderModule} from 'eds-angular4/dist/folder';
import {DialogsModule} from 'eds-angular4';
import {FlowchartModule} from '../flowchart/flowchart.module';

@NgModule({
	imports : [
		BrowserModule,
		FormsModule,
		NgbModule,
		FlowchartModule,

		LibraryModule,
		FolderModule,
		DialogsModule,
		ExpressionsModule,
		TestsModule
	],
	declarations : [
		QueryEditComponent,
		QueryPickerDialog
	],
	entryComponents : [
		QueryPickerDialog
	]
})
export class QueryModule {}
