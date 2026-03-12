# Mangalam HDPE Pipes — Product Page

Responsive product landing page for Mangalam HDPE Pipes, built from a Figma design using plain HTML, CSS, and JavaScript (no frameworks).

## Files

| File             | What it does                                                                                         |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| `index.html`     | Page structure — hero, specs table, feature cards, FAQ, carousels, contact form, footer, modals      |
| `styles.css`     | All styling, layout (flex/grid), responsive breakpoints                                              |
| `script.js`      | Interactivity — sticky header, image carousel with zoom, FAQ accordion, tab navigation, modals, etc. |
| `assets/images/` | Product images, logos, certification badges, noise texture                                           |

## Running locally

Open `index.html` in a browser, or serve it:

```
npx serve .
```

## Key features

- **Sticky header** — shows up when you scroll past the hero, disappears when scrolling back up
- **Image carousel + hover zoom** — thumbnails switch the main image; hovering shows a magnified lens preview
- **FAQ accordion** — one item open at a time, with aria-expanded for accessibility
- **Process tabs** — pills connected by a line; arrows switch content
- **Auto-scrolling testimonials** — pauses on hover/touch, uses native scroll
- **Responsive** — desktop (1600px), tablet, mobile breakpoints with hamburger nav
