import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderSpinner, clearSpinner } from './views/base';
import * as SearchBox from './views/searchBox';

/** Global state
 * Search object
 * current recipe object
 * shopping list object
 * favorites
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const handleSearch = async () => {
  // get query from view
  const query = SearchBox.getInput();

  if (query) {
    // add query to global state
    state.search = new Search(query);
    // clear previous list and loading spinner
    SearchBox.clearInput();
    SearchBox.clearResults();
    renderSpinner(elements.results);
    // make api call
    await state.search.getRecipes();

    // render results on webapp
    // console.log('state.search.result: ', state.search.result);
    clearSpinner();
    SearchBox.renderRecipes(state.search.result);
  }
};

elements.searchBtn.addEventListener('submit', (e) => {
  e.preventDefault();
  handleSearch();
});

elements.resultsPage.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-selector');

  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    SearchBox.clearResults();
    SearchBox.renderRecipes(state.search.result, goToPage);
    console.log('goToPage: ', goToPage);
  }
});

/**
 * RECIPE CONTROLLER
 */
const r = new Recipe();
