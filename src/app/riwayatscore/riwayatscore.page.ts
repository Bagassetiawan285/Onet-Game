import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { AudioService } from '../audio.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-riwayatscore',
  templateUrl: './riwayatscore.page.html',
  styleUrls: ['./riwayatscore.page.scss'],
  standalone: false
})
export class RiwayatscorePage implements OnInit {
  dailyScores: any[] = [];
  totalWeeklyScore: number = 0;
  icons = ["🍎","🍊","🍇","🍓","🍒","🍍","🍌","🍉","🥭","🥥","🍏","🥑","🥝","🍈","🌶️","🍐","🍅"];
  backButtonSubscription: Subscription | null = null;

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private audioService: AudioService
  ) {}

  ngOnInit() {
    this.dailyScores = this.getWeeklyScores();
    this.totalWeeklyScore = this.dailyScores.reduce((sum, s) => sum + s.score, 0);
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

  getWeeklyScores() {
    let scores = JSON.parse(localStorage.getItem('dailyScores') || '[]');
    const today = new Date();

    scores = scores.filter((s: any) => {
      const scoreDate = new Date(s.dateTime);
      const diff = (today.getTime() - scoreDate.getTime()) / (1000 * 3600 * 24);
      return diff < 7;
    });

    localStorage.setItem('dailyScores', JSON.stringify(scores));
    return scores;
  }

  goBackToMenu() {
    this.navCtrl.navigateRoot('/menu');
    const currentLevel = localStorage.getItem('currentLevel')
      ? parseInt(localStorage.getItem('currentLevel')!, 10)
      : 1;
    this.audioService.playLevelMusic(currentLevel);
  }
}
