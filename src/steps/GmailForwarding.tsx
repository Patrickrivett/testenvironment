import { useEffect, useState } from 'react'
import { Callout, CopyBox, Spinner, StepNav, Walkthrough, type WalkthroughStep } from '../components/ui'
import { fakeGmailConfirmationCode } from '../lib/inbox'
import type { StepProps } from '../types'

const CODE_STEP = 3

export function GmailForwarding({ data, update, next, back }: StepProps) {
  const [current, setCurrent] = useState(0)
  const [code, setCode] = useState('')
  const done = data.forwardingConfirmed

  // Mock: pretend our inbound webhook receives Gmail's confirmation email a few seconds later.
  useEffect(() => {
    if (current !== CODE_STEP || code) return
    const t = setTimeout(() => setCode(fakeGmailConfirmationCode()), 3500)
    return () => clearTimeout(t)
  }, [current, code])

  const steps: WalkthroughStep[] = [
    {
      title: 'Open your Gmail settings',
      body: (
        <>
          <p>
            On a computer, open Gmail and click the ⚙️ <b>gear icon</b> (top right), then <b>See all settings</b>. The
            Gmail mobile app doesn't have these settings.
          </p>
          <a className="btn btn-outline" href="https://mail.google.com/mail/u/0/#settings/general" target="_blank" rel="noreferrer">
            Open Gmail settings ↗
          </a>
        </>
      ),
      nextLabel: "I'm in settings",
    },
    {
      title: 'Go to the "Forwarding and POP/IMAP" tab',
      body: (
        <>
          <p>It's in the row of tabs along the top of the settings page.</p>
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
          </div>
        </>
      ),
      nextLabel: "I'm on that tab",
    },
    {
      title: 'Add your Dealbox address',
      body: (
        <>
          <p>
            Click <b>Add a forwarding address</b> and paste your address:
          </p>
          <CopyBox value={data.inboxAddress} />
          <p>
            Then click <b>Next → Proceed → OK</b>. Gmail will email a confirmation code to Dealbox, and we'll show it to
            you on the next step.
          </p>
          <details className="faq">
            <summary>Gmail says forwarding is disabled by my administrator</summary>
            <p>
              Some work or school (Google Workspace) accounts don't allow auto-forwarding. Ask your admin to enable it, or
              skip this and forward contracts by hand or upload PDFs from your dashboard.
            </p>
          </details>
        </>
      ),
      nextLabel: "I've added it",
    },
    {
      title: 'Enter the confirmation code',
      body: code ? (
        <>
          <Callout tone="success">We caught Gmail's confirmation email. Here's your code:</Callout>
          <div className="big-code">{code}</div>
          <p>
            Back in Gmail, paste it into the <b>confirmation code</b> box and click <b>Verify</b>.
          </p>
        </>
      ) : (
        <>
          <div className="waiting">
            <Spinner />
            <div>
              <strong>Waiting for Gmail's confirmation email…</strong>
              <p className="muted small">This usually takes a few seconds.</p>
            </div>
          </div>
          <details className="faq">
            <summary>No code after a minute?</summary>
            <p>
              Check the address was pasted exactly, then in Gmail click <b>Resend email</b> next to the pending address.
            </p>
          </details>
        </>
      ),
      nextLabel: "I've verified it",
      nextDisabled: !code,
    },
    {
      title: 'Leave forwarding off and save',
      body: (
        <>
          <p>
            Keep <b>"Disable forwarding"</b> selected. You don't want to forward <em>everything</em>. The filter in the next
            step decides which emails go to Dealbox.
          </p>
          <p>
            Scroll to the bottom and click <b>Save Changes</b>.
          </p>
        </>
      ),
      nextLabel: 'Saved',
      onNext: () => update({ forwardingConfirmed: true }),
    },
  ]

  return (
    <div className="step">
      <p className="eyebrow">Contract inbox · Step 2 of 4</p>
      <h2>Add your Dealbox address to Gmail</h2>
      <p className="lead">Keep this tab open and follow along in Gmail. Five quick steps.</p>

      <Walkthrough
        steps={steps}
        current={current}
        setCurrent={setCurrent}
        done={done}
        doneContent={
          <div className="wt-done">
            <Callout tone="success">Forwarding address verified ✓</Callout>
            <button
              type="button"
              className="link small"
              onClick={() => {
                update({ forwardingConfirmed: false })
                setCode('')
                setCurrent(0)
              }}
            >
              Go through these steps again
            </button>
          </div>
        }
      />

      <StepNav
        onBack={back}
        onNext={next}
        nextDisabled={!done}
        extra={
          !done && (
            <button type="button" className="btn btn-ghost" onClick={next}>
              Skip for now
            </button>
          )
        }
      />
    </div>
  )
}
