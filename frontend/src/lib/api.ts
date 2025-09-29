import type { Item } from '../types'

export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

// Retry configuration
const RETRY_DELAYS = [1000, 2000, 4000] // 1s, 2s, 4s

async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  retryCount = 0
): Promise<Response> {
  try {
    const response = await fetch(url, options)
    if (!response.ok && response.status >= 500 && retryCount < RETRY_DELAYS.length) {
      // Retry on server errors
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[retryCount]))
      return fetchWithRetry(url, options, retryCount + 1)
    }
    return response
  } catch (error) {
    if (retryCount < RETRY_DELAYS.length) {
      // Retry on network errors
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[retryCount]))
      return fetchWithRetry(url, options, retryCount + 1)
    }
    throw error
  }
}

export async function listItems(): Promise<Item[]> {
  const res = await fetchWithRetry(`${BASE_URL}/items`)
  if (!res.ok) {
    if (res.status === 404) return [] // Handle empty state gracefully
    throw new Error(`Failed to fetch items: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function createItem(text: string): Promise<Item> {
  const res = await fetchWithRetry(`${BASE_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) {
    throw new Error(`Failed to create item: ${res.status} ${res.statusText}`)
  }
  return res.json()
}


