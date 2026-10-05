let currentActiveId = 'slide-1';

// Slide transition helper (Right to Left / Next)
function nextSlide(targetId) {
  const currentSlide = document.getElementById(currentActiveId);
  const targetSlide = document.getElementById(targetId);
  
  if (!currentSlide || !targetSlide) return;
  
  // Prepare target slide offscreen on the right
  targetSlide.classList.remove('to-left', 'to-right', 'from-left');
  targetSlide.classList.add('from-right');
  targetSlide.offsetHeight; // Force reflow
  
  // Animate transition
  currentSlide.classList.remove('active');
  currentSlide.classList.add('to-left');
  
  targetSlide.classList.add('active');
  targetSlide.classList.remove('from-right');
  
  // Clean up exit class after animation ends
  setTimeout(() => {
    currentSlide.classList.remove('to-left');
  }, 600);
  
  currentActiveId = targetId;

  // Trigger a light confetti burst when opening the surprise memories!
  if (targetId === 'slide-2') {
    if (!isPlaying) togglePlayPause();
    setTimeout(triggerSurpriseConfetti, 400);
  }
}

// Slide transition helper (Left to Right / Previous)
function prevSlide(targetId) {
  const currentSlide = document.getElementById(currentActiveId);
  const targetSlide = document.getElementById(targetId);
  
  if (!currentSlide || !targetSlide) return;
  
  // Prepare target slide offscreen on the left
  targetSlide.classList.remove('to-left', 'to-right', 'from-right');
  targetSlide.classList.add('from-left');
  targetSlide.offsetHeight; // Force reflow
  
  // Animate transition
  currentSlide.classList.remove('active');
  currentSlide.classList.add('to-right');
  
  targetSlide.classList.add('active');
  targetSlide.classList.remove('from-left');
  
  // Clean up exit class after animation ends
  setTimeout(() => {
    currentSlide.classList.remove('to-right');
  }, 600);
  
  currentActiveId = targetId;
}

// Restart Surprise
function restartSurprise() {
  // Go back to slide 1
  prevSlide('slide-1');
  
  // Stop and reset audio playback
  if (isPlaying) {
    togglePlayPause();
  }
  if (audio) {
    audio.currentTime = 0;
  }
  currentSeconds = 0;
  updateProgress(0);
}

// Floating Hearts Background Generator
const heartsBg = document.getElementById('hearts-bg');
const hearts = ['❤️', '💖', '💕', '💌', '🌸', '✨'];

function spawnHeart() {
  if (!heartsBg) return;
  const heart = document.createElement('div');
  heart.classList.add('heart-particle');
  
  // Random heart character
  heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
  
  // Random horizontal position, size, and duration
  const randomX = Math.random() * 100;
  const size = Math.random() * 15 + 15; // 15px to 30px
  const duration = Math.random() * 4 + 6; // 6s to 10s
  
  heart.style.left = `${randomX}vw`;
  heart.style.fontSize = `${size}px`;
  heart.style.animationDuration = `${duration}s`;
  
  heartsBg.appendChild(heart);
  
  // Remove heart after it floats away
  setTimeout(() => {
    heart.remove();
  }, duration * 1000);
}

// Spawn a heart every 900ms
setInterval(spawnHeart, 900);
// Spawn a few initial hearts so it doesn't start completely empty
for(let i=0; i<6; i++) {
  setTimeout(spawnHeart, Math.random() * 4000);
}

