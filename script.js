const body = document.body;
const reveals = Array.from(document.querySelectorAll('.reveal'));
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const projectCards = Array.from(document.querySelectorAll('.project-card'));
const seeMoreBtn = document.querySelector('.see-more-btn');
const projectGrid = document.querySelector('.project-grid');
const projectCount = document.querySelector('.project-count');
const projectEmpty = document.querySelector('.project-empty');
const clearFiltersBtn = document.querySelector('.clear-filters');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = Array.from(document.querySelectorAll('.mobile-nav a'));
const sectionLinks = Array.from(
  document.querySelectorAll('.desktop-nav a[href^="#"], .mobile-nav a[href^="#"]')
);
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const setActiveNavLink = (id) => {
  sectionLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('active', isActive);
    if (!link.classList.contains('btn')) {
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    }
  });
};

const setMenuState = (isOpen) => {
  if (!menuToggle || !mobileMenu) return;

  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  mobileMenu.hidden = !isOpen;
  mobileMenu.dataset.open = String(isOpen);
  body.classList.toggle('menu-open', isOpen);
};

if (!reduceMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    }
  );

  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('active'));
}

if (observedSections.length && 'IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleEntries.length) {
        setActiveNavLink(visibleEntries[0].target.id);
      }
    },
    {
      rootMargin: '-25% 0px -55% 0px',
      threshold: [0.2, 0.4, 0.6],
    }
  );

  observedSections.forEach((section) => navObserver.observe(section));
} else if (observedSections.length) {
  setActiveNavLink(observedSections[0].id);
}

let showAll = false;
const initialVisible = 6;
const statusOrder = {
  completed: 1,
  progress: 2,
  failed: 3,
  community: 4,
};

const getStatus = (card) => {
  if (card.dataset.status) return card.dataset.status;
  const statusEl = card.querySelector('.status');
  if (!statusEl) return 'other';
  return statusEl.classList[1] || 'other';
};

const sortCards = (cards) =>
  [...cards].sort((a, b) => {
    const aStatus = statusOrder[getStatus(a)] || 9;
    const bStatus = statusOrder[getStatus(b)] || 9;

    if (aStatus !== bStatus) return aStatus - bStatus;

    const aTitle = a.querySelector('h3')?.textContent || '';
    const bTitle = b.querySelector('h3')?.textContent || '';
    return aTitle.localeCompare(bTitle);
  });

const applyFilter = (filter) => {
  if (!projectCards.length) return;

  let visibleCount = 0;
  const matched = projectCards.filter((card) => {
    const categories = card.dataset.category ? card.dataset.category.split(' ') : [];
    return filter === 'all' || categories.includes(filter);
  });

  const sorted = sortCards(matched);
  const hiddenCards = projectCards.filter((card) => !matched.includes(card));

  if (projectGrid) {
    sorted.forEach((card) => projectGrid.appendChild(card));
    hiddenCards.forEach((card) => {
      card.classList.add('hidden');
      projectGrid.appendChild(card);
    });
  }

  sorted.forEach((card) => {
    if (!showAll && visibleCount >= initialVisible) {
      card.classList.add('hidden');
    } else {
      card.classList.remove('hidden');
      visibleCount += 1;
    }
  });

  const total = sorted.length;
  if (projectCount) {
    projectCount.textContent = `Showing ${Math.min(visibleCount, total)} of ${total} projects`;
  }

  if (projectEmpty) {
    projectEmpty.classList.toggle('show', total === 0);
  }

  if (seeMoreBtn) {
    if (total <= initialVisible) {
      seeMoreBtn.hidden = true;
    } else {
      seeMoreBtn.hidden = false;
      seeMoreBtn.textContent = showAll
        ? `See Less (${total} of ${total})`
        : `See More (${Math.min(initialVisible, total)} of ${total})`;
    }
  }
};

if (filterButtons.length) {
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((button) => {
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      showAll = false;
      applyFilter(btn.dataset.filter || 'all');
    });
  });
}

if (seeMoreBtn) {
  seeMoreBtn.addEventListener('click', () => {
    showAll = !showAll;
    const activeFilter = document.querySelector('.filter-btn.active');
    applyFilter(activeFilter ? activeFilter.dataset.filter : 'all');
  });
}

if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener('click', () => {
    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allBtn) allBtn.click();
  });
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    setMenuState(!isOpen);
  });
}

mobileLinks.forEach((link) => {
  link.addEventListener('click', () => setMenuState(false));
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 960) {
    setMenuState(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenuState(false);
  }
});

setMenuState(false);
applyFilter('all');
