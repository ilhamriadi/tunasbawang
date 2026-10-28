import { getStoreSettings } from '@/lib/data/settings'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { SettingsForm } from '@/components/admin/settings/settings-form'

export const metadata = { title: 'Pengaturan' }

export default async function SettingsPage() {
  const settings = await getStoreSettings()
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Pengaturan Toko" description="Nama, kontak, alamat, dan preferensi toko." />
      <Card>
        <CardContent>
          <SettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  )
}
