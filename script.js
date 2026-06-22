/* ============================================================
   EXPANDUS BUSINESS COACHING — script.js
   All interactive behavior: menu, journey, approach, carousel
   ============================================================ */

(function() {
'use strict';

/* ─── Scroll reveal ─── */
function initReveal() {
  const els = [...document.querySelectorAll('[data-reveal]')];
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  els.forEach(el => io.observe(el));
  // Fallback
  setTimeout(() => els.forEach(el => el.classList.add('in')), 2000);
}

/* ─── Mobile menu ─── */
function initMobileMenu() {
  const btn     = document.getElementById('exp-mob-btn');
  const panel   = document.getElementById('exp-mob-panel');
  const overlay = document.getElementById('exp-mob-overlay');
  const close   = document.getElementById('exp-mob-close');
  if (!btn || !panel) return;

  const open  = () => { panel.classList.add('open'); overlay && overlay.classList.add('open'); document.body.style.overflow = 'hidden'; btn.setAttribute('aria-expanded','true'); };
  const closeMenu = () => { panel.classList.remove('open'); overlay && overlay.classList.remove('open'); document.body.style.overflow = ''; btn.setAttribute('aria-expanded','false'); };

  btn.addEventListener('click', open);
  if (close)   close.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

/* ─── Journey interactive track ─── */
const STAGES = [
  { num: 1, role: 'The Origin',     tag: 'Survival',              investible: false,
    descriptor: 'The founder is the business.',
    desc: 'You are the business. Every customer interaction, every delivery, every decision passes through you. Your energy is the only engine — if you stop, the business stops.',
    signals: ['You handle everything yourself', 'No team, or a team that exists only to assist you directly', 'Decisions cannot be made without you', 'Revenue is entirely tied to your personal output'] },
  { num: 2, role: 'The Manager',    tag: 'Controlled Chaos',      investible: false,
    descriptor: "The founder is at the centre of a team that's starting to form.",
    desc: "You're still doing the work, but have started hiring. Every conversation, every approval, every escalation still comes back to you. You secretly wish you hadn't hired people.",
    signals: ['Team members regularly wait for your input before acting', 'Your inbox and calendar are permanently overwhelmed', 'Decisions stall when you are unavailable', 'You feel like you are managing people rather than leading'] },
  { num: 3, role: 'The Strain',     tag: 'Founder Bottleneck',    investible: false,
    descriptor: 'Growth is here, but everything still runs through you.',
    desc: 'Your business is growing and money is coming in, but it does not feel like it. You are working harder than ever but feel stuck. The business has been built to depend on you for everything.',
    signals: ['You know you need to let go, but struggle to', 'Some decisions are delegated, but accountability is inconsistent', 'You feel the tension between control and growth', 'Revenue growth has plateaued'] },
  { num: 4, role: 'The Graduation', tag: 'Organisational Scale',  investible: false,
    descriptor: 'You orchestrate; you no longer run every function yourself.',
    desc: 'Leaders exist within your team. Decisions happen without you in the room. Your role shifts to strategy, alignment, and coaching your leaders — not managing daily operations.',
    signals: ['Leaders are beginning to make decisions independently', 'The business continues to function well when you are away', 'Your energy goes into direction, not delivery', 'Revenue and team are growing steadily'] },
  { num: 5, role: 'The Architect',  tag: 'Enterprise Evolution',  investible: true,
    descriptor: 'You design the system instead of running it.',
    desc: "You've moved from being inside the machine to building the machine. The organisation runs on its own logic, not on your presence. Investors or potential acquirers would see a business, not a person.",
    signals: ['The business has documented systems and clear accountability', 'Culture and performance standards exist independently of you', 'You spend most time on strategy and capability-building', 'The business is fundable and attractive to investors'] },
  { num: 6, role: 'The Chairman',   tag: 'Legacy & Impact',       investible: true,
    descriptor: 'You step back into a board-level role.',
    desc: 'You operate like an investor or board member within your own company. The business is no longer founder-dependent — it is investible, scalable, and self-sustaining.',
    signals: ['The business runs and grows without your daily involvement', 'A leadership team manages operations, culture, and performance', 'The company value is independent of any single person', 'You are free to focus on highest-level strategy'] },
];

// Cluster SVG patterns for each stage
function clusterSVG(idx) {
  const coords = [
    [],
    [[40,46],[80,46],[60,86]],
    [[34,42],[86,42],[30,76],[90,76],[60,94]],
    [[32,42],[88,40],[28,74],[92,72],[46,94],[78,94]],
    [[34,46],[58,42],[30,72],[54,70],[80,70],[44,94],[72,94]],
    [[30,48],[52,46],[74,48],[28,72],[50,70],[72,72],[40,94],[64,94]],
  ];
  const rdPositions = [[60,60],[60,58],[58,56],[64,48],[90,34],[98,26]];
  const pts = coords[idx] || [];
  const rd = rdPositions[idx] || [60,60];
  let circles = pts.map((p,i) =>
    `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="rgba(185,169,214,0.85)" key="${i}"/>`).join('');
  const spokes = pts.map((p,i) =>
    `<line x1="${rd[0]}" y1="${rd[1]}" x2="${p[0]}" y2="${p[1]}" stroke="rgba(100,54,149,0.4)" stroke-width="1.4"/>`).join('');
  return `<svg viewBox="0 0 120 120" style="width:140px;height:140px;display:block">
    ${spokes}
    ${circles}
    <circle cx="${rd[0]}" cy="${rd[1]}" r="13" fill="#F04F53"/>
    <circle cx="${rd[0]}" cy="${rd[1]}" r="13" fill="none" stroke="#F04F53" stroke-width="2.5" opacity="0.4">
      <animate attributeName="r" values="13;22;13" dur="2.6s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.4;0;0.4" dur="2.6s" repeatCount="indefinite"/>
    </circle>
  </svg>`;
}

function fmt2(n) { return String(n).padStart(2,'0'); }

/* ─── Red Dot Journey: scroll-stacking cards ─── */
function initRedDotStack() {
  const outer  = document.getElementById('rdj-scroll-outer');
  const sticky = document.getElementById('rdj-cards-sticky');
  if (!outer || !sticky) return;

  const N = STAGES.length; // 6

  // Render all cards (both static + animated modes use the same markup)
  STAGES.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'rdj-stage-card';
    card.innerHTML = `
      <div class="rdj-card-peek">
        <span class="rdj-card-peek-num">${fmt2(i + 1)}</span>
        <span class="rdj-card-peek-name">${s.role}</span>
        <div class="rdj-card-peek-badges">
          <span class="rdj-card-peek-badge${s.investible ? ' investible' : ''}">${s.tag.toUpperCase()}</span>
          <span class="rdj-card-peek-zone${s.investible ? ' investible' : ''}">${s.investible ? 'INVESTIBLE BUSINESS' : 'NON INVESTIBLE BUSINESS'}</span>
        </div>
      </div>
      <div class="rdj-card-body">
        <div class="rdj-card-content-col">
          <p class="rdj-card-descriptor">${s.descriptor}</p>
          <p class="rdj-card-desc">${s.desc}</p>
          <ul class="rdj-card-signals">
            ${s.signals.map(sig => `<li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#643695" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px"><polyline points="20 6 9 17 4 12"/></svg>
              <span>${sig}</span>
            </li>`).join('')}
          </ul>
          <a href="#whatwedo" class="rdj-card-link">Read More
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>
          </a>
        </div>
        <div class="rdj-card-visual-col">
          ${clusterSVG(i)}
        </div>
      </div>`;
    sticky.appendChild(card);
  });

  // Mobile / reduced-motion: plain stacked column, no JS animation needed
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.innerWidth <= 760 || reduced) return;

  outer.classList.add('rdj--animated');
  const cards = [...sticky.querySelectorAll('.rdj-stage-card')];

  // Deck-of-cards stack: behind cards peek above active, next card enters from below
  const PEEK_BEHIND = 28;    // px each behind card's visible top strip (narrow edge, not a full row)
  const MAX_BEHIND  = 3;     // max simultaneously visible behind cards
  const SCALE_STEP  = 0.04;  // scale shrink per depth level (more pronounced depth)
  const HEADER_TOP  = 88;    // px sticky top offset (clears the site header)

  const SCROLL_PER  = 700;  // px of scroll per stage transition

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const lerp  = (a, b, t)   => a + (b - a) * t;

  // Later-indexed cards have higher z-index — incoming card slides OVER the current active
  cards.forEach((c, i) => { c.style.zIndex = i + 1; });

  let cardH   = 0;
  let stickyH = 0;

  function buildLayout() {
    cardH   = cards[0].offsetHeight;
    stickyH = window.innerHeight - HEADER_TOP;
    sticky.style.height = stickyH + 'px';
    outer.style.height  = (SCROLL_PER * (N - 1) + stickyH) + 'px';
  }

  function update() {
    const outerTop  = outer.getBoundingClientRect().top;
    const scrolled  = clamp(-outerTop + HEADER_TOP, 0, SCROLL_PER * (N - 1));
    const activeRaw = scrolled / SCROLL_PER;

    const behindCount = Math.min(activeRaw, MAX_BEHIND);
    const baseY = behindCount * PEEK_BEHIND;

    cards.forEach((card, i) => {
      const d = activeRaw - i; // d=0: active; d>0: behind (above); d<0: upcoming (below)

      let y, scale;

      if (d >= MAX_BEHIND) {
        // Pinned at the deepest visible position (top of the stack)
        y     = baseY - MAX_BEHIND * PEEK_BEHIND;
        scale = 1 - MAX_BEHIND * SCALE_STEP;
      } else if (d >= 0) {
        // Active card (d=0) or stacking behind it (0 < d ≤ MAX_BEHIND)
        y     = baseY - d * PEEK_BEHIND;
        scale = 1 - d * SCALE_STEP;
      } else if (d > -1) {
        // Incoming: slides up from below into the active position
        y     = lerp(stickyH, baseY, d + 1);
        scale = 1;
      } else {
        // Not yet in play — parked below sticky, hidden by overflow:hidden
        y     = stickyH;
        scale = 1;
      }

      card.style.transform = `translateY(${y.toFixed(1)}px) scale(${scale.toFixed(4)})`;
    });
  }

  buildLayout();
  window.addEventListener('scroll', update, { passive: true });
  update();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth <= 760) {
        outer.classList.remove('rdj--animated');
        outer.style.height  = '';
        sticky.style.height = '';
        return;
      }
      outer.classList.add('rdj--animated');
      buildLayout();
      update();
    }, 200);
  });
}


