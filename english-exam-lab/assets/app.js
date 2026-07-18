(() => {
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-main-nav]');

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
  }

  document.querySelectorAll('[data-filter]').forEach((input) => {
    const selector = input.dataset.filter;
    const cards = [...document.querySelectorAll(selector)];
    const empty = document.querySelector('[data-filter-empty]');

    input.addEventListener('input', () => {
      const query = input.value.trim().toLocaleLowerCase('ko');
      let visible = 0;

      cards.forEach((card) => {
        const text = (card.dataset.search || card.textContent).toLocaleLowerCase('ko');
        const match = !query || text.includes(query);
        card.classList.toggle('is-hidden', !match);
        if (match) visible += 1;
      });

      if (empty) empty.classList.toggle('is-visible', visible === 0);
    });
  });

  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
