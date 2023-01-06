import { Types } from '../types/Types';

class Cart {
  cartItems: Types.TCart = [];
  totalQty = 0;
  totalPrice = 0;
  promoPc = 0;
  totalDiscount = 0;
  paginationCount = 3;

  initCartAdd(productCardDivCart: Element, product: Types.Product) {
    const card = document.getElementById(`product-${product.id}`);
    const cardCartWrapper = <HTMLDivElement>card?.lastChild?.lastChild?.lastChild;
    if (this.productInCart(product)) cardCartWrapper?.classList.add('added');
    productCardDivCart.addEventListener('click', () => {
      if (this.productInCart(product)) {
        this.deleteProduct(product);
        cardCartWrapper?.classList.remove('added');
      } else {
        this.addToCart(product);
        cardCartWrapper?.classList.add('added');
      }
    });
  }

  addToCart(product: Types.Product) {
    if (this.cartItems.length === 0) {
      this.cartItems.push({ product: product, qty: 1 });
    } else {
      let norepeat = true;
      for (let i = 0; i < this.cartItems.length; i++) {
        if (this.cartItems[i].product.id == product.id) {
          this.cartItems[i].qty++;
          norepeat = false;
        }
      }
      if (norepeat) this.cartItems.push({ product: product, qty: 1 });
    }

    this.updateHeader();
  }

