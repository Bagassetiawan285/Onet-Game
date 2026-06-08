import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { AudioService } from './audio.service'; 

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private router: Router,
    private audioService: AudioService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(10, () => {
        const currentUrl = this.router.url;

        if (currentUrl === '/menu') {
          this.audioService.stopMusic();
          this.audioService.stopAllSfx();
          App.exitApp();
        } else if (
          currentUrl.startsWith('/game') ||
          currentUrl.startsWith('/setting') ||
          currentUrl.startsWith('/riwayatscore') ||
          currentUrl.startsWith('/pilih-level')
        ) {
          this.navCtrl.navigateForward('/menu', {
            animated: true,
            animationDirection: 'back'
          });
        } else {
          this.navCtrl.back();
        }
      });

      this.platform.pause.subscribe(() => {
        this.audioService.stopMusic();
        this.audioService.stopAllSfx();
      });

      this.platform.resume.subscribe(() => {
        if (this.audioService.getMusicEnabled()) {
          this.audioService.playMusic();
        }
      });
    });
  }
}
