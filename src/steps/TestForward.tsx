import { useEffect, useState } from 'react'
import { Callout, CopyBox, Spinner, StepNav } from '../components/ui'
import type { StepProps } from '../types'

export function TestForward({ data, update, next, back }: StepProps) {
  const [waiting, setWaiting] = useState(false)

  // Mock: pretend the test email arrives at the inbound webhook.
  useEffect(() => {
    if (!waiting) return
    const t = setTimeout(() => {
      update({ testReceived: true })
      setWaiting(false)
    }, 4000)
    return () => clearTimeout(t)
  }, [waiting, update])

  return (
    <div className="step">
      <p className="eyebrow">Contract inbox</p>
      <h2>Send yourself a test</h2>
      <p className="lead">Let's make sure contracts actually reach Dealbox.</p>

      <ol className="steps-list">
        <li>
          From <b>any other email account</b> (or ask a friend), send an email to <b>{data.email || 'your Gmail'}</b>.
        </li>
        <li>
          Use the subject <code className="inline">Test contract</code> and attach any PDF with <b>"agreement"</b> or{' '}
          <b>"contract"</b> in the file name.
        </li>
        <li>Gmail's filter should forward it to Dealbox within a minute or two.</li>
      </ol>

      <div className="code-panel">
        {data.testReceived ? (
          <div className="test-result">
            <Callout tone="success">It works! We received your test email.</Callout>
            <div className="received-card">
              <div className="received-icon">PDF</div>
              <div>
                <strong>Test contract</strong>
                <p className="muted small">test-agreement.pdf · forwarded from {data.email || 'your Gmail'} · just now</p>
              </div>
              <span className="pill">Detected as contract</span>
            </div>
          </div>
        ) : waiting ? (
          <div className="waiting">
            <Spinner />
            <div>
              <strong>Listening for your test email at {data.inboxAddress}…</strong>
              <p className="muted small">Leave this page open. It can take up to 2 minutes.</p>
            </div>
          </div>
        ) : (
          <>
            <p>
              <strong>Ready?</strong> Click below, then send the test email.
            </p>
            <button type="button" className="btn btn-primary" onClick={() => setWaiting(true)}>
              Start listening
            </button>
          </>
        )}
      </div>

      <h3>Other ways to add deals</h3>
      <div className="fallbacks">
        <div className="fallback">
          <strong>Forward by hand</strong>
          <p className="muted small">Forward any email to your address, from any account:</p>
          <CopyBox value={data.inboxAddress} />
        </div>
        <div className="fallback">
          <strong>Upload a PDF</strong>
          <p className="muted small">Drag and drop contracts from your dashboard any time.</p>
          <div className="dropzone">Drop PDFs here after setup</div>
        </div>
      </div>

      <StepNav
        onBack={back}
        onNext={next}
        nextLabel={data.testReceived ? 'Continue to profile' : 'Continue'}
        nextDisabled={!data.testReceived}
        extra={
          !data.testReceived && (
            <button type="button" className="btn btn-ghost" onClick={next}>
              I'll test later
            </button>
          )
        }
      />
    </div>
  )
}
