/**
 * Copyright (C) 2026 Adham Cherkaoui Eddeqaqi (0dh4m). All rights reserved.
 * Proprietary and confidential. Unauthorized copying or distribution is strictly prohibited.
 * Author: Adham Cherkaoui Eddeqaqi (0dh4m) <0dh4mm@gmail.com>
 * GitHub: https://github.com/0dh4m
 */

/**
 * Cyberpunk Audio Waveform Visualizer
 * Simulates high-precision audio DSP frequency bars using HTML5 Canvas.
 */
class AudioWaveformVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.barCount = 48;
    this.bars = [];
    this.isPlaying = false;
    this.animId = null;

    // Initialize frequency bar state
    for (let i = 0; i < this.barCount; i++) {
      this.bars.push({
        height: 4,
        targetHeight: 4,
        speed: 0.15 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2
      });
    }

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.render();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  setPlaying(isPlaying) {
    this.isPlaying = isPlaying;
  }

  render() {
    const ctx = this.ctx;
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const barWidth = (width / this.barCount) - 3;
    const now = Date.now() / 1000;

    for (let i = 0; i < this.barCount; i++) {
      const b = this.bars[i];
      const x = i * (barWidth + 3);

      if (this.isPlaying) {
        // Frequency simulation: heavier bass on the left, harmonics in the middle
        const bassWeight = Math.sin((i / this.barCount) * Math.PI);
        const beatPulse = Math.sin(now * 8 + b.phase) * 0.4 + 0.6;
        const subBeat = Math.sin(now * 14 + (i * 0.3)) * 0.3 + 0.7;
        b.targetHeight = Math.max(6, (height * 0.85) * bassWeight * beatPulse * subBeat);
      } else {
        // Idle breathing wave
        b.targetHeight = 4 + Math.sin(now * 2 + (i * 0.2)) * 2;
      }

      // Smooth interpolation
      b.height += (b.targetHeight - b.height) * 0.18;

      const y = height - b.height;

      // Neon Gradient for each frequency bar
      const grad = ctx.createLinearGradient(0, height, 0, 0);
      grad.addColorStop(0, '#00f0ff');
      grad.addColorStop(0.55, '#8b5cf6');
      grad.addColorStop(1, '#ec4899');

      ctx.fillStyle = grad;
      ctx.shadowColor = 'rgba(0, 240, 255, 0.4)';
      ctx.shadowBlur = 8;

      // Draw rounded bar
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, b.height, [3, 3, 0, 0]);
      ctx.fill();

      // Top frequency peak dot
      if (this.isPlaying && b.height > 12) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(x + barWidth / 2, y - 3, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(() => this.render());
  }
}

window.AudioWaveformVisualizer = AudioWaveformVisualizer;
