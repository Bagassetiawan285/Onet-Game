import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-pilihan',
  templateUrl: './pilihan.page.html',
  styleUrls: ['./pilihan.page.scss'],
  standalone: false
})
export class PilihanPage implements OnInit {

  levelTransitionVisible: boolean = true; 
  level: number = 1; 
  levelCompleted: boolean = false; 

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const currentLevel = localStorage.getItem('currentLevel');
    this.level = currentLevel ? parseInt(currentLevel, 10) : 1;

    const completed = localStorage.getItem('levelCompleted');
    this.levelCompleted = completed === 'true';
  }

  continueGame() {
    this.levelTransitionVisible = false;

    if (this.levelCompleted) {
      this.level++;
      localStorage.setItem('currentLevel', this.level.toString());
      localStorage.setItem('levelCompleted', 'false'); 
    }
    this.navCtrl.navigateForward('/game');
  }

  replayGame() {
    localStorage.setItem('currentLevel', '1');
    localStorage.removeItem('currentScore');
    localStorage.setItem('levelCompleted', 'false');
    this.levelTransitionVisible = false;
    this.navCtrl.navigateForward('/game');
  }

  restartGame() {
    localStorage.removeItem('currentLevel');
    localStorage.removeItem('currentScore');
    localStorage.setItem('levelCompleted', 'false');
    this.levelTransitionVisible = false;
    this.navCtrl.navigateForward('/game');
  }

  goToMenu() {
    this.levelTransitionVisible = false;
    this.navCtrl.navigateRoot('/menu');
  }

  closeOverlay() {
    this.levelTransitionVisible = false;
  }

  

  
}
