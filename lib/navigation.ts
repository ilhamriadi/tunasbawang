import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Tags,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = { title: string; href: string; icon: LucideIcon }
export type NavGroup = { label: string; items: NavItem[] }

export const navGroups: NavGroup[] = [
  {
    label: 'Ringkasan',
    items: [{ title: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
  },
  {
    label: 'Katalog',
    items: [
      { title: 'Produk', href: '/admin/products', icon: Package },
      { title: 'Kategori', href: '/admin/categories', icon: Tags },
    ],
  },
  {
    label: 'Transaksi',
    items: [{ title: 'Pesanan', href: '/admin/orders', icon: ShoppingCart }],
  },
  {
    label: 'Stok',
    items: [{ title: 'Inventori', href: '/admin/inventory', icon: Boxes }],
  },
  {
    label: 'Pelanggan',
    items: [{ title: 'Pelanggan', href: '/admin/customers', icon: Users }],
  },
  {
    label: 'Analitik',
    items: [{ title: 'Laporan', href: '/admin/reports', icon: BarChart3 }],
  },
  {
    label: 'Sistem',
    items: [
      { title: 'Pengaturan', href: '/admin/settings', icon: Settings },
      { title: 'Pengguna & Peran', href: '/admin/settings/users', icon: ShieldCheck },
    ],
  },
]
