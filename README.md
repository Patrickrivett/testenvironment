# Dealbox: creator onboarding (mock)

A front-end-only mock of the creator sign-up flow. It has no backend. Anything the real system would do on the server (catching Gmail's confirmation code, receiving a test email, connecting Instagram, TikTok or YouTube) is simulated with timers.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173. Your progress is saved in localStorage. Click **Reset demo** in the sidebar to start again.

## Flow

1. **Sign up**: name, email, password (or a mocked "Continue with Google")
2. **Contract inbox**
   - **Your address**: a generated forwarding address like `jane.doe.k7q2@inbox.dealbox.app`, plus consent checkboxes
   - **Gmail forwarding**: step-by-step instructions. After "I've added the address", a mocked Gmail confirmation code appears
   - **Create filter**: a copyable Gmail search query and instructions for creating the filter
   - **Send a test**: a mocked "listening" state, plus manual forwarding and PDF upload as fallbacks
3. **Your profile**
   - **About you**: display name, date of birth (18+ check), pronouns, phone, country, city
   - **Social accounts**: Instagram, TikTok and YouTube handles, with mocked OAuth "Connect" buttons (no passwords)
   - **Your content**: UGC types, niches, formats, experience, typical rate, languages, bio
   - **Business details**: legal name, entity type, payment terms, manager or agent
4. **Review**, then a blank **Dashboard** page

You can skip the Gmail steps. They're then marked as "finish from your dashboard" on the review screen.

## Code layout

- `src/App.tsx`: screen and step state, sidebar, localStorage persistence
- `src/steps/*`: one component per step
- `src/components/ui.tsx`: shared form and UI pieces
- `src/lib/inbox.ts`: address generation, filter query, mocked confirmation code
