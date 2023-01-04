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

  export interface IFilters {
    price: {
      min: number;
      max: number;
    };
    stock: {
      min: number;
      max: number;
    };
    discount: {
      min: number;
      max: number;
    }
    categories: string[];
    brands: string[];
  }

  export interface RootObject {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
  }

  export interface ICartSlot {
    product: Types.Product;
    qty: number;
  }

  export type TCart = ICartSlot[];

  export type TypesOfData = string[] | RootObject | Product;

  export type CallBackType = (data?: Types.RootObject) => void;
  export type TProductCallback = (data?: Types.Product) => void;

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
