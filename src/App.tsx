import { useCallback, useEffect, useState } from 'react'
import { initialData, type OnboardingData, type StepProps } from './types'
import { generateInboxAddress } from './lib/inbox'
import { SignUp } from './steps/SignUp'
import { InboxIntro } from './steps/InboxIntro'
import { GmailForwarding } from './steps/GmailForwarding'
import { GmailFilter } from './steps/GmailFilter'
import { TestForward } from './steps/TestForward'
import { AboutYou } from './steps/AboutYou'
import { Socials } from './steps/Socials'
import { CreatorProfile } from './steps/CreatorProfile'
import { Business } from './steps/Business'
import { Review } from './steps/Review'

type Screen = 'signup' | 'onboarding' | 'dashboard'

type Saved = { screen: Screen; step: number; data: OnboardingData }

const STORAGE_KEY = 'dealbox-onboarding-mock'

const STEPS: { group: string; label: string }[] = [
  { group: 'Contract inbox', label: 'Your address' },
  { group: 'Contract inbox', label: 'Gmail forwarding' },
  { group: 'Contract inbox', label: 'Create filter' },
  { group: 'Contract inbox', label: 'Send a test' },
  { group: 'Your profile', label: 'About you' },
  { group: 'Your profile', label: 'Social accounts' },
  { group: 'Your profile', label: 'Your content' },
  { group: 'Your profile', label: 'Business details' },
  { group: 'Finish', label: 'Review' },
]

function load(): Saved {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw) as Saved
      return { ...saved, data: { ...initialData, ...saved.data } }
    }
  } catch {
    /* ignore corrupt or blocked storage */
  }
  return { screen: 'signup', step: 0, data: initialData }
}

export default function App() {
  const [state, setState] = useState<Saved>(load)
  const { screen, step, data } = state

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable: mock still works for the session */
    }
  }, [state])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [screen, step])

  const update = useCallback(
    (patch: Partial<OnboardingData>) => setState((s) => ({ ...s, data: { ...s.data, ...patch } })),
    [],
  )
  const goTo = (i: number) => setState((s) => ({ ...s, step: i }))
  const reset = () => setState({ screen: 'signup', step: 0, data: initialData })

  if (screen === 'signup') {
    return (
      <SignUp
        data={data}
        update={update}
        onDone={() =>
          setState((s) => ({
            screen: 'onboarding',
            step: 0,
            data: {
              ...s.data,
              inboxAddress: s.data.inboxAddress || generateInboxAddress(s.data.firstName, s.data.lastName),
              displayName: s.data.displayName || `${s.data.firstName} ${s.data.lastName}`.trim(),
            },
          }))
        }
      />
    )
  }

  if (screen === 'dashboard') {
    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
        <button type="button" className="link small" onClick={reset}>
          Reset demo
        </button>
      </div>
    )
  }

  const props: StepProps = {
    data,
    update,
    next: () =>
      setState((s) =>
        s.step >= STEPS.length - 1 ? { ...s, screen: 'dashboard' } : { ...s, step: s.step + 1 },
      ),
    back: () => setState((s) => (s.step === 0 ? { ...s, screen: 'signup' } : { ...s, step: s.step - 1 })),
  }

  const stepEls = [
    <InboxIntro {...props} />,
    <GmailForwarding {...props} />,
    <GmailFilter {...props} />,
    <TestForward {...props} />,
    <AboutYou {...props} />,
    <Socials {...props} />,
    <CreatorProfile {...props} />,
    <Business {...props} />,
    <Review {...props} goTo={goTo} />,
  ]

  const groups = [...new Set(STEPS.map((s) => s.group))]
  const progress = Math.round((step / (STEPS.length - 1)) * 100)

  return (
    <div className="onboarding">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">◆</span> Dealbox
        </div>
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <nav>
          {groups.map((g) => (
            <div key={g} className="nav-group">
              <p className="nav-group-title">{g}</p>
              {STEPS.map((s, i) =>
                s.group !== g ? null : (
                  <button
                    type="button"
                    key={s.label}
                    className={`nav-item ${i === step ? 'current' : ''} ${i < step ? 'done' : ''}`}
                    onClick={() => i < step && goTo(i)}
                    disabled={i > step}
                  >
                    <span className="nav-dot">{i < step ? '✓' : i + 1}</span>
                    {s.label}
                  </button>
                ),
              )}
            </div>
          ))}
        </nav>
        <div className="sidebar-foot">
          <span className="muted small">Signed in as {data.email}</span>
          <button type="button" className="link small" onClick={reset}>
            Reset demo
          </button>
        </div>
      </aside>

      <main className="main">
        <div className="mobile-progress">
          <span>
            {STEPS[step].group} · {STEPS[step].label}
          </span>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div key={step} className="step-container">
          {stepEls[step]}
        </div>
      </main>
    </div>
  )
}
