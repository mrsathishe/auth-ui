
# AMS Auth UI

A modern authentication UI for Apartment Management System (AMS), built with Next.js, React, TypeScript, and SCSS. Includes registration, login, user/admin dashboards, and common header/footer.

## Features
- Registration and login forms
- Phone number input with country selector
- User and admin dashboard pages
- Common header with logo, contact email, and phone
- Footer with copyright
- Axios integration for registration POST
- Responsive, clean design
- Environment-based API URL (development/production)

## Getting Started

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment
- Development API: `http://127.0.0.1:8000`
- Production API: Change in `src/app/register/page.tsx` as needed

## Folder Structure
- `src/app/register/page.tsx` — Registration page
- `src/app/login/page.tsx` — Login page
- `src/app/admin/page.tsx` — Admin dashboard
- `src/app/user/page.tsx` — User dashboard
- `src/app/components/Header.tsx` — Common header
- `src/app/components/Footer.tsx` — Common footer
- `src/constants/formData.ts` — Form data types/constants
- `public/apartment-logo.svg` — Logo

## Customization
- Update contact info in `Header.tsx`
- Update logo in `public/apartment-logo.svg`
- Adjust styles in SCSS/CSS files

## Deployment
Push only source code/config files. Do not commit `node_modules` or build output.

## License
MIT
