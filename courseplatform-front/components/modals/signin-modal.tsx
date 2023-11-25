
import * as z from 'zod'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { useSignInModal } from '@/hooks/useSignInModal'
import Modal from '../ui/modal'
import { useSessionStore } from '@/hooks/useSession'
import api from '@/services/api'

const formSchema = z.object({
  email: z.string().email({
    message: 'Email must be valid.'
  }),
  password: z.string().min(6, {
    message: 'Password must have at least 6 characters.'
  })
})

const SignInModal = () => {
  const signInModal = useSignInModal()
  const router = useRouter()
  const { setUser } = useSessionStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    try {
      await api.post('/auth', {
        email: values.email,
        password: values.password,
      }).then(() => {
        setUser()
      })
      signInModal.onClose()
      router.refresh()
    } catch (e) {
      const error = e as AxiosError
      alert(error.message)
    }
  }

  return (
    <Modal isOpen={signInModal.isOpen} onClose={signInModal.onClose}>
      <Card className='border-none'>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Log-in into your account</CardTitle>
        <CardDescription>
          Fill your credentials below to create your account
        </CardDescription>
      </CardHeader>
      <Form { ...form }>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                <FormItem className="grid">
                  <FormLabel htmlFor="password" className='mb-2'>Password</FormLabel>
                  <FormControl>
                    <Input id="password" type="password" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button className="w-full">Login Account</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  </Modal>
  )
}

export default SignInModal