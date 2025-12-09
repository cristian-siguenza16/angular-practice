import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFormCredentials } from './dialog-form-credentials';

describe('DialogFormCredentials', () => {
  let component: DialogFormCredentials;
  let fixture: ComponentFixture<DialogFormCredentials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogFormCredentials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogFormCredentials);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
