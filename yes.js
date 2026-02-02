// yes.js — create lots of floating love emojis, confetti, and animate the blushing emoji
document.addEventListener('DOMContentLoaded', () => {
  const emojis = ['💖','💕','💗','💓','💝','💘','❤️'];
  const confetti = ['✨','🎉','🎊','🌟'];

  function spawnFloating(count=60) {
    for (let i=0;i<count;i++){
      const el = document.createElement('div');
      el.className = 'floating-emoji';
      el.textContent = Math.random() < 0.7 ? emojis[Math.floor(Math.random()*emojis.length)] : confetti[Math.floor(Math.random()*confetti.length)];
      const size = 18 + Math.random()*36;
      el.style.fontSize = size+'px';
      el.style.left = Math.random()*100 + '%';
      el.style.top = Math.random()*100 + '%';
      el.style.opacity = (0.4 + Math.random()*0.7).toString();
      document.body.appendChild(el);

      const dx = (Math.random()-0.5) * 200;
      const dy = (Math.random()-0.5) * 200 - 60;
      const rot = (Math.random()-0.5) * 720;
      const dur = 4000 + Math.random()*5000;

      el.animate([
        { transform: 'translate(0,0) rotate(0deg)', opacity: el.style.opacity },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity: 0 }
      ], { duration: dur, easing: 'cubic-bezier(.17,.67,.12,1)' }).onfinish = () => el.remove();
    }
  }

  // burst confetti near center for effect
  function burstConfetti(count=40) {
    for (let i=0;i<count;i++){
      const el = document.createElement('div');
      el.className = 'floating-emoji';
      el.style.left = '50%';
      el.style.top = '45%';
      el.style.transform = 'translate(-50%,-50%)';
      el.textContent = (Math.random()<0.6? emojis[Math.floor(Math.random()*emojis.length)]: confetti[Math.floor(Math.random()*confetti.length)]);
      const size = 18 + Math.random()*34;
      el.style.fontSize = size+'px';
      document.body.appendChild(el);

      const angle = Math.random()*Math.PI*2;
      const dist = 80 + Math.random()*260;
      const x = Math.cos(angle)*dist;
      const y = Math.sin(angle)*dist - 60;
      const rot = (Math.random()-0.5)*720;
      const dur = 900 + Math.random()*1600;

      el.animate([
        { transform: 'translate(-50%,-50%) scale(0.2)', opacity:1 },
        { transform: `translate(${x - 50}%, ${y - 50}%) rotate(${rot}deg) scale(1.1)`, opacity:1 },
        { transform: `translate(${x - 50}%, ${y - 50}%) rotate(${rot+90}deg) scale(0.6)`, opacity:0 }
      ], { duration: dur, easing: 'cubic-bezier(.17,.67,.12,1)' }).onfinish = () => el.remove();
    }
  }

  // keep spawning gentle floating emojis
  spawnFloating(48);
  setInterval(() => spawnFloating(22), 2200);

  // initial celebration burst
  burstConfetti(60);

  // animate the blushing emoji (it has class 'blushing')
  const blush = document.querySelector('.blushing');
  if (blush) {
    blush.classList.add('blush-pulse');
    // also change it to a shyer face occasionally
    const faces = ['😊','☺️','😍','🥰','😳'];
    setInterval(()=>{
      blush.textContent = faces[Math.floor(Math.random()*faces.length)];
    }, 1200);
  }
});
