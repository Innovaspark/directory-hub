import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoryLayout2Component } from './directory-layout2.component';

describe('MainLayoutComponent', () => {
  let component: DirectoryLayout2Component;
  let fixture: ComponentFixture<DirectoryLayout2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectoryLayout2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectoryLayout2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
