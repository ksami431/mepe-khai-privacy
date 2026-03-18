export interface OpenFoodFactsProduct {
  code: string;
  product: {
    product_name: string;
    brands: string;
    quantity: string;
    image_url?: string;
    nutriments: {
      'energy-kcal_100g': number;
      proteins_100g: number;
      carbohydrates_100g: number;
      fat_100g: number;
      serving_size?: string;
    };
    serving_size?: string;
  };
  status: number;
  status_verbose: string;
}

export interface ScannedFoodData {
  barcode: string;
  productName: string;
  brand: string;
  imageUrl?: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatsPer100g: number;
  servingSize?: string;
}
