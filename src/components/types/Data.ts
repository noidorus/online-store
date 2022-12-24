/* eslint-disable @typescript-eslint/no-namespace */
export namespace DataTypes {
  export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
  }

  export interface RootObject {
    products: Product;
    total: number;
    skip: number;
    limit: number;
  }
}
