'use server';

/**
 * @fileOverview Assigns an emoji to a pet's image based on its facial expression.
 *
 * - assignEmoji - A function that handles the emoji assignment process.
 * - AssignEmojiInput - The input type for the assignEmoji function.
 * - AssignEmojiOutput - The return type for the assignEmoji function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssignEmojiInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a pet's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type AssignEmojiInput = z.infer<typeof AssignEmojiInputSchema>;

const AssignEmojiOutputSchema = z.object({
  emoji: z.string().describe("The emoji representing the pet's expression or mood."),
  comment: z.string().describe("A short, fun comment about the pet's expression or mood."),
});
export type AssignEmojiOutput = z.infer<typeof AssignEmojiOutputSchema>;

export async function assignEmoji(input: AssignEmojiInput): Promise<AssignEmojiOutput> {
  return assignEmojiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assignEmojiPrompt',
  input: {schema: AssignEmojiInputSchema},
  output: {schema: AssignEmojiOutputSchema},
  prompt: `You are an AI that analyzes a picture of a pet to determine its emotional state. Your task is to:
1.  Analyze the pet's facial expression. Do not identify the type of animal. Your goal is to understand the emotion conveyed by the face (e.g., happy, sleepy, curious, grumpy).
2.  Return a standard Unicode emoji that represents this facial expression. For example, if the pet looks happy, you might return '😄'. If it looks sleepy, '😴'. Do not return an emoji of the animal itself (e.g., if it's a cow, do not return '🐄').
3.  Provide a short, fun, single-sentence comment about the pet's expression.

If a face is not clearly visible, make a best guess based on the pet's posture or the overall context of the image.

Here is the pet's photo: {{media url=photoDataUri}}
`,
});

const assignEmojiFlow = ai.defineFlow(
  {
    name: 'assignEmojiFlow',
    inputSchema: AssignEmojiInputSchema,
    outputSchema: AssignEmojiOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The model did not return an output.");
    }
    return {
      emoji: output.emoji,
      comment: output.comment,
    };
  }
);
