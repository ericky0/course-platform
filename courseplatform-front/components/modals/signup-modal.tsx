import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSignInModal } from '@/hooks/useSignInModal'
import { useSignUpModal } from '@/hooks/useSignUpModal'
import Modal from '../ui/modal'


const formSchema = z.object({
  email: z.string().email({
    message: 'Email must be valid.'
  }),
  name: z.string().min(3, {
    message: 'Name must have at least 3 characters.'
  }),
  password: z.string().min(6, {
    message: 'Password must have at least 6 characters.'
  })
})


const SignUpModal = () => {

  const signUpModal = useSignUpModal()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false
    })

    if (response?.error) {
      console.log(response)
      return
    }
    
    router.refresh()

  }

  return (
    <Modal isOpen={signUpModal.isOpen} onClose={signUpModal.onClose}>
      <Card className='border-none'>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          <Button variant="outline">
            <Icons.gitHub className="mr-2 h-4 w-4" />
            Github
          </Button>
          <Button variant="outline">
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" placeholder="Erick Hogarth" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password"/>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Create account</Button>
      </CardFooter>
    </Card>
  </Modal>
  )
}

export default SignUpModal