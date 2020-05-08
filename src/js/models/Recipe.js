import { proxy } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const data = await fetch(`${proxy}https://forkify-api.herokuapp.com/api/get?rId=${this.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const jsonData = await data.json();
      // console.log('recipe: ', jsonData.recipe);
      this.title = jsonData.recipe.title;
      this.author = jsonData.recipe.publisher;
      this.image = jsonData.recipe.image_url;
      this.url = jsonData.recipe.source_url;
      this.ingredients = jsonData.recipe.ingredients;
    } catch (error) {
      alert('Something went wrong :(');
    }
  }

  // assuming we need 15 for every 3 ingredients;
  calcTime() {
    const ingNum = this.ingredients.length;
    const periods = Math.ceil(ingNum / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      'tablespoons',
      'tablespoon',
      'teaspoons',
      'teaspoon',
      'ounces',
      'ounce',
      'cups',
      'cup',
      'pounds',
    ];
    const unitsShort = ['tbsp', 'tbsp', 'tsp', 'tsp', 'oz', 'oz', 'cup', 'cup', 'pound'];
    const units = [...unitsShort, 'kg', 'g'];

    const newIngredients = this.ingredients.map((ing) => {
      // uniform units
      let ingredient = ing.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });
      // remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // parse ingredients into count, unit and ingredients
      const ingArr = ingredient.split(' ');
      const unitIndex = ingArr.findIndex((ing2) => units.includes(ing2));

      let ingObj;

      if (unitIndex > -1) {
        // there is unit
        const countArr = ingArr.slice(0, unitIndex);
        let count;
        if (countArr.length === 1) {
          count = eval(ingArr[0].replace('-', '+'));
        } else {
          count = eval(ingArr.slice(0, unitIndex).join('+'));
        }

        ingObj = {
          count,
          unit: ingArr[unitIndex],
          ingredient: ingArr.slice(unitIndex + 1).join(' '),
        };
      } else if (parseInt(ingArr[0], 10)) {
        // no unit but 1st element is number
        ingObj = {
          count: parseInt(ingArr[0], 10),
          unit: '',
          ingredient: ingArr.slice(1).join(' '),
        };
      } else if (unitIndex === -1) {
        // no unit, no number
        ingObj = {
          count: 1,
          unit: '',
          ingredient,
        };
      }
      return ingObj;
    });

    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // Servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    // Ingredients
    this.ingredients.forEach((ing) => {
      ing.count *= newServings / this.servings;
    });

    this.servings = newServings;
  }
}
