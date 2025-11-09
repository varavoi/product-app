'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onNextPage: () => void
  onPrevPage: () => void
}

export default function Pagination({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage
}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-4 mt-4">
      <button 
        onClick={onPrevPage}
        disabled={currentPage === 1}
        className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
      >
        Назад
      </button>
      <span>
        Страница {currentPage} из {totalPages}
      </span>
      <button 
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
      >
        Вперед
      </button>
    </div>
  )
}