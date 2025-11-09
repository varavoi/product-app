'use client'

interface LoadingProps {
  message?: string
}

export default function Loading({ message = "Загрузка..." }: LoadingProps) {
  return (
    <div className="p-4">
      <p>{message}</p>
    </div>
  )
}