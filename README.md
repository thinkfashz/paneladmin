# Next.js Admin Template with TypeScript & Shadcn UI

**Studio Admin** - Includes multiple dashboards, authentication layouts, customizable theme presets, and more.

<img src="https://github.com/arhamkhnz/next-shadcn-admin-dashboard/blob/main/media/dashboard.png?version=5" alt="Dashboard Screenshot">

Most admin templates I found, free or paid, felt cluttered, outdated, or too rigid. I built this as a cleaner alternative with features often missing in others, such as theme toggling and layout controls, while keeping the design modern, minimal, and flexible.

> **View demo:** [studio admin](https://next-shadcn-admin-dashboard.vercel.app)

> [!NOTE]
> Looking for the Base UI version? Check out [next-shadcn-admin-dashboard-baseui](https://github.com/arhamkhnz/next-shadcn-admin-dashboard-baseui).

> [!TIP]
> I’m also working on Nuxt.js, Svelte, and React Native versions. Stay tuned!

## Features

- **Multiple Dashboards** – Default, Analytics, E-commerce, and a Projects Kanban board
- **Auth Layouts** – Login, Register, Forgot Password, and OTP pages
- **Theme System** – Dark/Light mode, customizable presets, and a sidebar theme builder
- **Layout Controls** – Toggle sidebar style and density, compact/full-width options
- **Component Pages** – Typography, Colors, Buttons, Form fields, Tables, Cards, Modals, and more
- **Customizable** – Preferences stored via Zustand, easy to extend

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Shadcn/ui** (Radix Nova style)
- **Lucide React** for icons
- **Zustand** for state management
- **Recharts** for data visualization

## Getting Started

```bash
npx create-next-app@latest my-app --example https://github.com/arhamkhnz/next-shadcn-admin-dashboard
```

Or clone the repo:

```bash
git clone https://github.com/arhamkhnz/next-shadcn-admin-dashboard.git
cd next-shadcn-admin-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication pages
│   ├── (dashboard)/        # Dashboard pages
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── app/                # App-level components (sidebar, header, etc.)
│   └── ...                 # Feature-specific components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, constants, types
└── stores/                 # Zustand stores
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT — see [LICENSE](./LICENSE) for details.
