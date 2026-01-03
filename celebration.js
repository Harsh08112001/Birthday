// Celebration animation with balloons, crackers, and confetti
const canvas = document.getElementById('celebrationCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let balloons = [];
let crackers = [];
let celebrationText = '';
let textOpacity = 0;

class Confetti {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = (Math.random() - 0.5) * 6; // Slightly slower
        this.speedY = Math.random() * 5 + 2; // Slower falling
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.08;
        this.color = ['#ff6b9d', '#ffa502', '#26de81', '#54a0ff', '#fd79a8'][Math.floor(Math.random() * 5)];
        this.opacity = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.08; // Slightly less gravity
        this.rotation += this.rotationSpeed;
        this.opacity -= 0.008; // Slower fade
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

class Balloon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 20 + 25;
        this.speedX = (Math.random() - 0.5) * 2.5; // Slower horizontal
        this.speedY = Math.random() * -2 - 1; // Slower upward
        this.color = ['#ff6b9d', '#ffa502', '#26de81', '#54a0ff', '#f368e0'][Math.floor(Math.random() * 5)];
        this.opacity = 1;
        this.scale = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX += (Math.random() - 0.5) * 0.1;
        this.opacity -= 0.003; // Slower fade
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Balloon string
        ctx.strokeStyle = 'rgba(0, 0, 0, ' + this.opacity + ')';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.radius);
        ctx.lineTo(this.x, this.y + this.radius + 50);
        ctx.stroke();
        ctx.restore();
    }
}

class Cracker {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 8;
        this.speedX = (Math.random() - 0.5) * 10; // Slightly slower
        this.speedY = (Math.random() - 0.5) * 10;
        this.opacity = 1;
        this.color = '#ffa502';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.94; // Slightly more friction
        this.speedY *= 0.94;
        this.opacity -= 0.018; // Slightly slower fade
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createExplosion(x, y, particleCount = 50) {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Confetti(x, y));
    }
}

function createBalloons(count = 15) {
    for (let i = 0; i < count; i++) {
        balloons.push(new Balloon(Math.random() * canvas.width, canvas.height * 0.8));
    }
}

function createCrackers(x, y, count = 30) {
    for (let i = 0; i < count; i++) {
        crackers.push(new Cracker(x, y));
    }
}

function playSound() {
    // Create a simple pop sound effect using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Pop sound
        const now = audioContext.currentTime;
        
        // Cracker sounds
        for (let i = 0; i < 3; i++) {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.frequency.setValueAtTime(150 - i * 50, now + i * 0.05);
            osc.frequency.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.1);
            
            gain.gain.setValueAtTime(0.3, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.1);
            
            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.1);
        }
    } catch (e) {
        console.log('Audio not available');
    }
}

function animate() {
    // Clear canvas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].opacity <= 0) {
            particles.splice(i, 1);
        }
    }

    // Update and draw balloons
    for (let i = balloons.length - 1; i >= 0; i--) {
        balloons[i].update();
        balloons[i].draw(ctx);
        if (balloons[i].opacity <= 0 || balloons[i].y < -50) {
            balloons.splice(i, 1);
        }
    }

    // Update and draw crackers
    for (let i = crackers.length - 1; i >= 0; i--) {
        crackers[i].update();
        crackers[i].draw(ctx);
        if (crackers[i].opacity <= 0) {
            crackers.splice(i, 1);
        }
    }

    // Draw birthday text
    if (celebrationText) {
        ctx.save();
        ctx.globalAlpha = textOpacity;
        ctx.fillStyle = '#ff6b9d';
        ctx.font = 'bold 60px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(celebrationText, canvas.width / 2, canvas.height / 2);
        ctx.restore();
    }

    if (particles.length > 0 || balloons.length > 0 || crackers.length > 0) {
        requestAnimationFrame(animate);
    } else if (!canvas.getAttribute('data-animation-done')) {
        // Animation complete - hide canvas and show content
        canvas.setAttribute('data-animation-done', 'true');
        canvas.style.opacity = '0';
        canvas.style.pointerEvents = 'none';
        setTimeout(() => {
            canvas.style.display = 'none';
        }, 300);
    }
}

function startCelebration() {
    // Set the birthday text
    celebrationText = 'Happy Birthday Ishhuuuu';
    
    // Fade in the text
    let textFadeIn = setInterval(() => {
        if (textOpacity < 1) {
            textOpacity += 0.08;
        } else {
            clearInterval(textFadeIn);
        }
    }, 50);
    
    // Create initial balloons
    createBalloons(20);
    
    // Create crackers at multiple points - slightly slower timing
    for (let i = 0; i < 4; i++) {  // Increased from 3 to 4 bursts
        setTimeout(() => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height * 0.5 + 100;
            createCrackers(x, y, 40);
            createExplosion(x, y, 50);
            playSound();
        }, i * 200);  // Increased from 150ms to 200ms
    }

    animate();
    
    // Fade out text after animation
    setTimeout(() => {
        let textFadeOut = setInterval(() => {
            if (textOpacity > 0) {
                textOpacity -= 0.05;
            } else {
                clearInterval(textFadeOut);
                celebrationText = '';
            }
        }, 50);
    }, 3000);
    
    // Show and enable continue button after 3 seconds with smooth transition
    setTimeout(() => {
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
            continueBtn.style.display = 'block';
            continueBtn.style.opacity = '1';
            continueBtn.style.pointerEvents = 'auto';
            // Force reflow to ensure DOM updates
            continueBtn.offsetHeight;
        }
    }, 3000);
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Start celebration when page loads
window.addEventListener('load', () => {
    startCelebration();
});
