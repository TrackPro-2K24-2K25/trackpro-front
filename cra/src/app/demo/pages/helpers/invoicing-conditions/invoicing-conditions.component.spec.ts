import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicingConditionsComponent } from './invoicing-conditions.component';

describe('InvoicingConditionsComponent', () => {
  let component: InvoicingConditionsComponent;
  let fixture: ComponentFixture<InvoicingConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicingConditionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicingConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