// Like Button Toggle
function toggleLike(btn) {
  btn.classList.toggle('liked');
  if (btn.classList.contains('liked')) {
    btn.innerText = '💖';
    const rect = btn.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
      spawnBurstHeart(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  } else {
    btn.innerText = '❤️';
  }
}

function spawnBurstHeart(x, y) {
  const heart = document.createElement('div');
  heart.innerText = '💖';
  heart.style.position = 'fixed';
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '1000';
  heart.style.fontSize = '20px';
  heart.style.color = '#ff3377';
  heart.style.textShadow = '0 0 5px #ff3377';
  heart.style.transition = 'transform 1s ease-out, opacity 1s';
  
  document.body.appendChild(heart);
  
  const angle = Math.random() * Math.PI * 2;
  const dist = Math.random() * 60 + 30;
  const targetX = Math.cos(angle) * dist;
  const targetY = Math.sin(angle) * dist - 20;
  
  setTimeout(() => {
    heart.style.transform = `translate(${targetX}px, ${targetY}px) scale(0.5)`;
    heart.style.opacity = '0';
  }, 50);
  
  setTimeout(() => {
    heart.remove();
  }, 1050);
}

// Music Player Logic with Fallback simulation if file is missing
const audio = document.getElementById('birthday-audio');
const playBtn = document.getElementById('play-pause-btn');
const progressFill = document.getElementById('progress-bar-fill');
const elapsedText = document.getElementById('time-elapsed');
const durationText = document.getElementById('time-duration');

let isPlaying = false;
let simulateTimer = null;
let currentSeconds = 0;
const totalDuration = 165; // 2 min 45 sec (165 seconds)

// Format seconds into MM:SS
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Update UI progress
function updateProgress(seconds) {
  const percent = (seconds / totalDuration) * 100;
  progressFill.style.width = `${percent}%`;
  elapsedText.innerText = formatTime(seconds);
}

// Audio Time Update listener (if file loads successfully)
if (audio) {
  audio.addEventListener('timeupdate', () => {
    if (!simulateTimer && audio.duration) {
      const current = audio.currentTime;
      const duration = audio.duration;
      const percent = (current / duration) * 100;
      progressFill.style.width = `${percent}%`;
      elapsedText.innerText = formatTime(current);
      durationText.innerText = formatTime(duration);
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    durationText.innerText = formatTime(audio.duration);
  });
}

// Toggle Play/Pause
function togglePlayPause() {
  isPlaying = !isPlaying;
  
  if (isPlaying) {
    playBtn.innerText = '⏸';
    
    // Attempt actual audio playback
    audio.play().then(() => {
      console.log("Playing audio successfully!");
    }).catch(err => {
      console.log("Audio file missing or blocked by browser autoplays. Simulating playback interface...");
      startSimulation();
    });
  } else {
    playBtn.innerText = '▶';
    audio.pause();
    stopSimulation();
  }
}

function startSimulation() {
  if (simulateTimer) clearInterval(simulateTimer);
  simulateTimer = setInterval(() => {
    currentSeconds++;
    if (currentSeconds >= totalDuration) {
      currentSeconds = 0;
      togglePlayPause();
    }
    updateProgress(currentSeconds);
  }, 1000);
}

function stopSimulation() {
  if (simulateTimer) {
    clearInterval(simulateTimer);
    simulateTimer = null;
  }
}

// Seek controls
function seekAudio(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const width = rect.width;
  const percent = clickX / width;
  
  if (audio && audio.duration && !simulateTimer) {
    audio.currentTime = percent * audio.duration;
  } else {
    currentSeconds = Math.floor(percent * totalDuration);
    updateProgress(currentSeconds);
  }
}

// Confetti Canvas Particle System
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrameId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ConfettiParticle {
  constructor(x, y, isExplosion = false) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 8 + 5;
    this.color = ['#ff3377', '#ff85a2', '#ffccd5', '#9b5de5', '#f15bb5', '#fee440'][Math.floor(Math.random() * 6)];
    
    if (isExplosion) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 6;
      this.speedX = Math.cos(angle) * speed;
      this.speedY = Math.sin(angle) * speed - 3;
    } else {
      this.speedX = Math.random() * 6 - 3;
      this.speedY = Math.random() * -10 - 5;
    }
    
    this.gravity = 0.4;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 8 - 4;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += this.gravity;
    this.rotation += this.rotationSpeed;
  }
  
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

// Burst confetti from the bottom-right party card
function triggerCelebrationConfetti() {
  resizeCanvas();
  const startX = window.innerWidth * 0.8;
  const startY = window.innerHeight * 0.8;
  
  for (let i = 0; i < 120; i++) {
    particles.push(new ConfettiParticle(startX, startY, true));
  }
  
  for(let i=0; i<40; i++) {
    particles.push(new ConfettiParticle(Math.random() * window.innerWidth, -10));
  }
  
  if (!animFrameId) animateConfetti();
}

// Light burst when transitioning to slide-2 memories
function triggerSurpriseConfetti() {
  resizeCanvas();
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight * 0.3;
  
  for (let i = 0; i < 80; i++) {
    particles.push(new ConfettiParticle(startX, startY, true));
  }
  
  if (!animFrameId) animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach((p, index) => {
    p.update();
    p.draw();
    
    if (p.y > canvas.height + 10 || p.x < -10 || p.x > canvas.width + 10) {
      particles.splice(index, 1);
    }
  });
  
  if (particles.length > 0) {
    animFrameId = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animFrameId = null;
  }
}
