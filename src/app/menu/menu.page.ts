import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { AudioService } from '../audio.service'; 
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false
})
export class MenuPage implements OnInit {
  showSettings = false;
  settings: any;
  backButtonSubscription: Subscription | null = null; 

  levels: number[] = Array.from({ length: 50 }, (_, i) => i + 1);
  maxLevelUnlocked: number = 1;

  showPlayOptions = false;

  constructor(
    private navCtrl: NavController,
    private audioService: AudioService,
    private platform: Platform,
  ) {}

  ngOnInit() {
    const saved = localStorage.getItem('settings');
    if (saved) {
      this.settings = JSON.parse(saved);
    } else {
      this.settings = { music: true, sfx: true, theme: 'Klasik' };
    }

    this.audioService.setMusicEnabled(this.settings.music);
    this.audioService.setSfxEnabled(this.settings.sfx);

    const currentLevel = localStorage.getItem('currentLevel');
    this.maxLevelUnlocked = currentLevel ? parseInt(currentLevel, 10) : 1;

    if (this.maxLevelUnlocked >= 50) {
      this.maxLevelUnlocked = 50;
    }
  }

  ionViewDidEnter() {
    const currentLevel = localStorage.getItem('currentLevel')
      ? parseInt(localStorage.getItem('currentLevel')!, 10)
      : 1;

    if (this.audioService.getMusicEnabled() && !this.audioService.isMusicPlaying()) {
      this.audioService.playLevelMusic(currentLevel);
    }

    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      App.exitApp(); 
    });
  }

  ionViewWillLeave() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
      this.backButtonSubscription = null;
    }
  }

 goToGame() {
  if (this.audioService.getSfxEnabled()) {
    this.audioService.playSfx('assets/sounds/click.mp3');
  }

  const savedLevel = localStorage.getItem('currentLevel');
  if (!savedLevel) {
    this.navCtrl.navigateForward('/game');
  } else {
    this.navCtrl.navigateForward('/pilihan');
  }
}


  continueGame() {
    this.showPlayOptions = false;
    this.navCtrl.navigateForward('/game'); 
  }

  restartGame() {
    localStorage.removeItem('currentLevel');
    localStorage.removeItem('currentScore');
    this.showPlayOptions = false;
    this.navCtrl.navigateForward('/game'); 
  }

  goToMenu() {
    this.showPlayOptions = false;
    this.navCtrl.navigateRoot('/menu');
  }

  goToSetting() {
    if (this.audioService.getSfxEnabled()) {
      this.audioService.playSfx('assets/sounds/click.mp3');
    }
    this.navCtrl.navigateForward('/setting');
  }

  goToHistory() {
    if (this.audioService.getSfxEnabled()) {
      this.audioService.playSfx('assets/sounds/click.mp3');
    }
    this.navCtrl.navigateForward('/riwayatscore', {
      animated: true,
      animationDirection: 'forward' 
    });
  }

  selectLevel(lvl: number) {
    if (lvl <= this.maxLevelUnlocked) {
      localStorage.setItem('currentLevel', lvl.toString());
      this.navCtrl.navigateForward('/game');

      if (!this.audioService.isMusicPlaying()) {
        this.audioService.playLevelMusic(lvl);
      }
    }
  }

  goToPilihLevel() {
    if (this.audioService.getSfxEnabled()) {
      this.audioService.playSfx('assets/sounds/click.mp3');
    }
    this.navCtrl.navigateForward('/pilih-level');
  }

 

}
