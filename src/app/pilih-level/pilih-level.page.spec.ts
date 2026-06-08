import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PilihLevelPage } from './pilih-level.page';

describe('PilihLevelPage', () => {
  let component: PilihLevelPage;
  let fixture: ComponentFixture<PilihLevelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PilihLevelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
