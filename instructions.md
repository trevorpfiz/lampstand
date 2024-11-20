# Project overview

You are building a Bible study platform, where users can read the bible, take notes, and chat with AI to better understand concepts.

You will be using TypeScript, Next.js 15 App Router, shadcn/ui, Tailwind, and Lucide icons. We are building in a Turborepo.

# Core functionalities

1. Sidebar that allows user to navigate the dashboard and primarilly lists out the user's studies they have created and allows them to create a new study.
   1. Users can see the list of studies they have already created, with each one being a SidebarMenuAction component rendering a DropdownMenu with a Rename and Delete option.
   2. Sidebar footer has buttons for affiliate, feedback, support, and a user button at the bottom.
   3. Users can create a new study by clicking a square-pen button at the top right in the SidebarHeader.
2. Main page is the Bible text where users can read.
   1. A custom text renderer that follows a simpler implementation that focuses on Berean Standard Bible rendering and key user interactions (e.g., highlights, cross-references)
3. SidebarInset header shows which version of the Bible users are reading, and it has buttons to toggle the shadcn resizable panels for notes or chat. They can both be open at the same time, leading to the sidebar, main Bible view, resizable chat, and resizable notes panel being usable at the same time if a user wanted.
4. The chat will take inspiration from the Vercel ai-chatbot repo and will use the AI SDK.
5. The notes will use the Platejs rich-text editor with their new AI commands features.

# Doc

# Current file structure (`tree -L 4 -I 'node_modules|.git'`)

Our file names should primarily follow kebab case.

