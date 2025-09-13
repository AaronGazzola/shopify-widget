import '@testing-library/jest-dom'

global.fetch = jest.fn()

beforeEach(() => {
  fetch.mockClear()
})

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-123'),
}))

global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}