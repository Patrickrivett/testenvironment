import { StepNav } from '../components/ui'
import { ageFromDob } from '../lib/inbox'
import type { StepProps } from '../types'

function Row({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="review-row">
      <span className="muted">{label}</span>
      <span>{value || '—'}</span>
    </div>
  )
}

function Status({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={`status ${ok ? 'status-ok' : 'status-todo'}`}>
      <span>{ok ? '✓' : '!'}</span> {label}
      {!ok && <span className="muted small"> — you can finish this from your dashboard</span>}
    </div>
  )
}

export function Review({ data, next, back, goTo }: StepProps & { goTo: (i: number) => void }) {
  const socials = (['instagram', 'tiktok', 'youtube'] as const)
    .filter((k) => data[k].handle)
    .map((k) => `@${data[k].handle}${data[k].connected ? ' ✓' : ''}`)
    .join(', ')

  return (
    <div className="step">
      <p className="eyebrow">Almost done</p>
      <h2>Review your setup</h2>

      <section className="review-card">
        <div className="review-head">
          <h3>Contract inbox</h3>
          <button type="button" className="link" onClick={() => goTo(0)}>
            Edit
          </button>
        </div>
        <Row label="Your address" value={data.inboxAddress} />
        <Status ok={data.forwardingConfirmed} label="Gmail forwarding address verified" />
        <Status ok={data.filterCreated} label="Contract filter created" />
        <Status ok={data.testReceived} label="Test email received" />
      </section>

      <section className="review-card">
        <div className="review-head">
          <h3>Profile</h3>
          <button type="button" className="link" onClick={() => goTo(4)}>
            Edit
          </button>
        </div>
        <Row label="Name" value={`${data.firstName} ${data.lastName}`} />
        <Row label="Creator name" value={data.displayName} />
        <Row label="Age" value={ageFromDob(data.dateOfBirth)} />
        <Row label="Location" value={[data.city, data.country].filter(Boolean).join(', ')} />
        <Row label="Socials" value={socials} />
        <Row label="UGC types" value={data.ugcTypes.join(', ')} />
        <Row label="Niches" value={data.niches.join(', ')} />
        <Row label="Experience" value={data.experience} />
      </section>

      <section className="review-card">
        <div className="review-head">
          <h3>Business</h3>
          <button type="button" className="link" onClick={() => goTo(7)}>
            Edit
          </button>
        </div>
        <Row label="Legal name" value={data.legalName} />
        <Row label="Entity" value={data.businessName ? `${data.businessType} — ${data.businessName}` : data.businessType} />
        <Row label="Payment terms" value={data.paymentTerms} />
        <Row label="Manager" value={data.hasManager ? data.managerEmail : 'None'} />
      </section>

      <StepNav onBack={back} onNext={next} nextLabel="Finish setup →" />
    </div>
  )
}
