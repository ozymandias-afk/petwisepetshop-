'use client'
import { useEffect, useState } from 'react'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { useLanguage } from '@/components/language-provider'

let client: SupabaseClient | null = null
function getClient() {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) client = createClient(url, key)
  }
  return client
}

const NOTE_KINDS: [string, string, string][] = [
  ['shortage', 'Shortage', 'نقص'],
  ['excess', 'Excess inventory', 'فائض مخزون'],
  ['call_in', 'Call-in (absence)', 'إبلاغ عن غياب'],
  ['other', 'Other', 'أخرى'],
]
const METHODS: [string, string, string][] = [
  ['cash', 'Cash', 'نقداً'],
  ['cliq', 'CliQ', 'كليك'],
  ['card', 'Card', 'بطاقة'],
]

export default function EmployeePage() {
  const { lang } = useLanguage()
  const ar = lang === 'ar'
  const t = (en: string, arabic: string) => (ar ? arabic : en)

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [session, setSession] = useState<any>(null)
  const [ready, setReady] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [employee, setEmployee] = useState<{ full_name: string; active: boolean } | null>(null)
  const [shift, setShift] = useState<{ id: string; clock_in: string } | null>(null)
  const [total, setTotal] = useState(0)
  const [now, setNow] = useState(Date.now())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [saleAmount, setSaleAmount] = useState('')
  const [saleMethod, setSaleMethod] = useState('cash')
  const [saleNote, setSaleNote] = useState('')
  const [noteKind, setNoteKind] = useState('shortage')
  const [noteBody, setNoteBody] = useState('')

  // Connect to Supabase and follow the login session
  useEffect(() => {
    const s = getClient()
    setSupabase(s)
    if (!s) {
      setReady(true)
      return
    }
    s.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const {
      data: { subscription },
    } = s.auth.onAuthStateChange((_e, sess) => setSession(sess))
    return () => subscription.unsubscribe()
  }, [])

  // Keep the shift timer fresh
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(id)
  }, [])

  async function load() {
    if (!supabase || !session) return
    const { data: emp } = await supabase
      .from('employees')
      .select('full_name, active')
      .eq('user_id', session.user.id)
      .maybeSingle()
    setEmployee(emp)
    if (!emp) return
    const { data: sh } = await supabase
      .from('shifts')
      .select('id, clock_in')
      .is('clock_out', null)
      .maybeSingle()
    setShift(sh)
    if (sh) {
      const { data: tot } = await supabase.rpc('employee_shift_total')
      setTotal(Number(tot ?? 0))
    } else {
      setTotal(0)
    }
  }

  useEffect(() => {
    if (session && supabase) load()
    else {
      setEmployee(null)
      setShift(null)
      setTotal(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, supabase])

  function friendly(msg: string) {
    if (msg.includes('Clock in first')) return t('Start your shift first.', 'ابدأ الوردية أولاً.')
    if (msg.includes('No open shift')) return t('You have no open shift.', 'لا توجد وردية مفتوحة.')
    if (msg.includes('one_open_shift')) return t('You already have an open shift.', 'لديك وردية مفتوحة بالفعل.')
    if (msg.includes('Not an active employee')) return t('This account is not an active employee.', 'هذا الحساب ليس موظفاً نشطاً.')
    return msg
  }

  async function run(
    action: () => PromiseLike<{ error: { message: string } | null }>,
    okText: string,
    after?: () => void,
  ) {
    setBusy(true)
    setError('')
    setMessage('')
    const { error } = await action()
    if (error) setError(friendly(error.message))
    else {
      setMessage(okText)
      after?.()
      await load()
    }
    setBusy(false)
  }

  async function login(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setBusy(false)
  }

  async function addSale(e: React.FormEvent) {
    e.preventDefault()
    const amount = Number(saleAmount)
    if (!amount || amount <= 0) {
      setError(t('Enter a valid amount.', 'أدخل مبلغاً صحيحاً.'))
      return
    }
    await run(
      () => supabase!.rpc('employee_add_sale', { p_amount: amount, p_method: saleMethod, p_note: saleNote || null }),
      t('Sale saved.', 'تم حفظ عملية البيع.'),
      () => {
        setSaleAmount('')
        setSaleNote('')
      },
    )
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault()
    if (!noteBody.trim()) {
      setError(t('Write the note first.', 'اكتب الملاحظة أولاً.'))
      return
    }
    await run(
      () => supabase!.rpc('employee_add_note', { p_kind: noteKind, p_body: noteBody.trim() }),
      t('Note saved.', 'تم حفظ الملاحظة.'),
      () => setNoteBody(''),
    )
  }

  function elapsed(from: string) {
    const mins = Math.max(0, Math.floor((now - new Date(from).getTime()) / 60000))
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return ar ? `${h} س ${m} د` : `${h}h ${m}m`
  }

  const input = 'rounded-xl border bg-background p-3'
  const primaryBtn = 'rounded-full bg-primary px-6 py-3 font-bold text-white disabled:opacity-60'

  if (!ready) return <Wrap ar={ar}><p>…</p></Wrap>

  if (!supabase)
    return (
      <Wrap ar={ar}>
        <p>{t('The system is not configured yet.', 'النظام غير مُعد بعد.')}</p>
      </Wrap>
    )

  if (!session)
    return (
      <Wrap ar={ar}>
        <h1 className="text-3xl font-extrabold">{t('Employee sign in', 'دخول الموظفين')}</h1>
        <form onSubmit={login} className="mt-6 grid gap-4">
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className={input} />
          <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className={input} />
          {error && <p role="alert" className="text-red-600">{error}</p>}
          <button disabled={busy} className={primaryBtn}>{busy ? '…' : t('Sign in', 'تسجيل الدخول')}</button>
        </form>
      </Wrap>
    )

  if (!employee || !employee.active)
    return (
      <Wrap ar={ar}>
        <h1 className="text-2xl font-extrabold">{t('No employee access', 'لا يوجد صلاحية موظف')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('This account is not set up as an active employee. Ask the manager.', 'هذا الحساب غير مُعد كموظف نشط. تواصل مع المدير.')}
        </p>
        <button onClick={() => supabase.auth.signOut()} className="mt-4 rounded-full border px-4 py-2">{t('Sign out', 'تسجيل الخروج')}</button>
      </Wrap>
    )

  return (
    <Wrap ar={ar}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">{t('Hello', 'مرحباً')}, {employee.full_name}</h1>
        <button onClick={() => supabase.auth.signOut()} className="rounded-full border px-4 py-2">{t('Sign out', 'تسجيل الخروج')}</button>
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 font-bold text-red-700">{error}</p>}
      {message && <p role="status" className="mt-4 rounded-xl bg-green-50 p-3 font-bold text-green-700">{message}</p>}

      {/* Shift */}
      <section className="mt-6 rounded-2xl border bg-card p-5">
        {!shift ? (
          <>
            <p className="text-muted-foreground">{t('You are not on a shift.', 'أنت لست في وردية حالياً.')}</p>
            <button
              disabled={busy}
              onClick={() => run(() => supabase.rpc('employee_clock_in'), t('Shift started.', 'بدأت الوردية.'))}
              className={`${primaryBtn} mt-4 w-full text-lg`}
            >
              {t('Start shift', 'بدء الوردية')}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {t('On shift since', 'في الوردية منذ')}{' '}
              <span dir="ltr">
                {new Date(shift.clock_in).toLocaleTimeString(ar ? 'ar-JO-u-nu-latn' : 'en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Amman' })}
              </span>{' '}
              · <span dir="ltr">{elapsed(shift.clock_in)}</span>
            </p>
            <p className="mt-4 text-sm text-muted-foreground">{t('Total sales this shift', 'إجمالي المبيعات في هذه الوردية')}</p>
            <p className="mt-1 text-4xl font-extrabold" dir="ltr">{total.toFixed(3)} JOD</p>
            <button
              disabled={busy}
              onClick={() => {
                if (confirm(t('End your shift now?', 'إنهاء الوردية الآن؟')))
                  run(() => supabase.rpc('employee_clock_out'), t('Shift ended. Thank you!', 'انتهت الوردية. شكراً!'))
              }}
              className="mt-5 w-full rounded-full border border-red-600 px-6 py-3 font-bold text-red-600 disabled:opacity-60"
            >
              {t('End shift', 'إنهاء الوردية')}
            </button>
          </>
        )}
      </section>

      {/* Record a sale */}
      {shift && (
        <form onSubmit={addSale} className="mt-6 grid gap-3 rounded-2xl border bg-card p-5">
          <h2 className="text-xl font-bold">{t('Record a sale', 'تسجيل عملية بيع')}</h2>
          <input required inputMode="decimal" type="number" min="0.001" step="0.001" placeholder={t('Amount (JOD)', 'المبلغ (دينار)')} value={saleAmount} onChange={e => setSaleAmount(e.target.value)} className={input} />
          <select value={saleMethod} onChange={e => setSaleMethod(e.target.value)} className={input}>
            {METHODS.map(([id, en, arabic]) => <option key={id} value={id}>{t(en, arabic)}</option>)}
          </select>
          <input maxLength={200} placeholder={t('What was sold? (optional)', 'ماذا تم بيعه؟ (اختياري)')} value={saleNote} onChange={e => setSaleNote(e.target.value)} className={input} />
          <button disabled={busy} className={primaryBtn}>{t('Save sale', 'حفظ البيع')}</button>
        </form>
      )}

      {/* Notes */}
      <form onSubmit={addNote} className="mt-6 grid gap-3 rounded-2xl border bg-card p-5">
        <h2 className="text-xl font-bold">{t('Add a note', 'إضافة ملاحظة')}</h2>
        <select value={noteKind} onChange={e => setNoteKind(e.target.value)} className={input}>
          {NOTE_KINDS.map(([id, en, arabic]) => <option key={id} value={id}>{t(en, arabic)}</option>)}
        </select>
        <textarea required rows={3} maxLength={1000} placeholder={t('Write the details…', 'اكتب التفاصيل…')} value={noteBody} onChange={e => setNoteBody(e.target.value)} className={input} />
        <button disabled={busy} className={primaryBtn}>{t('Save note', 'حفظ الملاحظة')}</button>
      </form>
    </Wrap>
  )
}

function Wrap({ children, ar }: { children: React.ReactNode; ar: boolean }) {
  return (
    <div dir={ar ? 'rtl' : 'ltr'} className="mx-auto min-h-[70vh] max-w-xl px-4 py-10 sm:px-6">
      {children}
    </div>
  )
}
