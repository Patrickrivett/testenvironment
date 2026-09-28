import { Callout, CopyBox, StepNav } from '../components/ui'
import { GMAIL_FILTER_QUERY } from '../lib/inbox'
import type { StepProps } from '../types'

export function GmailFilter({ data, update, next, back }: StepProps) {
  return (
    <div className="step">
      <p className="eyebrow">Contract inbox · Step 3 of 4</p>
      <h2>Create a filter to forward contracts</h2>
      <p className="lead">
        This tells Gmail to send only emails with contract-looking PDFs to Dealbox. Everything else stays private.
      </p>

      <a
        className="btn btn-outline"
        href={`https://mail.google.com/mail/u/0/#search/${encodeURIComponent(GMAIL_FILTER_QUERY)}`}
        target="_blank"
        rel="noreferrer"
      >
        Open this search in Gmail ↗
      </a>

      <ol className="steps-list">
        <li>
          <strong>Copy this search.</strong>
          <CopyBox value={GMAIL_FILTER_QUERY} />
        </li>
        <li>
          <strong>Paste it into Gmail's search bar</strong> at the top, then click the <b>sliders icon</b> (Show search
          options) on the right of the search bar.
        </li>
        <li>
          <strong>Click "Create filter"</strong> at the bottom of the search options box.
        </li>
        <li>
          <strong>Tick "Forward it to"</strong> and choose <code className="inline">{data.inboxAddress}</code> from the
          dropdown.
          <span className="muted small block">
            Don't see it? Make sure you verified the code and clicked Save Changes in the previous step.
          </span>
        </li>
        <li>
          <strong>Optional:</strong> also tick <b>Apply the label</b> → <em>New label…</em> "Dealbox" so you can see what
          was sent.
        </li>
        <li>
          <strong>Click "Create filter".</strong>
        </li>
      </ol>

      <div className="mock-filter" aria-hidden>
        <div className="mock-filter-row">
          <input type="checkbox" readOnly /> Skip the Inbox (Archive it)
        </div>
        <div className="mock-filter-row">
          <input type="checkbox" readOnly checked /> Apply the label: <span className="mock-select">Dealbox ▾</span>
        </div>
        <div className="mock-filter-row highlight">
          <input type="checkbox" readOnly checked /> Forward it to:{' '}
          <span className="mock-select">{data.inboxAddress} ▾</span>
        </div>
        <div className="mock-filter-row">
          <input type="checkbox" readOnly /> Also apply filter to matching conversations
        </div>
        <span className="mock-btn">Create filter</span>
      </div>

      <Callout tone="warn">
        Filters aren't perfect. Some deals may slip through (e.g. a contract sent as a DocuSign link) and some unrelated
        PDFs may get forwarded — we discard non-contracts automatically. You can always forward an email by hand.
      </Callout>

      <details className="faq">
        <summary>Should I tick "Also apply filter to matching conversations"?</summary>
        <p>
          Gmail filters only forward <em>new</em> emails, even with that box ticked. To add past contracts, forward them by
          hand or upload the PDFs from your dashboard after setup.
        </p>
      </details>

      <label className="check">
        <input type="checkbox" checked={data.filterCreated} onChange={(e) => update({ filterCreated: e.target.checked })} />
        <span>I've created the filter</span>
      </label>

      <StepNav
        onBack={back}
        onNext={next}
        nextDisabled={!data.filterCreated}
        extra={
          !data.filterCreated && (
            <button type="button" className="btn btn-ghost" onClick={next}>
              Skip for now
            </button>
          )
        }
      />
    </div>
  )
}
