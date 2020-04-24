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
      console.log(error);
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
}
