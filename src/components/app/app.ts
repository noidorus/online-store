import LoadRoutes from '../route/loadRoutes';
import AppController from '../controller/controller';
// import { Types } from '../types/Types';

class App {
  loadRoutes: LoadRoutes;
  controller: AppController;

  constructor() {
    this.loadRoutes = new LoadRoutes();
    this.controller = new AppController();
  }

  start() {
    this.loadRoutes.init();
    this.observer();
    this.controller.getProducts((data?) => {
      if (data !== undefined) {
        console.log(data);
      }
    });
  }

  observer() {
    const observer = new MutationObserver((list) => {
      const productCards = document.querySelectorAll('.product-card');

      console.log('Product Cards: ', productCards);
      console.log('список мутаций: ', list);

      function getId(): number {
        return 10; // как заглушку просто поставил, наверное кулда-то вдругое место эту функцию
      }

      productCards.forEach((card) => {
        card.addEventListener('click', () => {
          const cardId: number = getId();

          console.log('Card: ', card);
          window.location.hash = 'product-details';

          this.controller.getProductDetails(
            (data?) => {
              if (data !== undefined) {
                console.log('data: ', data); // Function this.view.showProductDetails()
              }
            },
            {
              id: cardId, // Полученный Id
            }
          );
        });
      });
    });

    observer.observe(document.getElementById('app') as HTMLDivElement, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }
}

export default App;
