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
      "A photo of a pet's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AssignEmojiInput = z.infer<typeof AssignEmojiInputSchema>;

const AssignEmojiOutputSchema = z.object({
  emoji: z.string().describe('The emoji representing the pet\'s facial expression.'),
});
export type AssignEmojiOutput = z.infer<typeof AssignEmojiOutputSchema>;

export async function assignEmoji(input: AssignEmojiInput): Promise<AssignEmojiOutput> {
  return assignEmojiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assignEmojiPrompt',
  input: {schema: AssignEmojiInputSchema},
  output: {schema: AssignEmojiOutputSchema},
  prompt: `You are an AI that analyzes a picture of a pet's face and returns an emoji that best represents its facial expression. The emoji should reflect the emotion seen in the pet's face.

Here is the pet's photo: {{media url=photoDataUri}}

Respond only with a single emoji.
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
    return {
      emoji: output!,
    };
  }
);
