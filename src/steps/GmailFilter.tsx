import { useState } from 'react'
import { Callout, CopyBox, StepNav, Walkthrough, type WalkthroughStep } from '../components/ui'
import { GMAIL_FILTER_QUERY } from '../lib/inbox'
import type { StepProps } from '../types'

export function GmailFilter({ data, update, next, back }: StepProps) {
  const [current, setCurrent] = useState(0)
  const done = data.filterCreated

  const steps: WalkthroughStep[] = [
    {
      title: 'Search Gmail for contract emails',
      body: (
        <>
          <p>Copy this search and paste it into Gmail's search bar, or open it in Gmail directly.</p>
          <CopyBox value={GMAIL_FILTER_QUERY} />
          <a
            className="btn btn-outline"
            href={`https://mail.google.com/mail/u/0/#search/${encodeURIComponent(GMAIL_FILTER_QUERY)}`}
            target="_blank"
            rel="noreferrer"
          >
            Open this search in Gmail ↗
          </a>
        </>
      ),
      nextLabel: 'Done',
    },
    {
      title: 'Turn the search into a filter',
      body: (
        <p>
          Click the <b>sliders icon</b> at the right-hand end of the search bar, then <b>Create filter</b> at the bottom of
          the box that opens.
        </p>
      ),
      nextLabel: 'Done',
    },
    {
      title: 'Forward matches to Dealbox',
      body: (
        <>
          <p>
            Tick <b>Forward it to</b>, choose your Dealbox address, then click <b>Create filter</b>.
          </p>
          <div className="mock-filter" aria-hidden>
            <div className="mock-filter-row highlight">
              <input type="checkbox" readOnly checked /> Forward it to:{' '}
              <span className="mock-select">{data.inboxAddress} ▾</span>
            </div>
            <span className="mock-btn">Create filter</span>
          </div>
          <p className="muted small">
            Address not in the dropdown? Go back and check you verified the code and clicked Save Changes.
          </p>
        </>
      ),
      nextLabel: "I've created the filter",
      onNext: () => update({ filterCreated: true }),
    },
  ]

  return (
    <div className="step">
      <p className="eyebrow">Contract inbox</p>
      <h2>Set up your contract filter</h2>
      <p className="lead">Three quick steps. Only emails with contract PDFs will reach Dealbox.</p>

      <Walkthrough
        steps={steps}
        current={current}
        setCurrent={setCurrent}
        done={done}
        doneContent={
          <div className="wt-done">
            <Callout tone="success">Filter created ✓</Callout>
            <Callout tone="warn">
              Filters aren't perfect. Some deals may slip through (e.g. a contract sent as a DocuSign link) and some
              unrelated PDFs may get forwarded, which we discard automatically. Gmail filters only apply to new emails, so
              forward or upload past contracts by hand.
            </Callout>
            <button
              type="button"
              className="link small"
              onClick={() => {
                update({ filterCreated: false })
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
