import { useState } from 'react'
import type { SubmitEvent } from 'react'

type TaskFormProps = {
  onAddTask: (title: string) => void
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('')

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = newTaskTitle.trim()
    if (title.length === 0) return

    onAddTask(title)
    setNewTaskTitle('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label htmlFor="new-task">Новая задача</label>
      <div className="task-form-controls">
        <input
          id="new-task"
          value={newTaskTitle}
          onChange={(event) => setNewTaskTitle(event.target.value)}
          placeholder="Что нужно сделать?"
        />
        <button type="submit" className="add-button">Добавить</button>
      </div>
    </form>
  )
}
