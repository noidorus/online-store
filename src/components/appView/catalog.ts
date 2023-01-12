import { capitalizeExpr } from '../helpers/helpers';
import { ICatalog } from '../types/interfaces';
import { Types } from '../types/Types';

class Catalog implements ICatalog {
  drawCategory(category: string, div: HTMLDivElement, name: string): void {
    const label = document.createElement('label');
    const input = document.createElement('input');
    const span = document.createElement('span');

    label.className = `checkbox__item ${name}__item`;
    input.className = `checkbox__item-input ${name}__item-input`;
    span.className = 'checkmark';
    if (name == 'category') {
      label.textContent = capitalizeExpr(category);
    } else {
      label.textContent = category;
    }
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
    const cardTop = document.createElement('div');
    const cardBottom = document.createElement('div');
    const cardRating = document.createElement('div');
    const ratingStar = document.createElement('div');
    const raitingText = document.createElement('p');
    const cardCart = document.createElement('div');
    const cardCartImg = document.createElement('img');

    // Add Classes
    productCard.className = 'product-card';
    productCardLink.href = `/product-details-${card.id}`;
    productCard.id = `product-${card.id}`;
    productImg.className = 'card-image';
    cardTextWrapper.className = 'card-txt-wrapper';
    cardPrice.className = 'card-price';
    cardTitle.className = 'card-title';
    cardDescription.className = 'card-description';

    productCardLink.className = 'product-card__link';
    cardTop.className = 'card-top-wrapper';
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
    productCardLink.innerHTML = 'More';

    raitingText.textContent = card.rating.toString();

    // Add to html
    productCard.append(productImg);
    productCard.append(cardTextWrapper);

    cardTextWrapper.append(cardTop);
    cardTextWrapper.append(cardTitle);
    cardTextWrapper.append(cardDescription);
    cardTextWrapper.append(cardBottom);

    cardTop.append(cardPrice, productCardLink);
    cardBottom.append(cardRating, cardCart);

    cardRating.append(ratingStar);
    cardRating.append(raitingText);

    cardCart.append(cardCartImg);
    div.append(productCard);
  }

  drawSliderFilter(filterCat: { min: number; max: number }, filterType: string) {
    const inputTextMin: HTMLInputElement | null = document.querySelector(`.${filterType}-min`);
    const inputTextMax: HTMLInputElement | null = document.querySelector(`.${filterType}-max`);
    if (inputTextMin && inputTextMax) {
      inputTextMin.value = filterCat.min.toString();
      inputTextMax.value = filterCat.max.toString();
    }
    this.drawSliderInput(filterCat, filterType);
  }

  drawSliderInput(filterCat: { min: number; max: number }, filterType: string) {
    const sliderWrapper = document.querySelector(`.${filterType}-range-wrapper`);
    const sliderInputMin = <HTMLInputElement>sliderWrapper?.querySelector('.range-min');
    const sliderInputMax = <HTMLInputElement>sliderWrapper?.querySelector('.range-max');
    const inputBoxMin = <HTMLInputElement>document.querySelector(`.${filterType}-min`);
    const inputBoxMax = <HTMLInputElement>document.querySelector(`.${filterType}-max`);
    const sliderTrack = <HTMLDivElement>sliderWrapper?.querySelector('.slider-track');
    sliderInputMin.max = String(filterCat.max);
    sliderInputMax.max = String(filterCat.max);
    inputBoxMin.max = String(filterCat.max);
    inputBoxMax.max = String(filterCat.max);
    sliderInputMin.min = String(filterCat.min);
    sliderInputMax.min = String(filterCat.min);
    inputBoxMin.min = String(filterCat.min);
    inputBoxMax.min = String(filterCat.min);
    sliderInputMin.value = sliderInputMin.min;
    sliderInputMax.value = sliderInputMax.max;
    this.calcSliderInput(sliderInputMin, sliderInputMax, inputBoxMin, inputBoxMax, sliderTrack, true);
  }

  calcSliderInput(
    sliderInputMin: HTMLInputElement,
    sliderInputMax: HTMLInputElement,
    inputBoxMin: HTMLInputElement,
    inputBoxMax: HTMLInputElement,
    sliderTrack: HTMLDivElement,
    input: boolean
  ) {
    const minGap = 0;
    if (+sliderInputMax.value - +sliderInputMin.value <= minGap) {
      sliderInputMin.value = String(+sliderInputMax.value - minGap);
    }
    if (input) inputBoxMin.value = sliderInputMin.value;
    sliderTrack.style.background = this.fillSliderTrack(sliderInputMin, sliderInputMax);

    if (+sliderInputMax.value - +sliderInputMin.value <= minGap) {
      sliderInputMax.value = String(+sliderInputMax.value + minGap);
    }

    if (input) inputBoxMax.value = sliderInputMax.value;
    sliderTrack.style.background = this.fillSliderTrack(sliderInputMin, sliderInputMax);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fillSliderTrack(minInput: HTMLInputElement, maxInput: HTMLInputElement, maxVal?: string) {
    const dif = Math.round(100 / (+maxInput.max - +minInput.min));
    const pc1 = (+minInput.value - +minInput.min) * dif;
    const pc2 = (+maxInput.value - +minInput.min) * dif;
    return `Linear-Gradient(To Right, #Dadae5 ${pc1}% , #8e2de2 ${pc1}% , #8e2de2 ${pc2}%, #Dadae5 ${pc2}%)`;
  }
}

export default Catalog;
