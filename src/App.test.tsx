// @vitest-environment jsdom
import { StrictMode } from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { STORAGE_KEY } from './storage'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

test('если отправить форму, то пустой ввод отклоняется, а задача добавляется без пробелов по краям', async () => {
  const user = userEvent.setup()
  render(<App />)
  const input = screen.getByRole('textbox', { name: 'Новая задача' })
  const addButton = screen.getByRole('button', { name: 'Добавить' })

  await user.click(addButton)
  await user.type(input, '   ')
  await user.click(addButton)
  expect(screen.queryByRole('list')).toBeNull()

  await user.clear(input)
  await user.type(input, '  Первая задача  ')
  await user.click(addButton)
  expect(screen.getByRole('checkbox', { name: 'Первая задача' })).toBeTruthy()
  expect(input).toHaveProperty('value', '')

  await user.type(input, 'Вторая задача{Enter}')
  expect(screen.getAllByRole('listitem')).toHaveLength(2)
})

test('если изменить задачи при выбранном фильтре, то выполнение, удаление и список обновляются корректно', async () => {
  const user = userEvent.setup()
  render(<App />)
  const input = screen.getByRole('textbox', { name: 'Новая задача' })
  await user.type(input, 'Первая{Enter}Вторая{Enter}')
  await user.click(screen.getByRole('checkbox', { name: 'Первая' }))
  expect(screen.getByRole('checkbox', { name: 'Первая' })).toHaveProperty('checked', true)

  await user.click(screen.getByRole('button', { name: 'Активные' }))
  expect(screen.queryByRole('checkbox', { name: 'Первая' })).toBeNull()
  expect(screen.getByRole('checkbox', { name: 'Вторая' })).toBeTruthy()
  await user.click(screen.getByRole('button', { name: 'Удалить задачу «Вторая»' }))
  expect(screen.getByRole('status').textContent).toBe('Активных задач нет.')

  await user.click(screen.getByRole('button', { name: 'Выполненные' }))
  expect(screen.getByRole('checkbox', { name: 'Первая' })).toBeTruthy()
  await user.click(screen.getByRole('checkbox', { name: 'Первая' }))
  expect(screen.getByRole('status').textContent).toBe('Выполненных задач нет.')

  await user.click(screen.getByRole('button', { name: /^Все$/ }))
  expect(screen.getAllByRole('listitem')).toHaveLength(1)
  expect(screen.getByRole('checkbox', { name: 'Первая' })).toHaveProperty('checked', false)
})

test('если открыть сохранённый список в StrictMode и удалить все задачи, то данные восстанавливаются без перезаписи, а пустой список сохраняется', async () => {
  const user = userEvent.setup()
  const storedTasks = JSON.stringify([{ id: '1', title: 'Сохранённая', completed: true }])
  localStorage.setItem(STORAGE_KEY, storedTasks)
  const setItem = vi.spyOn(Storage.prototype, 'setItem')
  const view = render(<StrictMode><App /></StrictMode>)
  expect(screen.getByRole('checkbox', { name: 'Сохранённая' })).toHaveProperty('checked', true)
  expect(setItem).not.toHaveBeenCalled()

  await user.click(screen.getByRole('button', { name: 'Удалить задачу «Сохранённая»' }))
  expect(localStorage.getItem(STORAGE_KEY)).toBe('[]')
  view.unmount()
  render(<App />)
  expect(screen.queryByRole('list')).toBeNull()
})

test('если запись в localStorage недоступна, то задача остаётся в памяти и появляется предупреждение', async () => {
  const user = userEvent.setup()
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('Хранилище недоступно')
  })
  render(<App />)
  await user.type(screen.getByRole('textbox', { name: 'Новая задача' }), 'В памяти{Enter}')
  expect(screen.getByRole('checkbox', { name: 'В памяти' })).toBeTruthy()
  expect(screen.getByRole('alert').textContent).toContain('Не удалось сохранить задачи')
})
