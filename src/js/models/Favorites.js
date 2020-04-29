export default class Favorites {
  constructor() {
    this.favorites = [];
  }

  addFavorite(id, title, author, image) {
    const fav = {
      id,
      title,
      author,
      image,
    };
    this.favorites.push(fav);
    this.persistData();
    return fav;
  }

  deleteFavorite(id) {
    const index = this.favorites.findIndex((el) => el.id === id);
    this.favorites.splice(index, 1);
    this.persistData();
  }

  isFavorite(id) {
    return this.favorites.findIndex((el) => el.id === id) !== -1;
  }

  getFavLength() {
    return this.favorites.length;
  }

  persistData() {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  getStorageData() {
    const storage = JSON.parse(localStorage.getItem('favorites'));

    // Restoring favorites from localStorage
    if (storage) this.favorites = storage;
  }
}
