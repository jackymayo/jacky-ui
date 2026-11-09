# jacky-ui

Vue 3 components shared by the apps (fulfill, adhd-todo, the accounts dashboard). Source-only: there is no build
step, the consuming app's Vite compiles the `.vue` files.

| Export | What |
|---|---|
| `Avatar` | round profile picture, or initials on a colour from the name. Prop `profile` = `{ name, avatarUrl }` (what the accounts API returns) |
| `TagChip` | two-part chip `baking │ sourdough`. Prop `tag` = `{ tag, detail }`, optional `removable` |
| `DayView` | day calendar: drag to reschedule, create, select. Props `events`, `initialDay`, `initialSelected`; emits `update`, `create`, `delete`, `day-change`. Slot `panel` replaces the side panel (Fulfill uses it for live editing) |
| `EventList` | the planned-events list, upcoming first, with date ranges; emits `open(date, id)` and `create` |
| `Heading` | heading with an optional icon before it: `<Heading icon="…">Steps</Heading>`. `icon` is a picture URL, `"fa:<name>"` (a Font Awesome icon the app registered), `"ttv:<name>"` (a Twitch emote, below) or plain text such as an emoji. Props `tag` (default `h3`), `size` (icon height, px), `alt`. An icon that fails to load just disappears |
| `EventModal`, `BasicEventPanel`, `IncrementDecrement` | the create dialog, the default side panel and the duration stepper |
| `ttv(name)`, `loadEmotes(accountsUrl)` | the image link of a Twitch emote from the shared dictionary; the Navbar loads the dictionary for you |
| `registerIcons({ name: faIconDefinition })` | lets `Heading` draw `fa:name` icons; the package bundles no Font Awesome of its own |
| `formatRange`, `formatDuration`, `toYmd`, `fromYmd`, `sameDay`, `colors`, `DEFAULT_TYPE` | helpers |

An event is `{ id, title, description, type, start: Date, end: Date }`.

## Icons and Twitch emotes
`Heading`'s `icon` is one string. A URL (`https://…`, `/pic.png`, `data:image/…`) is shown as a picture, `fa:phone` as a Font Awesome icon
(register the definitions you use once, e.g. in `main.js`: `registerIcons({ phone: faPhone })`), `ttv:hamdance` as a Twitch emote, anything
else as text. `ttv('hamdance')` gives the same link as a string, for `:icon="ttv('hamdance')"` or an `<img>`.

The emote dictionary is **not in this package** (it is public): it is a private file in the server repo, served by the accounts service to
logged-in users. The Navbar fetches it, so any app with a Navbar can use `ttv:` names. Keep private links out of here.

## Using it in an app
1. `package.json`: `"jacky-ui": "https://github.com/jackymayo/jacky-ui/archive/refs/tags/v0.4.0.tar.gz"` (pin a tag; bump it
   to take updates). The tarball form needs no `git` in the Docker build image, unlike `github:jackymayo/jacky-ui#tag`.
2. `style.css`, so Tailwind generates the package's classes:
   ```css
   @import "tailwindcss";
   @source "../node_modules/jacky-ui/src";
   ```
3. `import { DayView, Avatar } from 'jacky-ui'`

## Changing it
Edit here, tag a release (`git tag v0.2.0 && git push --tags`), then bump the tag in each app. For local work on both
at once use `npm link` or temporarily `"jacky-ui": "file:../jacky-ui"`. Never commit the `file:` form: the apps' CI
builds cannot see sibling folders.
