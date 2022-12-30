import { Types } from '../types/Types';
import { capitalizeExpr, createRating } from '../helpers/helpers';

class ProductDetails {
  drawProduct(data: Types.Product) {
    this.drawCrumbs(data);
    this.drawProductDescr(data);
    this.drawProductImgs(data);
  }

  drawCrumbs(data: Types.Product) {
    const crumbs = document.querySelectorAll('.crumb');
    crumbs[1].innerHTML = capitalizeExpr(data.category);
    crumbs[2].innerHTML = capitalizeExpr(data.brand);
    crumbs[3].innerHTML = data.title;
  }

  drawProductDescr(data: Types.Product) {
    // select all elements
    const productBrand = document.querySelector('.product-brand');
    const productCategory = document.querySelector('.product-category');
    const productTitle = document.querySelector('.product-title');
    const salePersent = document.querySelector('.sale');
    const ratingStars = <NodeListOf<HTMLDivElement>>document.querySelectorAll('.rating-star');
    const ratingText = document.querySelector('.rating-txt');
    const productDescr = document.querySelector('.product-description');
    const productStock = document.querySelector('.product-stock-q');

    // fill all elements
    if (productBrand && productCategory) {
      productBrand.innerHTML = capitalizeExpr(data.brand);
      productCategory.innerHTML = capitalizeExpr(data.category);
    }

    if (productTitle && productDescr && productStock) {
      productTitle.innerHTML = data.title;
      productDescr.innerHTML = data.description;
      productStock.innerHTML = String(data.stock);
    }

    if (salePersent) {
      salePersent.innerHTML = `${Math.round(data.discountPercentage)}% OFF`;
    }

    // fill rating txtx and stars
    if (ratingText) {
      ratingText.innerHTML = String(data.rating);
    }
    createRating(ratingStars, data.rating);
  }

  drawProductImgs(data: Types.Product) {
    // select imgs elements
    const mainImg = <HTMLDivElement>document.querySelector('.product-img');
    const images = data.images;
    const imgThumbs: HTMLElement[] = [];
    for (let i = 0; i < images.length; i++) {
      if (!images[i].includes('thumbnail')) {
        imgThumbs.push(document.createElement('div'));
        imgThumbs[i].classList.add('product-thumb');
        console.log(imgThumbs[i]);
        document.querySelector('.product-img-wrapper')?.append(imgThumbs[i]);
      }
    }
    imgThumbs[0].classList.add('thumb--active');

    // fill thumbnails
    for (let i = 0; i < imgThumbs.length; i++) {
      imgThumbs[i].style.backgroundImage = `url(${data.images[i]})`;
    }
    // fill main img
    this.selectImage(images, imgThumbs, mainImg);
  }

  selectImage(dataImages: string[], imgThumbs: HTMLElement[], mainImg: HTMLDivElement) {
    for (let i = 0; i < imgThumbs.length; i++) {
      if (imgThumbs[i].classList.contains('thumb--active')) {
        mainImg.style.backgroundImage = `url(${dataImages[i]})`;
      }
      imgThumbs[i].addEventListener('click', () => {
        imgThumbs.forEach((el) => {
          el.classList.remove('thumb--active');
        });
        imgThumbs[i].classList.add('thumb--active');
        mainImg.style.backgroundImage = `url(${dataImages[i]})`;
      });
    }
  }
}
export default ProductDetails;
