const reveals = document.querySelectorAll('.reveal');
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const projectCards = Array.from(document.querySelectorAll('.project-card'));
const seeMoreBtn = document.querySelector('.see-more-btn');
const projectGrid = document.querySelector('.project-grid');
const projectCount = document.querySelector('.project-count');
const projectEmpty = document.querySelector('.project-empty');
const clearFiltersBtn = document.querySelector('.clear-filters');

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
    threshold: 0.2,
  }
);

reveals.forEach((el) => observer.observe(el));

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

const sortCards = (cards) => {
  return cards.sort((a, b) => {
    const aStatus = statusOrder[getStatus(a)] || 9;
    const bStatus = statusOrder[getStatus(b)] || 9;
    if (aStatus !== bStatus) return aStatus - bStatus;
    const aTitle = a.querySelector('h3')?.textContent || '';
    const bTitle = b.querySelector('h3')?.textContent || '';
    return aTitle.localeCompare(bTitle);
  });
};

const applyFilter = (filter) => {
  if (!projectCards.length) return;
  let visibleCount = 0;
  const matched = projectCards.filter((card) => {
    const categories = card.dataset.category ? card.dataset.category.split(' ') : [];
    return filter === 'all' || categories.includes(filter);
  });

  const sorted = sortCards(matched);
  if (projectGrid) sorted.forEach((card) => projectGrid.appendChild(card));

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
      seeMoreBtn.style.display = 'none';
    } else {
      seeMoreBtn.style.display = 'inline-flex';
      seeMoreBtn.textContent = showAll
        ? `See Less (${total} of ${total})`
        : `See More (${Math.min(initialVisible, total)} of ${total})`;
    }
  }
};

if (filterButtons.length) {
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
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
    const allBtn = document.querySelector('.filter-btn[data-filter=\"all\"]');
    if (allBtn) allBtn.click();
  });
}

applyFilter('all');
