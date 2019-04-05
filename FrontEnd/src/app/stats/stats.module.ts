import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {StatsComponent} from "./stats.component";
import {StatsService} from "./stats.service";
import {CuiControlsModule} from 'eds-angular4/dist/cuicontrols/cuicontrols.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CuiControlsModule,
  ],
	declarations : [
		StatsComponent
	],
	providers : [
		StatsService
	]
})
export class StatsModule {}
