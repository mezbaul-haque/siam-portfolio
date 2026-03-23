const body = document.body;
const reveals = Array.from(document.querySelectorAll('.reveal'));
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const projectCards = Array.from(document.querySelectorAll('.project-card'));
const detailCards = Array.from(document.querySelectorAll('.featured-card, .project-card'));
const seeMoreBtn = document.querySelector('.see-more-btn');
const projectGrid = document.querySelector('.project-grid');
const projectCount = document.querySelector('.project-count');
const projectEmpty = document.querySelector('.project-empty');
const clearFiltersBtn = document.querySelector('.clear-filters');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = Array.from(document.querySelectorAll('.mobile-nav a'));
const detailModal = document.querySelector('#detail-modal');
const detailModalBackdrop = detailModal?.querySelector('.detail-modal-backdrop');
const detailModalClose = detailModal?.querySelector('.detail-modal-close');
const detailModalMedia = detailModal?.querySelector('.detail-modal-media');
const detailModalKicker = detailModal?.querySelector('#detail-modal-kicker');
const detailModalTitle = detailModal?.querySelector('#detail-modal-title');
const detailModalMeta = detailModal?.querySelector('#detail-modal-meta');
const detailModalBody = detailModal?.querySelector('#detail-modal-body');
const detailModalActions = detailModal?.querySelector('#detail-modal-actions');
const sectionLinks = Array.from(
  document.querySelectorAll('.desktop-nav a[href^="#"], .mobile-nav a[href^="#"]')
);
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let lastFocusedCard = null;

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
  body.classList.toggle('menu-open', isOpen || !detailModal?.hidden);
};

const createMetaTag = (text) => {
  const tag = document.createElement('span');
  tag.textContent = text;
  return tag;
};

const openDetailModal = (card) => {
  if (
    !detailModal ||
    !detailModalTitle ||
    !detailModalBody ||
    !detailModalMeta ||
    !detailModalActions ||
    !detailModalKicker ||
    !detailModalMedia
  ) {
    return;
  }

  lastFocusedCard = card;
  detailModalBody.innerHTML = '';
  detailModalMeta.innerHTML = '';
  detailModalActions.innerHTML = '';
  detailModalKicker.textContent = '';

  const title = card.querySelector('h3')?.textContent?.trim() || 'Details';
  detailModalTitle.textContent = title;

  const image = card.querySelector('img');
  if (image?.getAttribute('src')) {
    detailModalMedia.hidden = false;
    detailModalMedia.src = image.getAttribute('src');
    detailModalMedia.alt = image.getAttribute('alt') || title;
  } else {
    detailModalMedia.hidden = true;
    detailModalMedia.removeAttribute('src');
    detailModalMedia.alt = '';
  }

  if (card.classList.contains('featured-card')) {
    detailModalKicker.textContent = card.querySelector('.eyebrow')?.textContent?.trim() || 'Featured Work';

    const summary = card.querySelector('.featured-summary')?.textContent?.trim();
    if (summary) {
      const summaryEl = document.createElement('p');
      summaryEl.textContent = summary;
      detailModalBody.appendChild(summaryEl);
    }

    card.querySelectorAll('.featured-impact span').forEach((item) => {
      detailModalMeta.appendChild(createMetaTag(item.textContent.trim()));
    });

    card.querySelectorAll('.featured-story > div').forEach((section) => {
      const block = document.createElement('div');
      block.className = 'detail-modal-section';

      const heading = document.createElement('h4');
      heading.textContent = section.querySelector('.story-label')?.textContent?.trim() || 'Detail';

      const copy = document.createElement('p');
      copy.textContent = section.querySelector('p')?.textContent?.trim() || '';

      block.appendChild(heading);
      block.appendChild(copy);
      detailModalBody.appendChild(block);
    });
  } else {
    detailModalKicker.textContent = 'Project Detail';

    const metaTexts = Array.from(card.querySelectorAll('.project-meta span')).map((item) =>
      item.textContent.trim()
    );
    metaTexts.forEach((text) => {
      detailModalMeta.appendChild(createMetaTag(text));
    });

    const description = card.querySelector('.project-body > p:not(.project-impact):not(.learning)');
    if (description?.textContent?.trim()) {
      const descriptionEl = document.createElement('p');
      descriptionEl.textContent = description.textContent.trim();
      detailModalBody.appendChild(descriptionEl);
    }

    const impactText = card.querySelector('.project-impact')?.textContent?.trim();
    if (impactText) {
      const impactBlock = document.createElement('div');
      impactBlock.className = 'detail-modal-section';
      const heading = document.createElement('h4');
      heading.textContent = 'Impact';
      const copy = document.createElement('p');
      copy.textContent = impactText;
      impactBlock.appendChild(heading);
      impactBlock.appendChild(copy);
      detailModalBody.appendChild(impactBlock);
    }

    const learningText = card.querySelector('.learning')?.textContent?.trim();
    if (learningText) {
      const learningBlock = document.createElement('div');
      learningBlock.className = 'detail-modal-section';
      const heading = document.createElement('h4');
      heading.textContent = 'Learning';
      const copy = document.createElement('p');
      copy.textContent = learningText;
      learningBlock.appendChild(heading);
      learningBlock.appendChild(copy);
      detailModalBody.appendChild(learningBlock);
    }

    const extraDetail = card.querySelector('.detail-content');
    if (extraDetail) {
      Array.from(extraDetail.children).forEach((child) => {
        detailModalBody.appendChild(child.cloneNode(true));
      });
    }

    card.querySelectorAll('.project-actions a').forEach((link) => {
      const action = document.createElement('a');
      action.className = 'btn btn-small';
      action.href = link.href;
      action.target = link.target || '_self';
      if (link.rel) action.rel = link.rel;
      if (link.hasAttribute('download')) action.setAttribute('download', '');
      action.textContent = link.textContent.trim();
      detailModalActions.appendChild(action);
    });
  }

  detailModal.hidden = false;
  body.classList.add('menu-open');
  detailModalClose?.focus();
};

const closeDetailModal = () => {
  if (!detailModal || detailModal.hidden) return;

  detailModal.hidden = true;
  body.classList.toggle('menu-open', menuToggle?.getAttribute('aria-expanded') === 'true');
  if (lastFocusedCard) {
    lastFocusedCard.focus();
  }
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

const updateActiveNavLink = () => {
  if (!observedSections.length) return;

  const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
  const scrollPosition = window.scrollY + headerOffset + 24;

  let currentSection = observedSections[0];

  observedSections.forEach((section) => {
    if (section.offsetTop <= scrollPosition) {
      currentSection = section;
    }
  });

  setActiveNavLink(currentSection.id);
};

if (observedSections.length) {
  let ticking = false;

  const handleNavState = () => {
    if (ticking) return;

    ticking = true;
    window.requestAnimationFrame(() => {
      updateActiveNavLink();
      ticking = false;
    });
  };

  window.addEventListener('scroll', handleNavState, { passive: true });
  window.addEventListener('resize', handleNavState);
  updateActiveNavLink();
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

if (detailCards.length) {
  detailCards.forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-haspopup', 'dialog');

    card.addEventListener('click', (event) => {
      if (event.target.closest('a, button')) return;
      openDetailModal(card);
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDetailModal(card);
      }
    });
  });
}

detailModalBackdrop?.addEventListener('click', closeDetailModal);
detailModalClose?.addEventListener('click', closeDetailModal);

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
    closeDetailModal();
  }
});

setMenuState(false);
applyFilter('all');
