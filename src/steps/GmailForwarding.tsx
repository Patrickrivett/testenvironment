import { useEffect, useState } from 'react'
import { Callout, CopyBox, Spinner, StepNav } from '../components/ui'
import { fakeGmailConfirmationCode } from '../lib/inbox'
import type { StepProps } from '../types'

type Phase = 'instructions' | 'waiting' | 'code' | 'verified'

export function GmailForwarding({ data, update, next, back }: StepProps) {
  const [phase, setPhase] = useState<Phase>(data.forwardingConfirmed ? 'verified' : 'instructions')
  const [code, setCode] = useState('')

  // Mock: pretend our inbound webhook receives Gmail's confirmation email a few seconds later.
  useEffect(() => {
    if (phase !== 'waiting') return
    const t = setTimeout(() => {
      setCode(fakeGmailConfirmationCode())
      setPhase('code')
    }, 3500)
    return () => clearTimeout(t)
  }, [phase])

  return (
    <div className="step">
      <p className="eyebrow">Contract inbox · Step 2 of 4</p>
      <h2>Add your Dealbox address to Gmail</h2>
      <p className="lead">Open Gmail on a computer (the mobile app doesn't have these settings). Keep this tab open.</p>

      <a className="btn btn-outline" href="https://mail.google.com/mail/u/0/#settings/fwdandpop" target="_blank" rel="noreferrer">
        Open Gmail forwarding settings ↗
      </a>

      <ol className="steps-list">
        <li>
          <strong>Go to Settings.</strong> Click the ⚙️ gear icon (top right) → <b>See all settings</b>.
        </li>
        <li>
          <strong>Open the forwarding tab.</strong> Click <b>Forwarding and POP/IMAP</b>.
        </li>
        <li>
          <strong>Add the address.</strong> Click <b>Add a forwarding address</b> and paste:
          <CopyBox value={data.inboxAddress} />
        </li>
        <li>
          <strong>Confirm.</strong> Click <b>Next → Proceed → OK</b>. Gmail will email a confirmation code to Dealbox — we'll
          show it below.
        </li>
      </ol>

      <div className="mock-gmail" aria-hidden>
        <div className="mock-gmail-bar">Settings</div>
        <div className="mock-gmail-tabs">
          <span>General</span>
          <span>Labels</span>
          <span>Inbox</span>
          <span>Accounts</span>
          <span>Filters and Blocked Addresses</span>
          <span className="active">Forwarding and POP/IMAP</span>
        </div>
        <div className="mock-gmail-body">
          <span className="mock-label">Forwarding:</span>
          <span className="mock-btn">Add a forwarding address</span>
        </div>
      </div>

      <div className="code-panel">
        {phase === 'instructions' && (
          <>
            <p>
              <strong>Done steps 1–4?</strong> We'll start listening for Gmail's confirmation email.
            </p>
            <button type="button" className="btn btn-primary" onClick={() => setPhase('waiting')}>
              I've added the address
            </button>
          </>
        )}

        {phase === 'waiting' && (
          <div className="waiting">
            <Spinner />
            <div>
              <strong>Waiting for Gmail's confirmation email…</strong>
              <p className="muted small">This usually takes a few seconds.</p>
            </div>
          </div>
        )}

        {phase === 'code' && (
          <>
            <Callout tone="success">We caught Gmail's confirmation email. Here's your code:</Callout>
            <div className="big-code">{code}</div>
            <ol className="steps-list compact">
              <li>
                Back in Gmail, paste the code into the <b>confirmation code</b> box and click <b>Verify</b>.
              </li>
              <li>
                Leave <b>"Disable forwarding"</b> selected. You don't want to forward <em>everything</em> — the filter in the
                next step handles which emails go to Dealbox.
              </li>
              <li>
                Scroll down and click <b>Save Changes</b>.
              </li>
            </ol>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                update({ forwardingConfirmed: true })
                setPhase('verified')
              }}
            >
              I've verified the code
            </button>
          </>
        )}

        {phase === 'verified' && <Callout tone="success">Forwarding address verified ✓</Callout>}
      </div>

      <details className="faq">
        <summary>Gmail says forwarding is disabled by my administrator</summary>
        <p>
          Some work or school (Google Workspace) accounts don't allow auto-forwarding. Ask your admin to enable it, or skip
          this and forward contracts by hand to your Dealbox address — or upload PDFs directly from your dashboard.
        </p>
      </details>
      <details className="faq">
        <summary>I didn't get a code</summary>
        <p>
          Double-check you pasted the address exactly, then in Gmail click <b>Resend email</b> next to the pending
          address. Codes usually arrive within a minute.
        </p>
        {phase === 'waiting' && (
          <button type="button" className="btn btn-small" onClick={() => setPhase('instructions')}>
            Start over
          </button>
        )}
      </details>

      <StepNav
        onBack={back}
        onNext={next}
        nextDisabled={phase !== 'verified'}
        extra={
          phase !== 'verified' && (
            <button type="button" className="btn btn-ghost" onClick={next}>
              Skip for now
            </button>
          )
        }
      />
    </div>
  )
}
