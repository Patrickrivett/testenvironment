import { ChipSelect, Field, StepNav } from '../components/ui'
import type { StepProps } from '../types'

const UGC_TYPES = [
  'Product demos',
  'Unboxings',
  'Testimonials / reviews',
  'Tutorials / how-to',
  'Voiceovers',
  'Skits / comedy',
  'Before & after',
  'Lifestyle / B-roll',
  'Photography',
  'Hauls',
  'ASMR',
  'Street interviews',
]

const NICHES = [
  'Beauty & skincare',
  'Fashion',
  'Fitness & wellness',
  'Food & drink',
  'Tech & gadgets',
  'Gaming',
  'Home & interiors',
  'Parenting & family',
  'Pets',
  'Travel',
  'Finance',
  'Health',
  'Education',
  'Apps & SaaS',
]

const FORMATS = [
  'Short-form video (under 60s)',
  'Long-form video',
  'Stories',
  'Static photos',
  'Carousels',
  'Livestreams',
  'Raw footage only',
  'Whitelisting / Spark Ads',
]

export function CreatorProfile({ data, update, next, back }: StepProps) {
  const valid = data.ugcTypes.length > 0 && data.niches.length > 0 && data.experience

  return (
    <div className="step">
      <p className="eyebrow">Your profile · Step 3 of 4</p>
      <h2>What kind of content do you make?</h2>
      <p className="lead">Helps us spot deal terms that matter for your work, like usage rights on paid ads.</p>

      <Field label="Types of UGC" hint="Pick all that apply">
        <ChipSelect options={UGC_TYPES} value={data.ugcTypes} onChange={(ugcTypes) => update({ ugcTypes })} />
      </Field>

      <Field label="Niches" hint={`Pick up to 5 (${data.niches.length}/5)`}>
        <ChipSelect options={NICHES} value={data.niches} onChange={(niches) => update({ niches })} max={5} />
      </Field>

      <Field label="Formats you deliver" optional>
        <ChipSelect options={FORMATS} value={data.contentFormats} onChange={(contentFormats) => update({ contentFormats })} />
      </Field>

      <div className="grid-2">
        <Field label="How long have you been doing brand deals?">
          <select value={data.experience} onChange={(e) => update({ experience: e.target.value })}>
            <option value="">Select…</option>
            <option>Just starting out</option>
            <option>Less than 1 year</option>
            <option>1–2 years</option>
            <option>3+ years</option>
          </select>
        </Field>
        <Field label="Typical rate per video" optional hint="Private — used to flag low offers">
          <select value={data.typicalRate} onChange={(e) => update({ typicalRate: e.target.value })}>
            <option value="">Prefer not to say</option>
            <option>Under $100</option>
            <option>$100–$250</option>
            <option>$250–$500</option>
            <option>$500–$1,000</option>
            <option>$1,000–$2,500</option>
            <option>$2,500+</option>
          </select>
        </Field>
      </div>

      <Field label="Languages you create in" optional>
        <input value={data.languages} placeholder="English, Spanish" onChange={(e) => update({ languages: e.target.value })} />
      </Field>

      <Field label="Short bio" optional hint={`${data.bio.length}/280`}>
        <textarea
          rows={3}
          maxLength={280}
          value={data.bio}
          placeholder="Skincare-obsessed UGC creator making honest, scroll-stopping demos."
          onChange={(e) => update({ bio: e.target.value })}
        />
      </Field>

      <StepNav onBack={back} onNext={next} nextDisabled={!valid} />
    </div>
  )
}
