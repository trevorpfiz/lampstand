# Project overview

You are building an AI-powered Bible study platform, where users can read the Bible, take notes, and chat with AI to better understand concepts. The goal is to design the chat interface to be the primary way to use the product.

You will be using TypeScript, Next.js 15 App Router, shadcn/ui, Tailwind, and Lucide icons. We are building in a Turborepo.

# Core functionalities

1. Sidebar that allows user to navigate the dashboard and primarily lists out the user's studies they have created and allows them to create a new study.
   1. Users can see the list of studies they have already created, with each one being a SidebarMenuAction component rendering a DropdownMenu with a Rename and Delete option.
   2. Sidebar footer has buttons for feedback and support, with usage stats if they are on the 'Free' plan.
   3. Users can create a new study by clicking a square-pen button at the top right in the SidebarHeader.
2. Main page is the Bible text where users can read.
   1. A custom text renderer that follows a simpler implementation that focuses on Berean Standard Bible rendering and key user interactions (e.g., copy, cross-references)
3. SidebarInset header shows which version of the Bible users are reading, and it has buttons to toggle the shadcn resizable panels for notes or chat. They can both be open at the same time, leading to the sidebar, main Bible view, resizable chat, and resizable notes panel being usable at the same time if a user wanted. There is also a user button at the far right of the header, where users can log out, go to settings, or upgrade their plan.
4. The chat will take inspiration from the Vercel ai-chatbot repo and will use the AI SDK. Each chat is tied to the study it is started in. A user can have multiple chats per study.
5. The notes will use the Platejs rich-text editor with their new AI commands features.

# Doc

# Current file structure (`tree -L 5 -I 'node_modules|.git|notebooks'`)

Our file names should primarily follow kebab case.

