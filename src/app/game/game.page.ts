import { Component, OnInit } from '@angular/core';
import { NavController, Platform, IonRouterOutlet } from '@ionic/angular';
import { AudioService } from '../audio.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: false,
})
export class GamePage implements OnInit {
  level = 1;
  score = 0;
  time = 30;
  timer: any;
  hint = 3;
  shuffle = 3;
  undo = 3;
  tiles: any[] = [];
  firstTile: any = null;
  lastMove: any = null;

  icons = ["🍎","🍊","🍇","🍓","🍒","🍍","🍌","🍉","🥭","🥥","🍏","🥑","🥝","🍈","🌶️","🍐","🍅"];

  currentTheme: string = 'Klasik';
  finalResultVisible = false;
  levelTransitionVisible = false; 
  finalScore: number = 0;
  backButtonSubscription: any;
  timeOverVisible = false;

  constructor(
    private navCtrl: NavController,
    public audioService: AudioService,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet 
  ) {}

  ngOnInit() {
    const savedLevel = localStorage.getItem('currentLevel');
    const savedScore = localStorage.getItem('currentScore');

    this.level = savedLevel ? parseInt(savedLevel, 10) : 1;
    this.score = savedScore ? parseInt(savedScore, 10) : 0;

    this.checkWeeklyReset(); 
    this.initBoard();
  }

  ionViewDidEnter() {
    if (this.audioService.getMusicEnabled() && !this.audioService.isMusicPlaying()) {
      this.audioService.playLevelMusic(this.level);
    }
    this.currentTheme = localStorage.getItem('tileTheme') || 'Klasik';
    this.routerOutlet.swipeGesture = false;

    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.stopTimer(); 
      this.navCtrl.navigateRoot('/menu');
    });
  }

  ionViewWillLeave() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
      this.backButtonSubscription = null;
    }
    this.routerOutlet.swipeGesture = true;
    this.stopTimer();
  }

  initBoard() {
    this.stopTimer();
    this.time = this.getTimeForLevel(this.level);
    localStorage.setItem('levelCompleted', 'false'); 

    this.timer = setInterval(() => {
      this.time--;
      if (this.time <= 0) {
        this.stopTimer();
        this.saveDailyScore();
        this.timeOverVisible = true;
      }
    }, 1000);

    let size = 6;
    let temp: any[] = [];
    for (let i = 0; i < (size * size) / 2; i++) {
      let icon = this.icons[i % this.icons.length];
      temp.push({ icon, hidden: false }, { icon, hidden: false });
    }
    temp.sort(() => Math.random() - 0.5);

    this.tiles = temp.map((t, i) => ({
      ...t,
      id: i,
      x: (i % size) * 65,
      y: Math.floor(i / size) * 65,
      z: Math.floor(Math.random() * 10)
    }));
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  selectTile(tile: any) {
    if (tile.hidden) return;
    if (!this.firstTile) {
      this.firstTile = tile;
    } else {
      if (this.firstTile.icon === tile.icon && this.firstTile.id !== tile.id) {
        this.firstTile.hidden = true;
        tile.hidden = true;
        this.score += 10;
        localStorage.setItem('currentScore', this.score.toString());

        this.lastMove = [this.firstTile, tile];
        this.checkWin();
      }
      this.firstTile = null;
    }
  }

  checkWin() {
    if (this.tiles.every(t => t.hidden)) {
      localStorage.setItem('levelCompleted', 'true'); 
      this.onWin();
      this.saveDailyScore(); 
      this.nextLevel();
    }
  }

  nextLevel() {
    if (this.level < 50) {  
      this.stopTimer();
      this.finalScore = this.score;
      this.levelTransitionVisible = true; 
    } else {
      this.onWin();
      this.stopTimer(); 
      this.finalScore = this.score;
      this.finalResultVisible = true;
      this.saveDailyScore(); 
      localStorage.setItem('allLevelsUnlocked', 'true');
      localStorage.removeItem('currentLevel');
      localStorage.removeItem('currentScore');
    }
  }

  continueGame() {
    const completed = localStorage.getItem('levelCompleted');
    if (completed === 'true') {
      this.startNextLevel(); 
    } else {
      this.levelTransitionVisible = false;
      this.initBoard();
    }
  }

 startNextLevel() {
  this.level++;
  localStorage.setItem('currentLevel', this.level.toString());
  localStorage.setItem('currentScore', this.score.toString());
  localStorage.setItem('levelCompleted', 'false');

  this.saveDailyScore();

  this.levelTransitionVisible = false;
  this.initBoard();
}

  resetGame() {
    this.saveDailyScore(); 
    this.level = 1;
    this.score = 0;
    localStorage.setItem('currentScore', this.score.toString());
    localStorage.setItem('levelCompleted', 'false');
    this.stopTimer(); 
    this.initBoard();
  }

  replayGame() {
    this.finalResultVisible = false;
    this.level = 1;
    this.score = 0;
    localStorage.setItem('currentScore', this.score.toString());
    localStorage.setItem('levelCompleted', 'false');
    this.stopTimer();
    this.initBoard();
  }

  goToMenu() {
    this.finalResultVisible = false;
    this.levelTransitionVisible = false;
    this.stopTimer();
    this.navCtrl.navigateRoot('/menu');
  }

  onWin() {
    if (this.level >= 45 && this.level <= 49) {
      this.audioService.playSuccessMusic();
    } else if (this.level === 50) {
      this.audioService.playVictoryMusic();
    }
  }

  useHint() {
    if (this.hint > 0) {
      this.hint--;
      alert("Hint: cari pasangan yang sama!");
    }
  }

  shuffleBoard() {
    if (this.shuffle > 0) {
      this.shuffle--;
      this.initBoard();
    }
  }

  undoMove() {
    if (this.undo > 0 && this.lastMove) {
      this.undo--;
      this.lastMove[0].hidden = false;
      this.lastMove[1].hidden = false;
      this.score = Math.max(0, this.score - 10);
      localStorage.setItem('currentScore', this.score.toString()); 
    }
  }

  saveDailyScore() {
    const now = new Date();
    const today = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    const dayName = now.toLocaleDateString('id-ID', { weekday: 'long' });

    let scores = JSON.parse(localStorage.getItem('dailyScores') || '[]');
    const randomIcon = this.icons[Math.floor(Math.random() * this.icons.length)];

    scores.push({
      date: today,
      time: time,
      day: dayName,
      score: this.score,
      icon: randomIcon,
      dateTime: now.toISOString()
    });

    localStorage.setItem('currentScore', this.score.toString()); 
    localStorage.setItem('dailyScores', JSON.stringify(scores));
  }

  checkWeeklyReset() {
    let scores = JSON.parse(localStorage.getItem('dailyScores') || '[]');
    const today = new Date();

    scores = scores.filter((s: any) => {
      const scoreDate = new Date(s.dateTime);
      const diff = (today.getTime() - scoreDate.getTime()) / (1000 * 3600 * 24);
      return diff < 7;
    });

    localStorage.setItem('dailyScores', JSON.stringify(scores));
  }

  getTimeForLevel(level: number): number {
    if (level <= 29) return 60;   
    if (level <= 45) return 40;   
    if (level <= 50) return 30;  
    return 60; 
  }

  retryLevel() {
    this.timeOverVisible = false;
    this.initBoard(); 
  }

  exitToMenu() {
    this.timeOverVisible = false;
    this.goToMenu(); 
  }
}
