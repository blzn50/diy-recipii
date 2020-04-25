import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.resultsList.innerHTML = '';
  elements.resultsPage.innerHTML = '';
};

const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(' ')}...`;
  }
  return title;
};

const renderRecipe = (recipe) => {
  const markup = `
                <li>
                  <a class="results__link" href="#${recipe.recipe_id}">
                      <figure class="results__fig">
                          <img src="${recipe.image_url}" alt="${recipe.title}">
                      </figure>
                      <div class="results__data">
                          <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                          <p class="results__author">${recipe.publisher}</p>
                      </div>
                  </a>
              </li>`;
  elements.resultsList.insertAdjacentHTML('beforeend', markup);
};

// 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline btn-selector results__btn--${type}" data-goto=${
  type === 'prev' ? page - 1 : page + 1
}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;
  if (page === 1 && pages > 1) {
    // button to go to next page only
    button = createButton(page, 'next');
  } else if (page < pages) {
    // both buttons
    button = `${createButton(page, 'prev')} ${createButton(page, 'next')}`;
  } else if (page === pages && pages > 1) {
    // button to go to prev page only
    button = createButton(page, 'prev');
  }
  elements.resultsPage.insertAdjacentHTML('afterbegin', button);
};

export const renderRecipes = (recipes, page = 1, resPerPage = 10) => {
  // render results in current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  // results pagination
  renderButtons(page, recipes.length, resPerPage);
};

export const highlightSelected = (id) => {
  const searchResults = Array.from(document.querySelectorAll('.results__link'));
  searchResults.forEach((result) => {
    result.classList.remove('results__link--active');
  });
  document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};
