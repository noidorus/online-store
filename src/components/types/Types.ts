/* eslint-disable @typescript-eslint/no-namespace */
export namespace Types {
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

  export type TypesOfData = RootObject | string[] | Product;

  export type CallBackType = (data?: TypesOfData) => void;

  export interface IOptions {
    id?: number;
    caterory?: string;
    // search?: string;
    endpoint?: Endpoint;
  }

  export enum Endpoint {
    CATEGORIES = 'categories',
    CATEGORY = 'category',
    // SEARCH = 'search',
  }
}
