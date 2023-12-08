import { ModeToggle } from '@/components/ui/modeToggle'
import NavbarAuth from './navbar-auth'
import AvatarSettings from '../avatar-settings'
import { getServerSession } from '@/services/apiCalls/session/getServerSession'

const Navbar = async () => {
  const { user } = await getServerSession()

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div></div>
        <p className="text-4xl font-semibold">LOGO</p>
        <div className="ml-auto flex items-center space-x-4 pr-16">
          {user ? (
            <>
              <p> Teacher mode </p>
              <AvatarSettings />
            </>
          ) : (
            <NavbarAuth />
          )}
        </div>
        <ModeToggle />
      </div>
    </div>
  )
}

export default Navbar
