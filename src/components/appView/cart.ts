import { Types } from '../types/Types';

class Cart {
  cartItems: Types.TCart = [];
  totalQty = 0;
  totalPrice = 0;
  promoPc = 0;
  totalDiscount = 0;

  initCartAdd(productCardDivCart: Element, product: Types.Product) {
    productCardDivCart.addEventListener('click', () => {
      const card = document.getElementById(`product-${product.id}`);
      const cardCartWrapper = <HTMLDivElement>card?.lastChild?.lastChild?.lastChild;
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

  fillCart() {
    if (this.cartItems.length == 0) {
      const cartSubst = <HTMLDivElement>document.querySelector('.cart-substitute');
      const cartWrapper = <HTMLDivElement>document.querySelector('.cart-wrapper');
      if (cartSubst && cartWrapper) {
        cartSubst.style.display = 'block';
        cartWrapper.style.display = 'none';
        document.querySelector('.cart-substitute__button')?.addEventListener('click', () => {
          window.location.href = '#catalog';
        });
      }
    } else {
      for (let i = 0; i < this.cartItems.length; i++) {
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
      if (+input.value < 0) input.value = '0';
      itemTotal.innerHTML = `$${+input.value * item.product.price}`;
      item.qty = Number(input.value);
      this.updateHeader();
      this.updateCheckout();
    });

    input.addEventListener('change', () => {
      if (+input.value < 0) input.value = '0';
      if (+input.value > item.product.stock) input.value = String(item.product.stock);
      itemTotal.innerHTML = `$${+input.value * item.product.price}`;
      item.qty = Number(input.value);
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
    this.cartItems.splice(this.cartItems.indexOf(item), 1);
    itemDiv?.remove();
    breakLine?.remove();
    this.updateHeader();
    this.updateCheckout();
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
    console.log(this.cartItems);
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
      }
    }
  }

  productInCart(product: Types.Product) {
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].product.id === product.id) return true;
    }
    return false;
  }
}

export default Cart;
