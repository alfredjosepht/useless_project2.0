'use server';

import { assignEmoji } from '@/ai/flows/assign-emoji';

export async function getEmojiForPet(photoDataUri: string) {
  if (!photoDataUri) {
    return { success: false, error: 'No photo data provided.' };
  }

  try {
    const result = await assignEmoji({ photoDataUri });
    return { success: true, emoji: result.emoji };
  } catch (e) {
    console.error(e);
    // A more user-friendly error message.
    return { success: false, error: 'Could not detect a face in the photo. Please try another one.' };
  }
}
