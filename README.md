# jacky-ui

Vue 3 components shared by the apps (fulfill, adhd-todo, the accounts dashboard). Source-only: there is no build
step, the consuming app's Vite compiles the `.vue` files.

| Export | What |
|---|---|
| `Avatar` | round profile picture, or initials on a colour from the name. Prop `profile` = `{ name, avatarUrl }` (what the accounts API returns) |
| `TagChip` | two-part chip `baking │ sourdough`. Prop `tag` = `{ tag, detail }`, optional `removable` |
| `DayView` | day calendar: drag to reschedule, create, select. Props `events`, `initialDay`, `initialSelected`; emits `update`, `create`, `delete`, `day-change`. Slot `panel` replaces the side panel (Fulfill uses it for live editing) |
| `EventList` | the planned-events list, upcoming first, with date ranges; emits `open(date, id)` and `create` |
| `Heading` | heading with an optional picture before it: `<Heading emote="<BetterTTV id>">Steps</Heading>`, or `image="<url>"`. Props `tag` (default `h3`), `size` (picture height, px), `alt`. A picture that fails to load just disappears |
| `EventModal`, `BasicEventPanel`, `IncrementDecrement` | the create dialog, the default side panel and the duration stepper |
| `bttvEmote(id, scale)` | image URL of a BetterTTV emote (see below) |
| `formatRange`, `formatDuration`, `toYmd`, `fromYmd`, `sameDay`, `colors`, `DEFAULT_TYPE` | helpers |

An event is `{ id, title, description, type, start: Date, end: Date }`.

## BetterTTV emotes
Find one on https://betterttv.com/emotes/popular, open it, and copy the id from the address (`betterttv.com/emotes/<id>`, 24 hex
characters). Pass that to `Heading`'s `emote` prop. The pictures load from BetterTTV's public CDN
(`cdn.betterttv.net/emote/<id>/2x.webp`), so there is nothing to sign up for or host. Emotes are made by other people: stay
with personal or small-scale use, and expect an emote to vanish if its owner removes it (the heading then shows without it).
BetterTTV's search API answers scripts with "unauthorized", so ids are picked by hand on the site rather than looked up in code.

## Using it in an app
1. `package.json`: `"jacky-ui": "https://github.com/jackymayo/jacky-ui/archive/refs/tags/v0.2.0.tar.gz"` (pin a tag; bump it
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
