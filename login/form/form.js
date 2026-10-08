let currentStep = 1;
let otpTimerInterval;
let userProfileImage = '';
let isRegistered = false;

function goStep(n) {
  document.getElementById('section' + currentStep).classList.remove('active');

  document.querySelectorAll('.pstep').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i + 1 < n) el.classList.add('done');
  });

  currentStep = n;

  if (n <= 5) {
    document.getElementById('section' + n).classList.add('active');
    const psteps = document.querySelectorAll('.pstep');
    if (psteps[n - 1]) psteps[n - 1].classList.add('active');
  } else {
    document.getElementById('section6').classList.add('active');
  }

  document.getElementById('curStep').textContent = Math.min(n, 5);

  const fills = [0, 25, 50, 75, 100, 100];
  document.getElementById('progressFill').style.width = (fills[n - 1] || 100) + '%';

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (n === 5) populateReview();
}

function aadMove(el, nextId) {
  el.value = el.value.replace(/\D/g, '');
  if (el.value.length === 4 && nextId) document.getElementById(nextId).focus();
}

function aadBack(e, prevId) {
  if (e.key === 'Backspace' && e.target.value === '') {
    document.getElementById(prevId).focus();
  }
}

function aadDone() {
  document.getElementById('aad3').value =
    document.getElementById('aad3').value.replace(/\D/g, '');
}

function aadPaste(e) {
  e.preventDefault();
  const v = (e.clipboardData || window.clipboardData)
    .getData('text')
    .replace(/\D/g, '')
    .slice(0, 12);

  ['aad1', 'aad2', 'aad3'].forEach((id, i) => {
    document.getElementById(id).value = v.slice(i * 4, i * 4 + 4);
  });
}

function getAadhaar() {
  return ['aad1', 'aad2', 'aad3']
    .map(id => document.getElementById(id).value)
    .join('');
}

function verifyAadhaar() {
  const aad = getAadhaar();

  if (aad.length !== 12) {
    document.getElementById('aadErr').classList.add('show');
    return;
  }

  document.getElementById('aadErr').classList.remove('show');
  document.getElementById('otpSection').style.display = 'block';
  startOtpTimer();
  document.getElementById('o1').focus();
  showToast('📱 OTP sent to Aadhaar-linked mobile (Demo: 1 2 3 4 5 6)');
}

function startOtpTimer() {
  clearInterval(otpTimerInterval);
  let t = 30;
  document.getElementById('otpTimer').textContent = t;

  otpTimerInterval = setInterval(() => {
    t--;
    document.getElementById('otpTimer').textContent = t;
    if (t <= 0) clearInterval(otpTimerInterval);
  }, 1000);
}

function otpMove(el, nextId) {
  el.value = el.value.replace(/\D/g, '').slice(-1);
  el.classList.toggle('filled', el.value.length > 0);
  if (el.value && nextId) document.getElementById(nextId).focus();
}

function otpBack(e, prevId) {
  if (e.key === 'Backspace' && !e.target.value) {
    document.getElementById(prevId).focus();
  }
}

function otpDone() {
  const o6 = document.getElementById('o6');
  o6.value = o6.value.replace(/\D/g, '').slice(-1);
  o6.classList.toggle('filled', o6.value.length > 0);
}

function confirmOtp() {
  const otp = ['o1', 'o2', 'o3', 'o4', 'o5', 'o6']
    .map(id => document.getElementById(id).value)
    .join('');

  document.getElementById('otpErr').classList.remove('show');

  if (otp !== '123456') {
    document.getElementById('otpErr').classList.add('show');
    return;
  }

  const sp = document.getElementById('otpSpinner');
  sp.style.display = 'block';

  setTimeout(() => {
    sp.style.display = 'none';
    document.getElementById('otpSection').style.display = 'none';
    document.getElementById('aadSuccess').style.display = 'block';
    document.getElementById('photoCard').style.display = 'block';
    document.getElementById('step1NextBtn').style.display = 'flex';

    document.getElementById('fname').value = '';
    document.getElementById('mname').value = '';
    document.getElementById('lname').value = '';
    document.getElementById('dob').value = '';
    calcAge();
    document.getElementById('gender').value = '';
    document.getElementById('category').value = '';
    document.getElementById('nationality').value = '';
    document.getElementById('fathername').value = '';
    document.getElementById('mothername').value = '';

    showToast('✅ Aadhaar verified! Details auto-filled.');
  }, 1500);
}

