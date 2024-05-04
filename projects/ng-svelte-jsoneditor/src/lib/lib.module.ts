import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSvelteJsoneditorComponent } from './ng-svelte-jsoneditor/ng-svelte-jsoneditor.component';



@NgModule({
  declarations: [
    NgSvelteJsoneditorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NgSvelteJsoneditorComponent
  ]
})
export class LibModule { }