  fillCart(page: number) {
    const startIdx = page * this.paginationCount;
    let endIdx =
      this.cartItems.length >= this.paginationCount ? startIdx + this.paginationCount : this.cartItems.length;
    if (endIdx > this.cartItems.length) endIdx = this.cartItems.length;
    const cartItemsWrapper = <HTMLDivElement>document.querySelector('.cart-items-wrapper');
    cartItemsWrapper.innerHTML = '';
    if (this.cartItems.length == 0) {
      const cartWrapper = <HTMLDivElement>document.querySelector('.cart-wrapper');
      const cartSubst = <HTMLDivElement>document.querySelector('.cart-substitute');
      if (cartSubst && cartWrapper) {
        cartSubst.style.display = 'block';
        cartWrapper.style.display = 'none';
        document.querySelector('.cart-substitute__button')?.addEventListener('click', () => {
          window.location.href = '#catalog';
        });
      }
    } else {
      for (let i = startIdx; i < endIdx; i++) {
        if (i == 0) {
          this.addItem(this.cartItems[i], i + 1, false);
        } else this.addItem(this.cartItems[i], i + 1, true);
      }
    }
    this.updateCheckout();
    const checkoutBtn = document.querySelector('.checkout-button-wrapper');
    checkoutBtn?.addEventListener('click', () => {
      this.openModal();
    });
    const overlay = document.querySelector('.overlay');
    if (overlay)
      overlay.addEventListener('click', () => {
        document.querySelector('.modal')?.classList.add('hidden');
        overlay.classList.add('hidden');
      });
    const backBtn = document.querySelector('.back-btn');
    backBtn?.addEventListener('click', () => {
      window.location.hash = '#catalog';
    });

    const inputCVV = <HTMLInputElement>document.querySelector('.input-cvv');
    const inputExpiry = <HTMLInputElement>document.querySelector('.input-expiry');
    inputCVV.addEventListener('input', () => {
      if (isNaN(Number(inputCVV.value))) inputCVV.value = '';
    });
    inputExpiry.addEventListener('input', () => {
      if (inputExpiry.value.match(/\//g))
        inputExpiry.value = inputExpiry.value.slice(0, 2) + inputExpiry.value.slice(3);
      if (
        +inputExpiry.value.slice(0, 2) > 12 ||
        +inputExpiry.value.slice(0, 2) < 0 ||
        +inputExpiry.value.slice(2) > 31 ||
        +inputExpiry.value.slice(2) < 0
      ) {
        inputExpiry.setCustomValidity('Invalid date');
      } else inputExpiry.setCustomValidity('');
    });
    inputExpiry.addEventListener('change', () => {
      if (inputExpiry.value.length == 4) {
        inputExpiry.value = inputExpiry.value.slice(0, 2) + '/' + inputExpiry.value.slice(2);
      }
      if (+inputExpiry.value.slice(0, 2) > 12 || +inputExpiry.value.slice(0, 2) < 0) inputExpiry.value = '';
      if (+inputExpiry.value.slice(3) > 31 || +inputExpiry.value.slice(3) < 0) inputExpiry.value = '';
    });
  }

  updateCart(page: number) {
    const startIdx = page * this.paginationCount;
    let endIdx =
      this.cartItems.length >= this.paginationCount ? startIdx + this.paginationCount : this.cartItems.length;
    if (endIdx > this.cartItems.length) endIdx = this.cartItems.length;
    const cartItemsWrapper = <HTMLDivElement>document.querySelector('.cart-items-wrapper');
    cartItemsWrapper.innerHTML = '';
    if (this.cartItems.length == 0) {
      const cartWrapper = <HTMLDivElement>document.querySelector('.cart-wrapper');
      const cartSubst = <HTMLDivElement>document.querySelector('.cart-substitute');
      if (cartSubst && cartWrapper) {
        cartSubst.style.display = 'block';
        cartWrapper.style.display = 'none';
        document.querySelector('.cart-substitute__button')?.addEventListener('click', () => {
          window.location.href = '#catalog';
        });
      }
    } else {
      for (let i = startIdx; i < endIdx; i++) {
        if (i == 0) {
          this.addItem(this.cartItems[i], i + 1, false);
        } else this.addItem(this.cartItems[i], i + 1, true);
      }
    }
    this.updateCheckout();
  }

  addItem(item: Types.ICartSlot, itemPos: number, position: boolean) {
    const itemWrapper = document.querySelector('.cart-items-wrapper');
    const cartItem = document.createElement('div');
    const itemNum = document.createElement('div');
    const itemImg = document.createElement('div');
    const itemName = document.createElement('p');
    const itemDescr = document.createElement('div');
    const itemPrice = document.createElement('p');
    const itemQty = document.createElement('div');
    const btnMinus = document.createElement('button');
    const input = document.createElement('input');
    const btnPlus = document.createElement('button');
    const itemTotal = document.createElement('p');
    const itemDeleteIcon = document.createElement('p');

    cartItem.classList.add('cart__item');
    cartItem.id = `cartItemId${item.product.id}`;
    itemNum.classList.add('cart__item-num');
    itemImg.classList.add('cart__item-img');
    itemName.classList.add('cart__item-name');
    itemDescr.classList.add('cart__item-details');
    itemPrice.classList.add('cart__item-price');
    itemQty.classList.add('cart__item-qty');
    btnMinus.classList.add('button');
    btnMinus.classList.add('btn-minus');
    input.classList.add('amount');
    btnPlus.classList.add('button');
    btnPlus.classList.add('btn-plus');
    itemTotal.classList.add('cart__item-total');
    itemDeleteIcon.classList.add('cart__item-del');

    itemWrapper?.append(cartItem);

    itemQty.append(btnMinus, input, btnPlus);

    cartItem.append(itemNum, itemImg, itemName, itemDescr, itemPrice, itemQty, itemTotal, itemDeleteIcon);

    if (position) {
      const breakLine = document.createElement('hr');
      breakLine.classList.add('split-line');
      breakLine.id = `breakLine${item.product.id}`;
      cartItem?.before(breakLine);
    }

    // fill cart item

    itemNum.innerHTML = String(itemPos);
    itemImg.style.backgroundImage = `url(${item.product.thumbnail})`;
    itemName.innerHTML = item.product.title;
    itemDescr.innerHTML = item.product.description;
    itemPrice.innerHTML = `$${item.product.price}`;
    btnMinus.innerHTML = '−';
    btnPlus.innerHTML = '+';
    input.value = String(item.qty);
    itemTotal.innerHTML = `$${item.product.price * item.qty}`;
    itemDeleteIcon.innerHTML = '&#9587;';

    this.makeInteractible(btnMinus, input, btnPlus, itemDeleteIcon, itemTotal, item);
  }

  makeInteractible(
    btnMinus: HTMLButtonElement,
    input: HTMLInputElement,
    btnPlus: HTMLButtonElement,
    itemDelete: HTMLDivElement,
    itemTotal: HTMLDivElement,
    item: Types.ICartSlot
  ) {
    btnMinus.addEventListener('click', () => {
      input.value = String(+input.value - 1);
      if (+input.value <= 0) {
        this.deleteItem(item);
      } else {
        itemTotal.innerHTML = `$${+input.value * item.product.price}`;
        item.qty = Number(input.value);
      }
      this.updateHeader();
      this.updateCheckout();
    });

    input.addEventListener('change', () => {
      if (+input.value <= 0) {
        this.deleteItem(item);
      } else {
        if (+input.value > item.product.stock) input.value = String(item.product.stock);
        itemTotal.innerHTML = `$${+input.value * item.product.price}`;
        item.qty = Number(input.value);
      }
      this.updateHeader();
      this.updateCheckout();
    });

    btnPlus.addEventListener('click', () => {
      input.value = String(+input.value + 1);
      if (+input.value > item.product.stock) input.value = String(item.product.stock);
      itemTotal.innerHTML = `$${+input.value * item.product.price}`;
      item.qty = Number(input.value);
      this.updateHeader();
      this.updateCheckout();
    });

    itemDelete.addEventListener('click', () => {
      this.deleteItem(item);
      this.updateHeader();
      this.updateCheckout();
    });
  }

  deleteItem(item: Types.ICartSlot) {
    const itemDiv = document.getElementById(`cartItemId${item.product.id}`);
    const breakLine = document.getElementById(`breakLine${item.product.id}`);
    const pageToInit = this.findPage();
    this.cartItems.splice(this.cartItems.indexOf(item), 1);
    itemDiv?.remove();
    breakLine?.remove();
    this.updateHeader();
    this.updateCheckout();
    console.log(pageToInit);
    if (pageToInit !== undefined) this.updatePages(pageToInit);
    if (this.cartItems.length == 0) {
      const cartWrapper = <HTMLDivElement>document.querySelector('.cart-wrapper');
      const cartSubst = <HTMLDivElement>document.querySelector('.cart-substitute');
      if (cartSubst && cartWrapper) {
        cartSubst.style.display = 'block';
        cartWrapper.style.display = 'none';
        document.querySelector('.cart-substitute__button')?.addEventListener('click', () => {
          window.location.href = '#catalog';
        });
      }
    }
  }

  deleteProduct(product: Types.Product) {
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].product.id == product.id) {
        this.cartItems.splice(i, 1);
        break;
      }
    }
    this.updateHeader();
  }

  updatePages(activePage: number) {
    const pagesCount = Math.ceil(this.cartItems.length / this.paginationCount);
    console.log(activePage, pagesCount);

    if (activePage >= pagesCount) {
      this.initPages(pagesCount, pagesCount - 1);
      const createdPages = <HTMLDivElement[]>[...document.querySelectorAll('.page-idx')];
      this.goToPage(createdPages, pagesCount - 1);
    } else {
      this.initPages(pagesCount, activePage);
      const createdPages = <HTMLDivElement[]>[...document.querySelectorAll('.page-idx')];
      this.goToPage(createdPages, activePage);
    }
  }

  findPage() {
    const currPageItems = document.querySelectorAll('.cart__item');
    const cartId = currPageItems[0].id.replace('cartItemId', '');
    let currPage;
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].product.id == +cartId) {
        currPage = Math.floor(i / this.paginationCount);
      }
    }
    return currPage;
  }

  updateHeader() {
    const priceDiv = <HTMLDivElement>document.querySelector('.shopping-cart__price');
    const quantityDiv = <HTMLDivElement>document.querySelector('.shopping-cart__count');
    this.totalQty = this.cartItems.reduce((acc, curr) => acc + curr.qty, 0);
    this.totalPrice = this.cartItems.reduce((acc, curr) => acc + curr.product.price * curr.qty, 0);
    this.totalDiscount = this.cartItems.reduce((acc, curr) => acc + curr.product.discountPercentage, 0);
    quantityDiv.innerHTML = String(this.cartItems.length);
    priceDiv.innerHTML = `$${this.totalPrice}`;
  }

  updateCheckout() {
    const amountSubtotal = document.querySelector('.amount-subtotal');
    const discountAmount = document.querySelector('.amount-discount');
    const totalAmount = document.querySelector('.amount-total');
    const checkoutAmount = document.querySelector('.amount-checkout');

    if (amountSubtotal) amountSubtotal.innerHTML = `$${this.totalPrice}`;
    this.updatePromo(0);
    if (discountAmount && totalAmount && checkoutAmount) {
      this.totalDiscount = this.cartItems.reduce(
        (acc, curr) => acc + Math.round((curr.product.price * curr.qty * curr.product.discountPercentage) / 100),
        0
      );
      discountAmount.innerHTML = `-$${this.totalDiscount}`;
      totalAmount.innerHTML = checkoutAmount.innerHTML = `$${
        this.totalPrice - this.totalDiscount - (this.totalPrice * this.promoPc) / 100
      }`;
    }
  }

  updatePromo(promoPcAm: number) {
    this.promoPc = promoPcAm;
    const promoPerc = document.querySelector('.title-promo-amount');
    const promoAmount = document.querySelector('.amount-promo');
    if (promoPerc && promoAmount) {
      promoPerc.innerHTML = this.promoPc ? `${this.promoPc}%` : '0';
      promoAmount.innerHTML = this.promoPc ? `$${(this.totalPrice * this.promoPc) / 100}` : '';
    }
  }

  openModal() {
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('.overlay');

    if (modal && overlay) {
      modal.classList.remove('hidden');
      overlay.classList.remove('hidden');
      const modalBtn = document.querySelector('.modal-button');
      if (modalBtn) {
        modalBtn.innerHTML = `Complete payment — $${
          this.totalPrice - this.totalDiscount - (this.totalPrice * this.promoPc) / 100
        }`;
        modalBtn.addEventListener('click', () => {
          this.showMessage(this.validateForm());
        });
      }
    }
  }

  productInCart(product: Types.Product) {
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].product.id === product.id) return true;
    }
    return false;
  }

  validateForm() {
    let formValid = true;
    const inputFirstName = <HTMLInputElement>document.querySelector('.input-first-name');
    const inputLastName = <HTMLInputElement>document.querySelector('.input-last-name');
    const inputPhone = <HTMLInputElement>document.querySelector('.input-phone');
    const inputAddress = <HTMLInputElement>document.querySelector('.input-address');
    const inputEmail = <HTMLInputElement>document.querySelector('.input-email');
    // const inputCardName = <HTMLInputElement>document.querySelector('.input-name');
    const inputCardNum = <HTMLInputElement>document.querySelector('.input-card-num');
    const inputCVV = <HTMLInputElement>document.querySelector('.input-cvv');
    const inputExpiry = <HTMLInputElement>document.querySelector('.input-expiry');

    if (inputFirstName && inputLastName) {
      if (inputFirstName.value.length < 3 || inputLastName.value.length < 3) formValid = false;
    }

    if (inputPhone) {
      if (!inputPhone.value.match(/\+\d{9}/g)) {
        console.log('inputPhone');
        formValid = false;
      }
    }

    if (inputAddress) {
      if (!inputAddress.value.match(/^(\b[A-Za-z]{3,}\s+[A-Za-z]{3,}\s+[A-Za-z]{3,}\b)$/g)) {
        console.log('inputAddress');
        formValid = false;
      }
    }

    if (inputEmail) {
      if (!inputEmail.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
        formValid = false;
        console.log('inputEmail');
      }
    }

    if (inputCardNum) {
      if (!inputCardNum.value.match(/^\d{16}$/g)) {
        formValid = false;
        console.log('inputCardNum');
      }
    }

    if (inputCVV) {
      if (!inputCVV.value.match(/^\d{3}$/g)) {
        console.log('inputCVV');
        formValid = false;
      }
    }

    if (inputExpiry) {
      if (!inputExpiry.value.match(/^\d{4}$|^\d{2}\/\d{2}$/g)) {
        console.log('inputExpiry');
        formValid = false;
      }
    }

    return formValid;
  }

  showMessage(mesType: boolean) {
    const modalWarning = document.createElement('div');
    const modalTxt = document.createElement('p');
    const modalBtn = document.createElement('button');

    modalWarning.classList.add('modal-warning');
    modalTxt.classList.add('modal-warning__text');
    modalBtn.classList.add('button');

    modalWarning.append(modalTxt, modalBtn);
    document.querySelector('.main-wrapper')?.append(modalWarning);

    if (mesType) {
      modalBtn.remove();
      modalTxt.innerHTML = 'The order was successfully completed!\nRedirecting...';
      setTimeout(() => {
        window.location.hash = '#catalog';
      }, 5000);
    } else {
      modalTxt.innerHTML = 'Please check the validity of all areas!';
      modalBtn.innerHTML = 'Back to checkout';
    }

    modalBtn.addEventListener('click', () => {
      modalWarning.remove();
    });
  }

  initPagesandCart() {
    // TODO: add query
    this.paginationCount = 3;
    const paginationDropdown = document.querySelector('.pagination-count-wrapper');
    const paginationVisible = document.querySelector('.pagination-visible--active');
    const paginationInvisible = document.querySelector('.pagination-invisible');
    paginationDropdown?.addEventListener('click', () => {
      paginationInvisible?.classList.toggle('show');
    });
    const paginationOpts = document.querySelectorAll('.pagination-inactive');
    if (paginationVisible) {
      paginationOpts.forEach((opt) => {
        opt.addEventListener('click', () => {
          this.paginationCount = Number(opt.textContent);
          paginationVisible.textContent = opt.textContent;
          const pagesCount = Math.ceil(this.cartItems.length / this.paginationCount);
          this.initPages(pagesCount, 0);
          this.fillCart(0);
        });
      });
    }
    const pagesCount = Math.ceil(this.cartItems.length / this.paginationCount);
    this.initPages(pagesCount, 0);
    this.fillCart(0);
  }

  initPages(pagesCount: number, pageActive: number) {
    const catalogPages = <HTMLDivElement>document.querySelector('.cart-pages');
    if (catalogPages) {
      if (pagesCount <= 1) {
        catalogPages.style.display = 'none';
      } else {
        catalogPages.style.display = 'flex';
        this.createPages(pagesCount, pageActive);
      }
    }
  }

  createPages(pagesCount: number, pageActive: number) {
    const pagesWrapper = document.querySelector('.pages-wrapper');
    const pageNext = document.querySelector('.page-next');
    const pagePrev = document.querySelector('.page-prev');

    if (pagesWrapper) {
      pagesWrapper.innerHTML = '';
    }
    const pagesArr: HTMLDivElement[] = [];
    for (let i = 0; i < pagesCount; i++) {
      pagesArr.push(document.createElement('p'));
      pagesArr[i].className = 'catalog__page';
      pagesArr[i].className = 'page-idx';
      pagesArr[i].textContent = String(i + 1);
      pagesWrapper?.append(pagesArr[i]);
      pagesArr[i].addEventListener('click', () => {
        this.goToPage(pagesArr, i);
      });
    }
    pagesArr[pageActive].classList.add('page-idx--active');
    pageNext?.addEventListener('click', () => {
      this.goToPage(pagesArr, this.findPageIdx(pagesArr) + 1);
    });
    pagePrev?.addEventListener('click', () => {
      this.goToPage(pagesArr, this.findPageIdx(pagesArr) - 1);
    });
  }

  goToPage(pagesArr: HTMLDivElement[], idx: number) {
    const cartDiv: HTMLDivElement | null = document.querySelector('.cart-items-wrapper');
    if (idx >= 0 && idx < pagesArr.length) {
      for (let i = 0; i < pagesArr.length; i++) {
        pagesArr[i].classList.remove('page-idx--active');
      }
      pagesArr[idx].classList.add('page-idx--active');
      if (cartDiv) {
        this.updateCart(idx);
      }
    }
  }

  findPageIdx(pagesArr: HTMLDivElement[]) {
    for (let i = 0; i < pagesArr.length; i++) {
      if (pagesArr[i].classList.contains('page-idx--active')) return i;
    }
    return 0;
  }
}

export default Cart;
