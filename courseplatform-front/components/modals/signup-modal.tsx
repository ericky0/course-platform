'use client';

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import api from '@/services/api'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { useSignUpModal } from '@/hooks/useSignUpModal'
import Modal from '../ui/modal'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { AxiosError } from 'axios'
import { useSessionStore } from '@/hooks/useSession';


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
  const { setUser } = useSessionStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await api.post('/users', {
        email: values.email,
        name: values.name,
        password: values.password,
      }).then(async () => {
        await api.post('/auth', {
          email: values.email,
          password: values.password,
        }).then(() => {
          setUser()
        })
      })
      toast.success('Account created successfully.')
      signUpModal.onClose()
      router.refresh()
    } catch (e) {
      const error = e as AxiosError
      console.log(error.message)
    }
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
      <Form { ...form }>
        <form onSubmit={form.handleSubmit(onSubmit)}> 
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-6">
              <Button variant="outline" onClick={() => router.push('http://localhost:3333/auth/github')} type='button'>
                <Icons.gitHub className="mr-2 h-4 w-4" />
                Github
              </Button>
              <Button variant="outline" type='button'>
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
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className="grid">
                  <FormLabel htmlFor="name" className='mb-2'>Name</FormLabel>
                  <FormControl>
                    <Input id="name" type="text" placeholder="Erick Hogarth" {...field}/>
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className="grid gap-2 mt-4">
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input id="email" type="email" placeholder="m@example.com"  {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input id="password" type="password" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button className="w-full" type='submit'>Create account</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  </Modal>
  )
}

export default SignUpModal