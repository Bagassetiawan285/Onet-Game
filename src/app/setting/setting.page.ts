import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { AudioService } from '../audio.service'; 
import { Subscription } from 'rxjs';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
  standalone: false
})
export class SettingPage implements OnInit {

  settings = {
    theme: 'Putih',       
    music: true,
    sfx: true,
    notifications: true 
  };

  backButtonSubscription: Subscription | null = null;

  constructor(
    private navCtrl: NavController,
    private audioService: AudioService,
    private platform: Platform
  ) { }

  async ngOnInit() {
    this.loadSettings();
    await LocalNotifications.requestPermissions();
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

    this.audioService.setMusicEnabled(this.settings.music);
    this.audioService.setSfxEnabled(this.settings.sfx);

    if (this.settings.notifications) {
      this.scheduleWeeklyNotifications();
    }

    localStorage.setItem('tileTheme', this.settings.theme);
  }

  updateSettings() {
    localStorage.setItem('settings', JSON.stringify(this.settings));

    this.audioService.setMusicEnabled(this.settings.music);
    this.audioService.setSfxEnabled(this.settings.sfx);

    if (!this.audioService.getMusicEnabled()) {
      this.audioService.stopMusic();
    }

    if (this.settings.notifications) {
      this.scheduleWeeklyNotifications();
    } else {
      this.cancelNotifications();
    }

    localStorage.setItem('tileTheme', this.settings.theme);
  }

  saveAndExit() {
    this.updateSettings();
    this.navCtrl.navigateRoot('/menu'); 
  }

  goBack() {
    this.navCtrl.navigateRoot('/menu'); 
  }

  changeTheme() {
    const themes = ['Putih', 'Biru', 'Ungu'];
    const currentIndex = themes.indexOf(this.settings.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.settings.theme = themes[nextIndex];
    this.updateSettings();
  }

  ionViewDidEnter() {
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

  async scheduleWeeklyNotifications() {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: "Main lagi yuk!",
          body: "Jangan lupa main game 🚀",
          schedule: { every: 'week', on: { weekday: 1, hour: 10, minute: 0 } } 
        },
        {
          id: 2,
          title: "Waktunya tantangan!",
          body: "Level baru menunggu 🎮",
          schedule: { every: 'week', on: { weekday: 4, hour: 10, minute: 0 } } 
        },
        {
          id: 3,
          title: "Sunday Fun!",
          body: "Mainkan game favoritmu 🌟",
          schedule: { every: 'week', on: { weekday: 7, hour: 10, minute: 0 } } 
        }
      ]
    });
  }

  async cancelNotifications() {
    await LocalNotifications.cancel({ notifications: [{ id: 1 }, { id: 2 }, { id: 3 }] });
  }
}
