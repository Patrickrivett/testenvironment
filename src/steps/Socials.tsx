import { useState } from 'react'
import { Callout, Field, Spinner, StepNav } from '../components/ui'
import type { OnboardingData, SocialAccount, StepProps } from '../types'

type Platform = 'instagram' | 'tiktok' | 'youtube'

const PLATFORMS: { key: Platform; name: string; prefix: string; color: string; icon: string; mockFollowers: string }[] = [
  { key: 'instagram', name: 'Instagram', prefix: 'instagram.com/', color: '#d62976', icon: 'IG', mockFollowers: '24.8K' },
  { key: 'tiktok', name: 'TikTok', prefix: 'tiktok.com/@', color: '#111111', icon: 'TT', mockFollowers: '61.2K' },
  { key: 'youtube', name: 'YouTube', prefix: 'youtube.com/@', color: '#e62117', icon: 'YT', mockFollowers: '3.1K' },
]

export function Socials({ data, update, next, back }: StepProps) {
  const [connecting, setConnecting] = useState<Platform | null>(null)

  const setSocial = (key: Platform, patch: Partial<SocialAccount>) =>
    update({ [key]: { ...data[key], ...patch } } as Partial<OnboardingData>)

  // Mock OAuth: in the real app this opens the platform's own login window.
  const connect = (p: (typeof PLATFORMS)[number]) => {
    setConnecting(p.key)
    setTimeout(() => {
      const handle = data[p.key].handle || (data.displayName || data.firstName || 'creator').toLowerCase().replace(/\s+/g, '')
      setSocial(p.key, { connected: true, handle, followers: p.mockFollowers })
      setConnecting(null)
    }, 1500)
  }

  const hasAny = PLATFORMS.some((p) => data[p.key].handle.trim())

  return (
    <div className="step">
      <p className="eyebrow">Your profile · Step 2 of 4</p>
      <h2>Your social accounts</h2>
      <p className="lead">
        Connect your accounts so we can verify them and show your audience stats to brands. Or just add your handle.
      </p>

      <Callout>
        We never ask for your social media passwords. "Connect" signs you in on Instagram, TikTok or YouTube's own page
        and only gives us read-only access to your public stats.
      </Callout>

      <div className="socials">
        {PLATFORMS.map((p) => {
          const s = data[p.key]
          return (
            <div className="social-row" key={p.key}>
              <span className="social-icon" style={{ background: p.color }}>
                {p.icon}
              </span>
              <div className="social-main">
                <div className="social-head">
                  <strong>{p.name}</strong>
                  {s.connected && <span className="pill pill-success">Connected · {s.followers} followers</span>}
                </div>
                <div className="prefixed">
                  <span>{p.prefix}</span>
                  <input
                    value={s.handle}
                    placeholder="yourhandle"
                    disabled={s.connected}
                    onChange={(e) => setSocial(p.key, { handle: e.target.value.replace(/^@/, '') })}
                  />
                </div>
              </div>
              {s.connected ? (
                <button type="button" className="btn btn-ghost btn-small" onClick={() => setSocial(p.key, { connected: false, followers: '' })}>
                  Disconnect
                </button>
              ) : (
                <button type="button" className="btn btn-outline btn-small" onClick={() => connect(p)} disabled={connecting !== null}>
                  {connecting === p.key ? (
                    <>
                      <Spinner /> Connecting…
                    </>
                  ) : (
                    `Connect ${p.name}`
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <Field label="Portfolio / media kit link" optional hint="Linktree, Notion, Google Drive, personal site…">
        <input value={data.portfolioUrl} placeholder="https://" onChange={(e) => update({ portfolioUrl: e.target.value })} />
      </Field>

      <StepNav onBack={back} onNext={next} nextDisabled={!hasAny} />
      {!hasAny && <p className="muted small right">Add at least one account to continue.</p>}
    </div>
  )
}
