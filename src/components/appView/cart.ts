import { Types } from '../types/Types';

class Cart {
  cartItems: Types.TCart = [];
  totalQty = 0;
  totalPrice = 0;
  checkoutPrice = 0;
  totalDiscount = 0;
  appliedPromos: string[] = [];
  promoPc = 0;
  promoMoneyAmount = 0;
  entriesOnPage = 3;
  pageQuery = new URLSearchParams(window.location.search);

  // HIGHEST ENTRY POINT
  initCartPage() {
    // init cart items
    const storagedItems = localStorage.getItem('onlineStoreCart112547');
    if (storagedItems) this.cartItems = JSON.parse(storagedItems);

    // init Number of entries on page & calc the amount of pages
    let currPage = this.getFromQuery('page') ? Number(this.getFromQuery('page')) - 1 : 0;
    this.entriesOnPage = this.getFromQuery('entries') ? Number(this.getFromQuery('entries')) : 3;
    const pagesCount = Math.ceil(this.cartItems.length / this.entriesOnPage);
    if (pagesCount < currPage + 1) {
      currPage = 0;
      this.deleteFromQuery('page');
    }
    // update header on init
    this.updateHeader();

    // Choose between filler and cart
    if (this.cartItems.length == 0) {
      this.createFiller();
    } else {
      this.initCartLinks();
      this.updateDropdown(this.entriesOnPage);
      this.updateCheckout();
      this.createPagesAndCart(pagesCount, currPage);
    }
  }

  // ***
  // INIT methods
  initCartLinks() {
    // init pagination dropdown
    this.initPaginationDropdownLinks();
    // init promo input
    this.initPromoInput();
    // init checkout button
    this.initCheckoutLink();
    // init modal & overlay links
    this.initModalLinks();
  }

  // Init links
  initPaginationDropdownLinks() {
    const paginationDropdownBtn = document.querySelector('.pagination-count-wrapper');
    const paginationVisible = document.querySelector('.pagination-visible--active');
    const paginationInvisible = document.querySelector('.pagination-invisible');
    const paginationOptions = document.querySelectorAll('.pagination-inactive');

    paginationDropdownBtn?.addEventListener('click', () => {
      paginationInvisible?.classList.toggle('show');
    });
    if (paginationVisible) {
      paginationOptions.forEach((option) => {
        option.addEventListener('click', () => {
          this.entriesOnPage = Number(option.textContent);
          paginationVisible.textContent = option.textContent;
          this.writeToQuery('entries', String(this.entriesOnPage));
          const pagesCount = Math.ceil(this.cartItems.length / this.entriesOnPage);
          this.createPages(pagesCount, 0);
          this.fillCart(0);
        });
      });
    }
  }

  initCheckoutLink() {
    const checkoutBtn = document.querySelector('.checkout-button-wrapper');
    checkoutBtn?.addEventListener('click', () => {
      this.openModal();
    });
  }

  initModalLinks() {
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
  }

  initPromoInput() {
    const promocodeInput = <HTMLInputElement>document.querySelector('.promocode-input');
    const btnApply = document.querySelector('.btn-submit');
    promocodeInput?.addEventListener('change', () => {
      this.searchPromo(promocodeInput.value, Types.promos);
    });
    btnApply?.addEventListener('change', () => {
      this.searchPromo(promocodeInput.value, Types.promos);
    });
  }

  // cart item links
  makeInteractible(
    btnMinus: HTMLButtonElement,
    input: HTMLInputElement,
    btnPlus: HTMLButtonElement,
    itemDelete: HTMLDivElement,
    itemTotal: HTMLDivElement,
    item: Types.ICartSlot
  ) {
    btnMinus.addEventListener('click', () => {
      console.log(this.cartItems);

      input.value = String(+input.value - 1);
      if (+input.value <= 0) {
        this.deleteItem(item);
      } else {
        itemTotal.innerHTML = `$${+input.value * item.product.price}`;
        item.qty = Number(input.value);
        localStorage.setItem('onlineStoreCart112547', JSON.stringify(this.cartItems));
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
        localStorage.setItem('onlineStoreCart112547', JSON.stringify(this.cartItems));
      }
      this.updateHeader();
      this.updateCheckout();
    });

    btnPlus.addEventListener('click', () => {
      console.log(this.cartItems);
      input.value = String(+input.value + 1);
      if (+input.value > item.product.stock) input.value = String(item.product.stock);
      itemTotal.innerHTML = `$${+input.value * item.product.price}`;
      item.qty = Number(input.value);
      localStorage.setItem('onlineStoreCart112547', JSON.stringify(this.cartItems));
      this.updateHeader();
      this.updateCheckout();
    });

    itemDelete.addEventListener('click', () => {
      this.deleteItem(item);
      this.updateHeader();
      this.updateCheckout();
    });
  }

