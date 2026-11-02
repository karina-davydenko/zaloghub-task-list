import { useState } from 'react'
import { TaskForm } from './components/TaskForm'
import { TaskFilters } from './components/TaskFilters'
import { TaskItem } from './components/TaskItem'
import { loadTasks, saveTasks } from './storage'
import type { Task, TaskFilter } from './types'

function App() {
  const [initialData] = useState(loadTasks)
  const [tasks, setTasks] = useState<Task[]>(initialData.tasks)
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all')
  const [storageWarning, setStorageWarning] = useState(initialData.warning)

  // Сохраняем только изменения пользователя: запуск не перезаписывает хранилище.
  function updateTasks(nextTasks: Task[]) {
    setTasks(nextTasks)
    const saved = saveTasks(nextTasks)
    setStorageWarning(saved ? '' : 'Не удалось сохранить задачи. Изменения доступны только до закрытия или перезагрузки страницы.')
  }

  function handleAddTask(title: string) {
    const newTask: Task = { id: crypto.randomUUID(), title, completed: false }
    updateTasks([...tasks, newTask])
  }

  function handleToggleTask(id: string) {
    updateTasks(tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task))
  }

  function handleDeleteTask(id: string) {
    updateTasks(tasks.filter((task) => task.id !== id))
  }

  const visibleTasks = tasks.filter((task) => {
    if (activeFilter === 'active') return !task.completed
    if (activeFilter === 'completed') return task.completed
    return true
  })

  const emptyMessage = tasks.length === 0
    ? 'Задач пока нет. Добавьте первую.'
    : activeFilter === 'active' ? 'Активных задач нет.' : 'Выполненных задач нет.'

  return (
    <main className="app">
      <h1>Список задач</h1>
      <TaskForm onAddTask={handleAddTask} />
      <TaskFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      {storageWarning && <p className="warning" role="alert">{storageWarning}</p>}
      {visibleTasks.length > 0 ? (
        <ul className="task-list" aria-label="Задачи">
          {visibleTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </ul>
      ) : <p className="empty-message" role="status">{emptyMessage}</p>}
    </main>
  )
}

export default App
