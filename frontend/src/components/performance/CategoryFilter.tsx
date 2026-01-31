export default function CategoryFilter({
  categories,
  selected,
  onSelect
}: {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      <button
        onClick={() => onSelect('All')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selected === 'All'
            ? 'bg-green-600 text-white shadow-md'
            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === category
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
