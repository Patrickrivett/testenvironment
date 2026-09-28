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
      title: 'Choose what gets forwarded',
      body: (
        <>
          <p>How much of your email should Dealbox see? You can change this later.</p>
          <div className="choice-grid">
            <ChoiceCard
              selected={data.forwardMode === 'all'}
              onSelect={() => update({ forwardMode: 'all' })}
              tag="Easiest"
              title="Forward everything"
              desc="Gmail sends us all your email and we pick out the brand deals."
              points={[
                'One more click, then you\'re done',
                'Catches deals sent as DocuSign links or in the email body',
                'Anything that isn\'t a deal is deleted straight away, never stored',
              ]}
            />
            <ChoiceCard
              selected={data.forwardMode === 'filter'}
              onSelect={() => update({ forwardMode: 'filter' })}
              tag="Most private"
              title="Only contract emails"
              desc="You add a Gmail filter so only emails with contract PDFs reach us."
              points={[
                'About 1 extra minute to set up',
                'Everything else never leaves your inbox',
                'May miss deals that don\'t come with a PDF attached',
              ]}
            />
          </div>
        </>
      ),
      nextLabel: 'Continue',
      nextDisabled: !data.forwardMode,
    },
    data.forwardMode === 'all'
      ? {
          title: 'Turn on forwarding and save',
          body: (
            <>
              <p>
                Select <b>Forward a copy of incoming mail to</b>, pick your Dealbox address, and choose{' '}
                <b>keep Gmail's copy in the Inbox</b>. Then scroll down and click <b>Save Changes</b>.
              </p>
              <div className="mock-gmail" aria-hidden>
                <div className="mock-gmail-body mock-radios">
                  <div className="mock-radio">
                    <span className="radio" /> Disable forwarding
                  </div>
                  <div className="mock-radio on">
                    <span className="radio" /> Forward a copy of incoming mail to{' '}
                    <span className="mock-select">{data.inboxAddress} ▾</span> and{' '}
                    <span className="mock-select">keep Gmail's copy in the Inbox ▾</span>
                  </div>
                </div>
              </div>
              <p className="muted small">
                Gmail will show a "You are forwarding your email" reminder for about a week. That's normal.
              </p>
            </>
          ),
          nextLabel: 'Saved',
          onNext: () => update({ forwardingConfirmed: true }),
        }
      : {
          title: 'Leave forwarding off and save',
          body: (
            <>
              <p>
                Keep <b>"Disable forwarding"</b> selected. The filter you'll set up next decides which emails go to
                Dealbox.
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
      <p className="eyebrow">Contract inbox</p>
      <h2>Connect your Gmail</h2>
      <p className="lead">Keep this tab open and follow along in Gmail.</p>

      <Walkthrough
        steps={steps}
        current={current}
        setCurrent={setCurrent}
        done={done}
        doneContent={
          <div className="wt-done">
            <Callout tone="success">
              {data.forwardMode === 'all'
                ? 'Forwarding is on ✓ We\'ll pick out your brand deals from now on.'
                : 'Forwarding address verified ✓ Next, a quick filter.'}
            </Callout>
            <button
              type="button"
              className="link small"
              onClick={() => {
                update({ forwardingConfirmed: false, forwardMode: '', filterCreated: false })
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

function ChoiceCard({
  selected,
  onSelect,
  tag,
  title,
  desc,
  points,
}: {
  selected: boolean
  onSelect: () => void
  tag: string
  title: string
  desc: string
  points: string[]
}) {
  return (
    <button type="button" className={`choice-card ${selected ? 'selected' : ''}`} onClick={onSelect} aria-pressed={selected}>
      <span className="choice-top">
        <span className="choice-tag">{tag}</span>
        <span className="choice-radio" aria-hidden />
      </span>
      <strong className="choice-title">{title}</strong>
      <span className="choice-desc">{desc}</span>
      <ul>
        {points.map((pt) => (
          <li key={pt}>{pt}</li>
        ))}
      </ul>
    </button>
  )
}
