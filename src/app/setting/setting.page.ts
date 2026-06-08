import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { AudioService } from '../audio.service'; 
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
  standalone: false
})
export class SettingPage implements OnInit {

  settings = {
    theme: 'Klasik',
    music: true,
    sfx: true
  };

  backButtonSubscription: Subscription | null = null;

  constructor(
    private navCtrl: NavController,
    private audioService: AudioService,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    const saved = localStorage.getItem('settings');
    if (saved) {
      try {
        this.settings = JSON.parse(saved);
      } catch (e) {
        console.error("Gagal membaca setting", e);
      }
    }

    // Sinkronisasi dengan AudioService
    this.audioService.setMusicEnabled(this.settings.music);
    this.audioService.setSfxEnabled(this.settings.sfx);
  }

  updateSettings() {
    localStorage.setItem('settings', JSON.stringify(this.settings));

    this.audioService.setMusicEnabled(this.settings.music);
    this.audioService.setSfxEnabled(this.settings.sfx);

    // Kalau musik dimatikan, stop semua musik (bg/success/victory)
    if (!this.audioService.getMusicEnabled()) {
      this.audioService.stopMusic();
    }
  }

  saveAndExit() {
    this.updateSettings();
    this.navCtrl.navigateRoot('/menu'); 
  }

  goBack() {
    this.navCtrl.navigateRoot('/menu'); 
  }

  changeTheme() {
    const themes = ['Klasik', 'Modern', 'Neon'];
    const currentIndex = themes.indexOf(this.settings.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.settings.theme = themes[nextIndex];
    this.updateSettings();
  }

  ionViewDidEnter() {
    // Back button HP → kembali ke menu
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot('/menu'); 
    });
  }

  ionViewWillLeave() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
      this.backButtonSubscription = null;
    }
    // Jangan stop musik di sini, biarkan tetap jalan sesuai flag
  }
}
