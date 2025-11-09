'use client'

interface SearchBarProps {
  search: string
  onSearchChange: (value: string) => void
  showOnlyLiked: boolean
  onToggleShowOnlyLiked: () => void
  productsCount: number
  apiProductsCount: number
  localProductsCount: number
}

export default function SearchBar({
  search,
  onSearchChange,
  showOnlyLiked,
  onToggleShowOnlyLiked,
  productsCount,
  apiProductsCount,
  localProductsCount
}: SearchBarProps) {
  return (
    <div className="mb-6">
      {/* Информация о товарах */}
      {localProductsCount > 0 && (
        <div className="mb-4 text-sm text-gray-600">
          <p>Показано {productsCount} товаров ({apiProductsCount} с API + {localProductsCount} ваших)</p>
        </div>
      )}
      
      {/* Поиск */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск товаров..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={onToggleShowOnlyLiked}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showOnlyLiked ? 'Показать все' : 'Показать избранные'}
        </button>
        
        {/* Кнопка для отладки - очистка localStorage */}
        <button 
          onClick={() => {
            localStorage.removeItem('reduxState')
            window.location.reload()
          }}
          className="bg-red-500 text-white px-4 py-2 rounded text-sm"
        >
          Очистить данные
        </button>
      </div>
    </div>
  )
}