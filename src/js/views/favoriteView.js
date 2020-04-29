import { elements } from './base';
import { limitRecipeTitle } from './searchBox';

export const toggleFavBtn = (isFav) => {
  const iconString = isFav ? 'icon-heart' : 'icon-heart-outlined';
  document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleFavMenu = (favLength) => {
  elements.favoriteMenu.style.visibility = favLength > 0 ? 'visible' : 'hidden';
};

export const renderFav = (favorite) => {
  const markup = `
                <li>
                    <a class="favorite__link" href="#${favorite.id}">
                        <figure class="favorite__fig">
                            <img src="${favorite.image}" alt="${favorite.title}">
                        </figure>
                        <div class="favorite__data">
                            <h4 class="favorite__name">${limitRecipeTitle(favorite.title)}</h4>
                            <p class="favorite__author">${favorite.author}</p>
                        </div>
                    </a>
                </li>
  `;
  elements.favoriteList.insertAdjacentHTML('beforeend', markup);
};

export const deleteFav = (id) => {
  const el = document.querySelector(`.favorite__link[href="#${id}"]`).parentElement;
  if (el) el.parentElement.removeChild(el);
};