function calcAge() {
  const dob = document.getElementById('dob').value;
  if (!dob) {
    document.getElementById('ageField').value = '';
    document.getElementById('ageDisplay').textContent = '';
    return;
  }

  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

  document.getElementById('ageField').value = age + ' years';
  document.getElementById('ageDisplay').textContent =
    age >= 18 ? '✅ Eligible for all services' : '⚠ Below 18 – limited services';
  document.getElementById('ageDisplay').style.color =
    age >= 18 ? 'var(--success)' : 'var(--saffron)';
}

function previewPhoto(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    showToast('⚠ File must be under 2MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = ev => {
    const img = document.getElementById('photoPreview');
    img.src = ev.target.result;
    img.style.display = 'block';

    document.getElementById('photoIcon').style.display = 'none';

    userProfileImage = ev.target.result;
    updateProfileUI();

    const receiptPhoto = document.getElementById('r_photo');
    if (receiptPhoto) {
      receiptPhoto.src = userProfileImage;
      receiptPhoto.style.display = 'block';
    }

    showToast('🖼 Photo uploaded successfully!');
  };

  reader.readAsDataURL(file);
}

function updateProfileUI() {
  const profileImg = document.getElementById('userProfileImg');
  const loginBtn = document.getElementById('loginSignupBtn');
  const profileWrap = document.getElementById('profileBox');

  if (userProfileImage && profileImg) {
    profileImg.src = userProfileImage;
    profileImg.style.display = 'block';
  }

  if (isRegistered) {
    if (loginBtn) {
      loginBtn.textContent = 'Profile';
      loginBtn.classList.add('profile-mode');
    }
    if (profileWrap) {
      profileWrap.style.display = 'flex';
    }
  }
}

function lookupPin(el) {
  el.value = el.value.replace(/\D/g, '');
  const found = document.getElementById('pincodeFound');

  if (el.value.length === 6) {
    found.style.display = 'block';
    found.textContent = '✅ PIN Code ' + el.value + ' verified – India Post';
  } else {
    found.style.display = 'none';
  }
}

function toggleSameAddr(cb) {
  const fields = document.getElementById('currAddrFields');

  if (cb.checked) {
    document.getElementById('c_hno').value = document.getElementById('hno').value;
    document.getElementById('c_village').value = document.getElementById('village').value;
    document.getElementById('c_district').value = document.getElementById('district').value;
    document.getElementById('c_pin').value = document.getElementById('pincode').value;

    fields.style.opacity = '.45';
    fields.style.pointerEvents = 'none';
  } else {
    fields.style.opacity = '1';
    fields.style.pointerEvents = '';
  }
}

function validateStep2() {
  const fn = document.getElementById('fname').value.trim();
  const ln = document.getElementById('lname').value.trim();
  const dob = document.getElementById('dob').value;
  const gen = document.getElementById('gender').value;
  const cat = document.getElementById('category').value;

  if (!fn) {
    document.getElementById('fnameErr').classList.add('show');
    showToast('⚠ First name is required');
    return;
  }

  if (!ln) {
    document.getElementById('lnameErr').classList.add('show');
    showToast('⚠ Last name is required');
    return;
  }

  if (!dob) {
    showToast('⚠ Date of birth is required');
    return;
  }

  if (!gen) {
    showToast('⚠ Please select gender');
    return;
  }

  if (!cat) {
    showToast('⚠ Please select category');
    return;
  }

  document.getElementById('fnameErr').classList.remove('show');
  document.getElementById('lnameErr').classList.remove('show');
  goStep(3);
}

function validateStep3() {
  const hno = document.getElementById('hno').value.trim();
  const vill = document.getElementById('village').value.trim();
  const po = document.getElementById('po').value.trim();
  const ps = document.getElementById('ps').value.trim();
  const dist = document.getElementById('district').value.trim();
  const state = document.getElementById('state').value;
  const pin = document.getElementById('pincode').value.trim();

  if (!hno || !vill || !po || !ps || !dist || !state || pin.length !== 6) {
    showToast('⚠ Please fill all required address fields');
    return;
  }

  goStep(4);
}

function validateMobile() {
  const v = document.getElementById('mobile').value;
  const ok = /^[6-9]\d{9}$/.test(v);

  document.getElementById('mobileErr').classList.toggle('show', v.length === 10 && !ok);
  document.getElementById('mobile').classList.toggle('valid', ok);
}

function validateEmail() {
  const v = document.getElementById('email').value;
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  document.getElementById('emailErr').classList.toggle('show', v.length > 3 && !ok);
  document.getElementById('email').classList.toggle('valid', ok);
}

