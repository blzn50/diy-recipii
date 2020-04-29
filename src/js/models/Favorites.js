export default class Favorites {
  constructor() {
    this.favorites = [];
  }

  addFavorite(id, title, author, img) {
    const fav = {
      id,
      title,
      author,
      img,
    };
    this.favorites.push(fav);
    return fav;
  }

  deleteFavorite(id) {
    const index = this.favorites.findIndex((el) => el.id === id);
    this.favorites.splice(index, 1);
  }

  isFavorite(id) {
    return this.favorites.findIndex((el) => el.id === id) !== -1;
  }

  getFavLength() {
    return this.favorites.length;
  }
}
