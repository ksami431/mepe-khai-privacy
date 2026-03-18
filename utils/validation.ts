import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const onboardingSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(13, 'Must be at least 13 years old').max(120, 'Invalid age'),
  gender: z.enum(['male', 'female', 'other']),
  weight_kg: z.number().min(20, 'Weight must be at least 20 kg').max(300, 'Invalid weight'),
  height_cm: z.number().min(100, 'Height must be at least 100 cm').max(250, 'Invalid height'),
  activity_level: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  goal: z.enum(['lose', 'maintain', 'gain']),
});

export const foodLogSchema = z.object({
  meal_name: z.string().min(1, 'Meal name is required'),
  calories: z.number().min(0, 'Calories must be positive'),
  protein: z.number().min(0, 'Protein must be positive').default(0),
  carbs: z.number().min(0, 'Carbs must be positive').default(0),
  fats: z.number().min(0, 'Fats must be positive').default(0),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional(),
});

export const weightLogSchema = z.object({
  weight_kg: z.number().min(20, 'Weight must be at least 20 kg').max(300, 'Invalid weight'),
  logged_at: z.string().optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type FoodLogInput = z.infer<typeof foodLogSchema>;
export type WeightLogInput = z.infer<typeof weightLogSchema>;
