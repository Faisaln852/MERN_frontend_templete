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
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="flex-1 container py-6">{children}</main>
      <Footer />
    </div>
  )
}
