

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSignInModal } from '@/hooks/useSignInModal'
import Modal from '../ui/modal'


const SignInModal = () => {

  const signInModal = useSignInModal()

  return (
    <Modal isOpen={signInModal.isOpen} onClose={signInModal.onClose}>
      <Card className='border-none'>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Log-in into your account</CardTitle>
        <CardDescription>
          Fill your credentials below to create your account
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
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password"/>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Login Account</Button>
      </CardFooter>
    </Card>
  </Modal>
  )
}

export default SignInModal