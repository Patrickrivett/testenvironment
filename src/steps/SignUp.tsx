import { useState } from 'react'
import { Field } from '../components/ui'
import type { OnboardingData } from '../types'

export function SignUp({
  data,
  update,
  onDone,
}: {
  data: OnboardingData
  update: (p: Partial<OnboardingData>) => void
  onDone: () => void
}) {
  const [agreed, setAgreed] = useState(false)
  const [tried, setTried] = useState(false)

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  const pwOk = data.password.length >= 8
  const valid = data.firstName.trim() && data.lastName.trim() && emailOk && pwOk && agreed

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (valid) onDone()
  }

  const googleMock = () => {
    update({
      firstName: data.firstName || 'Jane',
      lastName: data.lastName || 'Doe',
      email: data.email || 'jane.doe@gmail.com',
      password: data.password || 'mock-google-auth',
    })
    setAgreed(true)
    onDone()
  }

  return (
    <div className="auth-wrap">
      <div className="auth-side">
        <div className="brand">
          <span className="brand-mark">◆</span> Dealbox
        </div>
        <h1>
          Every brand deal, <em>in one place.</em>
        </h1>
        <p>
          Forward your contracts to your own private Dealbox address. We pull out the fees, deadlines, usage rights and
          exclusivity terms so nothing slips.
        </p>
        <ul className="auth-bullets">
          <li>Your own forwarding address, set up in about a minute</li>
          <li>Works with Gmail forwarding — we never log in to your inbox</li>
          <li>Upload or forward by hand any time</li>
        </ul>
      </div>

      <form className="auth-card" onSubmit={submit} noValidate>
        <h2>Create your creator account</h2>
        <p className="muted">Free while in beta. No credit card.</p>

        <button type="button" className="btn btn-outline btn-block" onClick={googleMock}>
          <span className="g-logo">G</span> Continue with Google
        </button>
        <div className="divider">
          <span>or</span>
        </div>

        <div className="grid-2">
          <Field label="First name" error={tried && !data.firstName.trim() && 'Required'}>
            <input value={data.firstName} onChange={(e) => update({ firstName: e.target.value })} autoComplete="given-name" />
          </Field>
          <Field label="Last name" error={tried && !data.lastName.trim() && 'Required'}>
            <input value={data.lastName} onChange={(e) => update({ lastName: e.target.value })} autoComplete="family-name" />
          </Field>
        </div>
        <Field label="Email" error={tried && !emailOk && 'Enter a valid email'}>
          <input
            type="email"
            value={data.email}
            onChange={(e) => update({ email: e.target.value })}
            autoComplete="email"
            placeholder="you@gmail.com"
          />
        </Field>
        <Field label="Password" hint="At least 8 characters" error={tried && !pwOk && 'At least 8 characters'}>
          <input
            type="password"
            value={data.password}
            onChange={(e) => update({ password: e.target.value })}
            autoComplete="new-password"
          />
        </Field>

        <label className="check">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>, and confirm I'm 18 or
            older.
          </span>
        </label>
        {tried && !agreed && <span className="field-error">Please accept to continue</span>}

        <button type="submit" className="btn btn-primary btn-block">
          Create account
        </button>
        <p className="muted small center">
          Already have an account? <a href="#">Log in</a>
        </p>
      </form>
    </div>
  )
}