function validateStep4() {
  const mob = document.getElementById('mobile').value;
  const email = document.getElementById('email').value;
  const pwd = document.getElementById('pwd').value;
  const cpwd = document.getElementById('cpwd').value;
  const father = document.getElementById('fathername').value.trim();
  const mother = document.getElementById('mothername').value.trim();

  if (!/^[6-9]\d{9}$/.test(mob)) {
    showToast('⚠ Invalid mobile number');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('⚠ Invalid email address');
    return;
  }

  if (pwd.length < 8) {
    showToast('⚠ Password must be at least 8 characters');
    return;
  }

  if (pwd !== cpwd) {
    document.getElementById('pwdErr').classList.add('show');
    showToast('⚠ Passwords do not match');
    return;
  }

  if (!father || !mother) {
    showToast('⚠ Father & Mother name required');
    return;
  }

  document.getElementById('pwdErr').classList.remove('show');
  goStep(5);
}

function checkStrength() {
  const pwd = document.getElementById('pwd').value;
  let score = 0;

  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const fill = document.getElementById('strengthFill');
  const text = document.getElementById('strengthText');

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#ef4444', '#f97316', '#3b82f6', '#22c55e'];

  fill.style.width = (score * 25) + '%';
  fill.style.background = colors[score] || 'transparent';
  text.textContent = labels[score] || '';
  text.style.color = colors[score] || 'var(--muted)';
}

function checkMatch() {
  const p = document.getElementById('pwd').value;
  const c = document.getElementById('cpwd').value;
  document.getElementById('pwdErr').classList.toggle('show', c.length > 0 && p !== c);
}

function togglePwd(id) {
  const inp = document.getElementById(id);
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

function populateReview() {
  const aad = getAadhaar();
  document.getElementById('rv_aadhaar').textContent = aad.slice(0, 4) + ' XXXX XXXX';

  const fn = document.getElementById('fname').value;
  const mn = document.getElementById('mname').value;
  const ln = document.getElementById('lname').value;

  document.getElementById('rv_name').textContent = [fn, mn, ln].filter(Boolean).join(' ') || '—';
  document.getElementById('rv_dob').textContent = document.getElementById('dob').value || '—';
  document.getElementById('rv_age').textContent = document.getElementById('ageField').value || '—';
  document.getElementById('rv_gender').textContent = document.getElementById('gender').value || '—';
  document.getElementById('rv_cat').textContent = document.getElementById('category').value || '—';
  document.getElementById('rv_nat').textContent = document.getElementById('nationality').value || '—';
  document.getElementById('rv_marital').textContent = document.getElementById('marital').value || '—';
  document.getElementById('rv_occ').textContent = document.getElementById('occupation').value || '—';
  document.getElementById('rv_hno').textContent = document.getElementById('hno').value || '—';
  document.getElementById('rv_vill').textContent = document.getElementById('village').value || '—';
  document.getElementById('rv_po').textContent = document.getElementById('po').value || '—';
  document.getElementById('rv_ps').textContent = document.getElementById('ps').value || '—';
  document.getElementById('rv_dist').textContent = document.getElementById('district').value || '—';

  const st = document.getElementById('state').value;
  const pin = document.getElementById('pincode').value;
  document.getElementById('rv_statepin').textContent = (st || '—') + (pin ? ' — ' + pin : '');

  const mob = document.getElementById('mobile').value;
  document.getElementById('rv_mob').textContent = mob ? mob.slice(0, 3) + 'XXXXXXX' : '—';
  document.getElementById('rv_email').textContent = document.getElementById('email').value || '—';
  document.getElementById('rv_father').textContent = document.getElementById('fathername').value || '—';
  document.getElementById('rv_mother').textContent = document.getElementById('mothername').value || '—';
}

function populateReceipt(ref) {
  const aad = getAadhaar();
  const fn = document.getElementById('fname').value;
  const mn = document.getElementById('mname').value;
  const ln = document.getElementById('lname').value;
  const fullName = [fn, mn, ln].filter(Boolean).join(' ') || '—';

  const address = [
    document.getElementById('hno').value,
    document.getElementById('village').value,
    document.getElementById('po').value,
    document.getElementById('ps').value,
    document.getElementById('district').value,
    document.getElementById('state').value,
    document.getElementById('pincode').value
  ].filter(Boolean).join(', ');

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value || '—';
  };

  setText('r_ref', ref);
  setText('r_aadhaar', aad ? aad.slice(0, 4) + ' XXXX XXXX' : '—');
  setText('r_name', fullName);
  setText('r_dob', document.getElementById('dob').value || '—');
  setText('r_age', document.getElementById('ageField').value || '—');
  setText('r_gender', document.getElementById('gender').value || '—');
  setText('r_category', document.getElementById('category').value || '—');
  setText('r_nationality', document.getElementById('nationality').value || '—');
  setText('r_marital', document.getElementById('marital').value || '—');
  setText('r_occupation', document.getElementById('occupation').value || '—');
  setText('r_address', address || '—');
  setText('r_mobile', document.getElementById('mobile').value || '—');
  setText('r_email', document.getElementById('email').value || '—');
  setText('r_father', document.getElementById('fathername').value || '—');
  setText('r_mother', document.getElementById('mothername').value || '—');

  const photo = document.getElementById('r_photo');
  if (photo && userProfileImage) {
    photo.src = userProfileImage;
    photo.style.display = 'block';
  }
}

