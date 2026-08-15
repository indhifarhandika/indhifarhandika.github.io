/* ==========================================================================
   Software Engineer Portfolio - Core Dynamic Interactivity
   Developer: Indhi Farhandika Rochimansyah
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Ambient Interactive Canvas Background ---
  initCanvasBackground();

  // --- 2. Dynamic Typing Text Effect ---
  initTypingEffect();

  // --- 3. Certificate Data Renderer (from certificate.json) ---
  loadCertificates();

  // --- 3.5. Project Data Renderer (from project.json) ---
  loadProjects();

  // --- 4. Navigation & Scrollspy ---
  initNavbar();

  // --- 5. Project Filtering Logic ---
  initProjectFilters();

  // --- 6. Contact Form & Toast Notification ---
  initContactForm();

  // --- 7. Back to Top Button ---
  initBackToTop();
});

/* -------------------------------------------------------------------------- */
/* 1. Canvas Background with Particle Grid & Glowing Nodes                   */
/* -------------------------------------------------------------------------- */
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const numParticles = Math.min(Math.floor(width / 18), 75);

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(6, 182, 212, ' : 'rgba(139, 92, 246, '
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw particle nodes
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.6)';
      ctx.fill();

      // Connect adjacent nodes
      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p.color + (1 - dist / 120) * 0.15 + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* -------------------------------------------------------------------------- */
/* 2. Typing Effect for Hero Subtitle                                         */
/* -------------------------------------------------------------------------- */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const roles = [
    "Software Engineer",
    "Python & Mobile Specialist",
    "Clean Code"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2200; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* -------------------------------------------------------------------------- */
/* 3. Certificate Data Loader                                                */
/* -------------------------------------------------------------------------- */
async function loadCertificates() {
  const container = document.getElementById('certificates-container');
  if (!container) return;

  try {
    const response = await fetch('certificate.json');
    if (!response.ok) throw new Error('Failed to load certificates');
    const data = await response.json();

    container.innerHTML = '';

    if (data && data.name && Array.isArray(data.name)) {
      const totalCerts = data.name.length;
      let isExpanded = false;

      for (let i = 0; i < totalCerts; i++) {
        const certName = data.name[i];
        const certFrom = data.from[i] || 'Verified Provider';
        const certDate = data.date[i] || '';
        const certLink = data.link[i] || '#';

        const certCard = document.createElement('div');
        certCard.className = 'glass-card cert-card';
        if (i >= 6) {
          certCard.style.display = 'none';
          certCard.classList.add('cert-extra');
        }

        const hasLink = certLink && certLink !== '#';
        const linkHtml = hasLink
          ? `<a href="${escapeHTML(certLink)}" target="_blank" rel="noopener noreferrer" class="cert-link">
               <span>Verify Certificate</span>
               <i class="fas fa-external-link-alt"></i>
             </a>`
          : `<span class="cert-link" style="color: var(--text-muted); opacity: 0.6; cursor: default;">
               <span>Issued Certificate</span>
               <i class="fas fa-check-circle"></i>
             </span>`;

        certCard.innerHTML = `
          <div>
            <div class="cert-header">
              <div class="cert-icon">
                <i class="fas fa-award"></i>
              </div>
              <span class="cert-date">${escapeHTML(certDate)}</span>
            </div>
            <h3 class="cert-title">${escapeHTML(certName)}</h3>
            <p class="cert-issuer">${escapeHTML(certFrom)}</p>
          </div>
          ${linkHtml}
        `;
        container.appendChild(certCard);
      }

      // Add Show More button if more than 6 certificates
      if (totalCerts > 6) {
        let btnContainer = document.getElementById('cert-more-container');
        if (!btnContainer) {
          btnContainer = document.createElement('div');
          btnContainer.id = 'cert-more-container';
          btnContainer.style.cssText = 'text-align: center; margin-top: 2.5rem; width: 100%; grid-column: 1 / -1;';
          container.after(btnContainer);
        }

        btnContainer.innerHTML = `
          <button id="cert-toggle-btn" class="btn btn-secondary" style="padding: 0.75rem 2rem;">
            <i class="fas fa-chevron-down"></i> <span id="cert-toggle-text">Show More (${totalCerts - 6} More Certificates)</span>
          </button>
        `;

        const toggleBtn = document.getElementById('cert-toggle-btn');
        const toggleText = document.getElementById('cert-toggle-text');

        toggleBtn.addEventListener('click', () => {
          isExpanded = !isExpanded;
          const extraCards = container.querySelectorAll('.cert-extra');

          extraCards.forEach(card => {
            card.style.display = isExpanded ? 'flex' : 'none';
          });

          if (isExpanded) {
            toggleText.textContent = 'Show Less';
            toggleBtn.querySelector('i').className = 'fas fa-chevron-up';
          } else {
            toggleText.textContent = `Show More (${totalCerts - 6} More Certificates)`;
            toggleBtn.querySelector('i').className = 'fas fa-chevron-down';
            // Smooth scroll back to top of certificates section
            document.getElementById('certificates').scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
    }
  } catch (err) {
    console.error('Error loading certificate.json:', err);
    container.innerHTML = `<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">Certificates available upon request.</p>`;
  }
}

/* -------------------------------------------------------------------------- */
/* 3.5. Project Data Loader (from project.json)                               */
/* -------------------------------------------------------------------------- */
async function loadProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  try {
    const response = await fetch('project.json');
    if (!response.ok) throw new Error('Failed to load project.json');
    const projects = await response.json();

    container.innerHTML = '';

    if (Array.isArray(projects)) {
      projects.forEach(project => {
        const title = project.title || 'Featured Project';
        const category = project.category || 'web';
        const description = project.description || '';
        const image = project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80';
        const tags = Array.isArray(project.tags) ? project.tags : [];
        const github = project.github || 'https://github.com/indhifarhandika';
        const demo = project.demo || '';

        const tagsHtml = tags.map(tag => `<span class="tag">${escapeHTML(tag)}</span>`).join('');

        const demoUrl = demo
          ? (demo.startsWith('http://') || demo.startsWith('https://') ? demo : `https://${demo}`)
          : '';
        const demoLinkHtml = demoUrl
          ? `<a href="${escapeHTML(demoUrl)}" target="_blank" rel="noopener noreferrer" class="icon-btn" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>`
          : '';

        const card = document.createElement('div');
        card.className = 'glass-card project-card';
        card.setAttribute('data-category', category);
        card.innerHTML = `
          <div class="project-image-wrapper">
            <img src="${escapeHTML(image)}" alt="${escapeHTML(title)}" class="project-image" onerror="this.src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80'">
            <div class="project-overlay">
              <a href="${escapeHTML(github)}" target="_blank" class="icon-btn" title="Source Code">
                <i class="fab fa-github"></i>
              </a>
              ${demoLinkHtml}
            </div>
          </div>
          <div class="project-content">
            <h3 class="project-title">${escapeHTML(title)}</h3>
            <p class="project-desc">${escapeHTML(description)}</p>
            <div class="project-tags">
              ${tagsHtml}
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    }

    // Re-bind filter buttons after dynamic render
    initProjectFilters();
  } catch (err) {
    console.error('Error loading project.json:', err);
  }
}

/* -------------------------------------------------------------------------- */
/* 4. Navbar Scroll & Responsive Drawer                                       */
/* -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 5. Project Filtering                                                      */
/* -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 6. Contact Form & Toast                                                   */
/* -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    const recipient = 'work@indhifarhandika.dev';
    const subject = `Project Inquiry from ${name}`;
    const body = `${message}\n\n-------------------------------\nSender: ${name}\nEmail: ${email}`;

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    showToast(`Redirecting to email client for ${escapeHTML(name)}...`);

    // Trigger mail client
    window.location.href = mailtoUrl;
    form.reset();
  });
}

function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--accent-emerald); font-size: 1.2rem;"></i> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

/* -------------------------------------------------------------------------- */
/* 7. Back To Top                                                             */
/* -------------------------------------------------------------------------- */
function initBackToTop() {
  const backBtn = document.getElementById('back-to-top');
  if (!backBtn) return;

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
