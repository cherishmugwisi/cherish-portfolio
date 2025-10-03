// Mobile nav toggle
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.getAttribute('data-open') === 'true';
    nav.setAttribute('data-open', String(!open));
    toggle.setAttribute('aria-expanded', String(!open));
  });
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ------- WhatsApp submit for the order form -------
const form = document.getElementById('orderForm');
if (form) {
  const showError = (name, msg) => {
    const el = form.querySelector(`[data-for="${name}"]`);
    if (el) el.textContent = msg || '';
  };

  const validators = {
    name: v => v.trim().length >= 2 || 'Please enter your full name.',
    email: v => /.+@.+\..+/.test(v) || 'Enter a valid email address.',
    type: v => v.trim().length > 0 || 'Select a project type.',
    message: v => v.trim().length >= 10 || 'Please add at least 10 characters.',
    agree: v => v === true || 'You must agree before submitting.'
  };

  const phoneE164NoPlus = '263788321580'; // Zimbabwe (+263) without the "+"
  const buildWhatsAppText = (data) => {
    const lines = [
      '*New Project Enquiry*',
      '',
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Project Type: ${data.type}`,
      data.budget ? `Budget (USD): ${data.budget}` : null,
      '',
      'Details:',
      data.message
    ].filter(Boolean);
    return lines.join('\n');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      name: form.name.value,
      email: form.email.value,
      type: form.type.value,
      budget: form.budget.value,
      message: form.message.value,
      agree: form.querySelector('#agree').checked,
      submittedAt: new Date().toISOString()
    };

    // validate
    let ok = true;
    for (const [key, rule] of Object.entries(validators)) {
      const valid = rule(data[key]);
      if (valid !== true) {
        showError(key, valid);
        ok = false;
      } else {
        showError(key, '');
      }
    }
    if (!ok) return;

    // OPTIONAL: keep your local demo save (remove this block if you don't want it)
    try {
      const previous = JSON.parse(localStorage.getItem('orders') || '[]');
      previous.push(data);
      localStorage.setItem('orders', JSON.stringify(previous));
    } catch {}

    // Build WhatsApp link with prefilled message
    const text = encodeURIComponent(buildWhatsAppText(data));
    const waURL = `https://wa.me/${phoneE164NoPlus}?text=${text}`;

    // Prefer same-tab navigation on mobile (better handoff to the app)
    // and a new tab on desktop. Simple heuristic:
    const isMobile = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = waURL;
    } else {
      const w = window.open(waURL, '_blank', 'noopener,noreferrer');
      if (!w) {
        // popup blocked — fallback to same tab
        window.location.href = waURL;
      }
    }

    // Show your success note (optional) and reset
    const success = document.querySelector('.form-success');
    if (success) {
      success.textContent = 'Opening WhatsApp… if nothing happens, please click the WhatsApp button again.';
      success.hidden = false;
    }
    form.reset();
  });
}