├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── apps
│ ├── fastapi
│ │ ├── Dockerfile
│ │ ├── README.md
│ │ ├── compose.lambda.yaml
│ │ ├── compose.yaml
│ │ ├── lambda.Dockerfile
│ │ ├── package.json
│ │ ├── pyproject.toml
│ │ ├── requirements.txt
│ │ ├── scripts
│ │ │ ├── deploy.sh
│ │ │ ├── run.sh
│ │ │ └── teardown.sh
│ │ ├── src
│ │ │ └── app
│ │ ├── tests
│ │ │ ├── **init**.py
│ │ │ ├── api
│ │ │ ├── conftest.py
│ │ │ ├── crud
│ │ │ └── utils.py
│ │ └── uv.lock
│ └── nextjs
│ ├── README.md
│ ├── eslint.config.js
│ ├── next-env.d.ts
│ ├── next.config.js
│ ├── package.json
│ ├── postcss.config.cjs
│ ├── src
│ │ ├── app
│ │ ├── components
│ │ ├── config
│ │ ├── env.ts
│ │ ├── lib
│ │ ├── middleware.ts
│ │ ├── providers
│ │ ├── stores
│ │ ├── styles
│ │ ├── trpc
│ │ ├── types
│ │ └── utils
│ ├── tailwind.config.ts
│ ├── tsconfig.json
│ └── turbo.json
├── instructions.md
├── package.json
├── packages
│ ├── api
│ │ ├── dist
│ │ │ ├── index.d.ts
│ │ │ ├── index.d.ts.map
│ │ │ ├── root.d.ts
│ │ │ ├── root.d.ts.map
│ │ │ ├── router
│ │ │ ├── trpc.d.ts
│ │ │ ├── trpc.d.ts.map
│ │ │ └── utils
│ │ ├── eslint.config.js
│ │ ├── openapi-ts.config.ts
│ │ ├── package.json
│ │ ├── src
│ │ │ ├── index.ts
│ │ │ ├── root.ts
│ │ │ ├── router
│ │ │ ├── trpc.ts
│ │ │ └── utils
│ │ └── tsconfig.json
│ ├── db
│ │ ├── dist
│ │ │ ├── client.d.ts
│ │ │ ├── client.d.ts.map
│ │ │ ├── index.d.ts
│ │ │ ├── index.d.ts.map
│ │ │ ├── lib
│ │ │ ├── migrate.d.ts
│ │ │ ├── migrate.d.ts.map
│ │ │ └── schema
│ │ ├── drizzle.config.ts
│ │ ├── eslint.config.js
│ │ ├── migrations
│ │ │ ├── 0000_lean_magma.sql
│ │ │ └── meta
│ │ ├── package.json
│ │ ├── src
│ │ │ ├── client.ts
│ │ │ ├── index.ts
│ │ │ ├── lib
│ │ │ ├── migrate.ts
│ │ │ └── schema
│ │ └── tsconfig.json
│ ├── ui
│ │ ├── components.json
│ │ ├── dist
│ │ │ ├── hooks
│ │ │ └── src
│ │ ├── eslint.config.js
│ │ ├── hooks
│ │ │ └── use-mobile.tsx
│ │ ├── package.json
│ │ ├── src
│ │ │ ├── accordion.tsx
│ │ │ ├── alert-dialog.tsx
│ │ │ ├── alert.tsx
│ │ │ ├── aspect-ratio.tsx
│ │ │ ├── avatar.tsx
│ │ │ ├── badge.tsx
│ │ │ ├── breadcrumb.tsx
│ │ │ ├── button.tsx
│ │ │ ├── card.tsx
│ │ │ ├── checkbox.tsx
│ │ │ ├── collapsible.tsx
│ │ │ ├── command.tsx
│ │ │ ├── context-menu.tsx
│ │ │ ├── dialog.tsx
│ │ │ ├── drawer.tsx
│ │ │ ├── dropdown-menu.tsx
│ │ │ ├── form.tsx
│ │ │ ├── hover-card.tsx
│ │ │ ├── index.ts
│ │ │ ├── input-otp.tsx
│ │ │ ├── input.tsx
│ │ │ ├── label.tsx
│ │ │ ├── menubar.tsx
│ │ │ ├── navigation-menu.tsx
│ │ │ ├── popover.tsx
│ │ │ ├── progress.tsx
│ │ │ ├── radio-group.tsx
│ │ │ ├── resizable.tsx
│ │ │ ├── scroll-area.tsx
│ │ │ ├── select.tsx
│ │ │ ├── separator.tsx
│ │ │ ├── sheet.tsx
│ │ │ ├── sidebar.tsx
│ │ │ ├── skeleton.tsx
│ │ │ ├── slider.tsx
│ │ │ ├── sonner.tsx
│ │ │ ├── switch.tsx
│ │ │ ├── table.tsx
│ │ │ ├── tabs.tsx
│ │ │ ├── textarea.tsx
│ │ │ ├── theme.tsx
│ │ │ ├── toggle-group.tsx
│ │ │ ├── toggle.tsx
│ │ │ └── tooltip.tsx
│ │ ├── tsconfig.json
│ │ └── unused.css
│ └── validators
│ ├── dist
│ │ ├── auth
│ │ ├── index.d.ts
│ │ └── index.d.ts.map
│ ├── eslint.config.js
│ ├── package.json
│ ├── src
│ │ ├── auth
│ │ └── index.ts
│ └── tsconfig.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── process.md
├── tooling
│ ├── eslint
│ │ ├── base.js
│ │ ├── expo.js
│ │ ├── nextjs.js
│ │ ├── package.json
│ │ ├── react.js
│ │ ├── tsconfig.json
│ │ └── types.d.ts
│ ├── github
│ │ ├── package.json
│ │ └── setup
│ │ └── action.yml
│ ├── prettier
│ │ ├── index.js
│ │ ├── package.json
│ │ └── tsconfig.json
│ ├── tailwind
│ │ ├── base.ts
│ │ ├── eslint.config.js
│ │ ├── native.ts
│ │ ├── package.json
│ │ ├── tsconfig.json
│ │ └── web.ts
│ └── typescript
│ ├── base.json
│ ├── internal-package.json
│ └── package.json
├── turbo
│ └── generators
│ ├── config.ts
│ └── templates
│ ├── eslint.config.js.hbs
│ ├── package.json.hbs
│ └── tsconfig.json.hbs
├── turbo.json
└── vercel.json

59 directories, 144 files
