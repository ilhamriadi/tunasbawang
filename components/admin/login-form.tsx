'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LogIn, ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export function LoginForm({ next, error }: { next?: string; error?: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (signInError) {
      toast.error('Gagal masuk', { description: 'Email atau kata sandi salah.' })
      return
    }
    router.replace(next && next.startsWith('/admin') ? next : '/admin')
    router.refresh()
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Masuk</CardTitle>
        <CardDescription>Gunakan akun administrator toko Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        {error === 'forbidden' && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-600/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
            <ShieldAlert className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-medium">Akses ditolak</p>
              <p className="text-xs">Akun ini tidak memiliki peran admin/staf.</p>
              <button onClick={handleSignOut} className="mt-1 text-xs underline underline-offset-2">
                Keluar dari akun ini
              </button>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tunasbawang.id"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Kata sandi</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Memproses…' : (
              <>
                <LogIn />
                Masuk
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
