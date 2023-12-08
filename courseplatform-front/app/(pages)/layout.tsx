import Navbar from '@/components/navbar/navbar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}

export default DashboardLayout
