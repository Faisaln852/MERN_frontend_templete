"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"

export default function Navbar() {
  const token = useSelector((state: any) => state.auth.user)
  
  const isAuthenticated = token !== null
  console.log("start")
  console.log(token)
  console.log("end")
  const pathname = usePathname()

  return (
    <header className="border-b shadow-sm">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold mx-5">
          MySite
        </Link>

        {/* Nav Links */}
        <nav className="space-x-4">
          <Link href="/" className={pathname === "/" ? "font-semibold" : ""}>
            Home
          </Link>
          <Link href="/about" className={pathname === "/about" ? "font-semibold" : ""}>
            About
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Button variant="ghost">
                <Link href="/logout">Logout</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
