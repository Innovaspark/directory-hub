import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoryLayoutComponent } from './directory-layout.component';

describe('MainLayoutComponent', () => {
  let component: DirectoryLayoutComponent;
  let fixture: ComponentFixture<DirectoryLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectoryLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectoryLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
