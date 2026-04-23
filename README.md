# Gurgaon Progressive Schools Council Website

Professional static website for Gurgaon Progressive Schools Council / CBSE Sahodaya Schools Complexes, Gurgaon Chapter.

## What Is Included

- Modern responsive public website
- Home, Board Members, Members, Events, Webinars, Conferences, Meetings, Publications, Join, Gallery and Contact pages
- Searchable and filterable member school directory
- Data-driven event cards, meeting archives and publication cards
- Decap CMS admin dashboard at `/admin`
- Editable JSON content in `/data`
- GitHub Pages friendly deployment with no build step

## Local Preview

Because the pages load JSON content, preview the site through a small local server instead of opening `index.html` directly.

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

## Content Files

- `data/site.json` - global settings, navigation, homepage text and stats
- `data/board-members.json` - managing committee and founder members
- `data/members.json` - member school directory
- `data/events.json` - webinars, conferences, meetings and publications
- `data/gallery.json` - gallery albums

## Admin Dashboard Setup

The admin dashboard uses Decap CMS.

Before deployment, edit `admin/config.yml`:

```yaml
backend:
  name: github
  repo: YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME
  branch: main
```

Also update:

```yaml
site_url: "https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME"
display_url: "https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME"
```

For a custom domain, replace those URLs with the final domain.

## Deploy On GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from this folder.
3. Go to repository Settings.
4. Open Pages.
5. Select deploy from `main` branch and root folder.
6. Save.
7. After deployment, visit the generated GitHub Pages URL.

## Admin Authentication

Decap CMS with GitHub backend requires OAuth authentication. The cleanest production option is to deploy through Netlify and enable Identity + Git Gateway. For pure GitHub Pages, configure a GitHub OAuth provider or use a Decap-compatible auth service.

If you prefer a fully custom dashboard with database login, replace `/admin` with a backend stack such as Supabase, Firebase or a Next.js admin app.

## Forms

The Join and Contact pages include frontend forms. Connect them to one of these before production:

- Formspree
- Google Forms
- Supabase
- Firebase
- A custom API endpoint

## Image Notes

Current images are professional placeholders from Unsplash. Replace them in the dashboard or JSON files with real GPSC, school, event and gallery images before launch.
