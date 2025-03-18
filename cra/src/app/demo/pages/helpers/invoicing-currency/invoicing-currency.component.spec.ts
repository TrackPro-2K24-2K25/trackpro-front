import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicingCurrencyComponent } from './invoicing-currency.component';

describe('InvoicingCurrencyComponent', () => {
  let component: InvoicingCurrencyComponent;
  let fixture: ComponentFixture<InvoicingCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicingCurrencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicingCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
