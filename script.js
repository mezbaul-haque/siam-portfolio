const reveals = document.querySelectorAll('.reveal');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const seeMoreBtn = document.querySelector('.see-more-btn');
const sliderTrack = document.querySelector('.slider-track');
const sliderPrev = document.querySelector('.slider-btn.prev');
const sliderNext = document.querySelector('.slider-btn.next');

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

const applyFilter = (filter) => {
  let visibleCount = 0;
  projectCards.forEach((card) => {
    const categories = card.dataset.category ? card.dataset.category.split(' ') : [];
    const match = filter === 'all' || categories.includes(filter);
    if (!match) {
      card.classList.add('hidden');
      return;
    }
    if (!showAll && visibleCount >= initialVisible) {
      card.classList.add('hidden');
    } else {
      card.classList.remove('hidden');
      visibleCount += 1;
    }
  });
};

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    showAll = false;
    if (seeMoreBtn) seeMoreBtn.textContent = 'See More';
    applyFilter(btn.dataset.filter || 'all');
  });
});

if (seeMoreBtn) {
  seeMoreBtn.addEventListener('click', () => {
    showAll = !showAll;
    seeMoreBtn.textContent = showAll ? 'See Less' : 'See More';
    const activeFilter = document.querySelector('.filter-btn.active');
    applyFilter(activeFilter ? activeFilter.dataset.filter : 'all');
  });
}

if (sliderTrack && sliderPrev && sliderNext) {
  const scrollAmount = 320;
  sliderPrev.addEventListener('click', () => {
    sliderTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  sliderNext.addEventListener('click', () => {
    sliderTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

applyFilter('all');
