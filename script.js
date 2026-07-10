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