import { create } from 'zustand'

import { getClientSession } from '@/services/apiCalls/session/getClientSession';
import { User } from '@/types/User';

interface useSessionStore {
  loggedUser: User | null,
  setUser: () => void
  deleteUser: () => void
}

export const useSessionStore = create <useSessionStore>((set) => ({
  loggedUser: null,
  setUser: async () => {
    const { user } = await getClientSession()
    set({ loggedUser: user })
  },
  deleteUser: async () => {
    set({ loggedUser: null })
  }
}))