import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PilihanPage } from './pilihan.page';

describe('PilihanPage', () => {
  let component: PilihanPage;
  let fixture: ComponentFixture<PilihanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PilihanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
