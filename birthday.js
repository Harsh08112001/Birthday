// Birthday page interaction
document.addEventListener('DOMContentLoaded', () => {
    const continueBtn = document.getElementById('continueBtn');
    const celebrationMsg = document.getElementById('celebrationMessage');
    const birthdayContent = document.getElementById('birthdayContent');
    const revealCardBtn = document.getElementById('revealCardBtn');
    const wishCard = document.getElementById('wishCard');

    // Make continue button visible and clickable after celebration (auto-show)
    if (continueBtn) {
        continueBtn.style.transition = 'opacity 0.3s ease-in';
        continueBtn.style.opacity = '0.7';
    }

    // Continue button click handler - faster transition to birthday page
    if (continueBtn) {
        continueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Hide celebration message
            if (celebrationMsg) {
                celebrationMsg.style.opacity = '0';
                celebrationMsg.style.transition = 'opacity 0.3s ease-out';
            }
            
            // Show birthday content with slight delay
            setTimeout(() => {
                if (celebrationMsg) celebrationMsg.style.display = 'none';
                if (birthdayContent) {
                    birthdayContent.style.display = 'block';
                    birthdayContent.style.opacity = '0';
                    // Force reflow
                    birthdayContent.offsetHeight;
                    // Fade in content
                    birthdayContent.style.transition = 'opacity 0.5s ease-in';
                    birthdayContent.style.opacity = '1';
                }
                window.scrollTo(0, 0);
            }, 300);
        });
    }

    // Reveal wish card button handler
    if (revealCardBtn) {
        revealCardBtn.addEventListener('click', () => {
            const pandaMonkeyModal = document.getElementById('pandaMonkeyModal');
            
            if (wishCard.style.display === 'none' || wishCard.style.display === '') {
                // Show panda-monkey image modal
                if (pandaMonkeyModal) {
                    pandaMonkeyModal.style.display = 'flex';
                    pandaMonkeyModal.style.opacity = '0';
                    // Force reflow
                    pandaMonkeyModal.offsetHeight;
                    // Fade in
                    pandaMonkeyModal.style.transition = 'opacity 0.3s ease-in';
                    pandaMonkeyModal.style.opacity = '1';
                }
            } else {
                wishCard.style.opacity = '0';
                wishCard.style.transition = 'opacity 0.3s ease-out';
                setTimeout(() => {
                    wishCard.style.display = 'none';
                    revealCardBtn.textContent = '💌 Show Your Wish Card 💌';
                }, 300);
            }
        });
    }

    // Continue to Wish Card button handler
    const continueWishCardBtn = document.getElementById('continueToWishCardBtn');
    if (continueWishCardBtn) {
        continueWishCardBtn.addEventListener('click', () => {
            const pandaMonkeyModal = document.getElementById('pandaMonkeyModal');
            
            // Hide panda-monkey modal
            if (pandaMonkeyModal) {
                pandaMonkeyModal.style.opacity = '0';
                pandaMonkeyModal.style.transition = 'opacity 0.3s ease-out';
                setTimeout(() => {
                    pandaMonkeyModal.style.display = 'none';
                }, 300);
            }
            
            // Show wish card
            setTimeout(() => {
                wishCard.style.display = 'block';
                wishCard.style.opacity = '0';
                // Force reflow
                wishCard.offsetHeight;
                // Fade in with transition
                wishCard.style.transition = 'opacity 0.6s ease-in';
                wishCard.style.opacity = '1';
                revealCardBtn.textContent = '💌 Hide Your Wish Card 💌';
                // Create confetti when card is revealed
                createCardRevealCelebration();
            }, 300);
        });
    }
});

function createCardRevealCelebration() {
    // Get canvas and context
    const canvas = document.getElementById('celebrationCanvas');
    const ctx = canvas.getContext('2d');
    
    // Create confetti at card location
    const cardElement = document.getElementById('wishCard');
    const rect = cardElement.getBoundingClientRect();
    
    // Create multiple small bursts
    for (let i = 0; i < 100; i++) {
        const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 100;
        const y = rect.top + (Math.random() - 0.5) * 50;
        
        // Create confetti manually for this burst
        const particle = {
            x: x,
            y: y,
            size: Math.random() * 5 + 2,
            speedX: (Math.random() - 0.5) * 8,
            speedY: Math.random() * 5 - 3,
            color: ['#ff6b9d', '#ffa502', '#26de81', '#54a0ff', '#fd79a8'][Math.floor(Math.random() * 5)],
            opacity: 1
        };
        
        // Animate this particle
        animateParticle(particle, ctx, canvas);
    }
    
    // Play a soft sound
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        osc.start(now);
        osc.stop(now + 0.2);
    } catch (e) {
        console.log('Audio not available');
    }
}

function animateParticle(particle, ctx, canvas) {
    let frame = 0;
    
    const animateFrame = () => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.speedY += 0.1; // gravity
        particle.opacity -= 0.015;
        
        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
        ctx.restore();
        
        if (particle.opacity > 0) {
            requestAnimationFrame(animateFrame);
        }
    };
    
    animateFrame();
}
