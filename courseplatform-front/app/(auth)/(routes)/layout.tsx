import { ModeToggle } from "@/components/ui/modeToggle"

interface AuthLayout {
  children: React.ReactNode
}

const authLayout = ({ children }: AuthLayout) => {
  return (
    <div className="flex justify-center items-center h-full">
      <ModeToggle />
      {children}
    </div>
  )
}

export default authLayout