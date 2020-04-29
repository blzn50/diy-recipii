import Search from './models/Search';
import Recipe from './models/Recipe';
import ShoppingList from './models/ShoppingList';
import Favorites from './models/Favorites';
import { elements, renderSpinner, clearSpinner } from './views/base';
import * as searchBox from './views/searchBox';
import * as recipeView from './views/recipeView';
import * as shopListView from './views/shopListView';
import * as favoriteView from './views/favoriteView';

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
  // Get query from view
  const query = searchBox.getInput();

  if (query) {
    // Add query to global state
    state.search = new Search(query);
    // Clear previous list and loading spinner
    searchBox.clearInput();
    searchBox.clearResults();
    renderSpinner(elements.results);
    try {
      // Make api call
      await state.search.getRecipes();

      // Render results on webapp
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
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderSpinner(elements.recipe);

    if (state.search) searchBox.highlightSelected(id);
    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // calcTime & calcServings
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe
      clearSpinner();
      recipeView.renderRecipe(state.recipe, state.favorites.isFavorite(id));
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
  // Create new shopping list if not present
  if (!state.list) state.list = new ShoppingList();

  // Add item to the shopping list and UI
  state.recipe.ingredients.forEach((ing) => {
    const item = state.list.addItem(ing.count, ing.unit, ing.ingredient);
    shopListView.renderItem(item);
  });
};

// Handle update and delete item from list
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

/**
 * FAVORITE CONTROLLER
 */

const controlFav = () => {
  if (!state.favorites) state.favorites = new Favorites();

  const currentID = state.recipe.id;

  // User has NOT liked the current recipe
  if (!state.favorites.isFavorite(currentID)) {
    // Add item to fav list state
    const fav = state.favorites.addFavorite(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.image
    );

    // Toggle fav icon
    favoriteView.toggleFavBtn(true);
    // Add item to UI
    favoriteView.renderFav(fav);
    // User HAS liked the current recipe
  } else {
    // Delete item from the fav list state
    state.favorites.deleteFavorite(currentID);

    // Toggle fav icon
    favoriteView.toggleFavBtn(false);

    // Remove item from UI
    favoriteView.deleteFav(currentID);
  }

  favoriteView.toggleFavMenu(state.favorites.getFavLength());
};

window.addEventListener('load', () => {
  state.favorites = new Favorites();

  // Restore favorites
  state.favorites.getStorageData();

  // Toggle favorite menu button
  favoriteView.toggleFavMenu(state.favorites.getFavLength());

  // Render the existing favorites
  state.favorites.favorites.forEach((fav) => {
    favoriteView.renderFav(fav);
  });
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
    // Add ingredients to shopping list
    controlShoppingList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Add/remove favorite item
    controlFav();
  }
});