  // FILL methods
  createFiller() {
    const cartWrapper = <HTMLDivElement>document.querySelector('.cart-wrapper');
    const cartSubst = <HTMLDivElement>document.querySelector('.cart-substitute');
    const numOfEntriesOnPage = <HTMLDivElement>document.querySelector('.pagination-count-wrapper');
    if (cartSubst && cartWrapper && numOfEntriesOnPage) {
      numOfEntriesOnPage.style.display = 'none';
      cartSubst.style.display = 'block';
      cartWrapper.style.display = 'none';
      document.querySelector('.cart-substitute__button')?.addEventListener('click', () => {
        window.location.href = '#catalog';
      });
    }
  }

  createPagesAndCart(pagesCount: number, pageNumber: number) {
    this.createPages(pagesCount, pageNumber);
    this.fillCart(pageNumber);
  }

  fillCart(page: number) {
    this.appliedPromos = [];
    this.promoPc = 0;
    const startIdx = page * this.entriesOnPage;
    let endIdx = this.cartItems.length >= this.entriesOnPage ? startIdx + this.entriesOnPage : this.cartItems.length;
    if (endIdx > this.cartItems.length) endIdx = this.cartItems.length;
    const cartItemsWrapper = <HTMLDivElement>document.querySelector('.cart-items-wrapper');
    cartItemsWrapper.innerHTML = '';
    if (this.cartItems.length == 0) {
      this.createFiller();
    } else {
      for (let i = startIdx; i < endIdx; i++) {
        if (i == 0) {
          this.addItem(this.cartItems[i], i + 1, false);
        } else this.addItem(this.cartItems[i], i + 1, true);
      }
    }
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

  // ***
  // UPDATE methods
  updateHeader() {
    const priceDiv = <HTMLDivElement>document.querySelector('.shopping-cart__price');
    const quantityDiv = <HTMLDivElement>document.querySelector('.shopping-cart__count');
    this.updateNumParams();
    quantityDiv.innerHTML = String(this.totalQty);
    priceDiv.innerHTML = `$${this.totalPrice}`;
  }

  updateCheckout() {
    const amountItemsQty = document.querySelector('.amount-items-qty');
    const amountTotalQty = document.querySelector('.amount-total-qty');
    const amountSubtotal = document.querySelector('.amount-subtotal');
    const promoPercAmount = document.querySelector('.title-promo-amount');
    const promoMoneyAmount = document.querySelector('.amount-promo');
    const discountAmount = document.querySelector('.amount-discount');
    const totalAmount = document.querySelector('.amount-total');
    const checkoutAmount = document.querySelector('.amount-checkout');

    if (amountItemsQty && amountTotalQty) {
      amountItemsQty.textContent = `${this.cartItems.length}`;
      amountTotalQty.textContent = `${this.totalQty}`;
    }
    if (amountSubtotal) amountSubtotal.innerHTML = `$${this.totalPrice}`;
    if (promoPercAmount && promoMoneyAmount) {
      if (this.promoPc) {
        promoPercAmount.innerHTML = this.promoPc ? `${this.promoPc}%` : '';
        this.promoMoneyAmount = this.totalPrice - Math.round((this.totalPrice * this.promoPc) / 100);
        promoMoneyAmount.innerHTML = this.promoPc ? `$${this.promoMoneyAmount}` : '';
      }
    }
    if (discountAmount && totalAmount && checkoutAmount) {
      this.totalDiscount = this.cartItems.reduce(
        (acc, curr) => acc + Math.round((curr.product.price * curr.qty * curr.product.discountPercentage) / 100),
        0
      );
      discountAmount.innerHTML = `-$${this.totalDiscount}`;
      totalAmount.innerHTML = checkoutAmount.innerHTML = this.promoMoneyAmount
        ? `$${this.promoMoneyAmount - this.totalDiscount}`
        : `$${this.totalPrice - this.totalDiscount}`;
    }
  }

  updateNumParams() {
    this.totalQty = this.cartItems.reduce((acc, curr) => acc + curr.qty, 0);
    this.totalPrice = this.cartItems.reduce((acc, curr) => acc + curr.product.price * curr.qty, 0);
    this.totalDiscount = this.cartItems.reduce((acc, curr) => acc + curr.product.discountPercentage, 0);
  }

  updateDropdown(entriesOnPage: number) {
    const paginationVisible = document.querySelector('.pagination-visible--active');
    if (paginationVisible) paginationVisible.textContent = String(entriesOnPage);
  }

  updateCart(page: number) {
    const startIdx = page * this.entriesOnPage;
    let endIdx = this.cartItems.length >= this.entriesOnPage ? startIdx + this.entriesOnPage : this.cartItems.length;
    if (endIdx > this.cartItems.length) endIdx = this.cartItems.length;
    const cartItemsWrapper = <HTMLDivElement>document.querySelector('.cart-items-wrapper');
    cartItemsWrapper.innerHTML = '';
    if (this.cartItems.length == 0) {
      this.createFiller();
    } else {
      for (let i = startIdx; i < endIdx; i++) {
        if (i == 0) {
          this.addItem(this.cartItems[i], i + 1, false);
        } else this.addItem(this.cartItems[i], i + 1, true);
      }
    }
    this.updateCheckout();
  }

  updatePages(activePage: number) {
    const pagesCount = Math.ceil(this.cartItems.length / this.entriesOnPage);
    console.log(activePage, pagesCount);

    if (activePage >= pagesCount) {
      this.createPages(pagesCount, pagesCount - 1);
      const createdPages = <HTMLDivElement[]>[...document.querySelectorAll('.page-idx')];
      this.goToPage(createdPages, pagesCount - 1);
    } else {
      this.createPages(pagesCount, activePage);
      const createdPages = <HTMLDivElement[]>[...document.querySelectorAll('.page-idx')];
      this.goToPage(createdPages, activePage);
    }
  }

  // Query string related methods
  getFromQuery(key: string) {
    if (this.pageQuery.has(key)) {
      return this.pageQuery.get(key);
    }
    return false;
  }

  deleteFromQuery(key: string) {
    this.pageQuery.delete(key);
    const newPathQuery = window.location.pathname + '?' + this.pageQuery.toString() + window.location.hash;
    history.pushState(null, '', newPathQuery);
  }

  writeToQuery(key: string, value: string) {
    this.pageQuery.set(key, value);
    const newPathQuery = window.location.pathname + '?' + this.pageQuery.toString() + window.location.hash;
    history.pushState(null, '', newPathQuery);
  }

  // Pagination related methods
  createPages(pagesCount: number, pageActive: number) {
    const catalogPages = <HTMLDivElement>document.querySelector('.cart-pages');
    if (catalogPages) {
      if (pagesCount <= 1) {
        catalogPages.style.display = 'none';
      } else {
        catalogPages.style.display = 'flex';
        this.drawPages(pagesCount, pageActive);
      }
    }
  }

  drawPages(pagesCount: number, pageActive: number) {
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
      this.writeToQuery('page', String(idx + 1));
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

  findPage() {
    const currPageItems = document.querySelectorAll('.cart__item');
    const cartId = currPageItems[0].id.replace('cartItemId', '');
    let currPage;
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].product.id == +cartId) {
        currPage = Math.floor(i / this.entriesOnPage);
      }
    }
    return currPage;
  }

  // Promo related methods
  searchPromo(promo: string, type: string[]) {
    for (let i = 0; i < type.length; i++) {
      if (promo == type[i].split('/')[0]) this.addPromo(type[i]);
    }
  }

  addPromo(value: string) {
    if (!this.appliedPromos.includes(value)) {
      const promoName = value.split('/')[0];
      const promoPc = +value.split('/')[1];
      this.appliedPromos.push(value);
      this.promoPc += promoPc;
      this.drawPromo(promoName, promoPc);
    }
  }

  drawPromo(promoName: string, promoAmount: number) {
    const promoInputWrapper = document.querySelector('.promocode-input-wrapper');
    const appliedPromo = document.createElement('p');
    appliedPromo.classList.add('applied-promo');
    const amSubt = <HTMLParagraphElement>document.querySelector('.amount-subtotal');
    if (promoInputWrapper && appliedPromo && amSubt) {
      appliedPromo.innerHTML = `Applied promo <b class="strong-promo-name">${promoName}</b> with <b class="strong-promo-amount">${promoAmount}%</b> discount`;
      promoInputWrapper.append(appliedPromo);
      this.updateCheckout();
      amSubt.style.textDecoration = 'line-through';
    }
  }

  // Modal related methods
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
      if (!inputAddress.value.match(/^(\b[A-Za-z]{3,15}\s+[A-Za-z]{3,15}\s+[\d\-]{3,7}\b)$/g)) {
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

  // Helpers
  productInCart(product: Types.Product) {
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].product.id === product.id) return true;
    }
    return false;
  }

  // Add/Delete methods
  initCartAdd(productCardDivCart: Element, product: Types.Product) {
    const storagedItems = localStorage.getItem('onlineStoreCart112547');
    if (storagedItems) this.cartItems = JSON.parse(storagedItems);
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
    const storagedItems = localStorage.getItem('onlineStoreCart112547');
    if (storagedItems) this.cartItems = JSON.parse(storagedItems);
    if (this.cartItems.length === 0) {
      this.cartItems.push({ product: product, qty: 1 });
      localStorage.setItem('onlineStoreCart112547', JSON.stringify(this.cartItems));
    } else {
      let norepeat = true;
      for (let i = 0; i < this.cartItems.length; i++) {
        if (this.cartItems[i].product.id == product.id) {
          this.cartItems[i].qty++;
          norepeat = false;
        }
      }
      if (norepeat) {
        this.cartItems.push({ product: product, qty: 1 });
        localStorage.setItem('onlineStoreCart112547', JSON.stringify(this.cartItems));
      }
    }

    this.updateHeader();
  }

  addItem(item: Types.ICartSlot, itemPos: number, position: boolean) {
    const itemWrapper = document.querySelector('.cart-items-wrapper');
    const cartItem = document.createElement('div');
    const itemNum = document.createElement('div');
    const itemImg = document.createElement('div');
    const itemName = document.createElement('p');
    const itemDescr = document.createElement('div');
    const itemStock = document.createElement('div');
    const itemStockTxt = document.createElement('p');
    const itemStockQty = document.createElement('p');
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
    itemStock.classList.add('cart__item-stock-wrapper');
    itemStockTxt.classList.add('cart__item-stock-txt');
    itemStockQty.classList.add('cart__item-stock-qty');
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
    itemStock.append(itemStockTxt, itemStockQty);

    cartItem.append(itemNum, itemImg, itemName, itemDescr, itemStock, itemPrice, itemQty, itemTotal, itemDeleteIcon);

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
    itemStockTxt.innerHTML = 'In stock: ';
    itemStockQty.innerHTML = String(item.product.stock);
    itemPrice.innerHTML = `$${item.product.price}`;
    btnMinus.innerHTML = '−';
    btnPlus.innerHTML = '+';
    input.value = String(item.qty);
    itemTotal.innerHTML = `$${item.product.price * item.qty}`;
    itemDeleteIcon.innerHTML = '&#9587;';

    this.makeInteractible(btnMinus, input, btnPlus, itemDeleteIcon, itemTotal, item);
  }

  deleteItem(item: Types.ICartSlot) {
    const itemDiv = document.getElementById(`cartItemId${item.product.id}`);
    const breakLine = document.getElementById(`breakLine${item.product.id}`);
    const pageToInit = this.findPage();
    this.cartItems.splice(this.cartItems.indexOf(item), 1);
    localStorage.setItem('onlineStoreCart112547', JSON.stringify(this.cartItems));
    itemDiv?.remove();
    breakLine?.remove();
    this.updateHeader();
    this.updateCheckout();
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
    const storagedItems = localStorage.getItem('onlineStoreCart112547');
    if (storagedItems) this.cartItems = JSON.parse(storagedItems);
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].product.id == product.id) {
        this.cartItems.splice(i, 1);
        localStorage.setItem('onlineStoreCart112547', JSON.stringify(this.cartItems));
        break;
      }
    }
    this.updateHeader();
  }
}

export default Cart;
