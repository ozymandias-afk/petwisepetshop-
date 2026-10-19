'use client'
import { useEffect, useState } from 'react'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { useLanguage } from '@/components/language-provider'
import { ShiftsPanel } from './shifts-panel'

type ProductRow = {
  id?: string
  slug: string
  name: { ar: string; en: string }
  description: { ar: string; en: string }
  price: number
  images: string[]
  category: string
  stock: number
  active: boolean
}

let client: SupabaseClient | null = null
function getClient() {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) client = createClient(url, key)
  }
  return client
}

const blankDraft = (): ProductRow => ({
  slug: '',
  name: { ar: '', en: '' },
  description: { ar: '', en: '' },
  price: 0,
  images: [],
  category: 'cat',
  stock: 0,
  active: true,
})

const ORDER_STATUSES = ['New', 'Confirmed', 'Preparing', 'Out for delivery', 'Completed', 'Cancelled']
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed', 'Refunded']

export default function AdminPage() {
  const { lang } = useLanguage()
  const ar = lang === 'ar'

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [session, setSession] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<ProductRow[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [busy, setBusy] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [draft, setDraft] = useState<ProductRow>(blankDraft())
  const [announcement, setAnnouncement] = useState({ text_en: '', text_ar: '', active: true })

  useEffect(() => {
    const s = getClient()
    setSupabase(s)
    if (s) {
      s.auth.getSession().then(({ data }) => setSession(data.session))
      const {
        data: { subscription },
      } = s.auth.onAuthStateChange((_e, session) => setSession(session))
      return () => subscription.unsubscribe()
    }
  }, [])

  async function refresh() {
    if (!supabase) return

    // 1. Fetch core store data (Orders, Products, Customers)
    const [o, p, c] = await Promise.all([
      supabase
        .from('orders')
        .select('*,customers(name,phone,email),order_items(*)')
        .order('created_at', { ascending: false })
        .limit(200),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase
        .from('customers')
        .select('*,orders(total,status,order_number)')
        .order('created_at', { ascending: false })
        .limit(500),
    ])

    if (o.error) setError(o.error.message)
    else setOrders(o.data || [])

    if (p.error) setError(p.error.message)
    else setProducts(p.data || [])

    if (c.error) setError(c.error.message)
    else setCustomers(c.data || [])

    // 2. Fetch announcements separately so it never breaks product rendering
    const { data: annData } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', 1)
      .maybeSingle()

    if (annData) {
      setAnnouncement({
        text_en: annData.text_en || '',
        text_ar: annData.text_ar || '',
        active: annData.active ?? true,
      })
    }
  }

    if (o.error) setError(o.error.message)
    else setOrders(o.data || [])
    if (p.error) setError(p.error.message)
    else setProducts(p.data || [])
    if (c.error) setError(c.error.message)
    else setCustomers(c.data || [])
    if (ann.data) {
      setAnnouncement({
        text_en: ann.data.text_en || '',
        text_ar: ann.data.text_ar || '',
        active: ann.data.active ?? true,
      })
    }
  }

  useEffect(() => {
    if (session && supabase) refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, supabase])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setBusy(false)
  }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setError('')
    const row = { ...draft, price: Number(draft.price), stock: Number(draft.stock) }
    const { error } = draft.id
      ? await supabase.from('products').update(row).eq('id', draft.id)
      : await supabase.from('products').insert(row)
    if (error) setError(error.message)
    else {
      setDraft(blankDraft())
      await refresh()
    }
    setBusy(false)
  }

  async function saveAnnouncement(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setError('')

    const { error } = await supabase.from('announcements').upsert({
      id: 1,
      text_en: announcement.text_en,
      text_ar: announcement.text_ar,
      active: announcement.active,
      updated_at: new Date().toISOString(),
    })

    if (error) setError(error.message)
    else alert(ar ? 'تم حفظ الإعلان!' : 'Announcement updated!')
    setBusy(false)
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !supabase) return
    const path = `products/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: false })
    if (error) {
      setError(error.message)
      return
    }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    setDraft(v => ({ ...v, images: [...v.images, data.publicUrl] }))
    e.target.value = ''
  }

  async function status(id: string, newStatus: string) {
    if (!supabase) return
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id)
    if (error) setError(error.message)
    else refresh()
  }

  // Numbers for the summary cards on the Orders tab
  const isToday = (d: string) => new Date(d).toDateString() === new Date().toDateString()
  const todayOrders = orders.filter(o => isToday(o.created_at)).length
  const todayRevenue = orders
    .filter(o => isToday(o.created_at) && o.status !== 'Cancelled')
    .reduce((n, o) => n + Number(o.total), 0)
  const bestSelling = (() => {
    const counts: Record<string, number> = {}
    orders.forEach(o =>
      (o.order_items || []).forEach((i: any) => {
        const name = typeof i.product_name === 'object' ? i.product_name?.en || i.product_slug : i.product_name
        counts[name] = (counts[name] || 0) + Number(i.quantity)
      }),
    )
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
  })()

  if (!supabase)
    return (
      <Wrap ar={ar}>
        <p>{ar ? 'أضف إعدادات Supabase إلى ملف البيئة.' : 'Add Supabase settings to your environment file.'}</p>
      </Wrap>
    )

  if (!session)
    return (
      <Wrap ar={ar}>
        <h1 className="text-3xl font-extrabold">{ar ? 'لوحة تحكم PetWise' : 'PetWise Admin'}</h1>
        <p className="mt-2 text-muted-foreground">
          {ar ? 'تسجيل دخول المالك والمشرفين المصرح لهم فقط.' : 'Sign in with an explicitly authorized admin account.'}
        </p>
        <form onSubmit={login} className="mt-6 grid gap-4">
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="rounded-xl border p-3" />
          <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="rounded-xl border p-3" />
          {error && <p role="alert" className="text-red-600">{error}</p>}
          <button disabled={busy} className="rounded-full bg-primary p-3 font-bold text-white">
            {busy ? '…' : ar ? 'تسجيل الدخول' : 'Sign in'}
          </button>
        </form>
      </Wrap>
    )

  const tabs: [string, string][] = [
    ['orders', ar ? 'الطلبات' : 'Orders'],
    ['products', ar ? 'المنتجات' : 'Products'],
    ['customers', ar ? 'العملاء' : 'Customers'],
    ['shifts', ar ? 'الورديات' : 'Shifts'],
    ['announcements', ar ? 'الإعلانات' : 'Announcements'],
  ]

  return (
    <Wrap ar={ar}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold">{ar ? 'لوحة التحكم' : 'Admin dashboard'}</h1>
        <button onClick={() => supabase.auth.signOut()} className="rounded-full border px-4 py-2">
          {ar ? 'تسجيل الخروج' : 'Sign out'}
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`rounded-full px-4 py-2 font-bold ${tab === id ? 'bg-primary text-white' : 'border'}`}>
            {label}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}

      {/* ORDERS */}
      {tab === 'orders' && (
        <section className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">{ar ? 'طلبات اليوم' : 'Today’s orders'}</p>
              <p className="mt-1 text-2xl font-extrabold">{todayOrders}</p>
            </div>
            <div className="rounded-2xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">{ar ? 'إيرادات اليوم' : 'Today’s revenue'}</p>
              <p className="mt-1 text-2xl font-extrabold">{todayRevenue.toFixed(2)} JOD</p>
            </div>
            <div className="rounded-2xl border bg-card p-4">
              <p className="text-sm text-muted-foreground">{ar ? 'الأكثر مبيعاً' : 'Best-selling product'}</p>
              <p className="mt-1 text-lg font-extrabold">{bestSelling}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-xl border bg-background p-2">
              <option value="all">{ar ? 'كل الحالات' : 'All statuses'}</option>
              {ORDER_STATUSES.map(x => <option key={x}>{x}</option>)}
            </select>
            <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="rounded-xl border bg-background p-2">
              <option value="all">{ar ? 'كل حالات الدفع' : 'All payment statuses'}</option>
              {PAYMENT_STATUSES.map(x => <option key={x}>{x}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            {orders
              .filter(o => (statusFilter === 'all' || o.status === statusFilter) && (paymentFilter === 'all' || o.payment_status === paymentFilter))
              .map(o => (
                <article key={o.id} className="rounded-2xl border bg-card p-4">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <h2 className="font-extrabold">{o.order_number} · {o.customers?.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {o.customers?.phone} · {Number(o.total).toFixed(2)} JOD · {o.payment_status}
                      </p>
                    </div>
                    <select value={o.status} onChange={e => status(o.id, e.target.value)} className="rounded-xl border bg-background p-2">
                      {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">
                    {o.delivery_type} · {o.payment_method} · {o.delivery_city || ''} {o.delivery_address || ''}
                  </p>
                  {o.notes && <p className="mt-1 whitespace-pre-wrap text-sm">{o.notes}</p>}

                  {o.notes?.includes('Transfer screenshot stored securely:') && (
                    <button
                      onClick={async () => {
                        const path = String(o.notes).match(/Transfer screenshot stored securely: (\S+)/)?.[1]
                        if (!path) return
                        const { data, error } = await supabase.storage.from('payment-proofs').createSignedUrl(path, 3600)
                        if (error) setError(error.message)
                        else if (data?.signedUrl) window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
                      }}
                      className="mt-2 rounded-full border px-3 py-2 text-sm font-bold"
                    >
                      {ar ? 'عرض إثبات التحويل' : 'View transfer screenshot'}
                    </button>
                  )}

                  <ul className="mt-3 list-inside list-disc text-sm">
                    {(o.order_items || []).map((i: any) => (
                      <li key={i.id}>
                        {typeof i.product_name === 'object' ? i.product_name.en : i.product_name} × {i.quantity} — {i.line_total} JOD
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            {!orders.length && <p className="py-8 text-muted-foreground">{ar ? 'لا توجد طلبات.' : 'No orders yet.'}</p>}
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      {tab === 'products' && (
        <section className="mt-5 grid items-start gap-6 lg:grid-cols-2">
          <form onSubmit={saveProduct} className="flex flex-col gap-3 rounded-2xl border bg-card p-4">
            <h2 className="text-xl font-bold">{ar ? 'إضافة / تعديل منتج' : 'Add / edit product'}</h2>

            <input required placeholder="slug" value={draft.slug} onChange={e => setDraft(v => ({ ...v, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))} className="h-11 rounded-xl border bg-background p-3" />
            <input required placeholder="Name (English)" value={draft.name.en} onChange={e => setDraft(v => ({ ...v, name: { ...v.name, en: e.target.value } }))} className="h-11 rounded-xl border bg-background p-3" />
            <input required placeholder="الاسم بالعربية" value={draft.name.ar} onChange={e => setDraft(v => ({ ...v, name: { ...v.name, ar: e.target.value } }))} className="h-11 rounded-xl border bg-background p-3" />
            <textarea required placeholder="Description (English)" value={draft.description.en} onChange={e => setDraft(v => ({ ...v, description: { ...v.description, en: e.target.value } }))} className="rounded-xl border bg-background p-3" />
            <textarea required placeholder="الوصف بالعربية" value={draft.description.ar} onChange={e => setDraft(v => ({ ...v, description: { ...v.description, ar: e.target.value } }))} className="rounded-xl border bg-background p-3" />

            <div className="grid grid-cols-3 gap-2">
              <input required type="number" min="0" step=".01" placeholder="Price JOD" value={draft.price} onChange={e => setDraft(v => ({ ...v, price: Number(e.target.value) }))} className="min-w-0 h-11 rounded-xl border bg-background p-2" />
              <input required type="number" min="0" placeholder="Stock" value={draft.stock} onChange={e => setDraft(v => ({ ...v, stock: Number(e.target.value) }))} className="min-w-0 h-11 rounded-xl border bg-background p-2" />
              <select value={draft.category} onChange={e => setDraft(v => ({ ...v, category: e.target.value }))} className="min-w-0 h-11 rounded-xl border bg-background p-2">
                {['dog', 'cat', 'birds', 'fish', 'small-pets', 'accessories'].map(x => <option key={x}>{x}</option>)}
              </select>
            </div>

            <input type="file" accept="image/*" onChange={upload} className="text-sm" />

            {/* Image thumbnails with a remove button */}
            <div className="flex flex-wrap gap-3">
              {draft.images.length === 0 && (
                <p className="text-xs text-muted-foreground">{ar ? 'لا توجد صور' : 'No images uploaded'}</p>
              )}
              {draft.images.map((src, i) => (
                <div key={src + i} className="relative">
                  <img src={src} alt="" className="size-20 rounded-xl border bg-muted object-cover" />
                  <button
                    type="button"
                    onClick={() => setDraft(v => ({ ...v, images: v.images.filter((_, j) => j !== i) }))}
                    aria-label={ar ? 'حذف الصورة' : 'Remove image'}
                    className="absolute -end-2 -top-2 flex size-6 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={draft.active} onChange={e => setDraft(v => ({ ...v, active: e.target.checked }))} />
              {ar ? 'نشط' : 'Active'}
            </label>

            <button disabled={busy} className="rounded-full bg-primary p-3 font-bold text-white">
              {ar ? 'حفظ المنتج' : 'Save product'}
            </button>
          </form>

          <div className="space-y-3">
            {products.map(p => (
              <article key={p.id || p.slug} className="flex items-center justify-between gap-3 rounded-2xl border bg-card p-3">
                <div>
                  <p className="font-bold">{p.name?.en || p.slug}</p>
                  <p className="text-sm">{p.price} JOD · {p.stock} in stock · {p.active ? 'Active' : 'Hidden'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setDraft({ ...p, images: p.images || [] })} className="rounded-full border px-3 py-2 text-sm">
                    {ar ? 'تعديل' : 'Edit'}
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('Delete product?')) {
                        const { error } = await supabase.from('products').delete().eq('id', p.id)
                        if (error) setError(error.message)
                        else refresh()
                      }
                    }}
                    className="rounded-full border px-3 py-2 text-sm text-red-600"
                  >
                    {ar ? 'حذف' : 'Delete'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CUSTOMERS */}
      {tab === 'customers' && (
        <section className="mt-5">
          <button
            onClick={async () => {
              const { data, error } = await supabase.from('customers').select('name,phone,email,created_at,orders(total,status,order_number)')
              if (error) {
                setError(error.message)
                return
              }
              const csv = [
                'name,phone,email,orders,total_spent',
                ...(data || []).map(c =>
                  [
                    c.name,
                    c.phone,
                    c.email || '',
                    c.orders?.length || 0,
                    (c.orders || []).reduce((n: number, o: any) => n + Number(o.total), 0),
                  ]
                    .map(v => `"${String(v ?? '').replaceAll('"', '""')}"`)
                    .join(','),
                ),
              ].join('\n')
              const a = document.createElement('a')
              a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
              a.download = 'petwise-customers.csv'
              a.click()
              URL.revokeObjectURL(a.href)
            }}
            className="rounded-full bg-primary px-5 py-3 font-bold text-white"
          >
            {ar ? 'تصدير العملاء CSV' : 'Export customers CSV'}
          </button>
          <p className="mt-3 text-sm text-muted-foreground">
            {ar ? 'تصدير العملاء وسجل الطلبات والإجمالي.' : 'Customer order history and lifetime spend.'}
          </p>

          <div className="mt-4 space-y-3">
            {customers.map(c => (
              <article key={c.id} className="rounded-2xl border bg-card p-4">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <h2 className="font-extrabold">{c.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {c.phone}
                      {c.email ? ` · ${c.email}` : ''}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="font-extrabold">
                      {(c.orders || []).reduce((n: number, o: any) => n + Number(o.total), 0).toFixed(2)} JOD
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(c.orders || []).length} {ar ? 'طلبات' : 'orders'}
                    </p>
                  </div>
                </div>
                {(c.orders || []).length > 0 && (
                  <ul className="mt-3 list-inside list-disc text-sm">
                    {(c.orders || []).map((o: any) => (
                      <li key={o.order_number}>
                        {o.order_number} · {o.status} · {Number(o.total).toFixed(2)} JOD
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* SHIFTS (employees) */}
      {tab === 'shifts' && <ShiftsPanel supabase={supabase} ar={ar} />}

      {/* ANNOUNCEMENTS */}
      {tab === 'announcements' && (
        <section className="mt-5 max-w-2xl">
          <form onSubmit={saveAnnouncement} className="flex flex-col gap-4 rounded-2xl border bg-card p-6">
            <h2 className="text-xl font-bold">{ar ? 'شريط الإعلانات العلوية' : 'Homepage Banner Announcement'}</h2>
            
            <div>
              <label className="block text-sm font-semibold mb-1">{ar ? 'النص بالإنجليزية' : 'English Text'}</label>
              <input
                type="text"
                value={announcement.text_en}
                onChange={e => setAnnouncement(v => ({ ...v, text_en: e.target.value }))}
                placeholder="e.g. 20% OFF all cat food this week!"
                className="w-full h-11 rounded-xl border bg-background p-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">{ar ? 'النص بالعربية' : 'Arabic Text'}</label>
              <input
                type="text"
                value={announcement.text_ar}
                onChange={e => setAnnouncement(v => ({ ...v, text_ar: e.target.value }))}
                placeholder="مثال: خصم 20% على جميع أطعمة القطط هذا الأسبوع!"
                className="w-full h-11 rounded-xl border bg-background p-3 text-sm"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
              <input
                type="checkbox"
                checked={announcement.active}
                onChange={e => setAnnouncement(v => ({ ...v, active: e.target.checked }))}
                className="size-4 rounded"
              />
              {ar ? 'تفعيل ظهور الشريط في الصفحة الرئيسية' : 'Show banner on homepage'}
            </label>

            <button disabled={busy} className="mt-2 rounded-full bg-primary p-3 font-bold text-white">
              {ar ? 'حفظ الإعلان' : 'Save Announcement'}
            </button>
          </form>
        </section>
      )}
    </Wrap>
  )
}

function Wrap({ children, ar }: { children: React.ReactNode; ar: boolean }) {
  return (
    <div dir={ar ? 'rtl' : 'ltr'} className="mx-auto min-h-[70vh] max-w-6xl px-4 py-10 sm:px-6">
      {children}
    </div>
  )
}
