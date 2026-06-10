import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private currentMusic: HTMLAudioElement | null = null;
  private musicEnabled = true;
  private sfxEnabled = true;
  private activeSfx: HTMLAudioElement[] = []; 

  constructor() {
    // baca setting dari localStorage
    const music = localStorage.getItem('musicEnabled');
    const sfx = localStorage.getItem('sfxEnabled');
    if (music !== null) this.musicEnabled = music === 'true';
    if (sfx !== null) this.sfxEnabled = sfx === 'true';

    // ❌ jangan auto play musik di sini
    // musik hanya dipanggil dari Menu/Game
  }

  // === MUSIC CONTROL ===
  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    localStorage.setItem('musicEnabled', String(enabled));
    if (!enabled) {
      this.stopMusic();
    }
  }

  getMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  isMusicPlaying(): boolean {
    return this.currentMusic !== null && !this.currentMusic.paused;
  }

  playMusic(path: string = 'assets/sounds/bg-music.mp3') {
    if (this.musicEnabled) {
      if (this.isMusicPlaying() && this.currentMusic?.src.includes(path)) {
        return; // sudah main musik yang sama
      }
      this.stopMusic(); 
      this.currentMusic = new Audio(path);
      this.currentMusic.loop = true;
      this.currentMusic.play().catch(err => console.log('Autoplay blocked:', err));
    }
  }

  playSuccessMusic(path: string = 'assets/sounds/success.mp3', loop: boolean = false) {
    if (this.musicEnabled) {
      this.stopMusic();
      this.currentMusic = new Audio(path);
      this.currentMusic.loop = loop;
      this.currentMusic.play().catch(err => console.log('Success music blocked:', err));
    }
  }

  playVictoryMusic(path: string = 'assets/sounds/victory.mp3', loop: boolean = false) {
    if (this.musicEnabled) {
      this.stopMusic();
      this.currentMusic = new Audio(path);
      this.currentMusic.loop = loop;
      this.currentMusic.play().catch(err => console.log('Victory music blocked:', err));
    }
  }

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.currentMusic = null;
    }
  }

  playLevelMusic(level: number) {
    if (!this.musicEnabled) {
      this.stopMusic();
      return;
    }

    if (level >= 45 && level <= 49) {
      this.playSuccessMusic();
    } else if (level === 50) {
      this.playVictoryMusic(); 
    } else {
      this.playMusic(); 
    }
  }

  setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
    localStorage.setItem('sfxEnabled', String(enabled));
  }

  getSfxEnabled(): boolean {
    return this.sfxEnabled;
  }

  playSfx(path: string) {
    if (this.sfxEnabled) {
      const sfx = new Audio(path);
      sfx.volume = 0.7;
      sfx.play().catch(err => console.log('SFX blocked:', err));
      this.activeSfx.push(sfx);
    }
  }

  stopAllSfx() {
    this.activeSfx.forEach(sfx => {
      sfx.pause();
      sfx.currentTime = 0;
    });
    this.activeSfx = [];
  }
}
