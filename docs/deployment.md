# Vercel deployment

1. Import the repository in Vercel and keep pnpm as the detected package manager.
2. Use Node.js 22 and `pnpm build`.
3. Configure the public site URL, Sanity project/dataset/version, server-only Sanity preview token if used, Resend key, verified sender, business recipient, and production rate-limiter credentials.
4. Add preview and production domains to Sanity CORS origins with credentials only where preview authentication requires them.
5. Verify the Resend domain's DNS records before testing live contact mail.
6. Run the production smoke journeys in French and English, then verify sitemap, robots, canonical URLs, alternate locales, structured data, and legacy redirects.
7. Connect the approved production domain only after placeholders and legal drafts are resolved.

Rollback through Vercel's previous deployment promotion. Content-only mistakes should normally be corrected or unpublished in Sanity without a code rollback.
