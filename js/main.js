document.addEventListener('DOMContentLoaded', () => {

  /* ===== イントロ制御 ===== */
  const overlay = document.getElementById('intro-overlay');
  const i1 = document.getElementById('intro-1');
  const i2 = document.getElementById('intro-2');
  const main = document.getElementById('main-site');

  const skipIntro = sessionStorage.getItem('skipIntro');

  function showMain() {
    overlay.style.display = 'none';
    main.style.display = 'block';
    main.style.opacity = '1';
  }

  if (skipIntro) {
    showMain();
  } else {
    function fi(el, delay, dur, cb) {
      setTimeout(() => {
        el.style.transition = `opacity ${dur}ms ease`;
        el.style.opacity = '1';
        setTimeout(() => cb && cb(), dur);
      }, delay);
    }
    function fo(el, delay, dur, cb) {
      setTimeout(() => {
        el.style.transition = `opacity ${dur}ms ease`;
        el.style.opacity = '0';
        setTimeout(() => cb && cb(), dur);
      }, delay);
    }

    fi(i1, 0, 600, () => {
      fo(i1, 1000, 600, () => {
        fi(i2, 200, 600, () => {
          fo(i2, 1200, 600, () => {
            overlay.style.transition = 'opacity .8s ease';
            overlay.style.opacity = '0';
            setTimeout(() => {
              overlay.style.display = 'none';
              main.style.display = 'block';
              main.style.opacity = '0';
              main.style.transition = 'opacity .6s ease';
              requestAnimationFrame(() => requestAnimationFrame(() => {
                main.style.opacity = '1';
              }));
              sessionStorage.setItem('skipIntro', '1');
            }, 800);
          });
        });
      });
    });
  }

  /* ===== スライダー ===== */
  const slides = [
    document.getElementById('slide1'),
    document.getElementById('slide2'),
    document.getElementById('slide3'),
    document.getElementById('slide4'),
    document.getElementById('slide5'),
    document.getElementById('slide6')
  ];
  const dots = document.querySelectorAll('.dot');
  let cur = 0, timer;

  function show(n) {
    slides[cur].classList.remove('active');
    dots[cur].classList.remove('on');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dots[cur].classList.add('on');
  }

  function startAuto() { timer = setInterval(() => show(cur + 1), 5000); }
  function resetAuto() { clearInterval(timer); startAuto(); }

  document.getElementById('arrowL').addEventListener('click', () => { show(cur - 1); resetAuto(); });
  document.getElementById('arrowR').addEventListener('click', () => { show(cur + 1); resetAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { show(i); resetAuto(); }));

  window.goSlide = function(n) { show(n); resetAuto(); };

  startAuto();

  /* ===== スワイプ ===== */
  let tx = 0;
  const hero = document.getElementById('hero');
  hero.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', e => {
    const diff = tx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { show(cur + (diff > 0 ? 1 : -1)); resetAuto(); }
  });

  /* ===== ナビ ===== */
  const hbg = document.getElementById('hamburger');
  const mob = document.getElementById('mobileMenu');

  hbg.addEventListener('click', () => {
    hbg.classList.toggle('open');
    mob.classList.toggle('open');
  });

  window.closeMobile = () => {
    hbg.classList.remove('open');
    mob.classList.remove('open');
  };

  /* ===== 他ページへ移動するリンク全てにskipIntroをセット ===== */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#' && href !== 'index.html' && !href.startsWith('javascript')) {
      link.addEventListener('click', () => {
        sessionStorage.setItem('skipIntro', '1');
      });
    }
  });

});