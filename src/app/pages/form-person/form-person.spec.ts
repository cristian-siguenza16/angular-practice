import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPerson } from './form-person';

describe('FormPerson', () => {
  let component: FormPerson;
  let fixture: ComponentFixture<FormPerson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPerson]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPerson);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
