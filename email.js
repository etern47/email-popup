(function () {
    if (window.__tipxEmailModalInjected) return;
    window.__tipxEmailModalInjected = true;
  
    var DEFAULT_DELAY_MS = 100;
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
            position: fixed; inset: 0; background: rgba(0,0,0,0.65);\
            display: flex; align-items: center; justify-content: center;\
            z-index: 2147483646; animation: tipxFadeIn 200ms ease both;\
          }\
          .tipx-modal {\
            position: relative; width: min(90vw, 420px);\
            background: radial-gradient(96% 96% at 48.8% -35.7%, rgb(138, 165, 255) 0%, rgb(0, 0, 0) 100%);\
            border: none;\
            border-radius: 16px; padding: 2px;\
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);\
            color: #ffffff;\
            font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", Arial, "Apple Color Emoji","Segoe UI Emoji",sans-serif;\
            font-weight: 500;\
            animation: tipxSlideUp 220ms ease both;\
          }\
          .tipx-modal-inner {\
            background: radial-gradient(96% 96% at 50% 7.5%, rgb(18, 20, 38) 0%, rgb(0, 0, 0) 100%);\
            border-radius: 16px;\
            padding: 32px;\
          }\
          .tipx-icon-container {\
            position: relative;\
            width: 56px;\
            height: 56px;\
            background: rgb(0, 0, 0);\
            border-radius: 8px;\
            display: flex;\
            align-items: center;\
            justify-content: center;\
            margin-bottom: 20px;\
          }\
          .tipx-icon-container svg {\
            width: 32px;\
            height: 32px;\
            fill: rgb(138, 165, 255);\
          }\
          .tipx-icon-stroke-1 {\
            position: absolute;\
            inset: 0;\
            background: linear-gradient(303deg, rgb(41, 52, 255) 0%, rgba(171, 171, 171, 0) 25%);\
            border-radius: 8px;\
            pointer-events: none;\
          }\
          .tipx-icon-stroke-2 {\
            position: absolute;\
            inset: 0;\
            background: linear-gradient(140deg, rgb(41, 52, 255) -4%, rgba(0, 0, 0, 0) 25%);\
            border-radius: 8px;\
            pointer-events: none;\
          }\
          .tipx-close {\
            position: absolute; top: 12px; right: 14px; width: 36px; height: 36px;\
            display: inline-flex; align-items: center; justify-content: center;\
            background: transparent; border: none; cursor: pointer;\
            color: rgba(255,255,255,0.7); font-size: 22px; line-height: 1;\
            border-radius: 8px; transition: background 120ms ease, transform 120ms ease, color 120ms ease;\
            z-index: 10;\
          }\
          .tipx-close:hover { background: rgba(255,255,255,0.08); color: #ffffff; transform: scale(1.04); }\
          .tipx-title { font-size: 24px; font-weight: 600; margin: 0 32px 12px 0; color: #ffffff; line-height: 28px; }\
          .tipx-desc { font-size: 16px; font-weight: 400; color: rgba(255,255,255,0.7); margin: 0 0 20px 0; line-height: 1.6; }\
          .tipx-input {\
            width: 100%; padding: 14px 18px; font-size: 15px; font-weight: 400;\
            background: rgba(255,255,255,0.06); color: #ffffff;\
            border: 1px solid rgba(138, 165, 255, 0.15); outline: none; border-radius: 12px; box-sizing: border-box;\
            transition: background 120ms ease, border-color 120ms ease;\
          }\
          .tipx-input:focus { background: rgba(255,255,255,0.08); border-color: rgba(138, 165, 255, 0.3); }\
          .tipx-input::placeholder { color: rgba(255,255,255,0.35); }\
          .tipx-row { display: flex; flex-direction: column; gap: 12px; margin-top: 12px; }\
          .tipx-button {\
            width: 100%; padding: 14px 24px; font-size: 15px; font-weight: 600;\
            background: linear-gradient(135deg, rgb(41, 52, 255) 0%, rgb(79, 88, 255) 100%); color: #ffffff; border: none; border-radius: 12px; cursor: pointer;\
            transition: filter 120ms ease, transform 120ms ease, box-shadow 120ms ease;\
            box-shadow: 0 4px 12px rgba(41, 52, 255, 0.3);\
          }\
          .tipx-button:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 6px 16px rgba(41, 52, 255, 0.4); }\
          .tipx-error { \
            max-height: 0; overflow: hidden; opacity: 0;\
            font-size: 14px; font-weight: 500; color: #ef4444; \
            transition: max-height 300ms ease, opacity 250ms ease, margin 300ms ease;\
          }\
          .tipx-error.tipx-error-visible { max-height: 60px; opacity: 1; margin-bottom: 8px; }\
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
  
      var innerContainer = document.createElement('div');
      innerContainer.className = 'tipx-modal-inner';
  
      var closeBtn = document.createElement('button');
      closeBtn.className = 'tipx-close';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.innerHTML = '×';
  
      var iconContainer = document.createElement('div');
      iconContainer.className = 'tipx-icon-container';
      iconContainer.innerHTML = '\
        <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 24 24">\
          <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"></path>\
        </svg>\
        <div class="tipx-icon-stroke-1"></div>\
        <div class="tipx-icon-stroke-2"></div>';
  
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
      row.appendChild(error);
      row.appendChild(button);
      form.appendChild(row);
  
      innerContainer.appendChild(iconContainer);
      innerContainer.appendChild(title);
      innerContainer.appendChild(desc);
      innerContainer.appendChild(form);
  
      modal.appendChild(closeBtn);
      modal.appendChild(innerContainer);
  
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
        
        // Check for @ followed by a period
        var hasAt = value.indexOf('@') > 0;
        var atIndex = value.indexOf('@');
        var hasPeriodAfterAt = atIndex > -1 && value.indexOf('.', atIndex) > atIndex;
        
        if (!hasAt || !hasPeriodAfterAt) {
          error.textContent = 'Please enter a valid email.';
          error.className = 'tipx-error tipx-error-visible';
          input.focus();
          return;
        }
        
        // Disable inputs while sending
        input.disabled = true;
        button.disabled = true;
        button.textContent = 'Sending...';
        error.textContent = '';
        error.className = 'tipx-error';
        
        // Send to API
        fetch('https://tipx-stripe-discord-production.up.railway.app/api/email/collect', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-endpoints-key': 'a8a3fae5_86f_42d6_ba26_8e7746178e78'
          },
          body: JSON.stringify({ email: value })
        })
        .then(function(response) {
          if (response.ok) {
            error.style.color = '#10b981';
            error.textContent = 'Thanks! You are now subscribed.';
            error.className = 'tipx-error tipx-error-visible';
            button.textContent = 'Subscribed';
            setTimeout(close, 1500);
          } else {
            throw new Error('Subscription failed');
          }
        })
        .catch(function(err) {
          error.style.color = '#ef4444';
          error.textContent = 'Something went wrong. Please try again.';
          error.className = 'tipx-error tipx-error-visible';
          input.disabled = false;
          button.disabled = false;
          button.textContent = 'Subscribe';
        });
      });
  
      setTimeout(function () { try { input.focus(); } catch (_) {} }, 50);
    }
  
    function checkIPAndSchedule(delayMs) {
      if (cancelled) return;
      
      // Check if IP already exists in database
      fetch('https://tipx-stripe-discord-production.up.railway.app/api/email/ip-exists', {
        method: 'GET',
        headers: { 
          'x-endpoints-key': 'a8a3fae5_86f_42d6_ba26_8e7746178e78'
        }
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // If IP doesn't exist, schedule the popup
        if (!data.exists) {
          scheduleShow(delayMs);
        }
      })
      .catch(function(err) {
        // On error, show popup anyway (fail open)
        console.warn('IP check failed, showing popup anyway:', err);
        scheduleShow(delayMs);
      });
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
        checkIPAndSchedule(typeof ms === 'number' && ms >= 0 ? ms : DEFAULT_DELAY_MS);
      }
    };
  
    // Optional delay override via data-delay on the script tag
    var current = document.currentScript;
    var attrDelay = current && current.getAttribute && current.getAttribute('data-delay');
    var delay = parseInt(attrDelay, 10);
    if (!isFinite(delay) || delay < 0) delay = DEFAULT_DELAY_MS;
  
    checkIPAndSchedule(delay);
  })();
  