├── CONTRIBUTING.md
├── PRD.md
├── README.md
├── apps
│   ├── api
│   │   ├── README.md
│   │   ├── next-env.d.ts
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   ├── sentry.client.config.ts
│   │   ├── src
│   │   │   ├── app
│   │   │   │   ├── apple-icon.png
│   │   │   │   ├── cron
│   │   │   │   ├── favicon.ico
│   │   │   │   ├── global-error.tsx
│   │   │   │   ├── health
│   │   │   │   ├── icon.png
│   │   │   │   ├── icon.svg
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── manifest.json
│   │   │   │   ├── opengraph-image.alt.txt
│   │   │   │   ├── opengraph-image.png
│   │   │   │   ├── public
│   │   │   │   ├── twitter-image.alt.txt
│   │   │   │   ├── twitter-image.png
│   │   │   │   └── webhooks
│   │   │   └── instrumentation.ts
│   │   ├── tsconfig.json
│   │   └── vercel.json
│   ├── app
│   │   ├── README.md
│   │   ├── components.json
│   │   ├── next-env.d.ts
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   ├── postcss.config.mjs
│   │   ├── sentry.client.config.ts
│   │   ├── src
│   │   │   ├── app
│   │   │   │   ├── (app)
│   │   │   │   ├── (auth)
│   │   │   │   ├── api
│   │   │   │   ├── apple-icon.png
│   │   │   │   ├── favicon.ico
│   │   │   │   ├── global-error.tsx
│   │   │   │   ├── globals.css
│   │   │   │   ├── healthz
│   │   │   │   ├── icon.png
│   │   │   │   ├── icon.svg
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── manifest.json
│   │   │   │   ├── not-found.tsx
│   │   │   │   ├── opengraph-image.alt.txt
│   │   │   │   ├── opengraph-image.png
│   │   │   │   ├── twitter-image.alt.txt
│   │   │   │   └── twitter-image.png
│   │   │   ├── components
│   │   │   │   ├── app-header.tsx
│   │   │   │   ├── auth
│   │   │   │   ├── bible
│   │   │   │   ├── billing
│   │   │   │   ├── chat
│   │   │   │   ├── notes
│   │   │   │   ├── panels-layout.tsx
│   │   │   │   ├── settings
│   │   │   │   ├── shared
│   │   │   │   └── sidebar
│   │   │   ├── hooks
│   │   │   │   ├── use-debounce.ts
│   │   │   │   ├── use-debounced-sync-document.ts
│   │   │   │   ├── use-is-touch-device.ts
│   │   │   │   ├── use-mounted.ts
│   │   │   │   ├── use-scroll-to-bottom.ts
│   │   │   │   ├── use-verse-map.ts
│   │   │   │   └── use-verse-tracking.ts
│   │   │   ├── instrumentation.ts
│   │   │   ├── lib
│   │   │   │   ├── actions
│   │   │   │   ├── constants.ts
│   │   │   │   ├── safe-action.ts
│   │   │   │   └── utils.ts
│   │   │   ├── middleware.ts
│   │   │   ├── providers
│   │   │   │   ├── bible-store-provider.tsx
│   │   │   │   ├── chat-store-provider.tsx
│   │   │   │   ├── layout-store-provider.tsx
│   │   │   │   ├── panels-store-provider.tsx
│   │   │   │   ├── pricing-dialog-store-provider.tsx
│   │   │   │   └── settings-dialog-store-provider.tsx
│   │   │   ├── public
│   │   │   │   ├── bible_metadata.json
│   │   │   │   ├── favicon.ico
│   │   │   │   ├── lampstand-logo-full.svg
│   │   │   │   ├── ordered_bible.json
│   │   │   │   ├── web-app-manifest-192x192.png
│   │   │   │   └── web-app-manifest-512x512.png
│   │   │   ├── scripts
│   │   │   │   ├── bible-converter.ts
│   │   │   │   ├── converted
│   │   │   │   └── usj-to-semantic-ir.ts
│   │   │   ├── stores
│   │   │   │   ├── bible-store.ts
│   │   │   │   ├── chat-store.ts
│   │   │   │   ├── layout-store.ts
│   │   │   │   ├── panels-store.ts
│   │   │   │   ├── pricing-dialog-store.ts
│   │   │   │   └── settings-dialog-store.ts
│   │   │   ├── styles
│   │   │   │   ├── CalSans-SemiBold.otf
│   │   │   │   └── fonts.ts
│   │   │   ├── trpc
│   │   │   │   ├── query-client.ts
│   │   │   │   ├── react.tsx
│   │   │   │   └── server.ts
│   │   │   ├── types
│   │   │   │   ├── bible.d.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── usj.ts
│   │   │   └── utils
│   │   │       └── bible
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   ├── turbo.json
│   │   └── vitest.config.ts
│   ├── email
│   │   ├── emails
│   │   │   └── contact.tsx
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web
│       ├── README.md
│       ├── components.json
│       ├── next-env.d.ts
│       ├── next.config.ts
│       ├── package.json
│       ├── postcss.config.mjs
│       ├── src
│       │   ├── app
│       │   │   ├── (home)
│       │   │   ├── (legal)
│       │   │   ├── apple-icon.png
│       │   │   ├── favicon.ico
│       │   │   ├── global-error.tsx
│       │   │   ├── icon.png
│       │   │   ├── icon.svg
│       │   │   ├── layout.tsx
│       │   │   ├── manifest.json
│       │   │   ├── opengraph-image.alt.txt
│       │   │   ├── opengraph-image.png
│       │   │   ├── pricing
│       │   │   ├── robots.ts
│       │   │   ├── sitemap.ts
│       │   │   ├── twitter-image.alt.txt
│       │   │   └── twitter-image.png
│       │   ├── components
│       │   │   ├── craft
│       │   │   ├── hero-video.tsx
│       │   │   ├── hero.tsx
│       │   │   ├── magicui
│       │   │   ├── pricing-tables.tsx
│       │   │   ├── sidebar.tsx
│       │   │   └── tailwindui
│       │   ├── instrumentation.ts
│       │   ├── middleware.ts
│       │   └── public
│       │       ├── lampstand-logo-full.svg
│       │       ├── lampstand.svg
│       │       ├── web-app-manifest-192x192.png
│       │       └── web-app-manifest-512x512.png
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── vercel.json
├── biome.json
├── package.json
├── packages
│   ├── ai
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── components
│   │   │   │   ├── index.ts
│   │   │   │   └── markdown.tsx
│   │   │   ├── config
│   │   │   │   ├── models.ts
│   │   │   │   └── prompts.ts
│   │   │   ├── index.ts
│   │   │   └── lib
│   │   │       ├── custom-middleware.ts
│   │   │       └── react.ts
│   │   └── tsconfig.json
│   ├── analytics
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── google.ts
│   │   │   ├── index.tsx
│   │   │   ├── posthog
│   │   │   │   ├── client.tsx
│   │   │   │   └── server.ts
│   │   │   └── vercel.ts
│   │   └── tsconfig.json
│   ├── api
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   ├── root.ts
│   │   │   ├── router
│   │   │   │   ├── auth.ts
│   │   │   │   ├── chat.ts
│   │   │   │   ├── feedback.ts
│   │   │   │   ├── message.ts
│   │   │   │   ├── note.ts
│   │   │   │   ├── profile.ts
│   │   │   │   ├── stripe.ts
│   │   │   │   └── study.ts
│   │   │   ├── trpc.ts
│   │   │   └── utils
│   │   │       ├── dates.ts
│   │   │       ├── drizzle.ts
│   │   │       └── index.ts
│   │   └── tsconfig.json
│   ├── cms
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── components
│   │   │   │   ├── body.tsx
│   │   │   │   ├── feed.tsx
│   │   │   │   ├── image.tsx
│   │   │   │   ├── toc.tsx
│   │   │   │   └── toolbar.tsx
│   │   │   ├── index.ts
│   │   │   ├── next-config.ts
│   │   │   └── typescript-config.json
│   │   └── tsconfig.json
│   ├── db
│   │   ├── drizzle.config.ts
│   │   ├── migrations
│   │   │   ├── 0000_cloudy_boom_boom.sql
│   │   │   ├── 0001_glossy_golden_guardian.sql
│   │   │   ├── 0002_dizzy_brood.sql
│   │   │   ├── 0003_whole_phil_sheldon.sql
│   │   │   ├── 0004_regular_frog_thor.sql
│   │   │   ├── 0005_strong_karnak.sql
│   │   │   ├── 0006_fair_thena.sql
│   │   │   └── meta
│   │   │       ├── 0000_snapshot.json
│   │   │       ├── 0001_snapshot.json
│   │   │       ├── 0002_snapshot.json
│   │   │       ├── 0003_snapshot.json
│   │   │       ├── 0004_snapshot.json
│   │   │       ├── 0005_snapshot.json
│   │   │       ├── 0006_snapshot.json
│   │   │       └── _journal.json
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── client.ts
│   │   │   ├── index.ts
│   │   │   ├── lib
│   │   │   │   └── utils.ts
│   │   │   ├── migrate.ts
│   │   │   ├── queries
│   │   │   │   ├── chat.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── message.ts
│   │   │   │   ├── note.ts
│   │   │   │   ├── profile.ts
│   │   │   │   ├── stripe.ts
│   │   │   │   └── study.ts
│   │   │   └── schema
│   │   │       ├── _table.ts
│   │   │       ├── chat.ts
│   │   │       ├── customer.ts
│   │   │       ├── feedback.ts
│   │   │       ├── index.ts
│   │   │       ├── message.ts
│   │   │       ├── note.ts
│   │   │       ├── price.ts
│   │   │       ├── product.ts
│   │   │       ├── profile.ts
│   │   │       ├── study.ts
│   │   │       └── subscription.ts
│   │   └── tsconfig.json
│   ├── email
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   └── templates
│   │   │       └── contact.tsx
│   │   └── tsconfig.json
│   ├── env
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── db
│   │   │   │   └── env.ts
│   │   │   ├── email
│   │   │   │   └── env.ts
│   │   │   └── env.ts
│   │   └── tsconfig.json
│   ├── feature-flags
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── access.ts
│   │   │   ├── index.ts
│   │   │   └── lib
│   │   │       └── create-flag.ts
│   │   └── tsconfig.json
│   ├── logger
│   │   ├── package.json
│   │   ├── src
│   │   │   └── index.ts
│   │   └── tsconfig.json
│   ├── next-config
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   └── instrumentation.ts
│   │   └── tsconfig.json
│   ├── observability
│   │   ├── package.json
│   │   ├── src
│   │   │   └── error.ts
│   │   └── tsconfig.json
│   ├── payments
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── client.ts
│   │   │   ├── index.ts
│   │   │   └── utils.ts
│   │   └── tsconfig.json
│   ├── plate
│   │   ├── components.json
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── app
│   │   │   │   └── api
│   │   │   ├── components
│   │   │   │   ├── editor
│   │   │   │   └── plate-ui
│   │   │   ├── hooks
│   │   │   │   ├── use-debounce.ts
│   │   │   │   ├── use-is-touch-device.ts
│   │   │   │   └── use-mounted.ts
│   │   │   ├── index.ts
│   │   │   └── lib
│   │   │       └── uploadthing.ts
│   │   ├── tsconfig.json
│   │   └── unused.css
│   ├── rate-limit
│   │   ├── package.json
│   │   ├── src
│   │   │   └── index.ts
│   │   └── tsconfig.json
│   ├── security
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   └── middleware.ts
│   │   └── tsconfig.json
│   ├── seo
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   ├── json-ld.tsx
│   │   │   └── metadata.ts
│   │   └── tsconfig.json
│   ├── supabase
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── clients
│   │   │   │   ├── client.ts
│   │   │   │   ├── middleware.ts
│   │   │   │   └── server.ts
│   │   │   ├── config
│   │   │   │   └── routes.ts
│   │   │   ├── index.ts
│   │   │   ├── queries.ts
│   │   │   └── types
│   │   │       ├── db.ts
│   │   │       └── index.ts
│   │   └── tsconfig.json
│   ├── testing
│   │   ├── package.json
│   │   ├── src
│   │   │   └── index.js
│   │   └── tsconfig.json
│   ├── ui
│   │   ├── components.json
│   │   ├── package.json
│   │   ├── postcss.config.mjs
│   │   ├── src
│   │   │   ├── components
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── alert-dialog.tsx
│   │   │   │   ├── alert.tsx
│   │   │   │   ├── aspect-ratio.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── breadcrumb.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── carousel.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── collapsible.tsx
│   │   │   │   ├── command.tsx
│   │   │   │   ├── context-menu.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── drawer.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── hover-card.tsx
│   │   │   │   ├── input-otp.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── menubar.tsx
│   │   │   │   ├── navigation-menu.tsx
│   │   │   │   ├── popover.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   ├── radio-group.tsx
│   │   │   │   ├── resizable.tsx
│   │   │   │   ├── scroll-area.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── sheet.tsx
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── slider.tsx
│   │   │   │   ├── sonner.tsx
│   │   │   │   ├── spinner.tsx
│   │   │   │   ├── switch.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── textarea-autosize.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── toggle-group.tsx
│   │   │   │   ├── toggle.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   └── virtualized-combobox.tsx
│   │   │   ├── hooks
│   │   │   │   └── use-mobile.tsx
│   │   │   ├── index.tsx
│   │   │   ├── lib
│   │   │   │   ├── fonts.ts
│   │   │   │   └── utils.ts
│   │   │   ├── providers
│   │   │   │   └── theme.tsx
│   │   │   └── styles
│   │   │       └── globals.css
│   │   └── tsconfig.json
│   └── validators
│       ├── package.json
│       ├── src
│       │   ├── auth
│       │   │   └── index.ts
│       │   └── index.ts
│       └── tsconfig.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── process.md
├── tooling
│   ├── github
│   │   ├── package.json
│   │   └── setup
│   │       └── action.yml
│   ├── tailwind
│   │   ├── base.ts
│   │   ├── native.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── web.ts
│   └── typescript
│       ├── base.json
│       ├── internal-package.json
│       └── package.json
├── turbo
│   └── generators
│       ├── config.ts
│       └── templates
│           ├── package.json.hbs
│           └── tsconfig.json.hbs
├── turbo.json
└── vercel.json

132 directories, 349 files