/* ─── Approach sticky scroll counter ─── */
function initApproach() {
  const CIRC = 2 * Math.PI * 98; // r=98
  const NAMES = ['Diagnose','Design','Develop','Deploy'];
  const ring   = document.getElementById('ap-ring');
  const bignum = document.getElementById('ap-bignum');
  const nameel = document.getElementById('ap-name');

  function update() {
    const cards = document.querySelectorAll('.ap-cs');
    if (!cards.length) return;
    let active = 0;
    cards.forEach((c, i) => { if (c.getBoundingClientRect().top <= 100) active = i; });
    if (ring) ring.setAttribute('stroke-dashoffset', (CIRC * (1 - (active+1)/4)).toFixed(2));
    if (bignum) bignum.innerHTML = String(active+1).padStart(2,'0') + '<span style="font-size:28px;color:rgba(255,255,255,0.32);font-weight:normal">/04</span>';
    if (nameel) nameel.textContent = NAMES[active] || '';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();

  // Accordion (mobile)
  const acc = document.getElementById('ap-acc');
  if (acc) {
    acc.addEventListener('click', e => {
      const head = e.target.closest('.ap-acc-head');
      if (!head) return;
      const item = head.closest('.ap-acc-item');
      if (!item) return;
      const wasOpen = item.classList.contains('open');
      acc.querySelectorAll('.ap-acc-item').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.ap-acc-head').setAttribute('aria-expanded','false');
      });
      if (!wasOpen) { item.classList.add('open'); head.setAttribute('aria-expanded','true'); }
    });
  }
}

