
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

// Simple form validation & demo "submit"
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

  form.addEventListener('submit', e => {
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

    // Store locally as a demo
    const previous = JSON.parse(localStorage.getItem('orders') || '[]');
    previous.push(data);
    localStorage.setItem('orders', JSON.stringify(previous));

    const success = document.querySelector('.form-success');
    if (success) success.hidden = false;
    console.log('Order saved locally (demo):', data);
    form.reset();
  });
}
