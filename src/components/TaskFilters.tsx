import type { TaskFilter } from '../types'

type TaskFiltersProps = {
  activeFilter: TaskFilter
  onFilterChange: (filter: TaskFilter) => void
}

const filters: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Активные' },
  { value: 'completed', label: 'Выполненные' },
]

export function TaskFilters({ activeFilter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="task-filters" role="group" aria-label="Фильтр задач">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          aria-pressed={activeFilter === filter.value}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
