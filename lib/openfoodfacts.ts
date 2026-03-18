import { OpenFoodFactsProduct, ScannedFoodData } from '@/types/openfoodfacts.types';

const BASE_URL = 'https://world.openfoodfacts.org/api/v0/product';
const USER_AGENT = 'MepeKhai - Sami Khan Fitness';

export const searchProductByBarcode = async (barcode: string): Promise<ScannedFoodData | null> => {
  try {
    const response = await fetch(`${BASE_URL}/${barcode}.json`, {
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      console.error('OpenFoodFacts API error:', response.status);
      return null;
    }

    const data: OpenFoodFactsProduct = await response.json();

    if (data.status !== 1 || !data.product) {
      console.log('Product not found in OpenFoodFacts database');
      return null;
    }

    const product = data.product;
    const nutriments = product.nutriments;

    // Extract nutrition data per 100g
    const scannedData: ScannedFoodData = {
      barcode: barcode,
      productName: product.product_name || 'Unknown Product',
      brand: product.brands || '',
      imageUrl: product.image_url,
      caloriesPer100g: nutriments['energy-kcal_100g'] || 0,
      proteinPer100g: nutriments.proteins_100g || 0,
      carbsPer100g: nutriments.carbohydrates_100g || 0,
      fatsPer100g: nutriments.fat_100g || 0,
      servingSize: product.serving_size || nutriments.serving_size,
    };

    return scannedData;
  } catch (error) {
    console.error('Error fetching product from OpenFoodFacts:', error);
    return null;
  }
};

export const calculateNutritionForServing = (
  productData: ScannedFoodData,
  servingGrams: number
) => {
  const multiplier = servingGrams / 100;

  return {
    calories: Math.round(productData.caloriesPer100g * multiplier),
    protein: Math.round(productData.proteinPer100g * multiplier * 10) / 10,
    carbs: Math.round(productData.carbsPer100g * multiplier * 10) / 10,
    fats: Math.round(productData.fatsPer100g * multiplier * 10) / 10,
  };
};
