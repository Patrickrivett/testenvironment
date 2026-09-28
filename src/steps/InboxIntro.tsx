import { Callout, CopyBox, StepNav } from '../components/ui'
import type { StepProps } from '../types'

export function InboxIntro({ data, update, next, back }: StepProps) {
  const consented = data.consentProcessing && data.consentAi && data.consentRetention

  return (
    <div className="step">
      <p className="eyebrow">Contract inbox · Step 1 of 4</p>
      <h2>Here's your private Dealbox address</h2>
      <p className="lead">
        Anything sent to this address lands in your Dealbox. You'll set Gmail to forward brand contracts here
        automatically — you never have to give us your Gmail password or inbox access.
      </p>

      <CopyBox value={data.inboxAddress} large />
      <p className="muted small">This address is unique to you. Don't share it publicly.</p>

      <div className="how-it-works">
        <div className="hiw-item">
          <span className="hiw-num">1</span>
          <div>
            <strong>Add it in Gmail</strong>
            <p>Add this address as a forwarding address. We'll catch Gmail's confirmation code and show it to you.</p>
          </div>
        </div>
        <div className="hiw-item">
          <span className="hiw-num">2</span>
          <div>
            <strong>Create a filter</strong>
            <p>Paste our ready-made search so only emails with contract PDFs get forwarded.</p>
          </div>
        </div>
        <div className="hiw-item">
          <span className="hiw-num">3</span>
          <div>
            <strong>Send a test</strong>
            <p>We'll confirm it's working. Then every new deal shows up in your dashboard.</p>
          </div>
        </div>
      </div>

      <h3>Before we start</h3>
      <div className="consents">
        <label className="check">
          <input
            type="checkbox"
            checked={data.consentProcessing}
            onChange={(e) => update({ consentProcessing: e.target.checked })}
          />
          <span>I'm happy for Dealbox to receive and store the emails and attachments I forward to this address.</span>
        </label>
        <label className="check">
          <input type="checkbox" checked={data.consentAi} onChange={(e) => update({ consentAi: e.target.checked })} />
          <span>
            I understand contracts are analysed by an AI provider under a data processing agreement, and are never used
            to train models. <a href="#">Learn more</a>
          </span>
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={data.consentRetention}
            onChange={(e) => update({ consentRetention: e.target.checked })}
          />
          <span>
            I understand non-contract emails that get forwarded by mistake are discarded automatically and not kept.
          </span>
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={data.consentConfidentiality}
            onChange={(e) => update({ consentConfidentiality: e.target.checked })}
          />
          <span>
            <em>(Optional)</em> Remind me to check a contract's confidentiality clause before I share it.
          </span>
        </label>
      </div>

      <Callout>
        Not on Gmail, or your work account blocks forwarding? You can still forward emails by hand or upload PDFs from
        your dashboard.
      </Callout>

      <StepNav onBack={back} onNext={next} nextDisabled={!consented} nextLabel="Set up Gmail forwarding" />
    </div>
  )
}
