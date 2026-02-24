'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { login } from '@/store/slices/authSlice'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Cookies from 'js-cookie'

const Login = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const token = useAppSelector((state) => state.auth.token)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (token) {
      router.replace('/admin') // or '/user' based on role if you want dynamic redirect
    }
  }, [token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials')
      }

      // ✅ Update Redux
      dispatch(
        login({
          user: data.user,
          token: data.user.token,
        })
      )

      // ✅ Set cookies for middleware
      Cookies.set('token', data.user.token, { expires: 7 }) // 1 day expiry
      Cookies.set('role', data.user.role, { expires: 7 })

      toast.success('Login successful')
      console.log(data);
      if(data.user.role=="admin"){
        router.push("/admin")
      }
      if(data.user.role=="user"){
        router.push("/user")
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <CardContent>
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
