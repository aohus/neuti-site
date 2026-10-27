import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  label: string
  allLabel: string
  value: string | undefined
  options: string[]
  onChange: (value: string | undefined) => void
}

export default function PerformanceFilterSelect({
  icon,
  label,
  allLabel,
  value,
  options,
  onChange,
}: Props) {
  return (
    <div className="space-y-3">
      <label className="text-primary ml-1 flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase">
        {icon} {label}
      </label>
      <select
        className="text-deep focus:ring-primary w-full rounded-2xl border-2 border-black/5 bg-surface/30 px-6 py-4 font-bold shadow-sm transition-all outline-none focus:bg-white focus:ring-2"
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}
