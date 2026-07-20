/* =========================================================
   Pehle page ke SAARE ".compare" boxes dhoondh lete hain
   (colour slide ka 1, vfx slide ka 1 — total 2 abhi)
   querySelectorAll ek list (NodeList) return karta hai
   ========================================================= */
const allCompareBoxes = document.querySelectorAll('.compare');

/* =========================================================
   forEach: har ek box ke liye alag-alag ye function chalega.
   Isse har box ka apna independent drag/slider logic ban jata hai —
   ek box ko drag karne se doosre box pe koi asar nahi padta.
   ========================================================= */
allCompareBoxes.forEach(function (compare) {

  // is specific box ke andar se uske apne elements nikal rahe hain
  const videoAfter = compare.querySelector('.video-after');
  const videoBefore = compare.querySelector('.video-before');
  const dividerLine = compare.querySelector('.divider-line');
  const handle = compare.querySelector('.handle');

  // har box ka apna "dragging" state — isliye ek box drag hone se
  // doosre box ki dragging state disturb nahi hoti
  let dragging = false;

  /* =========================================================
     setPosition(): is box ke slider ki position set karta hai
     percentFromLeft = 0 se 100 ke beech ek number
     (0 = bilkul LEFT edge, 100 = bilkul RIGHT edge)
     ========================================================= */
  function setPosition(percentFromLeft) {
    // value ko hamesha 0-100 ke beech rakha jata hai
    const p = Math.min(100, Math.max(0, percentFromLeft));

    // "after" video ko clip karte hain:
    // LEFT se p% hissa hide (cut) hoga,
    // matlab "after" video sirf p% se 100% tak (right side) dikhega,
    // aur "before" (background, poora video) left side me dikhta rahega
    videoAfter.style.clipPath = `inset(0 0 0 ${p}%)`;

    // divider line aur handle dono ko us p% wali LEFT position pe move karte hain
    dividerLine.style.left = p + '%';
    handle.style.left = p + '%';
  }

  /* =========================================================
     updateFromClientX(): mouse/finger ki screen position (clientX)
     ko IS BOX ke andar ka percentage (0-100) me convert karta hai
     ========================================================= */
  function updateFromClientX(clientX) {
    const rect = compare.getBoundingClientRect(); // isi box ka size/position
    const x = clientX - rect.left;                // box ke LEFT edge se relative position
    const percent = (x / rect.width) * 100;       // box ki total WIDTH ke hisaab se percentage
    setPosition(percent);
  }

  /* jab user is box ke handle ko dabaye, dragging shuru */
  function startDrag(e) {
    dragging = true;
    e.preventDefault();
  }

  /* jab chhode, dragging band */
  function stopDrag() {
    dragging = false;
  }

  /* mouse/finger move hone pe — agar ISI box ki dragging chal rahi hai to hi update karo */
  function onMove(e) {
    if (!dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateFromClientX(clientX);
  }

  // is box ke handle pe events
  handle.addEventListener('mousedown', startDrag);
  handle.addEventListener('touchstart', startDrag, { passive: false });

  // is box ke andar khali jagah pe click karne se bhi slider jump ho jaye
  compare.addEventListener('mousedown', (e) => {
    if (e.target === handle || handle.contains(e.target)) return;
    dragging = true;
    updateFromClientX(e.clientX);
  });

  compare.addEventListener('touchstart', (e) => {
    dragging = true;
    updateFromClientX(e.touches[0].clientX);
  }, { passive: true });

  // poora window sunta hai move/up events (taaki box ke bahar bhi drag chale)
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('touchend', stopDrag);

  // is box ke dono videos ko sync (ek saath chalu) rakhte hain
  videoBefore.addEventListener('play', () => {
    videoAfter.currentTime = videoBefore.currentTime;
    videoAfter.play();
  });

  // is box ka slider default 50% (bilkul beech) se shuru hoga
  setPosition(50);
});


// button
// Click hone par button pe "sparkle-active" class add karte hain,
// jisse CSS ke sparkle-active .sparkle wale rules trigger hote hain
// aur stars burst animation chalta hai.
//
// FIX: pehle e.preventDefault() lagane se parent <a href="contact.html">
// ka navigation bhi cancel ho raha tha (kyunki click event bubble hoke
// usi <a> tak jaata hai aur usi event object pe preventDefault() ka
// asar padta hai). Ab hum navigation ko sirf animation ki duration
// (700ms) ke liye rok rahe hain, aur uske baad khud contact.html
// pe redirect kar rahe hain.

const btnWrap = document.getElementById("btnWrap");
const liquidBtn = document.getElementById("liquidBtn");
const CONTACT_URL = "contact.html";

// Sabse zyada "animation-delay" wala sparkle hi sabse aakhri me khatam hota hai.
// (0.08s delay + 0.7s duration = 0.78s). Fixed setTimeout(700ms) se navigation
// thoda jaldi trigger ho raha tha, isliye burst beech me hi kat jaata tha.
// Ab hum seedha us AAKHRI sparkle ke "animationend" event ka wait karenge —
// isse chahe delay/duration kabhi CSS me badlo, navigation hamesha
// animation ke poora hone ke BAAD hi hoga.
const sparkles = liquidBtn.querySelectorAll(".sparkle");
let navigated = false;

function goToContact() {
  if (navigated) return; // do baar navigate na ho isliye guard
  navigated = true;
  window.location.href = CONTACT_URL;
}

liquidBtn.addEventListener("click", (e) => {
  e.preventDefault(); // navigation ko rokte hain jab tak animation poori na ho jaaye
  navigated = false;

  // agar pehle se animation chal rahi hai, use turant restart karne ke liye
  // class hata ke browser ko "reflow" force karwate hain
  btnWrap.classList.remove("sparkle-active");
  void btnWrap.offsetWidth; // reflow trick — restart ke liye zaroori

  btnWrap.classList.add("sparkle-active");

  // sabse aakhri sparkle ka animation khatam hote hi navigate karo
  let finished = 0;
  sparkles.forEach((s) => {
    s.addEventListener(
      "animationend",
      () => {
        finished++;
        if (finished === sparkles.length) {
          btnWrap.classList.remove("sparkle-active");
          goToContact();
        }
      },
      { once: true }
    );
  });

  // safety fallback — agar kisi wajah se animationend fire na ho
  // (jaise browser tab background me ho), to bhi 1s baad navigate ho jaaye
  setTimeout(() => {
    btnWrap.classList.remove("sparkle-active");
    goToContact();
  }, 1000);
});


/* =========================================================
   VIDEO SELECT GALLERIES (colour slide + vfx slide, dono ke
   niche apna-apna 3-video-box gallery hai)

   Ab page pe DO ".video-select-grid" hain:
     1) data-target="colourCompare"  -> colour slide ke compare box ko control karta hai
     2) data-target="vfxCompare"     -> vfx slide ke compare box ko control karta hai

   Har grid apne "data-target" attribute se pata karta hai ki
   usko kis compare box (id se) ko update karna hai. Isliye
   colour ke boxes sirf colour slide ko badlenge, aur vfx ke
   boxes sirf vfx slide ko — dono independent hain.
   ========================================================= */
(function () {
  const allGrids = document.querySelectorAll('.video-select-grid');

  allGrids.forEach((grid) => {
    const targetId = grid.dataset.target;
    if (!targetId) return;

    const targetCompare = document.getElementById(targetId);
    const selectItems = grid.querySelectorAll('.video-select-item');

    // agar target compare box hi nahi mila to is grid ko skip karo
    if (!targetCompare || selectItems.length === 0) return;

    const videoBefore = targetCompare.querySelector('.video-before');
    const videoAfter = targetCompare.querySelector('.video-after');

    selectItems.forEach((item) => {
      item.addEventListener('click', () => {
        const newBeforeSrc = item.dataset.before;
        const newAfterSrc = item.dataset.after;

        // agar HTML me data-before/data-after nahi diya to kuch mat karo
        if (!newBeforeSrc || !newAfterSrc) return;

        // agar wahi video pehle se hi load hai to dobara load na karo
        const alreadyLoaded = videoBefore.getAttribute('src') === newBeforeSrc;

        if (!alreadyLoaded) {
          videoBefore.setAttribute('src', newBeforeSrc);
          videoAfter.setAttribute('src', newAfterSrc);

          // naye src ko force-load karo
          videoBefore.load();
          videoAfter.load();

          // dono video ek saath autoplay ho jayen
          videoBefore.play().catch(() => {});
          videoAfter.play().catch(() => {});
        }

        // sirf ISI grid ke andar "active" (highlighted) badlo,
        // doosre grid (dusre slide) pe koi asar na ho
        selectItems.forEach((i) => i.classList.remove('active'));
        item.classList.add('active');

        // user ko upar wale compare box tak smoothly scroll kar do,
        // taaki use turant naya before/after result dikhe
        targetCompare.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  });
})();

// music
/* ============================================================
   SONG LIST — apne actual mp3 files ke path yahan daalo.
   Har player ka apna alag gaana-list hai (SONG QUEUE se dikhega).
   Example: { name: "Tera Yaar Hoon Main.mp3", url: "songs/tera-yaar-hoon-main.mp3" }

   NOTE: Ab har player card (id="p0", "p1", "p2", "p3") ALAG-ALAG
   apni khud ki <div> ke roop me index.html me already likhi hui hai
   (dynamically JS se banti nahi). Yahan sirf har card ke andar
   song-list aur waveform-bars bharte hain, id ke through.
   ============================================================ */
const ACCENTS = [
  {
    songs: [
      { name: 'anish', url: 'songs/audio1.mp3' },
      { name: 'music2.mp3', url: 'songs/audio2.mp3' },
    ]
  },
  {
    songs: [
      { name: 'music3.mp3', url: 'songs/audio2.mp3' },
      { name: 'music4.mp3', url: 'songs/audio1.mp3' },
    ]
  },
  {
    songs: [
      { name: 'music5.mp3', url: 'songs/audio1.mp3' },
      { name: 'music6.mp3', url: 'songs/audio2.mp3' },
    ]
  },
  {
    songs: [
      { name: 'music7.mp3', url: 'songs/audio2.mp3' },
      { name: 'music8.mp3', url: 'songs/audio1.mp3' },
    ]
  },
];

const grid = document.getElementById('playerGrid');

function buildWaveBars(n){
  let out = '';
  for(let i=0;i<n;i++){
    const h = 30 + Math.round(Math.random()*70);
    const d = (0.5 + Math.random()*0.7).toFixed(2);
    out += `<span style="--h:${h}%;animation-duration:${d}s;animation-delay:${(Math.random()*0.4).toFixed(2)}s"></span>`;
  }
  return out;
}

function buildQueueHTML(songs){
  if(!songs.length){
    return `<div class="qempty">Koi gaana nahi mila</div>`;
  }
  return songs.map((s,i) => `
    <div class="qitem" data-i="${i}">
      <span class="fname">${s.name}</span>
      <span class="ext">MP3</span>
    </div>
  `).join('');
}

// Har existing card (HTML me pehle se likhi hui) ke andar
// waveform bars aur song-queue bhar dete hain
ACCENTS.forEach((theme, idx) => {
  const id = 'p' + idx;
  const waveEl = document.getElementById('wave-' + id);
  const queueEl = document.getElementById('queue-' + id);
  if (waveEl) waveEl.innerHTML = buildWaveBars(26);
  if (queueEl) queueEl.innerHTML = buildQueueHTML(theme.songs);
});

// FIX: pehle har player independent tha, isliye ek saath 2-3 gaane
// ek saath baj sakte the. Ab ek global tracker rakha hai — jab bhi
// koi naya player play() hota hai, agar koi DOOSRA player pehle se
// baj raha ho to use pehle pause kar diya jata hai. Isse hamesha
// EK time pe sirf EK hi card ka gaana chalega.
let currentlyPlayingPlayer = null;

class Player{
  constructor(id, songs){
    this.id = id;
    this.audio = new Audio();
    this.songs = songs;
    this.currentIndex = -1;
    this.playBtn = document.getElementById('play-p'+id);
    this.queueEl = document.getElementById('queue-p'+id);
    this.titleEl = document.getElementById('title-p'+id);
    this.discEl = document.getElementById('disc-p'+id);
    this.waveEl = document.getElementById('wave-p'+id);
    this.progEl = document.getElementById('prog-p'+id);
    // Har card ka apna fixed id (p0, p1, p2, p3) HTML me already
    // likha hua hai, isliye seedha getElementById se sahi card
    // milta hai — LATEST UPLOADS wale video-cards se koi clash
    // nahi hota, kyunki unke id alag (ya koi id nahi) hai.
    this.cardEl = document.getElementById('p' + id);

    this.renderQueue();

    this.playBtn.addEventListener('click', () => {
      if(this.currentIndex === -1){
        alert('Please select the song from song queue');
        return;
      }
      this.toggle();
    });

    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.next());
  }

  renderQueue(){
    this.queueEl.querySelectorAll('.qitem').forEach(el => {
      const i = parseInt(el.dataset.i, 10);
      el.classList.toggle('active', i === this.currentIndex);
      el.onclick = () => {
        this.loadSong(i);
        this.play();
      };
    });
  }

  loadSong(i){
    if(i < 0 || i >= this.songs.length) return;
    this.currentIndex = i;
    this.audio.src = this.songs[i].url;
    this.titleEl.textContent = this.songs[i].name;
    this.renderQueue();
  }

  play(){
    if(this.currentIndex === -1){
      alert('Please select the song from song queue');
      return;
    }

    // agar koi doosra player pehle se baj raha hai, use pehle pause karo
    if(currentlyPlayingPlayer && currentlyPlayingPlayer !== this){
      currentlyPlayingPlayer.pause();
    }
    currentlyPlayingPlayer = this;

    this.audio.play();
    this.playBtn.textContent = 'Pause Song';
    this.discEl.style.animationPlayState = 'running';
    this.waveEl.querySelectorAll('span').forEach(s => s.style.animationPlayState = 'running');
    this.cardEl.classList.add('is-playing');
  }

  pause(){
    this.audio.pause();
    this.playBtn.textContent = 'Play Song';
    this.discEl.style.animationPlayState = 'paused';
    this.waveEl.querySelectorAll('span').forEach(s => s.style.animationPlayState = 'paused');
    this.cardEl.classList.remove('is-playing');

    if(currentlyPlayingPlayer === this){
      currentlyPlayingPlayer = null;
    }
  }

  toggle(){
    if(this.audio.paused) this.play(); else this.pause();
  }

  next(){
    if(!this.songs.length) return;
    const i = (this.currentIndex + 1) % this.songs.length;
    this.loadSong(i);
    this.play();
  }

  updateProgress(){
    if(!this.audio.duration) return;
    const pct = (this.audio.currentTime / this.audio.duration) * 100;
    this.progEl.style.width = pct + '%';
  }
}

// Ab har card ka id HTML me pehle se fix hai (p0-p3), isliye
// alag se id-assignment loop ki zaroorat nahi hai.
const players = ACCENTS.map((theme, i) => new Player(i, theme.songs));


/* =========================================================
   MOBILE HAMBURGER MENU
   ---------------------------------------------------------
   Sirf 860px aur usse chhoti screens pe hamburger icon (CSS me
   display:flex) dikhta hai, aur nav-links (id="nav-links",
   class="nav-links") ek slide-in panel ban jata hai (CSS me
   media.css ke andar ".nav-links.active").

   ASLI (REAL) WAJAH scroll na hone ki:
   "#home" wala section ".container" ke andar hai, aur ".container"
   pe CSS me "overflow: hidden;" laga hua hai (style.css me
   ".container { ... overflow: hidden; }"). Jab kisi element pe
   "overflow:hidden" wala ancestor hota hai, to browser ka
   ".scrollIntoView()" kabhi-kabhi confuse ho jata hai ki KISKO
   scroll kare — poore PAGE (window) ko, ya us "overflow:hidden"
   wale ancestor ko (jo waise scroll ho hi nahi sakta, bas silently
   fail ho jata hai). Isi wajah se pehle "scrollIntoView()" use
   karne par kuch links (khaaskar HOME) pe scroll hota hi nahi tha.

   FIX: Ab hum "scrollIntoView()" bilkul use nahi karte. Iske
   bajaye khud target element ki exact position (getBoundingClientRect
   + window.scrollY) calculate karke seedha "window.scrollTo()" call
   karte hain — ye hamesha ASLI window/page ko hi scroll karta hai,
   chahe target element kisi bhi "overflow:hidden" wale container
   ke andar kyun na ho. Isse HOME, ABOUT, SERVICES, SOUND — sab
   links reliably kaam karte hain.
   ========================================================= */
(function () {
  const hamburger = document.getElementById('hamburgerBtn');
  const nav = document.getElementById('nav-links');
  const overlay = document.getElementById('navOverlay');
  if (!hamburger || !nav) return; // is page pe mobile menu hai hi nahi

  function openMenu() {
    nav.classList.add('active');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // menu khule me background scroll na ho
  }

  function closeMenu() {
    nav.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // target element tak page ko manually scroll karta hai —
  // scrollIntoView() ke bharose nahi rehte (upar wajah likhi hai)
  function scrollToTarget(targetEl) {
    if (!targetEl) return;

    const rect = targetEl.getBoundingClientRect();

    // CSS me kuch sections pe "scroll-margin-top" diya hua hai
    // (taaki fixed header content ko cover na kare) — usko bhi
    // yahan manually respect karte hain
    const marginTop = parseFloat(getComputedStyle(targetEl).scrollMarginTop) || 0;

    const targetY = window.scrollY + rect.top - marginTop;

    window.scrollTo({
      top: Math.max(0, targetY),
      left: 0,
      behavior: 'smooth'
    });
  }

  hamburger.addEventListener('click', (e) => {
    e.preventDefault(); // <a href="#"> ka default jump/navigation rokte hain
    if (nav.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // overlay pe click karke bhi menu band ho jaye
  if (overlay) overlay.addEventListener('click', closeMenu);

  // kisi bhi nav link pe click karne ke baad menu band ho aur,
  // agar wo link isi page ke andar ka section hai, to page khud
  // us section tak smoothly scroll ho jaye
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      const isInPageAnchor = href.startsWith('#') && href.length > 1;

      if (isInPageAnchor) {
        e.preventDefault(); // default (unreliable) hash-jump ko rokte hain

        const targetEl = document.querySelector(href);

        closeMenu();

        // menu ki "active" class hatte hi turant scroll shuru kar
        // dete hain — koi setTimeout wait ki zaroorat nahi, kyunki
        // window.scrollTo() body/.container ki apni transition se
        // bilkul independent hai
        scrollToTarget(targetEl);
      } else {
        // SIGNING jaisa normal page link — sirf menu close karo,
        // navigation apne aap default se ho jayega
        closeMenu();
      }
    });
  });

  // agar user screen resize kare aur wapas desktop-size ho jaye,
  // to mobile menu ki leftover "active" state clear kar do
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeMenu();
  });
})();


/* =========================================================
   SPIDER CURSOR BACKGROUND
   ---------------------------------------------------------
   Ye poori website ke background me ek canvas (#c) chalata hai
   jo pointer (mouse/finger) ko follow karta hai — jaisa
   index.html me <canvas id="c"></canvas> pehle se hai.

   IIFE (function(){...})() ke andar isliye wrap kiya hai taaki:
   - agar kisi page pe #c canvas na ho to chup-chaap kuch na ho
     (guard clause "if (!canvas) return;")
   - andar ke saare helper functions (rnd, drawCircle, drawLine,
     many, lerp, noise, pt) sirf ISI block ke andar rahein aur
     upar wale music-player / video-compare code se collide na karein

   Isi script.js ko site ke HAR page pe include karne se (jahan
   bhi <canvas id="c"> aur style.css linked ho) ye spider effect
   automatically us page pe bhi chalu ho jayega.

   NAYA FIX (SPEED + SIZE KAM): neeche "SPIDER_SPEED" aur
   "SPIDER_SIZE" naam ke 2 control-variables add kiye hain.
   - SPIDER_SPEED: 1 = original speed, 0.5 = aadhi speed
     (jitna chhota, utna slow spider pointer ko follow karega
     aur utna hi slow apne aap idhar-udhar ghoomega)
   - SPIDER_SIZE: 1 = original size, 0.5 = aadha size
     (spider ki legs/body chhoti dikhengi)
   Agar future me speed/size aur kam-zyada karni ho, to bas
   inhi 2 values ko badal dena — poora code dhoondhne ki
   zaroorat nahi.
   ========================================================= */
(function () {
  const canvas = document.getElementById('c');
  if (!canvas) return; // is page pe spider canvas hai hi nahi, to kuch mat karo

  // === EASY CONTROLS: speed aur size yahin se control karo ===
  const SPIDER_SPEED = 0.3; // pehle effectively 1 tha — ab ~55% slow
  const SPIDER_SIZE = .5;   // pehle effectively 1 tha — ab 60% size (chhota)

  const ctx = canvas.getContext('2d');
  const { sin, cos, PI, hypot, min, max } = Math;

  let w, h;

  function spawn() {

    const pts = many(333, () => {
      return {
        x: rnd(innerWidth),
        y: rnd(innerHeight),
        len: 0,
        r: 0
      };
    });

    const pts2 = many(9, (i) => {
      return {
        x: cos((i / 9) * PI * 2),
        y: sin((i / 9) * PI * 2)
      };
    });

    let seed = rnd(100);
    let tx = rnd(innerWidth);
    let ty = rnd(innerHeight);
    let x = rnd(innerWidth);
    let y = rnd(innerHeight);

    // FIX: kx/ky spider ke "apne aap idhar-udhar ghoomne" (self-walk
    // oscillation) ki speed control karte hain. SPIDER_SPEED se
    // multiply karke inhe slow kar diya.
    let kx = rnd(0.5, 0.5) * SPIDER_SPEED;
    let ky = rnd(0.5, 0.5) * SPIDER_SPEED;

    // FIX: walkRadius spider ke self-wander ka "kitna bada circle"
    // banata hai — SPIDER_SIZE se chhota karne par wander area bhi
    // thoda compact ho jata hai (size ke hisaab se proportionate).
    let walkRadius = pt(rnd(50, 50) * SPIDER_SIZE, rnd(50, 50) * SPIDER_SIZE);

    // FIX: r spider ki legs/body ki "reach" (size) control karta hai.
    // Divisor ko SPIDER_SIZE se divide karke size chhoti kar di —
    // (SPIDER_SIZE chhota => divisor bada => r chhota).
    let r = (innerWidth / rnd(100, 150)) * SPIDER_SIZE;

    function paintPt(pt) {
      pts2.forEach((pt2) => {
        if (!pt.len)
          return;
        drawLine(
          lerp(x + pt2.x * r, pt.x, pt.len * pt.len),
          lerp(y + pt2.y * r, pt.y, pt.len * pt.len),
          x + pt2.x * r,
          y + pt2.y * r
        );
      });
      drawCircle(pt.x, pt.y, pt.r);
    }

    return {
      follow(nx, ny) {
        tx = nx;
        ty = ny;
      },

      tick(t) {

        const selfMoveX = cos(t * kx + seed) * walkRadius.x;
        const selfMoveY = sin(t * ky + seed) * walkRadius.y;
        let fx = tx + selfMoveX;
        let fy = ty + selfMoveY;

        // FIX: pehle "min(innerWidth/100, (fx-x)/10)" sirf POSITIVE
        // (right side) movement pe hi cap lagata tha — kyunki jab
        // (fx-x) NEGATIVE hota tha (cursor LEFT ki taraf), to
        // min(positive_cap, negative_number) hamesha wahi negative
        // number choose kar leta tha (koi cap nahi). Isi wajah se
        // LEFT jaate waqt spider tez aur RIGHT jaate waqt slow
        // lagta tha. Ab dono directions me BARABAR cap lagta hai.
        const maxStepX = (innerWidth / 100) * SPIDER_SPEED;
        const maxStepY = (innerWidth / 100) * SPIDER_SPEED;
        const rawStepX = ((fx - x) / 10) * SPIDER_SPEED;
        const rawStepY = ((fy - y) / 10) * SPIDER_SPEED;
        x += max(-maxStepX, min(maxStepX, rawStepX));
        y += max(-maxStepY, min(maxStepY, rawStepY));

        let i = 0;
        pts.forEach((pt) => {
          const dx = pt.x - x,
            dy = pt.y - y;
          const len = hypot(dx, dy);
          let r = min(2, innerWidth / len / 5) * SPIDER_SIZE;
          pt.t = 0;
          // FIX: pehle "innerWidth / 10" hamesha FIXED tha — ye
          // decide karta hai ki kitni DOOR tak ke points ko
          // "spider ke paas hai" maan ke leg/body me shaamil kiya
          // jaaye. Isi wajah se SPIDER_SIZE kam karne par sirf
          // legs patli/chhoti dikhti thi, lekin spider jitni JAGAH
          // (area) cover karta tha wo same hi rehta tha. Ab isko
          // bhi SPIDER_SIZE se scale kar diya, taaki poora spider
          // (uska "reach"/area) sahi me chhota ho.
          const increasing = len < (innerWidth / 10) * SPIDER_SIZE
            && (i++) < 8;
          let dir = increasing ? 0.1 : -0.1;
          if (increasing) {
            r *= 1.5;
          }
          pt.r = r;
          pt.len = max(0, min(pt.len + dir, 1));
          paintPt(pt);
        });

      }
    };
  }

  // FIX: pehle 2 spiders bante the (many(2, spawn)) — ab sirf 1
  // spider chahiye tha, isliye count 1 kar diya.
  const spiders = many(2, spawn);

  addEventListener("pointermove", (e) => {
    spiders.forEach(spider => {
      spider.follow(e.clientX, e.clientY);
    });
  });

  requestAnimationFrame(function anim(t) {
    if (w !== innerWidth) w = canvas.width = innerWidth;
    if (h !== innerHeight) h = canvas.height = innerHeight;
    ctx.fillStyle = "#000";
    drawCircle(0, 0, w * 10);
    ctx.fillStyle = ctx.strokeStyle = "#fff";
    t /= 1000;
    spiders.forEach(spider => spider.tick(t));
    requestAnimationFrame(anim);
  });

  function rnd(x = 1, dx = 0) {
    return Math.random() * x + dx;
  }

  function drawCircle(x, y, r) {
    ctx.beginPath();
    ctx.ellipse(x, y, r, r, 0, 0, PI * 2);
    ctx.fill();
  }

  function drawLine(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);

    many(100, (i) => {
      i = (i + 1) / 100;
      let x = lerp(x0, x1, i);
      let y = lerp(y0, y1, i);
      let k = noise(x / 5 + x0, y / 5 + y0) * 2;
      ctx.lineTo(x + k, y + k);
    });

    ctx.stroke();
  }

  function many(n, f) {
    return [...Array(n)].map((_, i) => f(i));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function noise(x, y, t = 101) {
    let w0 = sin(0.3 * x + 1.4 * t + 2.0 +
      2.5 * sin(0.4 * y + -1.3 * t + 1.0));
    let w1 = sin(0.2 * y + 1.5 * t + 2.8 +
      2.3 * sin(0.5 * x + -1.2 * t + 0.5));
    return w0 + w1;
  }

  function pt(x, y) {
    return { x, y };
  }
})();