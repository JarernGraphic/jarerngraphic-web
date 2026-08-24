// ECUT / JarernGraphic site — shared interactive animations
document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('mobile-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((el) => el !== item && el.classList.remove('open'));
      item.classList.toggle('open', !wasOpen);
    });
  });

  // Checkout Modal
  const modal = document.getElementById('checkoutModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalProductName');
  const modalPriceText = document.getElementById('modalPriceText');
  const confirmPayBtn = document.getElementById('confirmPayBtn');
  const buyerEmail = document.getElementById('buyerEmail');

  document.querySelectorAll('.open-checkout-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.dataset.product || 'JarernGraphic Tool';
      const price = btn.dataset.price || '1,990';
      if (modalTitle) modalTitle.textContent = `สั่งซื้อ ${product}`;
      if (modalPriceText) modalPriceText.textContent = `ยอดชำระ: ฿${Number(price).toLocaleString()}`;
      if (modal) modal.classList.add('active');
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  if (confirmPayBtn) {
    confirmPayBtn.addEventListener('click', () => {
      const email = buyerEmail ? buyerEmail.value.trim() : '';
      if (!email || !email.includes('@')) {
        alert('กรุณากรอกอีเมลที่ถูกต้องสำหรับรับ License Key ครับ');
        if (buyerEmail) buyerEmail.focus();
        return;
      }
      confirmPayBtn.disabled = true;
      confirmPayBtn.textContent = 'กำลังยืนยันรายการ...';
      setTimeout(() => {
        alert(`สั่งซื้อสำเร็จ! ระบบจำลองการส่ง License Key และไฟล์ติดตั้งไปยัง ${email} เรียบร้อยแล้วครับ`);
        if (modal) modal.classList.remove('active');
        confirmPayBtn.disabled = false;
        confirmPayBtn.textContent = 'แจ้งชำระเงิน / ยืนยันการสั่งซื้อ';
      }, 1200);
    });
  }

  // Staggered Scroll reveal
  const revealTargets = document.querySelectorAll('.product-card, .feature-card, .process-step, .trust-card, .faq-item, .section-head, .reveal');
  revealTargets.forEach((el, index) => {
    el.classList.add('reveal');
    // Stagger grid items
    if (el.classList.contains('product-card') || el.classList.contains('feature-card') || el.classList.contains('process-step') || el.classList.contains('trust-card')) {
      const delayClass = `reveal-delay-${(index % 4) + 1}`;
      el.classList.add(delayClass);
    }
  });

  if ('IntersectionObserver' in window && revealTargets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('in'));
  }

  // 3D Card Tilt & Mouse Tracking Light Effect
  const cards = document.querySelectorAll('.product-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate mouse position relative to center (% between -1 and 1)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7; // Deg tilt X
      const rotateY = ((x - centerX) / centerX) * 7;  // Deg tilt Y

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });

  // --- GSAP Silky Smooth Card Fan Spread Animation ---
  const deck = document.getElementById('cardFanDeck');
  if (deck && typeof gsap !== 'undefined') {
    const isMobile = window.innerWidth <= 640;
    const isTablet = window.innerWidth <= 980 && !isMobile;

    // Config coordinates based on viewport
    const config = {
      card1: { x: isMobile ? -110 : (isTablet ? -200 : -290), y: isMobile ? 10 : (isTablet ? 14 : 16), rot: isMobile ? -10 : -15, scale: isMobile ? 0.75 : 0.94 },
      card2: { x: isMobile ? -36 : (isTablet ? -68 : -100),   y: isMobile ? 0 : (isTablet ? 2 : 2),    rot: isMobile ? -3 : -5,   scale: isMobile ? 0.8 : 0.98 },
      card3: { x: isMobile ? 36 : (isTablet ? 68 : 100),     y: isMobile ? 0 : (isTablet ? 2 : 2),    rot: isMobile ? 3 : 5,     scale: isMobile ? 0.8 : 0.98 },
      card4: { x: isMobile ? 110 : (isTablet ? 200 : 290),   y: isMobile ? 10 : (isTablet ? 14 : 16),  rot: isMobile ? 10 : 15,   scale: isMobile ? 0.75 : 0.94 },
    };

    // Initial state: Stacked tightly below viewport
    gsap.set(deck, { y: 240, rotation: 18, scale: 0.65, opacity: 0 });
    gsap.set('.fan-card', { x: 0, y: 0, rotation: 0, scale: 1 });
    gsap.set('.fan-tag', { scale: 0, opacity: 0 });

    const tl = gsap.timeline({ delay: 0.2 });

    // Stage 1: Float up from bottom to center as a unified tilted stack
    tl.to(deck, {
      y: 0,
      rotation: -5,
      scale: 0.92,
      opacity: 1,
      duration: 1.35,
      ease: 'power3.out'
    })
    // Stage 2: Deck smoothly levels out and cards fan out majestically into wide arc
    .to(deck, {
      rotation: 0,
      scale: 1,
      duration: 1.6,
      ease: 'power2.out'
    }, '-=0.4')
    .to('.card-1', {
      x: config.card1.x,
      y: config.card1.y,
      rotation: config.card1.rot,
      scale: config.card1.scale,
      duration: 1.6,
      ease: 'expo.out'
    }, '<')
    .to('.card-2', {
      x: config.card2.x,
      y: config.card2.y,
      rotation: config.card2.rot,
      scale: config.card2.scale,
      duration: 1.6,
      ease: 'expo.out'
    }, '<0.08')
    .to('.card-3', {
      x: config.card3.x,
      y: config.card3.y,
      rotation: config.card3.rot,
      scale: config.card3.scale,
      duration: 1.6,
      ease: 'expo.out'
    }, '<0.08')
    .to('.card-4', {
      x: config.card4.x,
      y: config.card4.y,
      rotation: config.card4.rot,
      scale: config.card4.scale,
      duration: 1.6,
      ease: 'expo.out'
    }, '<0.08')
    // Stage 3: Pop in tag bubbles with natural spring bounce
    .to('.fan-tag', {
      scale: 1,
      opacity: 1,
      duration: 0.75,
      stagger: 0.14,
      ease: 'back.out(2)'
    }, '-=0.9')
    // Stage 4: Continuous perpetual breathing float loops for cards and tags
    const floatTweens = {};
    tl.add(() => {
      floatTweens['card-1'] = gsap.to('.card-1', { y: config.card1.y - 8, rotation: config.card1.rot + 1.5, duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      floatTweens['card-2'] = gsap.to('.card-2', { y: config.card2.y - 7, rotation: config.card2.rot + 1,   duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.2 });
      floatTweens['card-3'] = gsap.to('.card-3', { y: config.card3.y - 7, rotation: config.card3.rot - 1,   duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.4 });
      floatTweens['card-4'] = gsap.to('.card-4', { y: config.card4.y - 8, rotation: config.card4.rot - 1.5, duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.1 });

      // Perpetual organic float & sway for @Illustrator tag
      floatTweens['tag-left'] = gsap.to('.tag-left', {
        y: '-=10',
        x: '-=4',
        rotation: -4,
        duration: 2.6,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });

      // Perpetual organic float & sway for @CNC & Laser tag
      floatTweens['tag-right'] = gsap.to('.tag-right', {
        y: '-=12',
        x: '+=5',
        rotation: 4,
        duration: 3.0,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 0.35
      });
    });

    // Interactive Hover & Click Micro-interactions for Tag Bubbles
    const fanTags = document.querySelectorAll('.fan-tag');
    fanTags.forEach((tag) => {
      const isLeft = tag.classList.contains('tag-left');
      const tagKey = isLeft ? 'tag-left' : 'tag-right';

      tag.addEventListener('mouseenter', () => {
        if (floatTweens[tagKey]) floatTweens[tagKey].pause();
        gsap.to(tag, {
          scale: 1.15,
          rotation: isLeft ? -7 : 7,
          y: '-=8',
          duration: 0.3,
          ease: 'back.out(2.5)',
          overwrite: 'auto'
        });
      });

      tag.addEventListener('mouseleave', () => {
        gsap.to(tag, {
          scale: 1,
          rotation: 0,
          y: 0,
          x: 0,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => {
            if (floatTweens[tagKey]) floatTweens[tagKey].resume();
          }
        });
      });

      tag.addEventListener('click', () => {
        gsap.timeline()
          .to(tag, { scale: 0.9, duration: 0.08 })
          .to(tag, { scale: 1.22, rotation: isLeft ? -10 : 10, duration: 0.25, ease: 'back.out(3)' })
          .to(tag, { scale: 1.15, rotation: isLeft ? -7 : 7, duration: 0.18 });
      });
    });

    // Rock-solid Hover Micro-interactions (No flicker, stay elevated while hovered)
    const fanCards = document.querySelectorAll('.fan-card');
    fanCards.forEach((card) => {
      const cardKey = card.classList.contains('card-1') ? 'card-1' : (card.classList.contains('card-2') ? 'card-2' : (card.classList.contains('card-3') ? 'card-3' : 'card-4'));
      const target = config[cardKey.replace('-', '')];
      const defaultZ = cardKey === 'card-1' ? 1 : (cardKey === 'card-2' ? 2 : (cardKey === 'card-3' ? 3 : 4));

      card.addEventListener('mouseenter', () => {
        // Pause ambient float tween so it doesn't fight the hover position
        if (floatTweens[cardKey]) {
          floatTweens[cardKey].pause();
        }
        gsap.killTweensOf(card);
        gsap.to(card, {
          y: target.y - 24,
          x: target.x,
          scale: 1.08,
          rotation: 0,
          duration: 0.35,
          ease: 'power2.out',
          zIndex: 50,
          overwrite: 'auto'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.killTweensOf(card);
        gsap.to(card, {
          y: target.y,
          x: target.x,
          scale: target.scale,
          rotation: target.rot,
          duration: 0.45,
          ease: 'power2.out',
          zIndex: defaultZ,
          overwrite: 'auto',
          onComplete: () => {
            if (floatTweens[cardKey]) {
              floatTweens[cardKey].resume();
            }
          }
        });
      });
    });
  }
});



// ═══════════════════════════════════════════
// VISUAL LIVE PAGE EDITOR MODULE (JarernGraphic)
// ═══════════════════════════════════════════
(function initVisualLiveEditor() {
  // Avoid running on admin.html to prevent nested admin toolbars
  const currentPath = window.location.pathname.replace(/\\.html$/, '').replace(/^\\//, '') || 'index';
  if (currentPath.includes('admin')) return;

  const storageKey = 'jg_content_edits_' + (currentPath || 'index');
  let isEditing = false;
  let isPreview = false;

  // 1. Auto-hydrate saved edits on page load
  function applySavedEdits() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const edits = JSON.parse(raw);
      if (Array.isArray(edits)) {
        edits.forEach(item => {
          const els = document.querySelectorAll(item.selector);
          if (els && els[item.index]) {
            els[item.index].innerHTML = item.html;
          }
        });
      }
    } catch (e) {
      console.warn('Could not load saved page edits:', e);
    }
  }

  applySavedEdits();

  // 2. Selectors for text elements that can be visually edited
  const EDITABLE_SELECTORS = [
    'h1', 'h2', 'h3', 'h4', 'h5',
    'p',
    '.promo-line',
    '.hero-copy p',
    '.hero-subcopy p',
    '.app-name',
    '.app-category',
    '.fan-tag',
    '.fan-badge',
    '.chip',
    '.tag',
    '.card-price',
    '.pdp-price',
    '.compat-pill span',
    '.section-eyebrow',
    '.section-head h2',
    '.section-head span',
    '.feature-card h3',
    '.feature-card p',
    '.process-step h4',
    '.process-step p',
    '.trust-card h3',
    '.trust-card p',
    '.faq-q h3',
    '.faq-a p',
    '.pdp-spec-info strong',
    '.pdp-spec-info span',
    '.display-title',
    '.display-sub'
  ].join(', ');

  // 3. Create and show floating toggle button
  function createFloatingTrigger() {
    const btn = document.createElement('button');
    btn.id = 'jgFloatingEditBtn';
    btn.className = 'jg-floating-edit-btn';
    btn.setAttribute('aria-label', 'เปิดโหมดแก้ไขข้อความ');
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
      <span>แก้ไขข้อความหน้าเว็บ</span>
    `;
    btn.addEventListener('click', toggleVisualEditor);
    document.body.appendChild(btn);
  }

  // 4. Toggle Editor
  function toggleVisualEditor() {
    if (isEditing) {
      exitVisualEditor();
    } else {
      startVisualEditor();
    }
  }

  function startVisualEditor() {
    isEditing = true;
    isPreview = false;
    document.body.classList.add('jg-editor-active');
    document.body.classList.remove('jg-editor-preview');

    const floatBtn = document.getElementById('jgFloatingEditBtn');
    if (floatBtn) floatBtn.style.display = 'none';

    // Make target text elements editable
    const targets = document.querySelectorAll(EDITABLE_SELECTORS);
    targets.forEach(el => {
      // Skip anything inside navigation or editor controls
      if (el.closest('.nav') || el.closest('.jg-live-editor-bar') || el.closest('.admin-nav') || el.closest('#checkoutModal')) return;
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'false');
    });

    createEditorBar();
    showToastNotification('เข้าสู่โหมดแก้ไขข้อความสด สามารถคลิกพิมพ์บนหน้าเว็บได้ทันทีครับ');
  }

  function exitVisualEditor() {
    isEditing = false;
    isPreview = false;
    document.body.classList.remove('jg-editor-active', 'jg-editor-preview');

    const targets = document.querySelectorAll('[contenteditable="true"]');
    targets.forEach(el => el.removeAttribute('contenteditable'));

    const bar = document.getElementById('jgLiveEditorBar');
    if (bar) bar.remove();

    const floatBtn = document.getElementById('jgFloatingEditBtn');
    if (floatBtn) floatBtn.style.display = 'inline-flex';
  }

  // 5. Build Top Toolbar
  function createEditorBar() {
    let bar = document.getElementById('jgLiveEditorBar');
    if (bar) bar.remove();

    bar = document.createElement('div');
    bar.id = 'jgLiveEditorBar';
    bar.className = 'jg-live-editor-bar';

    const pageLabel = currentPath === 'index' ? 'หน้าแรก (Home)' : currentPath;

    bar.innerHTML = `
      <div class="jg-editor-badge">
        <span class="jg-editor-pill">Live Editor</span>
        <span>โหมดแก้ไขข้อความสด</span>
        <span class="jg-editor-page-tag">${pageLabel}</span>
      </div>

      <div class="jg-editor-actions">
        <button class="jg-editor-btn jg-editor-btn-primary" id="jgBtnSaveEdits" title="บันทึกข้อความทั้งหมดลงเบราว์เซอร์">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          <span>บันทึกข้อความ</span>
        </button>

        <button class="jg-editor-btn jg-editor-btn-outline" id="jgBtnCopyHtml" title="คัดลอกโค้ด HTML ที่แก้ไขแล้วเพื่อนำไปบันทึกถาวร">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>คัดลอก HTML</span>
        </button>

        <button class="jg-editor-btn jg-editor-btn-outline" id="jgBtnDownloadHtml" title="ดาวน์โหลดไฟล์ .html ที่แก้ไขแล้ว">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>ดาวน์โหลด</span>
        </button>

        <button class="jg-editor-btn jg-editor-btn-outline" id="jgBtnTogglePreview" title="สลับซ่อน/แสดงกรอบไฮไลต์เพื่อดูพรีวิวเสมือนจริง">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span id="jgPreviewText">ดูตัวอย่างจริง</span>
        </button>

        <button class="jg-editor-btn jg-editor-btn-outline" id="jgBtnResetEdits" title="รีเซ็ตข้อความกลับเป็นค่าเริ่มต้นเดิม">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
          <span>รีเซ็ต</span>
        </button>

        <button class="jg-editor-btn jg-editor-btn-danger" id="jgBtnExitEditor" title="ปิดโหมดแก้ไข">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span>ปิด</span>
        </button>
      </div>
    `;

    document.body.prepend(bar);

    // Bind toolbar events
    document.getElementById('jgBtnSaveEdits').addEventListener('click', saveCurrentEdits);
    document.getElementById('jgBtnCopyHtml').addEventListener('click', copyCleanHtml);
    document.getElementById('jgBtnDownloadHtml').addEventListener('click', downloadCleanHtml);
    document.getElementById('jgBtnTogglePreview').addEventListener('click', togglePreviewMode);
    document.getElementById('jgBtnResetEdits').addEventListener('click', resetCurrentEdits);
    document.getElementById('jgBtnExitEditor').addEventListener('click', exitVisualEditor);
  }

  // 6. Save Edits to LocalStorage
  function saveCurrentEdits() {
    const edits = [];
    const targets = document.querySelectorAll(EDITABLE_SELECTORS);
    
    // Group elements by tag/class selector to store efficiently
    targets.forEach(el => {
      if (el.closest('.nav') || el.closest('.jg-live-editor-bar') || el.closest('.admin-nav') || el.closest('#checkoutModal')) return;
      
      // Determine unique selector
      const tag = el.tagName.toLowerCase();
      const cls = el.className ? '.' + el.className.trim().split(/\\s+/)[0] : '';
      const selector = cls ? tag + cls : tag;
      
      const siblings = Array.from(document.querySelectorAll(selector));
      const index = siblings.indexOf(el);

      if (index !== -1) {
        edits.push({
          selector: selector,
          index: index,
          html: el.innerHTML
        });
      }
    });

    try {
      localStorage.setItem(storageKey, JSON.stringify(edits));
      showToastNotification('บันทึกการแก้ไขข้อความหน้าเว็บเรียบร้อยแล้ว!');
    } catch (e) {
      alert('ไม่สามารถบันทึกข้อความได้: ' + e.message);
    }
  }

  // 7. Toggle Preview Mode (Hide outlines)
  function togglePreviewMode() {
    isPreview = !isPreview;
    const txt = document.getElementById('jgPreviewText');
    if (isPreview) {
      document.body.classList.add('jg-editor-preview');
      if (txt) txt.textContent = 'กลับไปแก้ไข';
      showToastNotification('กำลังแสดงพรีวิวผลลัพธ์จริง (ซ่อนกรอบแก้ไข)');
    } else {
      document.body.classList.remove('jg-editor-preview');
      if (txt) txt.textContent = 'ดูตัวอย่างจริง';
    }
  }

  // 8. Generate Clean HTML without Editor UI
  function getCleanHtml() {
    const clone = document.documentElement.cloneNode(true);
    
    // Remove editor bar and floating button from clone
    const editorBar = clone.querySelector('#jgLiveEditorBar');
    if (editorBar) editorBar.remove();
    const floatBtn = clone.querySelector('#jgFloatingEditBtn');
    if (floatBtn) floatBtn.remove();
    const toast = clone.querySelector('#jgEditorToast');
    if (toast) toast.remove();

    // Remove contenteditable attributes
    clone.querySelectorAll('[contenteditable]').forEach(el => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('spellcheck');
    });

    // Remove jg-editor classes from body
    const body = clone.querySelector('body');
    if (body) {
      body.classList.remove('jg-editor-active', 'jg-editor-preview');
    }

    return '<!DOCTYPE html>\n' + clone.outerHTML;
  }

  // 9. Copy Clean HTML to Clipboard
  function copyCleanHtml() {
    const html = getCleanHtml();
    navigator.clipboard.writeText(html).then(() => {
      showToastNotification('คัดลอกโค้ด HTML ที่แก้ไขแล้วเรียบร้อย! สามารถนำไปบันทึกลงไฟล์ได้ทันทีครับ');
    }).catch(err => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = html;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToastNotification('คัดลอกโค้ด HTML เรียบร้อยแล้ว!');
    });
  }

  // 10. Download Clean HTML File
  function downloadCleanHtml() {
    const html = getCleanHtml();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const filename = (currentPath === 'index' ? 'index' : currentPath) + '.html';
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    showToastNotification('ดาวน์โหลดไฟล์ ' + filename + ' เรียบร้อยแล้ว!');
  }

  // 11. Reset Edits to original defaults
  function resetCurrentEdits() {
    if (confirm('ต้องการรีเซ็ตข้อความทั้งหมดของหน้านี้กลับเป็นค่าเริ่มต้นเดิมหรือไม่?')) {
      localStorage.removeItem(storageKey);
      window.location.reload();
    }
  }

  // 12. Toast Notification
  function showToastNotification(msg) {
    let t = document.getElementById('jgEditorToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'jgEditorToast';
      t.className = 'toast-msg';
      document.body.appendChild(t);
    }
    t.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${msg}</span>
    `;
    t.className = 'toast-msg show';
    setTimeout(() => { t.className = 'toast-msg'; }, 3200);
  }

  // Keyboard shortcut Ctrl+Shift+E or Cmd+Shift+E
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      toggleVisualEditor();
    }
  });

  // Auto-launch if URL has ?edit=1
  window.addEventListener('DOMContentLoaded', () => {
    createFloatingTrigger();
    const params = new URLSearchParams(window.location.search);
    if (params.get('edit') === '1') {
      startVisualEditor();
    }
  });
})();