function submitForm() {
  if (!document.getElementById('decl1').checked || !document.getElementById('decl2').checked) {
    showToast('⚠ Please agree to both declarations');
    return;
  }

  const sp = document.getElementById('submitSpinner');
  sp.style.display = 'block';

  setTimeout(() => {
    sp.style.display = 'none';

    const ref = 'DGSP-2025-' + Math.floor(10000000 + Math.random() * 89999999);

    document.getElementById('refNumber').textContent = ref;

    isRegistered = true;
    updateProfileUI();
    populateReceipt(ref);

    goStep(6);
    showToast('✅ Registration submitted successfully!');
  }, 2500);
}

function printReceipt() {
  const receiptContent = document.getElementById('receiptContent');
  if (!receiptContent) {
    showToast('⚠ Receipt section not found');
    return;
  }

  const win = window.open('', '_blank');
  win.document.write(`
    <html>
      <head>
        <title>Registration Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #111;
          }
          h2 {
            text-align: center;
            margin-bottom: 20px;
          }
          .receipt-box {
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 10px;
          }
          .receipt-box p {
            margin: 8px 0;
            font-size: 14px;
            line-height: 1.5;
          }
          .receipt-box img {
            max-width: 100px;
            max-height: 100px;
            border-radius: 8px;
            margin-top: 8px;
          }
        </style>
      </head>
      <body>
        <h2>Registration Receipt</h2>
        <div class="receipt-box">${receiptContent.innerHTML}</div>
      </body>
    </html>
  `);

  win.document.close();
  win.focus();
  win.print();
}

function downloadReceipt() {
  const receiptContent = document.getElementById('receiptContent');
  if (!receiptContent) {
    showToast('⚠ Receipt section not found');
    return;
  }

  if (typeof html2pdf === 'undefined') {
    showToast('⚠ html2pdf library not loaded');
    return;
  }

  const opt = {
    margin: 0.5,
    filename: 'Registration-Receipt.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(receiptContent).save();
}

function saveDraft() {
  showToast('💾 Draft saved successfully!');
  const fs = document.getElementById('floatSave');
  fs.classList.add('show');
  setTimeout(() => fs.classList.remove('show'), 3000);
}

function showToast(msg) {
  const existing = document.querySelector('.toast-notif');
  if (existing) existing.remove();

  const t = document.createElement('div');
  t.className = 'toast-notif';
  t.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(10,22,40,.95);
    border: 1px solid rgba(255,255,255,.12);
    color: #fff;
    padding: .7rem 1.5rem;
    border-radius: 24px;
    font-size: .83rem;
    z-index: 99999;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0,0,0,.4);
    white-space: nowrap;
    max-width: 90vw;
    text-align: center;
  `;
  t.textContent = msg;
  document.body.appendChild(t);

  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transition = 'opacity .3s';
    setTimeout(() => t.remove(), 300);
  }, 2800);
}

const pz = document.getElementById('photoZone');
if (pz) {
  pz.addEventListener('dragover', e => {
    e.preventDefault();
    pz.classList.add('dragover');
  });

  pz.addEventListener('dragleave', () => pz.classList.remove('dragover'));

  pz.addEventListener('drop', e => {
    e.preventDefault();
    pz.classList.remove('dragover');
    const f = e.dataTransfer.files[0];
    if (f) previewPhoto({ target: { files: [f] } });
  });
}

document.querySelectorAll('.pstep').forEach(el => {
  el.addEventListener('click', () => {
    const s = parseInt(el.dataset.step);
    if (s < currentStep) goStep(s);
  });
});

setInterval(() => {
  if (currentStep > 1) {
    const fs = document.getElementById('floatSave');
    if (fs) {
      fs.classList.add('show');
      setTimeout(() => fs.classList.remove('show'), 2500);
    }
  }
}, 60000);