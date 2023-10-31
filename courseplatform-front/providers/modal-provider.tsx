"use client";

import SignInModal from '@/components/modals/signin-modal';
import SignUpModal from '@/components/modals/signup-modal';
import { useEffect, useState } from 'react'



const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <SignInModal />
      <SignUpModal />
    </>
  )
}

export default ModalProvider