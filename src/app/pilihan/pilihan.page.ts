import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

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

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    // Ambil level terakhir
    const currentLevel = localStorage.getItem('currentLevel');
    this.level = currentLevel ? parseInt(currentLevel, 10) : 1;

    // Ambil status apakah level sudah selesai
    const completed = localStorage.getItem('levelCompleted');
    this.levelCompleted = completed === 'true';
  }

  // 👉 LANJUT: cek apakah level sudah selesai
  continueGame() {
    this.levelTransitionVisible = false;

    if (this.levelCompleted) {
      // kalau level sudah selesai → naik level
      this.level++;
      localStorage.setItem('currentLevel', this.level.toString());
      localStorage.setItem('levelCompleted', 'false'); // reset status
    }
    // kalau belum selesai → langsung lanjut game di level terakhir
    this.navCtrl.navigateForward('/game');
  }

  // 👉 ULANG dari level 1
  replayGame() {
    localStorage.setItem('currentLevel', '1');
    localStorage.removeItem('currentScore');
    localStorage.setItem('levelCompleted', 'false');
    this.levelTransitionVisible = false;
    this.navCtrl.navigateForward('/game');
  }

  // 👉 Restart game total
  restartGame() {
    localStorage.removeItem('currentLevel');
    localStorage.removeItem('currentScore');
    localStorage.setItem('levelCompleted', 'false');
    this.levelTransitionVisible = false;
    this.navCtrl.navigateForward('/game');
  }

  // 👉 Kembali ke menu utama
  goToMenu() {
    this.levelTransitionVisible = false;
    this.navCtrl.navigateRoot('/menu');
  }

  // 👉 Tutup overlay tanpa aksi
  closeOverlay() {
    this.levelTransitionVisible = false;
  }
}
