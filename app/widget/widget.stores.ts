import { create } from 'zustand'
import { WidgetState } from './widget.types'

const initialState = {
  renders: [],
  isLoading: false,
  error: null
}

export const useWidgetStore = create<WidgetState>()((set) => ({
  ...initialState,
  setRenders: (renders) => set({ renders }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState)
}))