'use server';

/**
 * @fileOverview A fare information lookup AI agent.
 *
 * - fareInformationLookup - A function that handles the fare information lookup process.
 * - FareInformationLookupInput - The input type for the fareInformationLookup function.
 * - FareInformationLookupOutput - The return type for the fareInformationLookup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FareInformationLookupInputSchema = z.object({
  departureStation: z.string().describe('The departure station.'),
  arrivalStation: z.string().describe('The arrival station.'),
  trainClass: z.string().describe('The class of travel (e.g., economy, business, first class).'),
  date: z.string().describe('The date of travel (YYYY-MM-DD).'),
});
export type FareInformationLookupInput = z.infer<typeof FareInformationLookupInputSchema>;

const FareInformationLookupOutputSchema = z.object({
  fareInformation: z.string().describe('Detailed fare information for the specified route, including price ranges and potential discounts.'),
});
export type FareInformationLookupOutput = z.infer<typeof FareInformationLookupOutputSchema>;

export async function fareInformationLookup(input: FareInformationLookupInput): Promise<FareInformationLookupOutput> {
  return fareInformationLookupFlow(input);
}

const fareInformationLookupPrompt = ai.definePrompt({
  name: 'fareInformationLookupPrompt',
  input: {schema: FareInformationLookupInputSchema},
  output: {schema: FareInformationLookupOutputSchema},
  prompt: `You are a travel assistant providing fare information for train routes.

  Provide a detailed fare information for the route between {{departureStation}} and {{arrivalStation}} on {{date}} in {{trainClass}} class.
  Include potential price ranges and possible discounts, taking into account that prices are estimates.
  Consider various factors such as time of day, and day of week.
  Do not include information about booking tickets, payment methods or anything else not directly related to fare information.
  Response should not be more than 200 words.
  `,
});

const fareInformationLookupFlow = ai.defineFlow(
  {
    name: 'fareInformationLookupFlow',
    inputSchema: FareInformationLookupInputSchema,
    outputSchema: FareInformationLookupOutputSchema,
  },
  async input => {
    const {output} = await fareInformationLookupPrompt(input);
    return output!;
  }
);
