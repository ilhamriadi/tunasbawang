import { Leaf } from 'lucide-react'
import { LoginForm } from '@/components/admin/login-form'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const { next, error } = await searchParams

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Leaf className="size-6" strokeWidth={2.5} />
        </span>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Tunas Bawang Admin</h1>
          <p className="text-sm text-muted-foreground">Masuk untuk mengelola toko</p>
        </div>
      </div>
      <LoginForm next={next} error={error} />
    </div>
  )
}
