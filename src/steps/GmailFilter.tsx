import { useState } from 'react'
import { Callout, CopyBox, StepNav, Walkthrough, type WalkthroughStep } from '../components/ui'
import { GMAIL_FILTER_QUERY } from '../lib/inbox'
import type { StepProps } from '../types'

export function GmailFilter({ data, update, next, back }: StepProps) {
  const [current, setCurrent] = useState(0)
  const done = data.filterCreated

  const steps: WalkthroughStep[] = [
    {
      title: 'Copy this search',
      body: (
        <>
          <p>It finds emails with PDF attachments that look like contracts.</p>
          <CopyBox value={GMAIL_FILTER_QUERY} />
        </>
      ),
      nextLabel: 'Copied',
    },
    {
      title: 'Paste it into Gmail and open search options',
      body: (
        <>
          <p>
            Paste the search into Gmail's search bar at the top. Then click the <b>sliders icon</b> (Show search options)
            at the right-hand end of the search bar.
          </p>
          <a
            className="btn btn-outline"
            href={`https://mail.google.com/mail/u/0/#search/${encodeURIComponent(GMAIL_FILTER_QUERY)}`}
            target="_blank"
            rel="noreferrer"
          >
            Or open this search in Gmail ↗
          </a>
        </>
      ),
      nextLabel: 'Search options are open',
    },
    {
      title: 'Click "Create filter"',
      body: <p>It's at the bottom of the search options box, next to the Search button.</p>,
      nextLabel: 'Done',
    },
    {
      title: 'Forward matching emails to Dealbox',
      body: (
        <>
          <p>
            Tick <b>Forward it to</b> and choose your Dealbox address from the dropdown. Optionally, tick{' '}
            <b>Apply the label</b> and create a "Dealbox" label so you can see what was sent.
          </p>
          <div className="mock-filter" aria-hidden>
            <div className="mock-filter-row">
              <input type="checkbox" readOnly checked /> Apply the label: <span className="mock-select">Dealbox ▾</span>
            </div>
            <div className="mock-filter-row highlight">
              <input type="checkbox" readOnly checked /> Forward it to:{' '}
              <span className="mock-select">{data.inboxAddress} ▾</span>
            </div>
          </div>
          <p className="muted small">
            Address not in the dropdown? Go back to the previous page and make sure you verified the code and clicked Save
            Changes.
          </p>
        </>
      ),
      nextLabel: 'Ticked',
    },
    {
      title: 'Save the filter',
      body: (
        <p>
          Click the blue <b>Create filter</b> button. From now on, new emails with contract PDFs will be forwarded to
          Dealbox automatically.
        </p>
      ),
      nextLabel: "I've created the filter",
      onNext: () => update({ filterCreated: true }),
    },
  ]

  return (
    <div className="step">
      <p className="eyebrow">Contract inbox · Step 3 of 4</p>
      <h2>Create a filter to forward contracts</h2>
      <p className="lead">Only emails with contract-looking PDFs get sent to Dealbox. Everything else stays private.</p>

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
