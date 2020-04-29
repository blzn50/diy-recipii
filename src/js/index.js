import Search from './models/Search';
import Recipe from './models/Recipe';
import ShoppingList from './models/ShoppingList';
import { elements, renderSpinner, clearSpinner } from './views/base';
import * as searchBox from './views/searchBox';
import * as recipeView from './views/recipeView';
import * as shopListView from './views/shopListView';

/** Global state
 * Search object
 * current recipe object
 * shopping list object
 * favorites
 */
const state = {};
window.state = state;
/**
 * SEARCH CONTROLLER
 */
const handleSearch = async () => {
  // get query from view
  const query = searchBox.getInput();

  if (query) {
    // add query to global state
    state.search = new Search(query);
    // clear previous list and loading spinner
    searchBox.clearInput();
    searchBox.clearResults();
    renderSpinner(elements.results);
    try {
      // make api call
      await state.search.getRecipes();

      // render results on webapp
      // console.log('state.search.result: ', state.search.result);
      clearSpinner();
      searchBox.renderRecipes(state.search.result);
    } catch (error) {
      alert('Cannot find the recipe. Please try again with new item!');
      clearSpinner();
    }
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
    searchBox.clearResults();
    searchBox.renderRecipes(state.search.result, goToPage);
  }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');
  if (id) {
    // prepare UI for changes
    recipeView.clearRecipe();
    renderSpinner(elements.recipe);

    if (state.search) searchBox.highlightSelected(id);
    // create new recipe object
    state.recipe = new Recipe(id);

    try {
      // get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // calcTime & calcServings
      state.recipe.calcTime();
      state.recipe.calcServings();

      // render recipe
      clearSpinner();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      alert('Error processing the recipe!');
    }
  }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach((e) => window.addEventListener(e, controlRecipe));

/**
 * SHOPPING LIST CONTROLLER
 */
const controlShoppingList = () => {
  // create new shopping list if not present
  if (!state.list) state.list = new ShoppingList();

  // add item to the shopping list and UI
  state.recipe.ingredients.forEach((ing) => {
    const item = state.list.addItem(ing.count, ing.unit, ing.ingredient);
    shopListView.renderItem(item);
  });
};

// handle update and delete item from list
elements.shopping.addEventListener('click', (e) => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // handle delete
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // delete from state
    state.list.deleteItem(id);
    // delete from UI
    shopListView.deleteItem(id);

    // handle update
  } else if (e.target.matches('.shopping__count--value')) {
    const val = parseFloat(e.target.value);
    if (val >= 0) state.list.updateCount(id, val);
  }
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', (e) => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease servings count
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase servings count
    state.recipe.updateServings('inc');
    recipeView.updateServingIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlShoppingList();
  }
});
