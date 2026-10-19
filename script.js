/**
 * VEXORA TECHNOLOGIES - EXACT REFERENCE JAVASCRIPT
 * Replicating https://www.vexoratech.in/ interactive effects and animations
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Custom Mouse Cursor (Desktop Only - Completely removed on Mobile/Touch) ---
  const cursorOuter = document.querySelector('.cursor-outer');
  const cursorInner = document.querySelector('.cursor-inner');

  const isDesktopPointer = window.innerWidth > 991 && !window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  if (cursorOuter && cursorInner && isDesktopPointer) {
    let mouseX = -100, mouseY = -100;
    let outerX = -100, outerY = -100;
    let isCursorActive = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isCursorActive) {
        isCursorActive = true;
        outerX = mouseX;
        outerY = mouseY;
        cursorOuter.style.opacity = '1';
        cursorInner.style.opacity = '1';
      }

      // Inner dot moves instantly
      cursorInner.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      // Dynamically detect if cursor is over a dark/black element or section
      const darkContainer = e.target && e.target.closest ? e.target.closest(
        '.banner-area, .subpage-hero, .secondary-bg, .testimonial-area, .footer-area, .header-area, .header-top, .sidebar-area, .counter__wrp, .modal-backdrop, .talk-us__item'
      ) : null;

      if (darkContainer) {
        cursorOuter.classList.add('cursor-on-dark');
        cursorInner.classList.add('cursor-on-dark');
      } else {
        cursorOuter.classList.remove('cursor-on-dark');
        cursorInner.classList.remove('cursor-on-dark');
      }
    }, { passive: true });

    // Smooth lerp animation for outer ring
    function renderCursor() {
      outerX += (mouseX - outerX) * 0.2;
      outerY += (mouseY - outerY) * 0.2;
      cursorOuter.style.transform = `translate3d(${outerX}px, ${outerY}px, 0)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Expand on hover using event delegation (handles present and future dynamic elements)
    const hoverSelector = 'a, button, input, select, textarea, .project-card, .service__item, .offer__item, .team-card, .counter__item, .filter-tab-btn, .modal-close-btn, .arry-prev, .arry-next, .banner-tab-dot, .banner-arrow-btn';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverSelector)) {
        cursorOuter.classList.add('cursor-hover');
        cursorInner.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverSelector)) {
        cursorOuter.classList.remove('cursor-hover');
        cursorInner.classList.remove('cursor-hover');
      }
    });

    // Hide custom cursor when leaving window
    document.documentElement.addEventListener('mouseleave', () => {
      cursorOuter.style.opacity = '0';
      cursorInner.style.opacity = '0';
    });
    document.documentElement.addEventListener('mouseenter', () => {
      cursorOuter.style.opacity = '';
      cursorInner.style.opacity = '';
    });
  } else if (cursorOuter && cursorInner) {
    // Completely remove custom cursor on mobile / touch viewports
    cursorOuter.remove();
    cursorInner.remove();
  }

  // --- 2. Fixed Header On Scroll ---
  const headerArea = document.querySelector('.header-area');
  const scrollThreshold = 180;

  function handleScrollHeader() {
    if (!headerArea) return;
    if (window.scrollY > scrollThreshold) {
      headerArea.classList.add('menu-fixed');
    } else {
      headerArea.classList.remove('menu-fixed');
    }
  }
  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader();

  // --- 3. Mobile Menu / Sidebar Drawer ---
  const openButton = document.getElementById('openButton');
  const closeButton = document.getElementById('closeButton');
  const sidebarArea = document.getElementById('targetElement');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');

  function openSidebar() {
    if (sidebarArea) sidebarArea.classList.add('open');
    if (sidebarOverlay) sidebarOverlay.classList.add('open');
    if (openButton) openButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (sidebarArea) sidebarArea.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('open');
    if (openButton) openButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (openButton) openButton.addEventListener('click', openSidebar);
  if (closeButton) closeButton.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  // Close sidebar drawer when clicking any nav link or quote button inside drawer
  document.querySelectorAll('.sidebar-menu a, .sidebar-area .open-quote-modal').forEach(link => {
    link.addEventListener('click', () => {
      closeSidebar();
    });
  });

  // --- 4. Back To Top Circular Progress Indicator ---
  const scrollUp = document.querySelector('.scroll-up');
  const progressPath = document.querySelector('.scroll-circle path');

  if (progressPath) {
    const pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

    function updateProgress() {
      const scroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = pathLength - (scroll * pathLength / height);
      progressPath.style.strokeDashoffset = progress;

      if (scroll > 300) {
        if (scrollUp) scrollUp.classList.add('show');
      } else {
        if (scrollUp) scrollUp.classList.remove('show');
      }
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  if (scrollUp) {
    scrollUp.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 5. Number Counter Animation ---
  const countElements = document.querySelectorAll('.count');
  if (countElements.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target') || el.innerText, 10);
          if (isNaN(target)) return;

          let current = 0;
          const duration = 1600;
          const stepTime = Math.max(Math.floor(duration / target), 20);

          const timer = setInterval(() => {
            current += Math.ceil(target / (duration / stepTime));
            if (current >= target) {
              el.innerText = target;
              clearInterval(timer);
            } else {
              el.innerText = current;
            }
          }, stepTime);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    countElements.forEach(el => counterObserver.observe(el));
  }

  // --- 6. Hero Banner Carousel & Slides Switcher ---
  const bannerSlides = [
    {
      eyebrow: "INNOVATION & DIGITAL TRANSFORMATION",
      title: 'Empowering Innovation Leaders With <span class="gradient-text">Next-Gen IT Solutions</span>',
      desc: "We engineer cutting-edge web platforms, scalable cloud architectures, and bespoke software solutions designed to accelerate growth and outperform competition."
    },
    {
      eyebrow: "MODERN DIGITAL WORKSPACE & SYSTEMS",
      title: 'High-Performance Systems <span class="gradient-text">Engineered For Growth</span>',
      desc: "From bespoke enterprise platforms and sleek business applications to reliable cloud integrations, we deliver secure, scalable, and conversion-focused technology."
    }
  ];

  const bannerTitleEl = document.getElementById('banner-title-text');
  const bannerEyebrowEl = document.getElementById('banner-eyebrow-text');
  const bannerDescEl = document.getElementById('banner-desc-text');
  const bannerDots = document.querySelectorAll('.banner-tab-dot');
  const bannerBgSlides = document.querySelectorAll('.banner-carousel-slide');
  const bannerPrevBtn = document.getElementById('banner-prev-btn');
  const bannerNextBtn = document.getElementById('banner-next-btn');

  let currentSlideIndex = 0;
  let slideInterval = null;

  function setBannerSlide(index) {
    if (!bannerTitleEl || !bannerSlides[index]) return;
    currentSlideIndex = index;

    // Switch background carousel slides
    if (bannerBgSlides.length > 0) {
      bannerBgSlides.forEach((slide, sIdx) => {
        slide.classList.toggle('active', sIdx === index);
      });
    }

    // Fade out text slightly
    bannerTitleEl.style.opacity = '0';
    if (bannerEyebrowEl) bannerEyebrowEl.style.opacity = '0';
    if (bannerDescEl) bannerDescEl.style.opacity = '0';

    setTimeout(() => {
      bannerTitleEl.innerHTML = bannerSlides[index].title;
      if (bannerEyebrowEl) {
        const svgBadge = `<svg width="34" height="14" viewBox="0 0 40 16" fill="none"><rect x="0.5" y="0.5" width="25.6" height="15" rx="7.5" stroke="#3c72fc" stroke-width="1.5"/><rect x="13.3" y="0" width="26.6" height="16" rx="8" fill="#3c72fc" /></svg>`;
        bannerEyebrowEl.innerHTML = `${svgBadge} ${bannerSlides[index].eyebrow}`;
      }
      if (bannerDescEl) bannerDescEl.innerText = bannerSlides[index].desc;

      bannerTitleEl.style.transition = 'opacity 0.4s ease';
      bannerTitleEl.style.opacity = '1';
      if (bannerEyebrowEl) {
        bannerEyebrowEl.style.transition = 'opacity 0.4s ease';
        bannerEyebrowEl.style.opacity = '1';
      }
      if (bannerDescEl) {
        bannerDescEl.style.transition = 'opacity 0.4s ease';
        bannerDescEl.style.opacity = '1';
      }

      bannerDots.forEach((dot, dIdx) => {
        dot.classList.toggle('active', dIdx === index);
      });
    }, 200);
  }

  function resetSlideAutoplay() {
    clearInterval(slideInterval);
    startSlideAutoplay();
  }

  function startSlideAutoplay() {
    slideInterval = setInterval(() => {
      const nextIndex = (currentSlideIndex + 1) % bannerSlides.length;
      setBannerSlide(nextIndex);
    }, 6500);
  }

  if (bannerDots.length > 0) {
    bannerDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        setBannerSlide(idx);
        resetSlideAutoplay();
      });
    });

    if (bannerPrevBtn) {
      bannerPrevBtn.addEventListener('click', () => {
        const prevIdx = (currentSlideIndex - 1 + bannerSlides.length) % bannerSlides.length;
        setBannerSlide(prevIdx);
        resetSlideAutoplay();
      });
    }

    if (bannerNextBtn) {
      bannerNextBtn.addEventListener('click', () => {
        const nextIdx = (currentSlideIndex + 1) % bannerSlides.length;
        setBannerSlide(nextIdx);
        resetSlideAutoplay();
      });
    }

    startSlideAutoplay();
  }

  // --- 7. Testimonials Slider Controller ---
  const testimonials = [
    {
      name: "Santosh Kumar",
      role: "Founder, Santosh Lifestyle",
      quote: "EvoTech completely elevated our retail brand online. The custom installment scheme app built on Next.js and Razorpay processed over 10,000 orders without a hiccup. Their attention to design detail is unmatched.",
      stars: 5
    },
    {
      name: "David Henderson",
      role: "General Manager, Serene Hills Resort",
      quote: "Before EvoTech, we paid 20%+ in commissions to third-party travel platforms. The direct booking engine they built saved us thousands every month and increased direct bookings by 85%. Flawless execution.",
      stars: 5
    },
    {
      name: "Rahul Shenoy",
      role: "Managing Partner, SpiceWood Restaurant",
      quote: "Our local Google ranking skyrocketed to #1 within weeks of launch. The online reservation flow is so easy our weekend tables are constantly fully booked. Incredible ROI from day one.",
      stars: 5
    },
    {
      name: "Rajesh Verma",
      role: "VP of Infrastructure, Arshith Group",
      quote: "The corporate portal developed by EvoTech has set a new benchmark for commercial real estate in our region. Investors and clients constantly compliment the speed, typography, and polish.",
      stars: 5
    },
    {
      name: "Ananya Roy",
      role: "Founder, Bloom Naturals",
      quote: "Their digital marketing and SEO strategies increased our organic leads by over 150% in just 3 months. EvoTech is the most reliable digital agency we have worked with.",
      stars: 5
    }
  ];

  let currentTestimonialIdx = 0;
  const testiNameEl = document.getElementById('testi-client-name');
  const testiRoleEl = document.getElementById('testi-client-role');
  const testiQuoteEl = document.getElementById('testi-quote');
  const prevTestiBtn = document.querySelector('.arry-prev');
  const nextTestiBtn = document.querySelector('.arry-next');

  function renderTestimonial(idx) {
    if (!testiNameEl || !testiQuoteEl) return;
    const item = testimonials[idx];
    testiQuoteEl.style.opacity = '0';

    setTimeout(() => {
      testiNameEl.innerText = item.name;
      if (testiRoleEl) testiRoleEl.innerText = item.role;
      testiQuoteEl.innerText = `“${item.quote}”`;
      testiQuoteEl.style.transition = 'opacity 0.3s ease';
      testiQuoteEl.style.opacity = '1';
    }, 150);
  }

  if (prevTestiBtn && nextTestiBtn) {
    prevTestiBtn.addEventListener('click', () => {
      currentTestimonialIdx = (currentTestimonialIdx - 1 + testimonials.length) % testimonials.length;
      renderTestimonial(currentTestimonialIdx);
    });
    nextTestiBtn.addEventListener('click', () => {
      currentTestimonialIdx = (currentTestimonialIdx + 1) % testimonials.length;
      renderTestimonial(currentTestimonialIdx);
    });
  }

  // --- 8. Project Database & Modal Lightbox ---
  const projectDatabase = {
    santosh: {
      title: "Santosh Lifestyle",
      subtitle: "E-commerce & Scheme App",
      category: "Full Stack Web & Mobile Solution",
      image: "assets/images/project-santosh.jpg",
      tags: ["Next.js", "Razorpay", "Vercel", "Tailwind CSS", "Node.js"],
      summary: "Santosh Lifestyle is a luxury apparel and jewelry retail destination. EvoTech designed and engineered a full-scale e-commerce portal coupled with a specialized monthly installment scheme app, allowing thousands of shoppers to purchase collections with automated payment plans.",
      highlights: [
        "Seamless Razorpay gateway integration for cards, UPI, and EMI schemes",
        "Sub-second page transitions powered by Next.js Server Side Rendering",
        "Automated customer ledger and recurring payment reminders",
        "Mobile-first responsive UX with 99.8% checkout conversion rate"
      ],
      metrics: {
        traffic: "+140% Monthly Traffic",
        speed: "0.8s Load Time",
        rating: "4.9/5 App Store"
      }
    },
    serene: {
      title: "Serene Hills Resort",
      subtitle: "Resort Website + Booking Engine",
      category: "Hospitality & Real-Time Booking Engine",
      image: "assets/images/project-serene.jpg",
      tags: ["Next.js", "Firebase", "PMS", "Google Maps API", "Stripe"],
      summary: "Serene Hills is an exclusive eco-luxury resort nestled in tropical forest hills. EvoTech engineered a breathtaking digital showcase accompanied by a custom direct-booking engine, eliminating third-party OTA commission fees.",
      highlights: [
        "Real-time villa availability calendar synced directly to resort PMS",
        "Immersive media galleries with virtual villa showcases",
        "Multi-currency dynamic pricing engine with promotional vouchers",
        "Full SEO optimization ranking #1 for regional luxury eco-stays"
      ],
      metrics: {
        bookings: "+85% Direct Bookings",
        savings: "Zero OTA Commission",
        engagement: "4m 20s Avg. Session"
      }
    },
    spicewood: {
      title: "SpiceWood Restaurant",
      subtitle: "Business Website + Google Maps",
      category: "Restaurant & Gastronomy Experience",
      image: "assets/images/project-spicewood.jpg",
      tags: ["React", "SEO", "Domain", "Google Business Profile", "Cloudflare"],
      summary: "SpiceWood is a celebrated fine-dining culinary haven. EvoTech built a dark, atmospheric website featuring interactive culinary menus, an instant table reservation widget, and local Google Maps optimization.",
      highlights: [
        "Interactive digital menu with dish dietary filters and high-res imagery",
        "Automated instant email and SMS reservation confirmation system",
        "Google Maps Business Profile synchronization driving physical footfall",
        "100/100 Google Lighthouse performance score on mobile"
      ],
      metrics: {
        footfall: "+60% Weekend Reservations",
        localRank: "#1 Google Maps Top 3",
        pageSpeed: "100/100 Lighthouse"
      }
    },
    arshith: {
      title: "Arshith Group",
      subtitle: "Company Website",
      category: "Corporate Enterprise Real Estate & Infrastructure",
      image: "assets/images/project-arshith.jpg",
      tags: ["Next.js", "Tailwind CSS", "Vercel", "CMS", "TypeScript"],
      summary: "Arshith Group is an infrastructure and commercial real estate development conglomerate. EvoTech created a modern corporate website showcasing signature commercial developments, investor reports, and career portals.",
      highlights: [
        "Interactive architectural project portfolio categorized by sector",
        "Downloadable financial reports and annual corporate brochures",
        "Lead capture funnel connecting high-net-worth investors directly to executives",
        "Fully custom responsive typography and brand design system"
      ],
      metrics: {
        investors: "250+ High Value Leads",
        uptime: "99.99% Enterprise Uptime",
        globalReach: "15+ Countries"
      }
    }
  };

  const projectModal = document.getElementById('project-modal');
  const projectModalContent = document.getElementById('project-modal-content');
  const quoteModal = document.getElementById('quote-modal');
  const toastNotify = document.getElementById('toast-notify');

  function showToast(message, duration = 3200) {
    if (!toastNotify) return;
    toastNotify.textContent = message;
    toastNotify.classList.add('show');
    setTimeout(() => {
      toastNotify.classList.remove('show');
    }, duration);
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Quote modal openers
  document.querySelectorAll('.open-quote-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(quoteModal);
    });
  });

  const closeQuoteBtn = document.getElementById('close-quote-modal');
  if (closeQuoteBtn) closeQuoteBtn.addEventListener('click', () => closeModal(quoteModal));

  const closeProjectBtn = document.getElementById('close-project-modal');
  if (closeProjectBtn) closeProjectBtn.addEventListener('click', () => closeModal(projectModal));

  window.addEventListener('click', (e) => {
    if (e.target === quoteModal) closeModal(quoteModal);
    if (e.target === projectModal) closeModal(projectModal);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(quoteModal);
      closeModal(projectModal);
      closeSidebar();
    }
  });

  // Project cards click preview
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project-id');
      const data = projectDatabase[projectId];
      if (!data || !projectModalContent) return;

      projectModalContent.innerHTML = `
        <div>
          <div style="position:relative; width:100%; aspect-ratio:16/9; overflow:hidden; border-radius:12px; margin-bottom:20px; background:#0f172a;">
            <img src="${data.image}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover;">
          </div>
          
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
            <div>
              <span style="color:#3c72fc; font-weight:700; font-size:13px; text-transform:uppercase; letter-spacing:1px;">${data.category}</span>
              <h3 style="font-size:24px; font-weight:800; color:#0f0d1d; margin:4px 0;">${data.title}</h3>
              <p style="color:#64748b; font-size:14.5px;">${data.subtitle}</p>
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              ${data.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
          </div>

          <p style="font-size:15px; color:#475569; line-height:1.65; margin-bottom:20px;">
            ${data.summary}
          </p>

          <h4 style="font-size:17px; font-weight:700; color:#0f0d1d; margin-bottom:10px;">Key Features &amp; Deliverables</h4>
          <ul style="list-style:none; padding:0; margin-bottom:25px; display:flex; flex-direction:column; gap:8px;">
            ${data.highlights.map(h => `
              <li style="display:flex; align-items:center; gap:10px; font-size:14px; color:#334155;">
                <span style="color:#3c72fc; font-weight:bold;">✓</span> ${h}
              </li>
            `).join('')}
          </ul>

          <div class="modal-actions-row">
            <button class="btn-outline" style="color:#0f0d1d; border-color:#cbd5e1; background:#f8fafc;" onclick="document.getElementById('close-project-modal').click();">Close Preview</button>
            <button class="btn-one" id="modal-start-similar-btn">
              <span>Start Similar Project</span>
              <i class="fa-regular fa-arrow-right-long"></i>
            </button>
          </div>
        </div>
      `;

      const startSimilarBtn = projectModalContent.querySelector('#modal-start-similar-btn');
      if (startSimilarBtn) {
        startSimilarBtn.addEventListener('click', () => {
          closeModal(projectModal);
          setTimeout(() => openModal(quoteModal), 220);
        });
      }

      openModal(projectModal);
    });
  });

  // --- 9. Quote Form Submission ---
  const quoteForm = document.getElementById('quote-form');
  const quoteSuccessMsg = document.getElementById('quote-success-msg');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('.btn-one') || quoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Sending Request...</span>';
        submitBtn.style.opacity = '0.7';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.style.opacity = '1';
        }
        quoteForm.reset();
        quoteForm.style.display = 'none';
        if (quoteSuccessMsg) quoteSuccessMsg.style.display = 'block';
        showToast("Your quote request has been sent! We will contact you within 24 hours.");
      }, 700);
    });
  }

  // --- 10. Talk To Us Form Submission (Home Page) ---
  const talkForm = document.getElementById('talk-form');
  if (talkForm) {
    talkForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = talkForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Sending Message...</span>';
        submitBtn.style.opacity = '0.7';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.style.opacity = '1';
        }
        talkForm.reset();
        showToast("Thank you! Your message has been sent to EvoTech.");
      }, 700);
    });
  }

  // --- 11. Portfolio Category Filtering (projects.html) ---
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 12. Active Navigation Highlight based on URL ---
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-menu nav > ul > li > a, .sidebar-menu ul li a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (href && href.endsWith('.html') && href !== currentPath) {
      link.classList.remove('active');
    }
  });

});
