import { getServerSession } from "next-auth"
import { Avatar, AvatarImage } from "../ui/avatar"
import { ModeToggle } from "@/components/ui/modeToggle"
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route"
import NavbarAuth from "./navbar-auth"


const Navbar = async () => {
  const session = await getServerSession(nextAuthOptions)

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <ModeToggle />
        <div className="ml-auto flex items-center space-x-4">
          { 
            session
            ? 
              <>
                <p> Teacher mode </p>
                  <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png"/>
                </Avatar>
              </>
            :
            <>
              <NavbarAuth />
            </>
          }
          

        </div>
      </div>
    </div>
  )
}

export default Navbar