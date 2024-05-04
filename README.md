
# ng-svelte-jsoneditor

Angular Json Editor (wrapper for [svelte-jsoneditor](https://github.com/josdejong/svelte-jsoneditor)). View/Edit Json file with formatting.

A web-based tool to view, edit, format, transform, and validate JSON.


## Installation


```bash
  npm install ng-svelte-jsoneditor
```
    
## Usage


```ts
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ......
    NgSvelteJsonEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```

```html
<ng-svelte-jsoneditor [formControl]="editor"></ng-svelte-jsoneditor>
```

## Methods

```html
<ng-svelte-jsoneditor [formControl]="editor" [options]="options" (onInitialized)="onInitialized($event)"></ng-svelte-jsoneditor>
```

Use pre-defined options & methods
```ts
options: JSONEditorPropsOptional = {
  onChange: (c) => {
    //console.log(c);   
  }
};
```

Same methods are accessible via subscription
```ts
onInitialized(eventSub: {[key: string]: Subject<any>}) {
  eventSub['onChange'].subscribe((c: any) => {
    
  });
}
```
Supported Methods For Above
```
onChangeQueryLanguage
onChange
onClassName
onChangeMode
onSelect
onError
onFocus
onBlur
```

### @Inputs - methods
```
onRenderValue
onRenderMenu
onRenderContextMenu
```

### Accessing component reference
```ts
@ViewChild(NgSvelteJsoneditorComponent, { static: true }) ngSvelteJsoneditorComponent: NgSvelteJsoneditorComponent | undefined
```

Disable field
```ts
this.editor.disable()
```

Set options
```ts
<!-- Method 1 -->
this.ngSvelteJsoneditorComponent?.setOptions(
  {
    mode: Mode.text
  }
)

<!-- Method 2 -->
this.options.mode = Mode.text;
this.options = JSON.parse(JSON.stringify(this.options))
```
## Documentation

[Documentation](https://github.com/josdejong/svelte-jsoneditor?tab=readme-ov-file#properties)


## License

ng-svelte-jsoneditor is released as open source under the permissive the ISC license. [MIT](https://github.com/krunal-limbad/ng-svelte-jsoneditor/blob/main/LICENSE.md)

