import { Types } from '../types/Types';
import { capitalizeExpr, createRating } from '../helpers/helpers';
import Cart from './cart';

class ProductDetails {
  cart: Cart;

  constructor(cart: Cart) {
    this.cart = cart;
  }

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

    // fill rating txt and stars
    if (ratingText) {
      ratingText.innerHTML = String(data.rating);
    }
    createRating(ratingStars, data.rating);
    this.initButtons(data);
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
        document.querySelector('.product-img-wrapper')?.append(imgThumbs[i]);
      }
    }
    imgThumbs[0].classList.add('thumb--active');
    mainImg.addEventListener('mouseenter', () => {
      this.createMagnifyerDiv();
    });
    mainImg.addEventListener('mousemove', (e) => {
      this.magnifyImage(e);
    });
    mainImg.addEventListener('mouseleave', (e) => {
      this.removeMagnify(e);
    });

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

  createMagnifyerDiv() {
    const modal = document.createElement('div');
    modal.classList.add('modal-prodDetails');
    document.body.append(modal);
  }

  magnifyImage(e: MouseEvent) {
    const modal = <HTMLDivElement>document.querySelector('.modal-prodDetails');
    if (modal) {
      const currImg = <HTMLDivElement>document.querySelector('.product-img');
      modal.style.backgroundImage = currImg.style.backgroundImage;
      modal.style.backgroundPositionX = `${((e.pageX - currImg.offsetLeft) / currImg.offsetWidth) * 100}%`;
      modal.style.backgroundPositionY = `${((e.pageY - currImg.offsetTop) / currImg.offsetHeight) * 100}%`;
    }
  }

  removeMagnify(e: MouseEvent) {
    document.querySelector('.modal-prodDetails')?.remove();
  }

  initButtons(data: Types.Product) {
    const btnAdd = document.querySelector('.button-add');
    const btnBuyNow = document.querySelector('.button-buy-now');
    const btnGoToCart = document.querySelector('.to-cart');
    const btnGoToCatalog = document.querySelector('.to-catalog');
    if (btnAdd) {
      for (let i = 0; i < this.cart.cartItems.length; i++) {
        if (this.cart.cartItems[i].product.id == data.id) {
          btnAdd.classList.add('added');
          btnAdd.innerHTML = 'Added';
        }
      }
    }
    btnAdd?.addEventListener('click', () => {
      if (btnAdd.classList.contains('added')) {
        btnAdd.classList.remove('added');
        btnAdd.innerHTML = 'Add to cart';
        this.cart.deleteProduct(data);
      } else {
        btnAdd.classList.add('added');
        btnAdd.innerHTML = 'Added';
        console.log('added to cart');
        this.cart.addToCart(data);
        console.log(this.cart.cartItems);
      }
    });
    btnBuyNow?.addEventListener('click', () => {
      this.cart.addToCart(data);
      console.log(this.cart.cartItems);
      window.location.href = '#cart';
      setTimeout(() => {
        const cartDiv = document.querySelector('.cart');
        if (cartDiv) {
          this.cart.fillCart();
        }
        this.cart.openModal();
      }, 50);
    });
    btnGoToCart?.addEventListener('click', () => {
      window.location.href = '#cart';
    });
    btnGoToCatalog?.addEventListener('click', () => {
      window.location.href = '#catalog';
    });
  }
}
export default ProductDetails;
