import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createItem } from '../lib/api'
import { useState } from 'react'
import { CreateItemSchema } from '../types'

export function AddItem({ onAdded }: { onAdded: () => void }) {
  const [text, setText] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createItem,
    onMutate: async (newText) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['items'] })
      
      // Snapshot previous value
      const previousItems = queryClient.getQueryData(['items'])
      
      // Optimistically update
      const optimisticItem = {
        id: Date.now(), // Temporary ID
        text: newText,
        created_at: new Date().toISOString(),
      }
      
      queryClient.setQueryData(['items'], (old: any) => [optimisticItem, ...(old || [])])
      
      return { previousItems }
    },
    onError: (err, newText, context) => {
      // Rollback on error
      queryClient.setQueryData(['items'], context?.previousItems)
    },
    onSuccess: () => {
      setText('')
      setValidationError(null)
      onAdded()
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    
    // Client-side validation
    try {
      CreateItemSchema.parse({ text: trimmed })
      setValidationError(null)
    } catch (error: any) {
      setValidationError(error.errors[0]?.message || 'Invalid input')
      return
    }
    
    mutation.mutate(trimmed)
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              if (validationError) setValidationError(null)
            }}
            placeholder="Describe your item"
            maxLength={500}
            style={{ 
              width: '100%',
              padding: '0.5rem',
              border: validationError ? '1px solid #ff6b6b' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {validationError && (
            <div style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {validationError}
            </div>
          )}
          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
            {text.length}/500 characters
          </div>
        </div>
        <button 
          type="submit" 
          disabled={mutation.isPending || text.trim().length < 1}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: mutation.isPending ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: mutation.isPending ? 'not-allowed' : 'pointer',
            minWidth: '80px'
          }}
        >
          {mutation.isPending ? 'Adding…' : 'Add'}
        </button>
      </form>
      {mutation.error && (
        <div style={{ 
          color: '#ff6b6b', 
          fontSize: '0.875rem', 
          marginTop: '0.5rem',
          padding: '0.5rem',
          backgroundColor: '#fff5f5',
          borderRadius: '4px',
          border: '1px solid #ff6b6b'
        }}>
          Error: {mutation.error.message}
        </div>
      )}
    </div>
  )
}


