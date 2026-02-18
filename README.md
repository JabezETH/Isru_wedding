# Wedding Invitation Website

Mobile-friendly HTML wedding invitation with:

- Animated opening screen
- Background music (tap-to-play)
- Photo gallery
- Zoomable Google Map embed
- Easy GitHub Pages hosting

## Files

- `index.html`
- `styles.css`
- `config.js`
- `script.js`

## Customize

1. Edit everything in one place:
   - Update `config.js` for all:
     - Text content (names, headings, body, footer, button labels)
     - Photo links + alt text
     - Music file path
     - Map embed/search links
     - Background image links

2. Music file:
   - Put your song at `assets/music.mp3` or change `resources.musicSrc` in `config.js`.

3. Browser autoplay behavior:
   - The page attempts autoplay on load.
   - If a browser blocks autoplay, music starts on the first user interaction.

## Host on GitHub Pages

1. Create a new GitHub repository.
2. Upload all project files.
3. Go to `Settings` -> `Pages`.
4. Under `Build and deployment`:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main` (or `master`) and `/root`
5. Save, then wait ~1 minute.
6. GitHub gives you a public link like:
   - `https://your-username.github.io/your-repo-name/`

Share that URL with your guests.
