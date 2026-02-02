const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const message = document.getElementById('message');
const sadMessage = document.getElementById('sadMessage');
const container = document.querySelector('.container');

// Open contact modal when Yes is clicked (collect email/message first)
const contactModal = document.getElementById('contactModal');
const contactForm = document.getElementById('contactForm');
const senderEmailInput = document.getElementById('senderEmail');
const anonymousCheckbox = document.getElementById('anonymous');
const anonMessageInput = document.getElementById('anonMessage');
const cancelContact = document.getElementById('cancelContact');

yesBtn.addEventListener('click', (e) => {
  e.preventDefault();
  // Navigate to the dedicated yes page which shows the message and animations
  window.location.href = 'yes.html';
});

if (cancelContact) cancelContact.addEventListener('click', () => {
  if (contactModal) contactModal.classList.add('hidden');
});

// Submit contact form to local API
if (contactForm) {
  contactForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const payload = {
      sender_email: senderEmailInput ? senderEmailInput.value : '',
      anonymous: anonymousCheckbox ? anonymousCheckbox.checked : false,
      message: anonMessageInput ? anonMessageInput.value : '',
    };

    fetch('http://localhost:3000/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((resp) => {
        if (resp && resp.ok) {
          if (contactModal) contactModal.classList.add('hidden');
          // show success UI
          triggerConfetti(50);
          showJumpingMan();
          showSuccess();
        } else {
          alert('Send failed — try again later.');
          console.error(resp);
        }
      })
      .catch((err) => {
        alert('Send failed — check server is running.');
        console.error(err);
      });
  });
}

noBtn.addEventListener('click', () => {
  sadMessage.classList.remove('hidden');
  message.classList.add('hidden');
});

function moveNoButton() {
  const containerRect = container.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const maxLeft = Math.max(0, containerRect.width - btnRect.width);
  const maxTop = Math.max(0, containerRect.height - btnRect.height);
  const left = Math.random() * maxLeft;
  const top = Math.random() * maxTop;
  noBtn.style.position = 'absolute';
  noBtn.style.left = left + 'px';
  noBtn.style.top = top + 'px';
}

noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('focus', moveNoButton);
noBtn.addEventListener('mousedown', (e) => {
  e.preventDefault();
  moveNoButton();
});

// Taunt messages
const tauntEl = document.getElementById('taunt');
const taunts = [
  "Not so fast! 😜",
  "Try again — I'm shy! 🙈",
  "Aw, come on! 💕",
  "You'll have to catch me! 🏃‍♀️",
  "Nice try! 😅"
];
function showTaunt(text) {
  if (!tauntEl) return;
  tauntEl.textContent = text;
  tauntEl.classList.remove('hidden');
  setTimeout(() => tauntEl.classList.add('hidden'), 900);
}

// Call a taunt whenever the No button evades
function handleNoEvade() {
  const txt = taunts[Math.floor(Math.random() * taunts.length)];
  showTaunt(txt);
}

// wrap moveNoButton so we taunt too
function moveNoButtonAndTaunt() {
  moveNoButton();
  handleNoEvade();
}

noBtn.removeEventListener && noBtn.removeEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('mouseenter', moveNoButtonAndTaunt);
noBtn.addEventListener('mousedown', (e) => {
  e.preventDefault();
  moveNoButtonAndTaunt();
});

// Success overlay
const successOverlay = document.getElementById('successOverlay');
const closeSuccess = document.getElementById('closeSuccess');
function showSuccess() {
  if (!successOverlay) return;
  successOverlay.classList.remove('hidden');
}
if (closeSuccess) {
  closeSuccess.addEventListener('click', () => {
    successOverlay.classList.add('hidden');
  });
}

window.addEventListener('resize', () => {
  // Keep the button inside the container when viewport changes
  noBtn.style.left = '';
  noBtn.style.top = '';
  noBtn.style.position = '';
});

// Floating hearts background
function createFloatingHearts(count = 24) {
  const colors = ['#ff66b2', '#ff4aa7', '#ffd1e8', '#ff9ccf'];
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerText = '💖';
    const size = 12 + Math.random() * 28; // px
    heart.style.fontSize = size + 'px';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = 6 + Math.random() * 8 + 's';
    heart.style.animationDelay = Math.random() * 6 + 's';
    heart.style.color = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(heart);
  }
}

createFloatingHearts(28);

// Confetti fallback (plain JS) similar to the Framer Motion snippet
function triggerConfetti(count = 50) {
  const emojis = ['💖', '💕', '💗', '💓', '🎉', '✨', '💝', '❤️'];
  const pieces = Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    angle: (i / count) * 360,
    distance: Math.random() * 300 + 200,
    rotation: Math.random() * 720 - 360,
    size: Math.random() * 20 + 15,
  }));

  pieces.forEach((piece) => {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.textContent = piece.emoji;
    el.style.fontSize = piece.size + 'px';
    el.style.left = '50%';
    el.style.top = '50%';
    el.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(el);

    const radians = (piece.angle * Math.PI) / 180;
    const x = Math.cos(radians) * piece.distance;
    const y = Math.sin(radians) * piece.distance * -1; // send upward

    const duration = 1600 + Math.random() * 1400;

    el.animate(
      [
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: `translate(${x}px, ${y}px) rotate(${piece.rotation}deg) scale(1.2)`, opacity: 1 },
        { transform: `translate(${x * 1.08}px, ${y * 1.08}px) rotate(${piece.rotation + 90}deg) scale(0.8)`, opacity: 0 },
      ],
      {
        duration,
        easing: 'cubic-bezier(.17,.67,.12,1)',
      }
    ).onfinish = () => el.remove();
  });
}

// JumpingMan fallback: creates a centered emoji that animates vertical jumps, scale and rotate
function showJumpingMan() {
  const el = document.createElement('div');
  el.className = 'jumping-man';
  el.textContent = '🥳';
  document.body.appendChild(el);

  const keyframes = [
    { transform: 'translate(-50%, 0) scale(1) rotate(0deg)' },
    { transform: 'translate(-50%, -80px) scale(1.2) rotate(-10deg)' },
    { transform: 'translate(-50%, 0) scale(1) rotate(10deg)' },
    { transform: 'translate(-50%, -60px) scale(1.15) rotate(-8deg)' },
    { transform: 'translate(-50%, 0) scale(1) rotate(8deg)' },
    { transform: 'translate(-50%, -40px) scale(1.1) rotate(-5deg)' },
    { transform: 'translate(-50%, 0) scale(1) rotate(5deg)' },
    { transform: 'translate(-50%, -20px) scale(1.05) rotate(0deg)' },
    { transform: 'translate(-50%, 0) scale(1) rotate(0deg)' },
  ];

  const anim = el.animate(keyframes, {
    duration: 2000,
    easing: 'cubic-bezier(.4,0,.2,1)'
  });

  anim.onfinish = () => el.remove();
}

