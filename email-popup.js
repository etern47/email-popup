(function () {
  if (window.__tipxEmailModalInjected) return;
  window.__tipxEmailModalInjected = true;

  var DEFAULT_DELAY_MS = 25000;
  var cancelled = false;
  var showTimer = null;

  function injectStyles() {
    if (document.getElementById('tipx-email-modal-styles')) return;
    var style = document.createElement('style');
    style.id = 'tipx-email-modal-styles';
    style.textContent = '\
      @keyframes tipxFadeIn { from { opacity: 0 } to { opacity: 1 } }\
      @keyframes tipxSlideUp { from { transform: translateY(12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }\
      .tipx-overlay {\
        position: fixed; inset: 0; background: rgba(0,0,0,0.6);\
        display: flex; align-items: center; justify-content: center;\
        z-index: 2147483646; animation: tipxFadeIn 200ms ease both;\
      }\
      .tipx-modal {\
        position: relative; width: min(90vw, 420px);\
        background: rgba(255, 255, 255, 0.1);\
        backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);\
        border: 0px solid rgba(255, 255, 255, 0.2);\
        border-radius: 16px; padding: 24px;\
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);\
        color: #ffffff;\
        font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", Arial, "Apple Color Emoji","Segoe UI Emoji",sans-serif;\
        animation: tipxSlideUp 220ms ease both;\
      }\
      .tipx-close {\
        position: absolute; top: 10px; right: 12px; width: 36px; height: 36px;\
        display: inline-flex; align-items: center; justify-content: center;\
        background: transparent; border: none; cursor: pointer;\
        color: rgba(255,255,255,0.9); font-size: 22px; line-height: 1;\
        border-radius: 8px; transition: background 120ms ease, transform 120ms ease, color 120ms ease;\
      }\
      .tipx-close:hover { background: rgba(255,255,255,0.08); color: #ffffff; transform: scale(1.04); }\
      .tipx-title { font-size: 18px; font-weight: 700; margin: 0 32px 8px 0; color: #ffffff; }\
      .tipx-desc { font-size: 14px; color: rgba(255,255,255,0.8); margin: 0 0 16px 0; }\
      .tipx-input {\
        width: 100%; padding: 12px 16px; font-size: 16px;\
        background: rgba(255,255,255,0.1); color: #ffffff;\
        border: none; outline: none; border-radius: 12px; box-sizing: border-box;\
      }\
      .tipx-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: center; margin-top: 12px; }\
      .tipx-button {\
        padding: 12px 16px; font-size: 14px; font-weight: 700;\
        background: #10b981; color: #0b0f0d; border: none; border-radius: 12px; cursor: pointer;\
        transition: filter 120ms ease, transform 120ms ease;\
      }\
      .tipx-button:hover { filter: brightness(1.05); transform: translateY(-1px); }\
      .tipx-error { grid-column: 1 / -1; min-height: 16px; font-size: 12px; color: #ef4444; }\
    ';
    document.head.appendChild(style);
  }

  function showModal() {
    injectStyles();

    var overlay = document.createElement('div');
    overlay.className = 'tipx-overlay';
    overlay.id = 'tipx-email-overlay';

    var modal = document.createElement('div');
    modal.className = 'tipx-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'tipx-email-title');

    var closeBtn = document.createElement('button');
    closeBtn.className = 'tipx-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = '×';

    var title = document.createElement('h2');
    title.className = 'tipx-title';
    title.id = 'tipx-email-title';
    title.textContent = 'Get updates via email';

    var desc = document.createElement('p');
    desc.className = 'tipx-desc';
    desc.textContent = 'Join our list to receive news, tips, and occasional offers.';

    var form = document.createElement('form');
    form.setAttribute('novalidate', 'true');

    var row = document.createElement('div');
    row.className = 'tipx-row';

    var input = document.createElement('input');
    input.className = 'tipx-input';
    input.type = 'email';
    input.placeholder = 'you@example.com';
    input.name = 'email';
    input.autocomplete = 'email';
    input.required = true;

    var button = document.createElement('button');
    button.className = 'tipx-button';
    button.type = 'submit';
    button.textContent = 'Subscribe';

    var error = document.createElement('div');
    error.className = 'tipx-error';

    row.appendChild(input);
    row.appendChild(button);
    form.appendChild(row);
    form.appendChild(error);

    modal.appendChild(closeBtn);
    modal.appendChild(title);
    modal.appendChild(desc);
    modal.appendChild(form);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    function close() {
      document.removeEventListener('keydown', onKeyDown);
      overlay.remove();
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') close();
    }

    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', onKeyDown);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var value = (input.value || '').trim();
      var valid = /^\S+@\S+\.\S+$/.test(value);
      if (!valid) {
        error.textContent = 'Please enter a valid email.';
        input.focus();
        return;
      }
      // TODO: send "value" to your endpoint/service
      error.style.color = '#10b981';
      error.textContent = 'Thanks! You’re subscribed.';
      input.disabled = true; button.disabled = true;
      setTimeout(close, 1000);
    });

    setTimeout(function () { try { input.focus(); } catch (_) {} }, 50);
  }

  function scheduleShow(delayMs) {
    if (cancelled) return;
    if (showTimer) { clearTimeout(showTimer); showTimer = null; }
    showTimer = setTimeout(function () {
      if (!document.getElementById('tipx-email-overlay')) showModal();
    }, delayMs);
  }

  // Expose API immediately; cancel works even if called before timer is set
  window.tipxEmailPopup = {
    show: showModal,
    close: function () {
      var o = document.getElementById('tipx-email-overlay');
      if (o) o.remove();
    },
    cancel: function () {
      cancelled = true;
      if (showTimer) { clearTimeout(showTimer); showTimer = null; }
    },
    reschedule: function (ms) {
      cancelled = false;
      scheduleShow(typeof ms === 'number' && ms >= 0 ? ms : DEFAULT_DELAY_MS);
    }
  };

  // Optional delay override via data-delay on the script tag
  var current = document.currentScript;
  var attrDelay = current && current.getAttribute && current.getAttribute('data-delay');
  var delay = parseInt(attrDelay, 10);
  if (!isFinite(delay) || delay < 0) delay = DEFAULT_DELAY_MS;

  scheduleShow(delay);
})();
