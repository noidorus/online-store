import Route from '../route/route';
import { Types } from './Types';

export interface ILoader {
  baseLink: string;

  getResp(callback: () => void, options: Types.IOptions): void;

  makeUrl(options: Types.IOptions): string;

  load(callback: Types.CallBackType, options: Types.IOptions): void;
}

export interface IRoute {
  name: string;

  htmlName: string;

  default: boolean;

  isActiveRoute(hashedPath: string): boolean;
}

export interface IRouter {
  routes: IRoute[];

  rootElem: HTMLDivElement;

  init: IInit;

  initRoutes(): void;

  startRouter(): void;

  initPaths(): void;

  hasChanged(r: IRoute[], callback: () => void): void;

  goToRoute(htmlName: string, callback: () => void): Promise<void>;
}

export interface IApp {
  router: IRouter;

  start(): void;
}

export interface IInit {
  controller: IAppController;

  view: IAppView;

  filtersObj: Types.IFilters;

  cache: Types.Product[];

  filteredArr: Types.Product[];

  searchArr: Types.Product[];

  filterQuery: URLSearchParams;

  getData(routeArr: Route[], callback: () => void): void;

  loadCardRoutes(routeArr: Route[], data: Types.Product[]): void;

  initMainPage(): void;

  initCatalog(): void;

  initSearchInput(): void;

  makeInitialSearch(searchString: string): void;

  initialSearch(value: string): void;

  search(value: string): void;

  initCart(): void;

  initProductDetails(): void;

  initFilters(): void;

  initFilterButtons(): void;

  removeSearch(): void;

  initFiltersFromQuery(): void;

  initRangeFiltersFromQuery(type: string): void;

  getRangeFiltersFromQuery(
    type: string,
    sliderInputMin: HTMLInputElement,
    sliderInputMax: HTMLInputElement,
    inputBoxMin: HTMLInputElement,
    inputBoxMax: HTMLInputElement
  ): void;

  getRangeFiltersByType(type: string, minMax: string[]): void;

  getCheckboxFiltersFromQuery(type: string, inputList: NodeListOf<HTMLInputElement>): void;

  nullifyCheckboxFilters(type: string): void;

  addFilterRangeListener(filterType: string, inputVals: { min: number; max: number }): void;

  filtersCheckListener(): void;

  filtersRangeListener(): void;

  changeCheckboxes(input: NodeListOf<HTMLElement>, index: number, arr: string[], type: string): void;

  filterProducts(data: Types.Product[], filtersObj: Types.IFilters): void;

  getQuery(key: string): string | false | null;

  removeFromQuery(key: string): void;

  writeToQuery(key: string, value: string): void;

  addToQuery(input: HTMLInputElement, type: string): void;

  deleteFromQuery(input: HTMLInputElement, type: string): void;
}

export interface IAppView {
  productDetails: IProductDetails;

  catalog: ICatalog;

  cart: ICart;

  cartItems: Types.TCart;

  showProductDetails(data: Types.Product): void;

  createToggle(): void;

  getToggleView(toggleQuery: URLSearchParams, toggleBtn: HTMLDivElement, catalogContainer: HTMLDivElement): void;

  createDropdown(): void;

  createCheckFilters(data: Types.Product[], type: string): void;

  createPriceFilters(data: Types.Product[], filtersObj: Types.IFilters): void;

  createStockFilters(data: Types.Product[], filtersObj: Types.IFilters): void;

  createDiscountFilters(data: Types.Product[], filtersObj: Types.IFilters): void;

  initPages(filteredArr: Types.Product[], pagesCount: number): void;

  initPagesandFilter(filteredArr: Types.Product[], filtersObj?: Types.IFilters): void;

  createPages(filteredArr: Types.Product[], pagesCount: number): void;

  goToPage(filteredArr: Types.Product[], pagesArr: HTMLDivElement[], idx: number): void;

  findPageIdx(pagesArr: HTMLDivElement[]): number;

  // Catalog methods
  createCatalog(filteredArr: Types.Product[], catalogDiv: HTMLDivElement, page: number): void;

  createSortedCatalog(filteredArr: Types.Product[]): void;

