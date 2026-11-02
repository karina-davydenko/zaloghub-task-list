import type { Task } from './types'

export const STORAGE_KEY = 'zaloghub-tasks'

type StoredTasks = {
  tasks: Task[]
  warning: string
}

function isTask(value: unknown): value is Task {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    'title' in value &&
    typeof value.title === 'string' &&
    value.title.trim().length > 0 &&
    'completed' in value &&
    typeof value.completed === 'boolean'
  )
}

export function loadTasks(): StoredTasks {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY)
    if (storedValue === null) {
      return { tasks: [], warning: '' }
    }

    const parsedValue: unknown = JSON.parse(storedValue)
    if (!Array.isArray(parsedValue) || !parsedValue.every(isTask)) {
      return { tasks: [], warning: 'Сохранённые данные повреждены. Начните новый список.' }
    }

    const tasks: Task[] = parsedValue
    if (new Set(tasks.map((task) => task.id)).size !== tasks.length) {
      return { tasks: [], warning: 'Сохранённые данные повреждены. Начните новый список.' }
    }

    return { tasks, warning: '' }
  } catch {
    return { tasks: [], warning: 'Не удалось прочитать сохранённые задачи. Можно работать с новым списком.' }
  }
}

export function saveTasks(tasks: Task[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    return true
  } catch {
    return false
  }
}
