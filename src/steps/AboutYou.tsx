import { useState } from 'react'
import { Field, StepNav } from '../components/ui'
import { ageFromDob } from '../lib/inbox'
import type { StepProps } from '../types'

const COUNTRIES = [
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Ireland',
  'New Zealand',
  'Germany',
  'France',
  'Spain',
  'Netherlands',
  'Other',
]

export function AboutYou({ data, update, next, back }: StepProps) {
  const [tried, setTried] = useState(false)
  const age = ageFromDob(data.dateOfBirth)
  const ageError = !data.dateOfBirth ? 'Required' : age !== null && age < 18 ? 'You must be 18 or older' : ''
  const valid = data.displayName.trim() && !ageError && data.country

  return (
    <div className="step">
      <p className="eyebrow">Your profile · Step 1 of 4</p>
      <h2>About you</h2>
      <p className="lead">This appears on your profile and helps us fill in contract details correctly.</p>

      <div className="grid-2">
        <Field label="First name">
          <input value={data.firstName} onChange={(e) => update({ firstName: e.target.value })} />
        </Field>
        <Field label="Last name">
          <input value={data.lastName} onChange={(e) => update({ lastName: e.target.value })} />
        </Field>
      </div>

      <div className="grid-2">
        <Field label="Creator / display name" hint="How brands know you" error={tried && !data.displayName.trim() && 'Required'}>
          <input
            value={data.displayName}
            placeholder="e.g. Jane Makes Things"
            onChange={(e) => update({ displayName: e.target.value })}
          />
        </Field>
        <Field label="Pronouns" optional>
          <select value={data.pronouns} onChange={(e) => update({ pronouns: e.target.value })}>
            <option value="">Prefer not to say</option>
            <option>she/her</option>
            <option>he/him</option>
            <option>they/them</option>
            <option>Other</option>
          </select>
        </Field>
      </div>

      <div className="grid-2">
        <Field
          label="Date of birth"
          hint={age !== null && age >= 18 ? `Age ${age}` : 'You must be 18+ to use Dealbox'}
          error={tried && ageError}
        >
          <input type="date" value={data.dateOfBirth} onChange={(e) => update({ dateOfBirth: e.target.value })} />
        </Field>
        <Field label="Phone" optional hint="For deal deadline reminders by SMS">
          <input type="tel" value={data.phone} placeholder="+44 7700 900000" onChange={(e) => update({ phone: e.target.value })} />
        </Field>
      </div>

      <div className="grid-2">
        <Field label="Country" hint="Affects tax and contract law guidance" error={tried && !data.country && 'Required'}>
          <select value={data.country} onChange={(e) => update({ country: e.target.value })}>
            <option value="">Select…</option>
            {COUNTRIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="City" optional>
          <input value={data.city} onChange={(e) => update({ city: e.target.value })} />
        </Field>
      </div>

      <StepNav
        onBack={back}
        onNext={() => {
          setTried(true)
          if (valid) next()
        }}
      />
    </div>
  )
}
