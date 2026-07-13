let userEmail = "johndoe@gmail.com";
let resendTimerInterval;

// map: current screen -> the screen "one step back" should go to
const prevMap = { 2: 1, 3: 2, 5: 3, 6: 5 };

function showToast(msg, isError){
  const toast = document.getElementById('toast');
  const dot = toast.querySelector('.dot');
  document.getElementById('toastText').textContent = msg;
  dot.style.background = isError ? '#E0577A' : '#2FAE72';
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), 3200);
}

function updateSteps(n){
  document.querySelectorAll('.step-item').forEach(item=>{
    const s = parseInt(item.dataset.step);
    item.classList.remove('active','done');
    if(s < n) item.classList.add('done');
    if(s === n) item.classList.add('active');
  });
}

function goTo(n){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen'+n).classList.add('active');
  const stepMap = {1:1, 2:2, 3:2, 4:3, 5:4, 6:5};
  updateSteps(stepMap[n] || 1);
}

function goBack(){
  const active = document.querySelector('.screen.active');
  if(!active) return;
  const current = parseInt(active.id.replace('screen',''));
  const prev = prevMap[current];
  if(prev) goTo(prev);
}

function validEmail(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function handleSend(){
  const input = document.getElementById('emailInput');
  const wrap = document.getElementById('emailWrap');
  const err = document.getElementById('emailError');
  const val = input.value.trim();

  if(!validEmail(val)){
    wrap.classList.add('error');
    err.classList.add('show');
    return;
  }
  wrap.classList.remove('error');
  err.classList.remove('show');
  userEmail = val;

  const btn = document.getElementById('sendBtn');
  const spinner = document.getElementById('sendSpinner');
  const text = document.getElementById('sendText');
  btn.disabled = true;
  spinner.style.display = 'inline-block';
  text.textContent = 'Sending...';

  setTimeout(()=>{
    spinner.style.display = 'none';
    text.textContent = 'Send verification link';
    btn.disabled = false;

    document.getElementById('sentEmailText').textContent = userEmail;
    document.getElementById('recipientEmail').textContent = userEmail;

    showToast('Verification link sent to ' + userEmail + '!', false);
    goTo(2);
    startResendTimer();
  }, 1300);
}

function openEmail(){
  goTo(3);
}

function verifyFromEmail(){
  goTo(4);
  setTimeout(()=>{
    showToast('Identity verified!', false);
    document.getElementById('verifiedEmailText').textContent = userEmail;
    goTo(5);
  }, 1600);
}

function startResendTimer(){
  let seconds = 30;
  const link = document.getElementById('resendLink');
  const timerEl = document.getElementById('resendTimer');
  link.classList.add('disabled');
  timerEl.style.display = 'inline';
  clearInterval(resendTimerInterval);
  resendTimerInterval = setInterval(()=>{
    seconds--;
    timerEl.textContent = ' (' + seconds + 's)';
    if(seconds <= 0){
      clearInterval(resendTimerInterval);
      link.classList.remove('disabled');
      timerEl.style.display = 'none';
    }
  }, 1000);
}

function resendEmail(){
  const link = document.getElementById('resendLink');
  if(link.classList.contains('disabled')) return;
  showToast('Link resent to ' + userEmail + '!', false);
  startResendTimer();
}

/* ===== Set new password screen ===== */

function togglePwd(inputId, iconEl){
  const input = document.getElementById(inputId);
  if(!input) return;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  iconEl.style.color = isHidden ? 'var(--purple-mid)' : 'var(--ink-soft)';
}

function checkPwdStrength(pwd){
  let score = 0;
  if(pwd.length >= 8) score++;
  if(/[A-Z]/.test(pwd)) score++;
  if(/[0-9]/.test(pwd)) score++;
  if(/[^A-Za-z0-9]/.test(pwd)) score++;

  const fill = document.getElementById('pwdStrengthFill');
  const label = document.getElementById('pwdStrengthLabel');
  if(!fill || !label) return score;

  const levels = [
    {width:'0%', color:'#EDE6F5', text:'Password strength'},
    {width:'25%', color:'#E0577A', text:'Weak'},
    {width:'50%', color:'#E0A83F', text:'Fair'},
    {width:'75%', color:'#7B3FA0', text:'Good'},
    {width:'100%', color:'#2FAE72', text:'Strong'}
  ];
  const lvl = levels[score];
  fill.style.width = lvl.width;
  fill.style.background = lvl.color;
  label.textContent = lvl.text;
  return score;
}

document.addEventListener('input', (e)=>{
  if(e.target && e.target.id === 'pwdInput'){
    checkPwdStrength(e.target.value);
  }
});

function handleSetPassword(){
  const pwdInput = document.getElementById('pwdInput');
  const confirmInput = document.getElementById('confirmInput');
  const pwdWrap = document.getElementById('pwdWrap');
  const confirmWrap = document.getElementById('confirmWrap');
  const pwdError = document.getElementById('pwdError');
  const confirmError = document.getElementById('confirmError');

  const pwd = pwdInput.value;
  const confirm = confirmInput.value;

  let valid = true;

  if(pwd.length < 8){
    pwdWrap.classList.add('error');
    pwdError.classList.add('show');
    valid = false;
  } else {
    pwdWrap.classList.remove('error');
    pwdError.classList.remove('show');
  }

  if(confirm !== pwd || confirm.length === 0){
    confirmWrap.classList.add('error');
    confirmError.classList.add('show');
    valid = false;
  } else {
    confirmWrap.classList.remove('error');
    confirmError.classList.remove('show');
  }

  if(!valid) return;

  const btn = document.getElementById('setPwdBtn');
  const spinner = document.getElementById('setPwdSpinner');
  const text = document.getElementById('setPwdText');
  btn.disabled = true;
  spinner.style.display = 'inline-block';
  text.textContent = 'Updating...';

  setTimeout(()=>{
    spinner.style.display = 'none';
    text.textContent = 'Update password';
    btn.disabled = false;

    document.getElementById('loggedEmail').textContent = userEmail;
    showToast('Password updated successfully!', false);
    goTo(6);
  }, 1300);
}