/* ─── Build carousel ─── */
function initCarousel() {
  const track = document.getElementById('build-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  if (!track) return;

  function scrollByCards(dir) {
    track.scrollBy({ left: dir * track.clientWidth, behavior: 'smooth' });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => scrollByCards(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollByCards(1));

  // Auto-scroll
  let timer = setInterval(() => {
    const { scrollLeft, scrollWidth, clientWidth } = track;
    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      scrollByCards(1);
    }
  }, 3200);

  track.addEventListener('mouseenter', () => clearInterval(timer));
  track.addEventListener('mouseleave', () => {
    timer = setInterval(() => scrollByCards(1), 3200);
  });
  track.addEventListener('touchstart', () => clearInterval(timer), { passive: true });
}

/* ─── Smooth nav scroll ─── */
function initNavScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
      }
    });
  });
}

/* ─── Video modal ─── */
function initVideoModal() {
  const trigger = document.getElementById('video-play-trigger');
  if (!trigger) return;
  trigger.addEventListener('click', () => {
    // Placeholder: alert or open a video URL
    alert('Connect your video URL here. Swap this alert with a lightbox or YouTube embed.');
  });
}

/* ─── Init all ─── */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initMobileMenu();
  initRedDotStack();
  initApproach();
  initCarousel();
  initNavScroll();
  initVideoModal();
});

})();
