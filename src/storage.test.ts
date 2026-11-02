// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { loadTasks, STORAGE_KEY } from './storage'

beforeEach(() => localStorage.clear())
afterEach(() => vi.restoreAllMocks())

test('если сохранённых данных нет, то возвращается пустой список без предупреждения', () => {
  expect(loadTasks()).toEqual({ tasks: [], warning: '' })
})

test.each([
  '{',
  'null',
  '{}',
  '[null]',
  '[{"id":1,"title":"Задача","completed":false}]',
  '[{"id":"1","title":"   ","completed":false}]',
  '[{"id":"1","title":"Задача","completed":"false"}]',
  '[{"id":"1","title":"Одна","completed":false},{"id":"1","title":"Другая","completed":true}]',
])('если сохранённые данные повреждены, то возвращается пустой список с предупреждением без перезаписи данных: %s', (storedValue) => {
  localStorage.setItem(STORAGE_KEY, storedValue)
  const result = loadTasks()
  expect(result.tasks).toEqual([])
  expect(result.warning).not.toBe('')
  expect(localStorage.getItem(STORAGE_KEY)).toBe(storedValue)
})

test('если чтение localStorage недоступно, то возвращается пустой список с предупреждением', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('Доступ запрещён')
  })
  expect(loadTasks().tasks).toEqual([])
  expect(loadTasks().warning).not.toBe('')
})
