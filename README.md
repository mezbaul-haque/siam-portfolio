# Siam Portfolio

Personal portfolio site for Siam Ur Rahman, focused on customer experience leadership, operations impact, and proof-backed project storytelling.

## Project Structure

- `index.html`: Main content, portfolio sections, metadata, and modal markup
- `styles.css`: Full visual design, layout, responsive behavior, and animations
- `script.js`: Navigation state, reveal effects, project filtering, and modal interactions
- `assets/`: Published images, logos, PDFs, and project media used by the live site
- `assets-source/`: Original JPG source photos kept for editing and future exports
- `assets-updated/`: Source material and newer media kept for future content updates

## Local Preview

Because this is a static site, you can preview it with any simple file server.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Content Update Workflow

1. Replace text directly in `index.html`.
2. Add or swap source photos inside `assets-source/`, then export optimized live assets into `assets/`.
3. Keep large raw or candidate files inside `assets-updated/` until they are optimized for the live site.
4. Review responsive layout and modal behavior after any new cards or sections are added.

## Current UX Features

- Sticky responsive navigation with active-section highlighting
- Filterable project gallery with progressive reveal
- Keyboard-openable detail modal with focus containment
- Structured metadata for search and social sharing
- Reduced-motion friendly reveal animations

## Deployment

This project does not require a build step. It can be deployed directly to any static host, including GitHub Pages, Netlify, Vercel static hosting, or a traditional web server.

## Maintenance Notes

- Prefer WebP for live photographic assets in `assets/`
- Keep JPG originals in `assets-source/` unless a JPG is still intentionally used for social preview metadata
- Keep role dates and headline metrics current in `index.html`
- Use absolute URLs for future canonical or social preview tags once the final production domain is confirmed
