# Future Edu Academy

A modern Jamstack education platform built with Astro, featuring course management, AI-powered chatbot, and headless CMS integration.

## 🚀 Tech Stack

- **Framework**: Astro 5.x (Static Site Generator)
- **Styling**: Tailwind CSS 3.x with custom pastel theme
- **Font**: Quicksand (Google Fonts)
- **CMS**: Decap CMS (Headless CMS with Git backend)
- **Forms**: Formspree (Contact forms)
- **AI Integration**: window.ai (Chrome AI API)
- **Linting**: ESLint + Prettier
- **CI/CD**: Netlify (deploy) + GitHub Actions (DNS & CI checks)

## 📋 Prerequisites

- Node.js 20 or higher
- npm or yarn
- Git

## 🛠️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/mleczakm/eduacademy.git
cd eduacademy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory (if needed):

```env
# Formspree configuration
FORMSPREE_ID=your-formspree-id
```

### 4. Start development server

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

## 📝 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Project Structure

```
eduacademy/
├── public/
│   ├── admin/              # Decap CMS configuration
│   └── assets/             # Static assets (images, PDFs)
├── src/
│   ├── components/         # Astro components
│   │   ├── HeroAI.astro    # AI chatbot component
│   │   ├── CourseCard.astro # Course card component
│   │   └── FormspreeModal.astro # Enrollment modal
│   ├── content/            # Content collections
│   │   ├── courses/        # Course content (Markdown)
│   │   ├── publications/   # Blog posts (Markdown)
│   │   └── pages/          # Static pages (Markdown)
│   ├── layouts/            # Layout components
│   │   └── Layout.astro   # Main layout
│   ├── pages/              # Page routes
│   │   ├── index.astro     # Homepage
│   │   ├── szkolenia/      # Course detail pages
│   │   └── llms.txt.ts    # AI agent endpoint
│   └── styles/             # Global styles
│       └── global.css      # Tailwind + custom styles
├── .github/workflows/      # CI/CD workflows
├── astro.config.mjs        # Astro configuration
├── tailwind.config.mjs     # Tailwind configuration
└── package.json            # Dependencies and scripts
```

### Content Management

#### Adding Courses

1. Create a new Markdown file in `src/content/courses/`
2. Add frontmatter with course metadata:

```markdown
---
title: "Course Title"
category: "Dla dzieci" | "Dla nauczycieli" | "Dla seniorów"
tags: ["tag1", "tag2"]
priceFrom: "120,00 zł"
image: "🎨"
---

Course description here...
```

#### Using Decap CMS

Access the admin panel at `/admin` to manage content through a web interface.

## 🚢 Deployment

### Netlify (Automatic)

The site deploys from Netlify when you push to `main`. GitHub Actions manages Cloudflare DNS and runs CI checks.

1. Connect the repository in the [Netlify dashboard](https://app.netlify.com/)
2. Set the custom domain to `eduacademy.pl`
3. Enable **Identity** and **Git Gateway** (Site settings → Identity → Services → Git Gateway)
4. Push to `main` — Netlify builds and deploys; GitHub Actions updates DNS to Netlify (`75.2.60.5`) and runs lint/build checks

Decap CMS at `/admin` uses Netlify Identity for authentication.

#### Identity email links (invite / password reset)

By default, Netlify Identity emails redirect to the site root (`https://eduacademy.pl/`) instead of `/admin`.
That's why there is a custom JavaScript to redirect to admin pages when a netlify anchor is found.

The site also loads the Netlify Identity widget on all pages so that if a user still lands on `/` with a token in the URL hash, they are logged in and redirected to `/admin`.

### Manual Deployment

```bash
npm run build
# Upload the contents of the `dist/` folder to your hosting provider
```

## 🔧 Configuration

### Astro Configuration (`astro.config.mjs`)

```javascript
export default defineConfig({
  site: 'https://eduacademy.pl',
  integrations: [tailwind(), sitemap()],
});
```

### Tailwind Configuration (`tailwind.config.mjs`)

Custom brand colors are defined in the Tailwind config:

- `brandPrimary`: Teal (#0d9488)
- `brandAccent`: Amber (#f59e0b)
- `brandBg`: Off-white (#fdfbf7)

### Content Configuration (`src/content.config.ts`)

Content collections are defined with Zod schemas for type safety:

- `courses` - Training courses
- `publications` - Blog posts
- `pages` - Static pages

## 🤖 AI Integration

The project includes an AI chatbot powered by Chrome's `window.ai` API:

- **Location**: `src/components/HeroAI.astro`
- **Features**: Local AI processing, privacy-focused, zero server costs
- **Fallback**: Graceful degradation for unsupported browsers

## 📊 SEO

- Automatic sitemap generation via `@astrojs/sitemap`
- Meta tags configured in layouts
- `llms.txt` endpoint for AI agents

## 🧪 Testing

```bash
# Run linting
npm run lint

# Check formatting
npm run format:check

# Build project
npm run build
```

## 📄 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and formatting
5. Submit a pull request

## 📞 Support

For issues or questions, please open an issue on GitHub.
