import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { ContentErrors, JSONEditor, JSONEditorPropsOptional, Mode, OnChange, OnRenderContextMenu, OnRenderMenu, OnRenderValue } from 'vanilla-jsoneditor'

@Component({
	selector: 'ng-svelte-jsoneditor',
	templateUrl: './ng-svelte-jsoneditor.component.html',
	styleUrl: './ng-svelte-jsoneditor.component.css',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => NgSvelteJsoneditorComponent),
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: NgSvelteJsoneditorComponent,
			multi: true,
		}
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class NgSvelteJsoneditorComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnChanges, OnDestroy {

	
	private _options: JSONEditorPropsOptional = {};
	@Input() set options(optVal: JSONEditorPropsOptional) {
		this._options = optVal;
		this.updateProps();
	}

	get options() {
		return this._options;
	}

	@Input() set onRenderValue(optVal: OnRenderValue) {
		if (optVal) {
			this.options.onRenderValue = optVal;
			this.updateProps();
		}
	}

	@Input() set onRenderMenu(optVal: OnRenderMenu) {
		if (optVal) {
			this.options.onRenderMenu = optVal;
			this.updateProps();
		}
	}

	@Input() set onRenderContextMenu(optVal: OnRenderContextMenu) {
		if (optVal) {
			this.options.onRenderContextMenu = optVal;
			this.updateProps();
		}
	}

	private data: Object = {};

	private _onChange!: ((_: any) => void);
	private _onTouched!: (() => void);
	private _onValidationChange: any = () => {};
	private _editorRef: any;
	private _modeEnumHash: { [key: string]: Mode } = {
		'text': Mode.text,
		'tree': Mode.tree,
		'table': Mode.tree
	}
	private eventRegistration: Array<string> = [
		'onChangeQueryLanguage',
		'onChange',
		// 'onRenderValue',
		'onClassName',
		// 'onRenderMenu',
		// 'onRenderContextMenu',
		'onChangeMode',
		'onSelect',
		'onError',
		'onFocus',
		'onBlur'
	];
	private initRan: boolean = false;
	private errors: ContentErrors | undefined;

	disabled = false;
	isFocused = false;
	static nextId = 0;
	eventSubject: { [key: string]: Subject<any> } = {};

	
	@ViewChild('editorContainer', { static: true }) editorContainer: ElementRef | undefined;
	@HostBinding() id = `ng-svelte-jsoneditor-${NgSvelteJsoneditorComponent.nextId++}`;

	@Output() onInitialized: EventEmitter<{ [key: string]: Subject<any> }> = new EventEmitter();

	constructor(
		private cdr: ChangeDetectorRef
	) {

	}

	ngOnInit(): void {
		if (!this.options) {
			this.options = {};
		}
		if (!this.options.mode) {
			this.options.mode = Mode.text;
		} else {
			this.options.mode = this._modeEnumHash[this.options.mode];
		}
	}

	ngAfterViewInit() {
		this.initalizeEditor();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes) {
			if (JSON.stringify(changes['options']?.currentValue) !== JSON.stringify(changes['options']?.previousValue)) {
				this.updateProps();
			}
		}
	}

	ngOnDestroy(): void {
		if (this._editorRef?.destroy) {
			this._editorRef.destroy();
		}
	}

	private initalizeEditor() {

		let props: JSONEditorPropsOptional = {
			mode: this.options.mode,
			content: this.editorContent()
		};

		this.eventRegistration.forEach((eventName: string) => {
			this.eventSubject[eventName] = new Subject();

			const emitCallback = (...args: any): any => {
				this.eventSubject[eventName].next({ ...args }) 
				if (typeof this.options[eventName as keyof JSONEditorPropsOptional] === 'function') {
					(this.options[eventName as keyof JSONEditorPropsOptional] as Function).apply(this, args);
				}
				if (eventName === 'onChange') {
					this.errors = args[2]?.contentErrors?.parseError || null;
					this._onChange(typeof this.data !== 'object' ? JSON.stringify(this._editorRef.get()) :  this._editorRef.get());
					this._onValidationChange();
				} else if (eventName === 'onFocus') {
					this._onTouched()
				}
			}
			props[eventName as keyof JSONEditorPropsOptional] = emitCallback as any;
		});

		this._editorRef = new JSONEditor({
			target: this.editorContainer?.nativeElement,
			props
		});

		this.onInitialized.emit(this.eventSubject);
		this.initRan = true;
	}

	private isValidJson(str: any) {
		if (typeof str !== 'object') {
			try {
				JSON.parse(str);
			} catch (e) {
				return false;
			}
		}
		return true;
	}

	private editorContent() {
		let editorContent: any = {
		};

		if (this.options.mode === Mode.text) {
			editorContent.text = this.data?.toString() || '';
		} else {
			if (this.isValidJson(this.data)) {
				editorContent.json = typeof this.data !== 'object' ? JSON.parse(this.data) : this.data;
			} else {
				editorContent.json = {};
			}
		}
		
		return editorContent;
	}

	private updateProps() {
		this._editorRef?.updateProps(this.options);
		this.cdr.detectChanges();
	}

	get editorRef() {
		return this._editorRef;
	}

	setOptions(optVal: JSONEditorPropsOptional) {
		if (this.isValidJson(optVal)) {
			this.options = Object.assign(this.options, optVal);
			this.updateProps();
		}
	}

	writeValue(obj: any): void {
		this.data = obj;
		if (this.initRan && this._editorRef) {
			this._editorRef?.update(this.editorContent());
			this.cdr.detectChanges();
		}
	}
	
	registerOnChange(fn: (_: any) => void): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this._onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
		this.options.readOnly = this.disabled;
		this.updateProps();
	}

	validate({ value }: FormControl): ValidationErrors | null {
		return this.errors ? { invalid: true } : null;
	}

	registerOnValidatorChange?(fn: () => void): void {
		this._onValidationChange = fn;
	  }

}
