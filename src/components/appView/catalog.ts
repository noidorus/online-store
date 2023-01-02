import { Types } from '../types/Types';

class Catalog {
  drawCategory(category: string, div: HTMLDivElement, name: string): void {
    const label = document.createElement('label');
    const input = document.createElement('input');
    const span = document.createElement('span');

    label.className = `checkbox__item ${name}__item`;
    input.className = `checkbox__item-input ${name}__item-input`;
    span.className = 'checkmark';

    label.textContent = category;
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', name);
    input.value = category;

    label.append(input);
    label.append(span);
    div.append(label);
  }

  drawCard(card: Types.Product, div: HTMLDivElement) {
    const productCard = document.createElement('div');
    const productCardLink = document.createElement('a');
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
    productCardLink.className = 'product-card-link';
    productCard.className = 'product-card';
    productCardLink.href = `#product-details/${card.id}`;
    productCard.id = String(card.id);
    productImg.className = 'card-image';
    cardTextWrapper.className = 'card-txt-wrapper';
    cardPrice.className = 'card-price';
    cardTitle.className = 'card-title';
    cardDescription.className = 'card-description';

    cardBottom.className = 'card-bottom-wrapper';
    cardRating.className = 'card-rating';
    ratingStar.className = 'card-rating-star';
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
    productCard.append(productCardLink);
    productCardLink.append(productImg);
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
    const inputTextMin: HTMLInputElement | null = filtersDiv.querySelector('.price-min');
    const inputTextMax: HTMLInputElement | null = filtersDiv.querySelector('.price-max');

    if (inputTextMin && inputTextMax) {
      inputTextMin.value = price.min.toString();
      inputTextMax.value = price.max.toString();
    }
  }

  addCardViewToggler() {
    const toggleBtn = document.querySelector('.display-icon');
    const catalogContainer = document.querySelector('.cards-wrapper');
    if (toggleBtn && catalogContainer) {
      toggleBtn.addEventListener('click', () => {
        if (toggleBtn.classList.contains('list')) {
          toggleBtn.classList.remove('list');
          catalogContainer.classList.remove('list');
        } else {
          toggleBtn.classList.add('list');
          catalogContainer.classList.add('list');
        }
      });
    }
  }
}

export default Catalog;
