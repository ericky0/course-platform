'use client'

import { UserCog, LogOut } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { getClientSession } from '@/services/apiCalls/session/getClientSession'
import { useEffect, useState } from 'react'
import { UserResponse } from '@/types/UserResponse'
import api from '@/services/api'
import { useRouter } from 'next/navigation'
import { useSessionStore } from '@/hooks/useSession'

const AvatarSettings = () => {
  const { loggedUser, deleteUser } = useSessionStore()
  const router = useRouter()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>
            <p className="font-normal dark:text-slate-300">
              {loggedUser?.name}
            </p>
            <p className="font-light text-slate-400">{loggedUser?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex gap-2">
            <UserCog size={18} />
            Edit Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={async () => {
              await api.delete('/auth')
              deleteUser()
              router.refresh()
            }}
          >
            <LogOut size={18} />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default AvatarSettings
