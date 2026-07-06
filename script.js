/* =========================================================
   Pehle page ke SAARE ".compare" boxes dhoondh lete hain
   (chahe 2 ho, 3 ho, jitne bhi HTML me likhe hain)
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
  const videoAfter   = compare.querySelector('.video-after');
  const videoBefore  = compare.querySelector('.video-before');
  const dividerLine  = compare.querySelector('.divider-line');
  const handle       = compare.querySelector('.handle');

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

const btnWrap = document.getElementById("btnWrap");
const liquidBtn = document.getElementById("liquidBtn");

liquidBtn.addEventListener("click", (e) => {
  e.preventDefault(); // agar <a href="#"> ke andar hai to page top pe jump na ho

  // agar pehle se animation chal rahi hai, use turant restart karne ke liye
  // class hata ke browser ko "reflow" force karwate hain
  btnWrap.classList.remove("sparkle-active");
  void btnWrap.offsetWidth; // reflow trick — restart ke liye zaroori

  btnWrap.classList.add("sparkle-active");

  // animation khatam hote hi class hata do, taaki agli baar click par
  // dobara se fresh animation chal sake
  setTimeout(() => {
    btnWrap.classList.remove("sparkle-active");
  }, 700); // 0.7s = burst animation ki duration (CSS se match honi chahiye)
});