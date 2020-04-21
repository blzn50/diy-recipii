import Search from './models/Search';
import { elements, renderSpinner, clearSpinner } from './views/base';
import * as SearchBox from './views/searchBox';

/** Global state
 * Search object
 * current recipe object
 * shopping list object
 * favorites
 */
const state = {};

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

// fetch(`https://forkify-api.herokuapp.com/api/get?rId=${query}`, {
//   headers: {
//     'Content-Type': 'application/json',
//   },
// }).then((res) => res.json());
