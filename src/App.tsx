import { useCallback, useEffect, useState, type ReactNode } from 'react'
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

export type StepId =
  | 'address'
  | 'gmail'
  | 'filter'
  | 'test'
  | 'about'
  | 'socials'
  | 'content'
  | 'business'
  | 'review'

type Saved = { screen: Screen; step: StepId; data: OnboardingData }

const STORAGE_KEY = 'dealbox-onboarding-mock-v2'

const ALL_STEPS: { id: StepId; group: string; label: string }[] = [
  { id: 'address', group: 'Contract inbox', label: 'Your address' },
  { id: 'gmail', group: 'Contract inbox', label: 'Connect Gmail' },
  { id: 'filter', group: 'Contract inbox', label: 'Contract filter' },
  { id: 'test', group: 'Contract inbox', label: 'Send a test' },
  { id: 'about', group: 'Your profile', label: 'About you' },
  { id: 'socials', group: 'Your profile', label: 'Social accounts' },
  { id: 'content', group: 'Your profile', label: 'Your content' },
  { id: 'business', group: 'Your profile', label: 'Business details' },
  { id: 'review', group: 'Finish', label: 'Review' },
]

/** The filter page only exists for creators who chose to forward contracts only. */
function visibleSteps(data: OnboardingData) {
  return ALL_STEPS.filter((s) => s.id !== 'filter' || data.forwardMode !== 'all')
}

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
  return { screen: 'signup', step: 'address', data: initialData }
}

export default function App() {
  const [state, setState] = useState<Saved>(load)
  const { screen, data } = state

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable: mock still works for the session */
    }
  }, [state])

  const steps = visibleSteps(data)
  const index = Math.max(0, steps.findIndex((s) => s.id === state.step))
  const current = steps[index]

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [screen, current.id])

  const update = useCallback(
    (patch: Partial<OnboardingData>) => setState((s) => ({ ...s, data: { ...s.data, ...patch } })),
    [],
  )
  const goTo = (id: StepId) => setState((s) => ({ ...s, step: id }))
  const reset = () => setState({ screen: 'signup', step: 'address', data: initialData })

  if (screen === 'signup') {
    return (
      <SignUp
        data={data}
        update={update}
        onDone={() =>
          setState((s) => ({
            screen: 'onboarding',
            step: 'address',
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
      setState((s) => {
        const list = visibleSteps(s.data)
        const i = list.findIndex((x) => x.id === s.step)
        return i >= list.length - 1 ? { ...s, screen: 'dashboard' } : { ...s, step: list[i + 1].id }
      }),
    back: () =>
      setState((s) => {
        const list = visibleSteps(s.data)
        const i = list.findIndex((x) => x.id === s.step)
        return i <= 0 ? { ...s, screen: 'signup' } : { ...s, step: list[i - 1].id }
      }),
  }

  const pages: Record<StepId, ReactNode> = {
    address: <InboxIntro {...props} />,
    gmail: <GmailForwarding {...props} />,
    filter: <GmailFilter {...props} />,
    test: <TestForward {...props} />,
    about: <AboutYou {...props} />,
    socials: <Socials {...props} />,
    content: <CreatorProfile {...props} />,
    business: <Business {...props} />,
    review: <Review {...props} goTo={goTo} />,
  }

  const groups = [...new Set(steps.map((s) => s.group))]
  const progress = Math.round((index / (steps.length - 1)) * 100)

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
              {steps.map((s, i) =>
                s.group !== g ? null : (
                  <button
                    type="button"
                    key={s.id}
                    className={`nav-item ${i === index ? 'current' : ''} ${i < index ? 'done' : ''}`}
                    onClick={() => i < index && goTo(s.id)}
                    disabled={i > index}
                  >
                    <span className="nav-dot">{i < index ? '✓' : i + 1}</span>
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
            {current.group} · {current.label}
          </span>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div key={current.id} className="step-container">
          {pages[current.id]}
        </div>
      </main>
    </div>
  )
}
