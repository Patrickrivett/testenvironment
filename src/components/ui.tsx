import { useState, type ReactNode } from 'react'

export function Field({
  label,
  hint,
  error,
  children,
  optional,
}: {
  label: string
  hint?: string
  error?: string | false
  optional?: boolean
  children: ReactNode
}) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {optional && <span className="optional"> (optional)</span>}
      </span>
      {children}
      {error ? <span className="field-error">{error}</span> : hint && <span className="field-hint">{hint}</span>}
    </label>
  )
}

export function ChipSelect({
  options,
  value,
  onChange,
  max,
}: {
  options: string[]
  value: string[]
  onChange: (v: string[]) => void
  max?: number
}) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt))
    else if (!max || value.length < max) onChange([...value, opt])
  }
  return (
    <div className="chips">
      {options.map((opt) => (
        <button
          type="button"
          key={opt}
          className={`chip ${value.includes(opt) ? 'chip-on' : ''}`}
          onClick={() => toggle(opt)}
          aria-pressed={value.includes(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export function CopyBox({ value, mono = true, large }: { value: string; mono?: boolean; large?: boolean }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      /* clipboard may be blocked in some contexts; the mock still shows feedback */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className={`copybox ${large ? 'copybox-large' : ''}`}>
      <code className={mono ? 'mono' : ''}>{value}</code>
      <button type="button" className="btn btn-small" onClick={copy}>
        {copied ? 'Copied ✓' : 'Copy'}
      </button>
    </div>
  )
}

export function StepNav({
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextDisabled,
  extra,
}: {
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
  nextDisabled?: boolean
  extra?: ReactNode
}) {
  return (
    <div className="step-nav">
      {onBack ? (
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          ← Back
        </button>
      ) : (
        <span />
      )}
      <div className="step-nav-right">
        {extra}
        <button type="button" className="btn btn-primary" onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
        </button>
      </div>
    </div>
  )
}

export function Callout({ tone = 'info', children }: { tone?: 'info' | 'warn' | 'success'; children: ReactNode }) {
  return <div className={`callout callout-${tone}`}>{children}</div>
}

export function Spinner() {
  return <span className="spinner" aria-hidden />
}

export type WalkthroughStep = {
  title: string
  body: ReactNode
  nextLabel?: string
  nextDisabled?: boolean
  /** Runs instead of simply advancing, e.g. to kick off a mocked wait. */
  onNext?: () => void
}

/** Shows one instruction at a time; finished ones collapse into a checklist above. */
export function Walkthrough({
  steps,
  current,
  setCurrent,
  done,
  doneContent,
}: {
  steps: WalkthroughStep[]
  current: number
  setCurrent: (i: number) => void
  done: boolean
  doneContent?: ReactNode
}) {
  const active = done ? steps.length : current
  const step = steps[active]

  return (
    <div className="walkthrough">
      <div className="wt-progress" aria-hidden>
        {steps.map((s, i) => (
          <span key={s.title} className={i < active ? 'done' : i === active ? 'current' : ''} />
        ))}
      </div>

      {steps.slice(0, active).map((s, i) => (
        <button type="button" key={s.title} className="wt-done-row" onClick={() => setCurrent(i)} disabled={done}>
          <span className="wt-check">✓</span>
          <span>{s.title}</span>
          {!done && <span className="wt-edit">View</span>}
        </button>
      ))}

      {step && (
        <div className="wt-card" key={active}>
          <p className="wt-count">
            Step {active + 1} of {steps.length}
          </p>
          <h3 className="wt-title">{step.title}</h3>
          <div className="wt-body">{step.body}</div>
          <div className="wt-actions">
            {active > 0 ? (
              <button type="button" className="btn btn-ghost" onClick={() => setCurrent(active - 1)}>
                ← Previous
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              className="btn btn-primary"
              disabled={step.nextDisabled}
              onClick={() => (step.onNext ? step.onNext() : setCurrent(active + 1))}
            >
              {step.nextLabel ?? 'Done, next step'}
            </button>
          </div>
        </div>
      )}

      {done && doneContent}
    </div>
  )
}
