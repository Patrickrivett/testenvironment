import { Field, StepNav } from '../components/ui'
import type { StepProps } from '../types'

export function Business({ data, update, next, back }: StepProps) {
  const fullName = `${data.firstName} ${data.lastName}`.trim()
  const valid =
    data.legalName.trim() &&
    data.businessType &&
    (data.businessType === 'Individual / sole trader' || data.businessName.trim()) &&
    (!data.hasManager || data.managerEmail.trim())

  return (
    <div className="step">
      <p className="eyebrow">Your profile · Step 4 of 4</p>
      <h2>Business & contract details</h2>
      <p className="lead">
        We check these against every contract you forward — e.g. that the right legal name is on it and payment terms
        match what you expect.
      </p>

      <Field label="Legal name (as it appears on contracts)" hint="Usually your full legal name">
        <input
          value={data.legalName}
          placeholder={fullName || 'Jane Doe'}
          onChange={(e) => update({ legalName: e.target.value })}
          onFocus={() => !data.legalName && fullName && update({ legalName: fullName })}
        />
      </Field>

      <div className="grid-2">
        <Field label="I work as">
          <select value={data.businessType} onChange={(e) => update({ businessType: e.target.value })}>
            <option value="">Select…</option>
            <option>Individual / sole trader</option>
            <option>Limited company / LLC</option>
            <option>Partnership</option>
            <option>Other</option>
          </select>
        </Field>
        {data.businessType && data.businessType !== 'Individual / sole trader' && (
          <Field label="Registered business name">
            <input value={data.businessName} onChange={(e) => update({ businessName: e.target.value })} />
          </Field>
        )}
      </div>

      <Field label="Payment terms you usually agree to" optional hint="We'll flag contracts that pay slower">
        <select value={data.paymentTerms} onChange={(e) => update({ paymentTerms: e.target.value })}>
          <option value="">Not sure</option>
          <option>Upfront</option>
          <option>50% upfront, 50% on delivery</option>
          <option>On delivery</option>
          <option>Net 15</option>
          <option>Net 30</option>
          <option>Net 60</option>
        </select>
      </Field>

      <label className="check">
        <input type="checkbox" checked={data.hasManager} onChange={(e) => update({ hasManager: e.target.checked })} />
        <span>I have a manager or agent who handles some deals</span>
      </label>

      {data.hasManager && (
        <div className="grid-2">
          <Field label="Manager / agent name" optional>
            <input value={data.managerName} onChange={(e) => update({ managerName: e.target.value })} />
          </Field>
          <Field label="Manager / agent email" hint="They can forward contracts to your Dealbox address too">
            <input type="email" value={data.managerEmail} onChange={(e) => update({ managerEmail: e.target.value })} />
          </Field>
        </div>
      )}

      <StepNav onBack={back} onNext={next} nextDisabled={!valid} />
    </div>
  )
}
