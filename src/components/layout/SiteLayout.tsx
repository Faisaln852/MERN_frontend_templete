import Navbar from "./Navbar"
import Footer from "./Footer"

export default function SiteLayout({
  children,
  isAuthenticated,
}: {
  children: React.ReactNode
  isAuthenticated: boolean
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      <main className="">{children}</main>
      <Footer />
    </div>
  )
}
