// Header scroll state
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  });

  // Reliable smooth-scroll for ALL in-page anchor links, offset for the fixed header
  function scrollToId(id){
    const target = document.getElementById(id);
    if(!target) return;
    const headerOffset = header.classList.contains('scrolled') ? 78 : 90;
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    const hash = link.getAttribute('href');
    if(!hash || hash.length < 2) return; // skip bare "#"
    link.addEventListener('click', (e) => {
      const id = hash.slice(1);
      if(!document.getElementById(id)) return; // let it fall through if no matching section
      e.preventDefault();
      scrollToId(id);
      history.pushState(null, '', hash);
    });
  });

  // Mobile menu
  const burger = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const scrim = document.getElementById('scrim');
  const menuClose = document.getElementById('menuClose');
  function openMenu(){ mobileMenu.classList.add('open'); mobileMenu.style.display='flex'; scrim.classList.add('show'); }
  function closeMenu(){ mobileMenu.classList.remove('open'); scrim.classList.remove('show'); setTimeout(()=> mobileMenu.style.display='none', 350); }
  burger.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  scrim.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Hero image slider (right column only; left text stays fixed)
  const heroTrack = document.getElementById('heroTrack');
  const heroSlides = document.querySelectorAll('.image-slide');
  const dots = document.querySelectorAll('.dot');
  let current = 0;
  let timer;
  function showSlide(i){
    heroTrack.style.transform = `translateX(-${i * (100 / heroSlides.length)}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[i].classList.add('active');
    current = i;
  }
  function nextSlide(){ showSlide((current + 1) % heroSlides.length); resetTimer(); }
  function resetTimer(){ clearInterval(timer); timer = setInterval(nextSlide, 5200); }
  dots.forEach(d => d.addEventListener('click', () => { showSlide(parseInt(d.dataset.dot)); resetTimer(); }));
  resetTimer();

  // Contact form (demo only, no backend)
  document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const original = btn.textContent;

    const payload = {
      name: document.getElementById('name').value,
      phone_number: document.getElementById('phone').value,
      interest: document.getElementById('interest').value,
      message: document.getElementById('message').value,
    };

    btn.textContent = 'Sending...';
    btn.disabled = true;

    fetch('/api/contact/', {   // change host once deployed
      method: 'POST',
      headers: { 'Content-Type': 'application/json' ,
                'X-CSRFToken': getCookie("csrftoken"),},
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          btn.textContent = 'Message Sent ✓';
          this.reset();
        } else {
          btn.textContent = 'Something went wrong';
        }
      })
      .catch((error) => { console.error("Fetch error:", error);
        btn.textContent = 'Network error, try again'; })
      .finally(() => {
        setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 2600);
      });
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie("csrftoken");