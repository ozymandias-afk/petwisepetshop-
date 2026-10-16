   'use client'
   import { useState } from 'react'
   import { useCart } from '@/components/cart-provider'
   import { useLanguage } from '@/components/language-provider'
   import { formatPrice } from '@/lib/i18n'

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart()
  const { lang } = useLanguage()
  const ar = lang === 'ar'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState('')
  const [transferScreenshot, setTransferScreenshot] = useState('')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Amman',
    address: '',
    notes: '',
    deliveryType: 'delivery',
    paymentMethod: 'cod',
    transferReference: '',
    website: ''
  })

  const label = (en: string, arabic: string) => (ar ? arabic : en)
  const change = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setForm(v => ({ ...v, [e.target.name]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!items.length) {
      setError(label('Your cart is empty.', 'سلتك فارغة.'))
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          transferScreenshot,
          lang,
          items: items.map(p => ({ slug: p.slug, quantity: p.quantity }))
        })
      })
      const data = await res.json()
      if (!res.ok)
        throw new Error(
          data.error ||
            label('Could not place order.', 'تعذر إرسال الطلب.')
        )
      clear()
      if (data.adminWhatsApp)
        sessionStorage.setItem('petwise-last-order-wa', data.adminWhatsApp)
      window.location.href = `/order-confirmation?number=${encodeURIComponent(
        data.orderNumber
      )}`
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : label('Something went wrong.', 'حدث خطأ.')
      )
    } finally {
      setLoading(false)
    }
  }

  if (order) return <p>{order}</p>

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold">
        {label('Checkout', 'إتمام الطلب')}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {label('Order subtotal', 'المجموع الفرعي')}:{' '}
        {formatPrice(subtotal, lang)}
      </p>

      <div className="mt-4 rounded-2xl border bg-card p-4">
        {items.map(item => (
          <div
            key={item.slug}
            className="flex justify-between gap-4 border-b py-2 last:border-0"
          >
            <span>
              {item.name[lang]} × {item.quantity}
            </span>
            <strong className="shrink-0">
              {formatPrice(item.price * item.quantity, lang)}
            </strong>
          </div>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="mt-6 grid gap-5 rounded-3xl border border-border bg-card p-5 sm:p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="name"
            label={label('Full name', 'الاسم الكامل')}
            required
            value={form.name}
            onChange={change}
          />
          <Field
            name="phone"
            label={label('Phone number', 'رقم الهاتف')}
            required
            value={form.phone}
            onChange={change}
          />
          <Field
            name="email"
            type="email"
            label={label('Email (optional)', 'البريد الإلكتروني (اختياري)')}
            value={form.email}
            onChange={change}
          />
          <Field
            name="city"
            label={label('Delivery area / city', 'المنطقة / المدينة')}
            required
            value={form.city}
            onChange={change}
          />
        </div>

        <Field
          name="address"
          label={label('Full address', 'العنوان الكامل')}
          required
          value={form.address}
          onChange={change}
        />

        <label className="grid gap-2 text-sm font-bold">
          {label('Delivery notes', 'ملاحظات التوصيل')}
          <textarea
            name="notes"
            value={form.notes}
            onChange={change}
            rows={3}
            maxLength={1000}
            className="rounded-xl border border-input bg-background p-3 font-normal"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold">
            {label('Fulfilment', 'طريقة الاستلام')}
            <select
              name="deliveryType"
              value={form.deliveryType}
              onChange={change}
              className="rounded-xl border bg-background p-3"
            >
              <option value="delivery">{label('Delivery', 'توصيل')}</option>
              <option value="pickup">{label('Store pickup', 'استلام من المتجر')}</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-bold">
            {label('Payment method', 'طريقة الدفع')}
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={change}
              className="rounded-xl border bg-background p-3"
            >
              <option value="cod">
                {label(
                  'Cash on delivery / pay at pickup',
                  'الدفع عند التوصيل / الاستلام'
                )}
              </option>
              <option value="cliq">
                {label('CliQ / bank transfer', 'كليك / تحويل بنكي')}
              </option>
              <option value="card">
                {label(
                  'Online card (coming soon)',
                  'بطاقة إلكترونية (قريباً)'
                )}
              </option>
            </select>
          </label>
        </div>

        {form.paymentMethod === 'cliq' && (
          <div className="rounded-xl bg-muted p-4 text-sm">
            <p className="font-bold">
              {label('Transfer details', 'تفاصيل التحويل')}
            </p>
            <div className="mt-2 space-y-1">
              <p>
                {label('CliQ alias', 'اسم كليك')}:{' '}
                <span dir="ltr" className="inline-block font-bold text-red-600">
                  {process.env.NEXT_PUBLIC_CLIQ_ALIAS ||
                    label('Not configured yet', 'لم يتم الإعداد بعد')}
                </span>
              </p>
              <p>
                {label('Account name', 'اسم صاحب الحساب')}:{' '}
                <span dir="ltr" className="inline-block font-bold text-red-600">
                  Tareq Banna
                </span>
              </p>
            </div>

            <Field
              name="transferReference"
              label={label(
                'Transfer reference number',
                'رقم مرجع التحويل'
              )}
              value={form.transferReference}
              onChange={change}
            />

            <label className="mt-3 grid gap-2 font-bold">
              {label(
                'Upload transfer screenshot (optional)',
                'ارفع صورة إثبات التحويل (اختياري)'
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (!f) {
                    setTransferScreenshot('')
                    return
                  }
                  if (f.size > 4 * 1024 * 1024) {
                    setError(
                      label(
                        'Screenshot must be under 4MB.',
                        'يجب أن يكون حجم الصورة أقل من 4 ميغابايت.'
                      )
                    )
                    e.target.value = ''
                    return
                  }
                  const reader = new FileReader()
                  reader.onload = () =>
                    setTransferScreenshot(String(reader.result || ''))
                  reader.readAsDataURL(f)
                }}
                className="font-normal file:me-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-red-600 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-red-700"
              />
            </label>
          </div>
        )}

        {form.paymentMethod === 'card' && (
          <p className="rounded-xl bg-accent p-4 text-sm">
            {label(
              'Online card payment is not active yet. Choose cash or transfer until a Jordan-supported provider is configured.',
              'الدفع بالبطاقة غير متاح حالياً. اختر الدفع النقدي أو التحويل حتى يتم إعداد مزوّد دفع يدعم الأردن.'
            )}
          </p>
        )}

        {/* Hidden spam-trap field: real customers never see or fill it */}
        <input
          name="website"
          value={form.website}
          onChange={change}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || form.paymentMethod === 'card'}
          className="rounded-full bg-primary px-6 py-3 font-bold text-white disabled:opacity-60"
        >
          {loading
            ? label('Placing order…', 'جاري إرسال الطلب…')
            : label('Place order', 'تأكيد الطلب')}
        </button>
      </form>
    </div>
  )
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="mt-3 grid gap-2 text-sm font-bold first:mt-0">
      {label}
      <input
        {...props}
        className="rounded-xl border border-input bg-background p-3 font-normal"
      />
    </label>
  )
}
