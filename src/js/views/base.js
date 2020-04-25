export const elements = {
  searchBtn: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  results: document.querySelector('.results'),
  resultsList: document.querySelector('.results__list'),
  resultsPage: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
};

export const elementStrings = {
  spinner: 'spinner',
};

export const renderSpinner = (parent) => {
  const spinner = `
                  <div class="${elementStrings.spinner}">
                    <svg>
                      <use href="img/icons.svg#icon-cw"></use>
                    </svg>
                  </div>
                `;
  parent.insertAdjacentHTML('afterbegin', spinner);
};

export const clearSpinner = () => {
  const spinner = document.querySelector(`.${elementStrings.spinner}`);
  if (spinner) {
    spinner.parentElement.removeChild(spinner);
  }
};
