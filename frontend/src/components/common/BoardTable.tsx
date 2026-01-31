'use client'

import React from 'react'

interface Column<T> {
  header: string
  key: keyof T | string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface BoardTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  isLoading?: boolean
}

export default function BoardTable<T extends { id: number | string }>({
  columns,
  data,
  onRowClick,
  isLoading = false
}: BoardTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, idx) => (
              <th
                key={idx}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-gray-500">
                로딩 중...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-gray-500">
                게시글이 없습니다.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
              >
                {columns.map((column, idx) => (
                  <td
                    key={idx}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-600 ${column.className || ''}`}
                  >
                    {column.render ? column.render(item) : (item[column.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
