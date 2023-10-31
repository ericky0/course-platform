"use client"

import { useSignInModal } from "@/hooks/useSignInModal"
import { Button } from "../ui/button"
import { useSignUpModal } from "@/hooks/useSignUpModal"

const NavbarAuth = () => {

  const signInModal = useSignInModal()
  const signUpModal = useSignUpModal()

  return (
    <div className="flex gap-4">
      <Button variant={'outline'} onClick={signInModal.onOpen}>sign-in</Button>
      <Button variant={'link'} onClick={signUpModal.onOpen}>sign-up</Button>
    </div>
  )
}

export default NavbarAuth