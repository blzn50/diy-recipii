export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getRecipes() {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    try {
      const data = await fetch(
        `${proxy}https://forkify-api.herokuapp.com/api/search?q=${this.query}`
      );
      const jsonData = await data.json();
      this.result = jsonData.recipes;
    } catch (error) {
      console.log('Error with fetching the data. Please try again');

      // error.text().then((er) => console.log(er));
    }
  }
}
