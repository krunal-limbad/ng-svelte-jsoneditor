import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSvelteJsoneditorComponent } from './ng-svelte-jsoneditor.component';

describe('NgSvelteJsoneditorComponent', () => {
  let component: NgSvelteJsoneditorComponent;
  let fixture: ComponentFixture<NgSvelteJsoneditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgSvelteJsoneditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgSvelteJsoneditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
