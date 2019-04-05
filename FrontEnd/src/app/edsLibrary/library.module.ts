import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {LibraryComponent} from "./library.component";
import {PipesModule} from "../pipes/pipes.module";
import {FolderModule} from 'eds-angular4/dist/folder';
import {LibraryService} from 'eds-angular4/dist/library';

@NgModule({
	imports:[
		BrowserModule,
		NgbModule,

		PipesModule,
		FolderModule,
	],
	declarations:[
		LibraryComponent,
	],
	providers:[
		LibraryService,
	],
})
export class EdsLibraryModule {}
