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


// ═══════════════════════════════════════════
// DIRECT VISUAL CONTENT HYDRATION (Admin Sync)
// ═══════════════════════════════════════════
(function initDirectVisualHydration() {
  const currentPath = window.location.pathname.replace(/\.html$/, '').replace(/^\//, '') || 'index';
  const pageKey = (currentPath.includes('saiscale') ? 'saiscale' :
                   currentPath.includes('eznest') ? 'eznest' :
                   currentPath.includes('cutprep') ? 'cutprep' :
                   currentPath.includes('costboard') ? 'costboard' :
                   currentPath.includes('pricing') ? 'pricing' :
                   currentPath.includes('guide') ? 'guide' : 'index');

  try {
    const savedHtml = localStorage.getItem('jg_page_body_' + pageKey);
    if (savedHtml && !window.location.search.includes('raw=1')) {
      document.body.innerHTML = savedHtml;
      
      // Re-init mobile nav and FAQ if body was replaced
      setTimeout(() => {
        const toggle = document.querySelector('.nav-toggle');
        const links = document.querySelector('.nav-links');
        if (toggle && links) {
          toggle.addEventListener('click', () => {
            const isOpen = links.classList.toggle('mobile-open');
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          });
        }
        document.querySelectorAll('.faq-item').forEach((item) => {
          const q = item.querySelector('.faq-q');
          if (!q) return;
          q.addEventListener('click', () => {
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach((el) => el !== item && el.classList.remove('open'));
            item.classList.toggle('open', !wasOpen);
          });
        });
      }, 50);
    }
  } catch (e) {
    console.warn('Hydration error:', e);
  }
})();
