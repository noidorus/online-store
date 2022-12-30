import { Types } from '../types/Types';

class Catalog {
  drawCategory(category: string, div: HTMLDivElement) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    const span = document.createElement('span');

    label.className = 'checkbox__item category__item';
    input.className = 'checkbox__item-input category__item-input';
    span.className = 'checkmark';

    label.textContent = category;
    input.setAttribute('type', 'checkbox');

    label.append(input);
    label.append(span);
    div.append(label);
  }

  drawCard(card: Types.Product, div: HTMLDivElement) {
    const productCard = document.createElement('div');
    const productImg = document.createElement('img');
    const cardTextWrapper = document.createElement('div');
    const cardPrice = document.createElement('h4');
    const cardTitle = document.createElement('h4');
    const cardDescription = document.createElement('p');
    const cardBottom = document.createElement('div');
    const cardRating = document.createElement('div');
    const ratingStar = document.createElement('div');
    const raitingText = document.createElement('p');
    const cardCart = document.createElement('div');
    const cardCartImg = document.createElement('img');

    // Add Classes
    productCard.className = 'product-card';
    productImg.className = 'card-image';
    cardTextWrapper.className = 'card-txt-wrapper';
    cardPrice.className = 'card-price';
    cardTitle.className = 'card-title';
    cardDescription.className = 'card-description';

    cardBottom.className = 'card-bottom-wrapper';
    cardRating.className = 'card-rating';
    ratingStar.className = 'rating-star';
    raitingText.className = 'card-rating-txt';
    cardCart.className = 'card-cart';
    cardCartImg.className = 'card-cart-img';

    // Add inner Text
    productImg.src = card.thumbnail;
    cardPrice.textContent = `$${card.price.toString()}`;
    cardTitle.textContent = card.title;
    cardDescription.textContent = card.description;
    cardCartImg.src = './assets/icons/add-to-cart-icon.svg';

    raitingText.textContent = card.rating.toString();

    // Add to html
    div.append(productCard);
    productCard.append(productImg);
    productCard.append(cardTextWrapper);

    cardTextWrapper.append(cardPrice);
    cardTextWrapper.append(cardTitle);
    cardTextWrapper.append(cardDescription);
    cardTextWrapper.append(cardBottom);

    cardBottom.append(cardRating);
    cardBottom.append(cardCart);

    cardRating.append(ratingStar);
    cardRating.append(raitingText);

    cardCart.append(cardCartImg);
  }

  drawPrice(price: { min: number; max: number }, filtersDiv: HTMLDivElement) {
    const inputTextMin: HTMLInputElement | null = document.querySelector('.price-min');
    const inputTextMax: HTMLInputElement | null = document.querySelector('.price-max');

    if (inputTextMin && inputTextMax) {
      inputTextMin.value = price.min.toString();
      inputTextMax.value = price.max.toString();
    }

    console.log(price, filtersDiv);
  }
}

export default Catalog;