  initSorting(filteredArr: Types.Product[]): void;

  initSortingVisual(sortParams: URLSearchParams): void;

  addToQuery(type: string, sortParams: URLSearchParams): void;

  sortArrayInitial(filteredArr: Types.Product[], sortParams: URLSearchParams): void;

  createCart(): void;
}

export interface ICart {
  openModalBool: boolean;

  cartItems: Types.TCart;

  totalQty: number;

  totalPrice: number;

  checkoutPrice: number;

  totalDiscount: number;

  appliedPromos: string[];

  promoPc: number;

  promoMoneyAmount: number;

  entriesOnPage: number;

  pageQuery: URLSearchParams;

  initCartPage(): void;

  initOpenModal(): void;

  initCartLinks(): void;

  initPaginationDropdownLinks(): void;

  initCheckoutLink(): void;

  initModalLinks(): void; 

  initPromoInput(): void;

  makeInteractible(
    btnMinus: HTMLButtonElement,
    input: HTMLInputElement,
    btnPlus: HTMLButtonElement,
    itemDelete: HTMLDivElement,
    itemTotal: HTMLDivElement,
    item: Types.ICartSlot
  ): void;

  createFiller(): void;

  createPagesAndCart(pagesCount: number, pageNumber: number): void;

  fillCart(page: number): void;

  updateHeader(): void;

  updateCheckout(): void;

  updateNumParams(): void;

  updateDropdown(entriesOnPage: number): void;

  updateCart(page: number): void;

  updatePages(activePage: number): void;

  getFromQuery(key: string): string | false | null;

  deleteFromQuery(key: string): void;

  writeToQuery(key: string, value: string): void;

  createPages(pagesCount: number, pageActive: number): void;

  drawPages(pagesCount: number, pageActive: number): void;

  goToPage(pagesArr: HTMLDivElement[], idx: number): void;

  findPageIdx(pagesArr: HTMLDivElement[]): number;

  findPage(): number | undefined;

  searchPromo(promo: string, type: string[]): void;

  addPromo(value: string): void;

  drawPromo(promoName: string, promoAmount: number): void;

  openModal(): void;

  validateForm(): boolean;

  showMessage(mesType: boolean): void;

  productInCart(product: Types.Product): boolean;

  initCartAdd(productCardDivCart: Element, product: Types.Product): void;

  addToCart(product: Types.Product): void;

  addItem(item: Types.ICartSlot, itemPos: number, position: boolean): void;

  deleteItem(item: Types.ICartSlot): void;

  deleteProduct(product: Types.Product): void;
}

export interface IProductDetails {
  cart: ICart;

  drawProduct(data: Types.Product): void;

  drawCrumbs(data: Types.Product): void;

  drawProductDescr(data: Types.Product): void;

  drawProductImgs(data: Types.Product): void;

  selectImage(dataImages: string[], imgThumbs: HTMLElement[], mainImg: HTMLDivElement): void;

  createMagnifyerDiv(): void;

  magnifyImage(e: MouseEvent): void;

  removeMagnify(): void;

  initButtons(data: Types.Product): void;
}

export interface ICatalog {
  drawCategory(category: string, div: HTMLDivElement, name: string): void;

  drawCard(card: Types.Product, div: HTMLDivElement): void;

  drawSliderFilter(filterCat: { min: number; max: number }, filterType: string): void;

  drawSliderInput(filterCat: { min: number; max: number }, filterType: string): void;

  calcSliderInput(
    sliderInputMin: HTMLInputElement,
    sliderInputMax: HTMLInputElement,
    inputBoxMin: HTMLInputElement,
    inputBoxMax: HTMLInputElement,
    sliderTrack: HTMLDivElement,
    input: boolean
  ): void;

  fillSliderTrack(minInput: HTMLInputElement, maxInput: HTMLInputElement): void;
}

export interface IAppController {
  getProducts(callback: Types.CallBackType, options?: Types.IOptions): void;

  getProductDetails(callback: Types.TProductCallback, options: Types.IOptions): void;

  getCategories(callback: Types.CallBackType): void;

  getSearchResults(searchString: string, callback: Types.CallBackType): void;
}
