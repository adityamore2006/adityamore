import { z } from 'zod'

export const ItemSchema = z.object({
  id: z.number(),
  text: z.string(),
  created_at: z.string(),
})

export const CreateItemSchema = z.object({
  text: z.string().min(1, 'Text is required').max(500, 'Text must be less than 500 characters'),
})

export type Item = z.infer<typeof ItemSchema>
export type CreateItem = z.infer<typeof CreateItemSchema>


