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
            padding: 24px;\
          }\
          .tipx-icon-container {\
            position: relative;\
            width: 40px;\
            height: 40px;\
            background: rgb(0, 0, 0);\
            border-radius: 8px;\
            display: flex;\
            align-items: center;\
            justify-content: center;\
            margin-bottom: 12px;\
          }\
          .tipx-icon-container svg {\
            width: 24px;\
            height: 24px;\
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
          .tipx-title { font-size: 20px; font-weight: 600; margin: 0 32px 6px 0; color: #ffffff; line-height: 24px; }\
          .tipx-desc { font-size: 14px; font-weight: 400; color: rgba(255,255,255,0.7); margin: 0 0 12px 0; line-height: 1.4; }\
          .tipx-input {\
            width: 100%; padding: 12px 16px; font-size: 15px; font-weight: 400;\
            background: rgba(255,255,255,0.06); color: #ffffff;\
            border: 1px solid rgba(138, 165, 255, 0.15); outline: none; border-radius: 10px; box-sizing: border-box;\
            transition: background 120ms ease, border-color 120ms ease;\
          }\
          .tipx-input:focus { background: rgba(255,255,255,0.06); border-color: rgba(138, 165, 255, 0.4); }\
          .tipx-input::placeholder { color: rgba(255,255,255,0.35); }\
          .tipx-row { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }\
          .tipx-button {\
            width: 100%; padding: 12px 24px; font-size: 15px; font-weight: 600;\
            background: linear-gradient(135deg, rgb(41, 52, 255) 0%, rgb(79, 88, 255) 100%); color: #ffffff; border: none; border-radius: 10px; cursor: pointer;\
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
          .tipx-form-hide { \
            opacity: 0; transform: translateY(-8px);\
            transition: opacity 300ms ease, transform 300ms ease;\
            pointer-events: none;\
          }\
          .tipx-code-display { \
            background: linear-gradient(135deg, rgba(41, 52, 255, 0.2) 0%, rgba(79, 88, 255, 0.15) 100%);\
            border: 2px dashed rgba(138, 165, 255, 0.4);\
            border-radius: 12px;\
            padding: 0;\
            text-align: center;\
            margin-top: 0;\
            opacity: 0;\
            max-height: 0;\
            overflow: hidden;\
            transform: translateY(12px);\
            transition: opacity 400ms ease 200ms, transform 400ms ease 200ms, max-height 400ms ease 200ms, margin-top 400ms ease 200ms, padding 400ms ease 200ms;\
            cursor: pointer;\
            user-select: none;\
          }\
          .tipx-code-display:hover { \
            background: linear-gradient(135deg, rgba(41, 52, 255, 0.25) 0%, rgba(79, 88, 255, 0.2) 100%);\
            border-color: rgba(138, 165, 255, 0.5);\
          }\
          .tipx-code-display.tipx-code-visible { \
            opacity: 1;\
            transform: translateY(0);\
            max-height: 300px;\
            margin-top: 12px;\
            padding: 24px;\
          }\
          .tipx-code-label { \
            font-size: 14px;\
            color: rgba(255,255,255,0.6);\
            margin: 0 0 8px 0;\
            font-weight: 500;\
          }\
          .tipx-code-value { \
            font-size: 32px;\
            font-weight: 700;\
            color: #ffffff;\
            letter-spacing: 2px;\
            margin: 0;\
            font-family: "Courier New", monospace;\
          }\
          .tipx-code-copy-hint { \
            font-size: 13px;\
            color: rgba(255,255,255,0.5);\
            margin: 12px 0 0 0;\
            font-weight: 400;\
          }\
          .tipx-copied-message { \
            font-size: 14px;\
            color: #10b981;\
            margin: 12px 0 0 0;\
            font-weight: 500;\
            opacity: 0;\
            transition: opacity 200ms ease;\
          }\
          .tipx-copied-message.tipx-show { \
            opacity: 1;\
          }\
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
          <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7""></path>\
        </svg>\
        <div class="tipx-icon-stroke-1"></div>\
        <div class="tipx-icon-stroke-2"></div>';
  
      var title = document.createElement('h2');
      title.className = 'tipx-title';
      title.id = 'tipx-email-title';
      title.textContent = '10% Off, Just Enter Your Email';
  
      var desc = document.createElement('p');
      desc.className = 'tipx-desc';
      desc.textContent = 'Receive a coupon code for your first order when you join our newsletter, no spam ever!';
  
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

      var codeDisplay = document.createElement('div');
      codeDisplay.className = 'tipx-code-display';
      codeDisplay.innerHTML = '\
        <p class="tipx-code-label">Your 10% Off Discount Code</p>\
        <p class="tipx-code-value">TIPX10</p>\
        <p class="tipx-code-copy-hint">Click to copy</p>\
        <p class="tipx-copied-message">✓ Copied to clipboard!</p>';
      
      var copyHint = null;
      var copiedMsg = null;
      
      function copyToClipboard() {
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('TIPX10');
          } else {
            // Fallback for older browsers
            var textArea = document.createElement('textarea');
            textArea.value = 'TIPX10';
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
          }
          
          if (copyHint) copyHint.style.opacity = '0';
          if (copiedMsg) copiedMsg.classList.add('tipx-show');
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      }
      
      codeDisplay.addEventListener('click', copyToClipboard);

      innerContainer.appendChild(iconContainer);
      innerContainer.appendChild(title);
      innerContainer.appendChild(desc);
      innerContainer.appendChild(form);
      innerContainer.appendChild(codeDisplay);
  
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
            // Update title and description
            title.textContent = 'Thank you!';
            desc.textContent = 'Here\'s your exclusive discount code:';
            
            // Hide form with animation
            form.classList.add('tipx-form-hide');
            
            // Show code display after form animates out
            setTimeout(function() {
              form.style.display = 'none';
              codeDisplay.classList.add('tipx-code-visible');
              
              // Get references to hint and message elements
              copyHint = codeDisplay.querySelector('.tipx-code-copy-hint');
              copiedMsg = codeDisplay.querySelector('.tipx-copied-message');
              
              // Automatically copy to clipboard after showing the code
              setTimeout(function() {
                copyToClipboard();
              }, 900);
            }, 300);
            
            // Don't auto-close - let user close manually
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
  