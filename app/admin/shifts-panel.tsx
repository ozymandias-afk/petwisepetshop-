'use client'
import { useCallback, useEffect, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'

const KINDS: Record<string, [string, string]> = {
  shortage: ['Shortage', 'نقص'],
  excess: ['Excess inventory', 'فائض مخزون'],
  call_in: ['Call-in (absence)', 'إبلاغ عن غياب'],
  other: ['Other', 'أخرى'],
}

function sinceMs(range: string) {
  if (range === 'all') return 0
  if (range === 'today') {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  }
  return Date.now() - Number(range) * 86400000
}

export function ShiftsPanel({ supabase, ar }: { supabase: SupabaseClient; ar: boolean }) {
  const t = (en: string, arabic: string) => (ar ? arabic : en)
  const locale = ar ? 'ar-JO-u-nu-latn' : 'en-GB'

  const [rows, setRows] = useState<any[]>([])
  const [notes, setNotes] = useState<any[]>([])
  const [team, setTeam] = useState<any[]>([])
  const [range, setRange] = useState('7')
  const [who, setWho] = useState('all')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [noteEmployee, setNoteEmployee] = useState('')
  const [noteKind, setNoteKind] = useState('call_in')
  const [noteBody, setNoteBody] = useState('')

  const refresh = useCallback(async () => {
    setError('')
    const [r, n, e] = await Promise.all([
      supabase.from('admin_shift_report').select('*').order('clock_in', { ascending: false }).limit(500),
      supabase.from('shift_notes').select('id, employee_id, kind, body, created_at, employees(full_name)').order('created_at', { ascending: false }).limit(300),
      supabase.from('employees').select('user_id, full_name, active').order('full_name'),
    ])
    if (r.error) setError(r.error.message)
    else setRows(r.data || [])
    if (n.error) setError(n.error.message)
    else setNotes(n.data || [])
    if (e.error) setError(e.error.message)
    else setTeam(e.data || [])
  }, [supabase])

  useEffect(() => {
    refresh()
  }, [refresh])

  const since = sinceMs(range)
  const shiftsShown = rows.filter(
    r => new Date(r.clock_in).getTime() >= since && (who === 'all' || r.employee === who),
  )
  const notesShown = notes.filter(
    n => new Date(n.created_at).getTime() >= since && (who === 'all' || n.employees?.full_name === who),
  )

  const totalMinutes = shiftsShown.reduce((n, r) => n + Number(r.minutes_worked || 0), 0)
  const totalSales = shiftsShown.reduce((n, r) => n + Number(r.total_sales || 0), 0)

  const perEmployee: Record<string, { shifts: number; minutes: number; sales: number }> = {}
  shiftsShown.forEach(r => {
    const x = (perEmployee[r.employee] ||= { shifts: 0, minutes: 0, sales: 0 })
    x.shifts += 1
    x.minutes += Number(r.minutes_worked || 0)
    x.sales += Number(r.total_sales || 0)
  })

  function dur(minutes: number) {
    const m = Math.round(minutes)
    const h = Math.floor(m / 60)
    return ar ? `${h} س ${m % 60} د` : `${h}h ${m % 60}m`
  }
  const when = (iso: string) =>
    new Date(iso).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Amman' })
  const money = (n: number) => `${n.toFixed(3)} JOD`

  async function addNote(e: React.FormEvent) {
    e.preventDefault()
    if (!noteEmployee || !noteBody.trim()) return
    setBusy(true)
    const { error } = await supabase
      .from('shift_notes')
      .insert({ employee_id: noteEmployee, kind: noteKind, body: noteBody.trim() })
    if (error) setError(error.message)
    else {
      setNoteBody('')
      await refresh()
    }
    setBusy(false)
  }

  async function toggleActive(id: string, active: boolean) {
    const { error } = await supabase.from('employees').update({ active: !active }).eq('user_id', id)
    if (error) setError(error.message)
    else refresh()
  }

  const card = 'rounded-2xl border bg-card p-4'
  const field = 'rounded-xl border bg-background p-2'

  return (
    <section className="mt-5 space-y-6">
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={range} onChange={e => setRange(e.target.value)} className={field}>
          <option value="today">{t('Today', 'اليوم')}</option>
          <option value="7">{t('Last 7 days', 'آخر 7 أيام')}</option>
          <option value="30">{t('Last 30 days', 'آخر 30 يوماً')}</option>
          <option value="all">{t('All time', 'كل الفترات')}</option>
        </select>
        <select value={who} onChange={e => setWho(e.target.value)} className={field}>
          <option value="all">{t('All employees', 'كل الموظفين')}</option>
          {team.map(m => <option key={m.user_id} value={m.full_name}>{m.full_name}</option>)}
        </select>
        <button onClick={refresh} className="rounded-full border px-4 py-2">{t('Refresh', 'تحديث')}</button>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className={card}>
          <p className="text-sm text-muted-foreground">{t('Shifts', 'الورديات')}</p>
          <p className="mt-1 text-2xl font-extrabold">{shiftsShown.length}</p>
        </div>
        <div className={card}>
          <p className="text-sm text-muted-foreground">{t('Hours worked', 'ساعات العمل')}</p>
          <p className="mt-1 text-2xl font-extrabold" dir="ltr">{dur(totalMinutes)}</p>
        </div>
        <div className={card}>
          <p className="text-sm text-muted-foreground">{t('Recorded sales', 'المبيعات المسجلة')}</p>
          <p className="mt-1 text-2xl font-extrabold" dir="ltr">{money(totalSales)}</p>
        </div>
      </div>

      {/* Per employee */}
      {Object.keys(perEmployee).length > 0 && (
        <div className={card}>
          <h2 className="font-extrabold">{t('Per employee', 'لكل موظف')}</h2>
          <ul className="mt-3 divide-y">
            {Object.entries(perEmployee).map(([name, x]) => (
              <li key={name} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <span className="font-bold">{name}</span>
                <span dir="ltr">{x.shifts} {t('shifts', 'وردية')} · {dur(x.minutes)} · {money(x.sales)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Shifts */}
      <div className="space-y-3">
        <h2 className="text-xl font-extrabold">{t('Shifts', 'الورديات')}</h2>
        {shiftsShown.map(r => (
          <article key={r.shift_id} className={card}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-extrabold">{r.employee}</h3>
              {!r.clock_out && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  {t('On shift now', 'في الوردية الآن')}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              <span dir="ltr">{when(r.clock_in)}</span> → {r.clock_out ? <span dir="ltr">{when(r.clock_out)}</span> : '…'}
            </p>
            <p className="mt-2 text-sm font-bold" dir="ltr">
              {dur(Number(r.minutes_worked || 0))} · {money(Number(r.total_sales || 0))}
            </p>
          </article>
        ))}
        {!shiftsShown.length && <p className="py-4 text-muted-foreground">{t('No shifts in this period.', 'لا توجد ورديات في هذه الفترة.')}</p>}
      </div>

      {/* Notes */}
      <div className="space-y-3">
        <h2 className="text-xl font-extrabold">{t('Notes', 'الملاحظات')}</h2>

        <form onSubmit={addNote} className={`${card} grid gap-3`}>
          <p className="font-bold">{t('Add a note for an employee (for example a call-in)', 'إضافة ملاحظة لموظف (مثل إبلاغ غياب)')}</p>
          <select required value={noteEmployee} onChange={e => setNoteEmployee(e.target.value)} className={field}>
            <option value="">{t('Choose employee', 'اختر الموظف')}</option>
            {team.map(m => <option key={m.user_id} value={m.user_id}>{m.full_name}</option>)}
          </select>
          <select value={noteKind} onChange={e => setNoteKind(e.target.value)} className={field}>
            {Object.entries(KINDS).map(([id, [en, arabic]]) => <option key={id} value={id}>{t(en, arabic)}</option>)}
          </select>
          <textarea required rows={2} maxLength={1000} value={noteBody} onChange={e => setNoteBody(e.target.value)} placeholder={t('Details…', 'التفاصيل…')} className={field} />
          <button disabled={busy} className="rounded-full bg-primary p-3 font-bold text-white disabled:opacity-60">{t('Save note', 'حفظ الملاحظة')}</button>
        </form>

        {notesShown.map(n => (
          <article key={n.id} className={card}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-extrabold">{n.employees?.full_name}</h3>
              <span className="rounded-full border px-3 py-1 text-xs font-bold">{t(...(KINDS[n.kind] || KINDS.other))}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground" dir="ltr">{when(n.created_at)}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm">{n.body}</p>
          </article>
        ))}
        {!notesShown.length && <p className="py-4 text-muted-foreground">{t('No notes in this period.', 'لا توجد ملاحظات في هذه الفترة.')}</p>}
      </div>

      {/* Team */}
      <div className={card}>
        <h2 className="font-extrabold">{t('Employees', 'الموظفون')}</h2>
        <ul className="mt-3 divide-y">
          {team.map(m => (
            <li key={m.user_id} className="flex items-center justify-between gap-2 py-2">
              <span className="font-bold">{m.full_name}</span>
              <button onClick={() => toggleActive(m.user_id, m.active)} className="rounded-full border px-3 py-1 text-sm">
                {m.active ? t('Active — tap to disable', 'نشط — اضغط للإيقاف') : t('Disabled — tap to enable', 'موقوف — اضغط للتفعيل')}
              </button>
            </li>
          ))}
          {!team.length && <li className="py-2 text-sm text-muted-foreground">{t('No employees yet.', 'لا يوجد موظفون بعد.')}</li>}
        </ul>
      </div>
    </section>
  )
}
