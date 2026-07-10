const stage = document.getElementById('stage');
const infoPanel = document.getElementById('infoPanel');
const formPanel = document.getElementById('formPanel');
const showFormBtn = document.getElementById('showForm');
const showInfoBtn = document.getElementById('showInfo');

let showingForm = false;

function playTransition(direction) {
  stage.classList.remove('playing', 'to-form', 'to-info');
  void stage.offsetWidth;
  stage.classList.add('playing', direction);

  setTimeout(() => {
    stage.classList.remove('playing', 'to-form', 'to-info');
    if (direction === 'to-form') {
      infoPanel.style.opacity = 0;
      infoPanel.style.zIndex = 1;
      formPanel.style.opacity = 1;
      formPanel.style.zIndex = 2;
    } else {
      formPanel.style.opacity = 0;
      formPanel.style.zIndex = 1;
      infoPanel.style.opacity = 1;
      infoPanel.style.zIndex = 2;
    }
  }, 700);
}

showFormBtn.addEventListener('click', () => {
  if (showingForm) return;
  showingForm = true;
  playTransition('to-form');
});

showInfoBtn.addEventListener('click', () => {
  if (!showingForm) return;
  showingForm = false;
  playTransition('to-info');
});

const contactForm = document.querySelector('.form form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Thanks! Your message has been sent — we'll get back to you soon.");
    contactForm.reset();
  });
}