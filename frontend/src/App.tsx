import { useQuery, useQueryClient } from '@tanstack/react-query'
import { listItems } from './lib/api'
import { ItemList } from './components/ItemList'
import { AddItem } from './components/AddItem'
import { ErrorBoundary } from './components/ErrorBoundary'

export default function App() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['items'],
    queryFn: listItems,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  return (
    <ErrorBoundary>
      <div style={{ maxWidth: 640, margin: '2rem auto', fontFamily: 'system-ui, sans-serif' }}>
        <h1>Edge Boot</h1>
        <AddItem onAdded={() => queryClient.invalidateQueries({ queryKey: ['items'] })} />
        {isLoading && <p>Loading…</p>}
        {isError && (
          <div style={{ 
            color: '#ff6b6b', 
            padding: '1rem',
            backgroundColor: '#fff5f5',
            borderRadius: '4px',
            border: '1px solid #ff6b6b',
            marginBottom: '1rem'
          }}>
            Failed to load items: {error?.message}
          </div>
        )}
        {data && <ItemList items={data} />}
      </div>
    </ErrorBoundary>
  )
}


