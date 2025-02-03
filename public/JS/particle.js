const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let particles = [];

canvas.width = innerWidth;
canvas.height = innerHeight;

window.onresize = () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
};

// Glow effect particles
window.onmousemove = (e) => {
  for (let i = 0; i < 10; i++) {
    particles.push({
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 10 + 1, // Bigger size for more impact
      dx: Math.random() * 3 - 1.5,
      dy: Math.random() * 3 - 1.5,
      color: ['#ff0054', '#4caf50', '#03a9f4', '#ff9800'][Math.floor(Math.random() * 4)],
      alpha: 1, // Full opacity initially
      life: 150 // How long the particle will exist
    });
  }
};

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter(p => p.life > 0).map(p => {
    p.x += p.dx;
    p.y += p.dy;
    p.size *= 0.98; // Shrink particles over time
    p.alpha -= 0.01; // Fade effect for glowing trail
    p.life -= 1; // Life decreases with time

    // Draw particle with glow effect
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${parseInt(p.color.slice(1, 3), 16)}, ${parseInt(p.color.slice(3, 5), 16)}, ${parseInt(p.color.slice(5, 7), 16)}, ${p.alpha})`;
    ctx.fill();
    
    return p;
  });

  requestAnimationFrame(animate);
}

animate();