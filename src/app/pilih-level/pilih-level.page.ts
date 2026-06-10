import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { AudioService } from '../audio.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pilih-level',
  templateUrl: './pilih-level.page.html',
  styleUrls: ['./pilih-level.page.scss'],
  standalone: false
})
export class PilihLevelPage implements OnInit {
  levels: number[] = Array.from({ length: 50 }, (_, i) => i + 1);
  maxLevelUnlocked: number = 1;
  backButtonSubscription: Subscription | null = null;

  constructor(
    private navCtrl: NavController,
    private audioService: AudioService,
    private platform: Platform
  ) {}

  ngOnInit() {
    const allUnlocked = localStorage.getItem('allLevelsUnlocked') === 'true';
    const currentLevel = parseInt(localStorage.getItem('currentLevel') || '1', 10);
    this.maxLevelUnlocked = allUnlocked ? 50 : currentLevel;
    if (this.maxLevelUnlocked >= 50) {
      this.maxLevelUnlocked = 50;
    }
  }

  ionViewDidEnter() {
    const currentLevel = localStorage.getItem('currentLevel')
      ? parseInt(localStorage.getItem('currentLevel')!, 10)
      : 1;
    this.audioService.playLevelMusic(currentLevel);

    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot('/menu');
    });
  }

  ionViewWillLeave() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
      this.backButtonSubscription = null;
    }
  }

  selectLevel(lvl: number) {
    if (lvl <= this.maxLevelUnlocked) {
      localStorage.setItem('currentLevel', lvl.toString());
      localStorage.setItem('levelCompleted', 'false');
      this.audioService.playLevelMusic(lvl);
      this.navCtrl.navigateForward('/game');
    }
  }

  goBack() {
    this.navCtrl.navigateRoot('/menu');
    const currentLevel = localStorage.getItem('currentLevel')
      ? parseInt(localStorage.getItem('currentLevel')!, 10)
      : 1;
    this.audioService.playLevelMusic(currentLevel);
  }
}
