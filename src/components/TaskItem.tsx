import type { Task } from '../types'

type TaskItemProps = {
  task: Task
  onToggleTask: (id: string) => void
  onDeleteTask: (id: string) => void
}

export function TaskItem({ task, onToggleTask, onDeleteTask }: TaskItemProps) {
  return (
    <li className="task-item">
      <label className="task-label">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleTask(task.id)}
        />
        <span className={task.completed ? 'task-title completed' : 'task-title'}>
          {task.title}
        </span>
      </label>
      <button
        type="button"
        className="delete-button"
        aria-label={`Удалить задачу «${task.title}»`}
        onClick={() => onDeleteTask(task.id)}
      >
        Удалить
      </button>
    </li>
  )
}
