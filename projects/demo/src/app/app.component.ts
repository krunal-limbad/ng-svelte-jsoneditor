import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgSvelteJsoneditorComponent } from 'ng-svelte-jsoneditor';
import { Subject } from 'rxjs';
import { JSONEditorPropsOptional, Mode } from 'vanilla-jsoneditor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'demo';
  editor = new FormControl({"greetings": "hello world"})
  options: JSONEditorPropsOptional = {
    onChange: (c) => {
     
    }
  };

  @ViewChild(NgSvelteJsoneditorComponent, { static: true }) ngSvelteJsoneditorComponent: NgSvelteJsoneditorComponent | undefined

  onInitialized(eventSub: {[key: string]: Subject<any>}) {
    eventSub['onChange'].subscribe((c: any) => {
      
    });

    setTimeout(() => {
      // this.editor.disable()
      // METHOD 1
      // this.ngSvelteJsoneditorComponent?.setOptions(
      //   {
      //     mode: Mode.text
      //   }
      // )
      // METHOD 2
      // this.options.mode = Mode.text;
      // this.options = JSON.parse(JSON.stringify(this.options))
    }, 1000);
  }
}
