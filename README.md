# Lingolin 🌍

> Your browser's multilingual companion - Translate, Learn, and Connect

Lingolin is a powerful Chrome extension that transforms your browsing experience
into a seamless language learning and translation tool. Whether you're working
in an international team or learning a new language, Lingolin makes language
barriers disappear.

[![Lingolin Demo](https://lingolin.xyz/thumbnail.png)](https://lingolin.xyz/videos/final-demo.mp4)

### [🎬🍿 Watch the video demo here](https://lingolin.xyz/videos/final-demo.mp4)

### [📊 Read our pitch deck here](https://lingolin.xyz/lingolin-deck.pdf)

### Note: This is the website & backend Repo!!

- If you're interested in the Chrome Extension's code, please go to
  [The Extension Repo](https://github.com/lingolin-xyz/lingolin-extension)

- If you're interested in the Smart Contracts, please go to
  [The Smart Contracts Repo](https://github.com/lingolin-xyz/lingolin-contracts)

## Website Stack:

- Frontend stuff with NextJS, TailwindCSS, Shadcnui, Framer-motion
- Wagmi for contracts interaction and wallate balance reading
- Privy: auth, social login, user management, wallet linking
- Nillion's SecretVault as the database: Credits are _secret_ and all
  translations are stored there too.
- NextJS App Router for POST and GET API endpoints
- Gemini Flash: speech-to-text, transcriptions, vision to read images
- Nil AI: as part of the translation process
- 0x for Swaps between $MON and $USDC
- Stripe integration for non-crypto natives
- Alchemy, as a secondary RPC if the official one is down,
- Deployed on Vercel

## Main features:

- Login/Signup with email or google, thanks to Privy.
- Connect your wallet afterwards with wagmi and link it with privy
- Read the credits with Nillion
- Buy credits with Stripe
- Mint credits with our contract on Monad Testnet
- See the NFTs information
- Notepad: easy playground for quick translations
- Drag to Transcribe: drag an image and get the translaction (using the chrome
  extension too!)
- Your previos tts and regular text translations, that you can delete
- Dashboard (for limited admin email addresses) including a Nillion playground,
  activity tracking, list of users and some very basic stats.

### to install it and run it locally:

- clone the repo
- run `npm i --force`
- run `npm run dev`
- set up the env variables following the exampoe at `.env.local.example`

### Contact us

For feedback, possible collabs, or any question, please contact us at
hellolingolin@gmail.com
