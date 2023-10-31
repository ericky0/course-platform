import { create } from 'zustand'

interface useSignUpModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useSignUpModal = create <useSignUpModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))