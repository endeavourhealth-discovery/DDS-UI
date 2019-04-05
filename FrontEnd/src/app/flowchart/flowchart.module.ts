import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowchartComponent } from './flowchart/flowchart.component';
import {MouseCaptureModule} from '../mouseCapture/mousecapture.module';

@NgModule({
  imports: [
    CommonModule,
    MouseCaptureModule
  ],
  declarations: [FlowchartComponent],
  exports: [FlowchartComponent],
  entryComponents: [FlowchartComponent]
})
export class FlowchartModule { }
