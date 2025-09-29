import type { Item } from '../types'

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return dateString
  }
}

export function ItemList({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem',
        color: '#666',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <p style={{ margin: 0, fontSize: '1.1rem' }}>No items yet</p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
          Add your first item above to get started!
        </p>
      </div>
    )
  }

  return (
    <div>
      <h3 style={{ marginBottom: '1rem', color: '#333' }}>
        Items ({items.length})
      </h3>
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {items.map((it, index) => (
          <li 
            key={it.id} 
            style={{ 
              padding: '1rem',
              backgroundColor: '#fff',
              borderRadius: index === 0 ? '8px 8px 0 0' : index === items.length - 1 ? '0 0 8px 8px' : '0',
              border: '1px solid #eee',
              borderBottom: index < items.length - 1 ? '1px solid #eee' : '1px solid #eee',
              marginBottom: index < items.length - 1 ? 0 : 0,
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff'
            }}
          >
            <div style={{ 
              fontSize: '1rem', 
              lineHeight: '1.4',
              marginBottom: '0.5rem',
              wordBreak: 'break-word'
            }}>
              {it.text}
            </div>
            <small style={{ 
              color: '#666',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>#{it.id}</span>
              <span>•</span>
              <span>{formatDate(it.created_at)}</span>
            </small>
          </li>
        ))}
      </ul>
    </div>
  )
}


