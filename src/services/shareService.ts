import * as SMS from 'expo-sms';
import { Recipe } from '../types/recipe';

export async function shareRecipeBySms(
  recipe: Recipe,
): Promise<'sent' | 'cancelled' | 'unknown' | 'unavailable'> {
  const available = await SMS.isAvailableAsync();
  if (!available) {
    return 'unavailable';
  }
  const message = `Coba resep ${recipe.title} (${recipe.area}) di ThinkCook!${recipe.youtube ? ` Videonya: ${recipe.youtube}` : ''}`;
  const { result } = await SMS.sendSMSAsync([], message);
  return result;
}
