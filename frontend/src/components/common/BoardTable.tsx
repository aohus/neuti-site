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
  // 표는 width:100% 를 줘도 min-content 너비 아래로는 줄어들지 않는다. 셀에
  // whitespace-nowrap 이 걸려 있어 모바일에서 375px 를 넘는데, 감싼 div 가
  // overflow-hidden 이면 넘친 열이 그대로 잘려 읽을 수 없다. 가로 스크롤로 연다.
  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-2xl shadow-sm">
      <table className="w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, idx) => (
              <th
                key={idx}
                scope="col"
                className={`px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider md:px-6 ${column.className || ''}`}
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
                    className={`px-4 py-4 whitespace-nowrap text-sm text-gray-600 md:px-6 ${column.className || ''}`}
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
