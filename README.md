# jacky-ui

Vue 3 components shared by the apps (fulfill, adhd-todo, the accounts dashboard). Source-only: there is no build
step, the consuming app's Vite compiles the `.vue` files.

| Export | What |
|---|---|
| `Avatar` | round profile picture, or initials on a colour from the name. Prop `profile` = `{ name, avatarUrl }` (what the accounts API returns) |
| `TagChip` | two-part chip `baking │ sourdough`. Prop `tag` = `{ tag, detail }`, optional `removable` |
| `DayView` | day calendar: drag to reschedule, create, select. Props `events`, `initialDay`, `initialSelected`; emits `update`, `create`, `delete`, `day-change`. Slot `panel` replaces the side panel (Fulfill uses it for live editing) |
| `EventList` | the planned-events list, upcoming first, with date ranges; emits `open(date, id)` and `create` |
| `Heading` | heading with an optional picture before it: `<Heading emote="breakdance">Steps</Heading>` (a name from the `emotes` dictionary), or `image="<url>"`. Props `tag` (default `h3`), `size` (picture height, px), `alt`. A picture that fails to load just disappears |
| `EventModal`, `BasicEventPanel`, `IncrementDecrement` | the create dialog, the default side panel and the duration stepper |
| `emotes`, `registerEmotes(obj)`, `bttvEmote(name, scale)` | the emote dictionary (name → BetterTTV id), adding names at runtime, and an emote's image URL (see below) |
| `formatRange`, `formatDuration`, `toYmd`, `fromYmd`, `sameDay`, `colors`, `DEFAULT_TYPE` | helpers |

An event is `{ id, title, description, type, start: Date, end: Date }`.

## BetterTTV emotes
Headings pick an emote by **name** from one dictionary, `emotes` in `src/emotes.js`, so each emote's id is written once and shared by
every app. To add one: find it on https://betterttv.com/emotes/popular, open it, copy the id from the address
(`betterttv.com/emotes/<id>`, 24 hex characters) and add `name: 'id'` to the dictionary. Then release (below) and bump the tag in the
apps. While trying one out you can skip the release: `registerEmotes({ breakdance: '<id>' })` in the app's `main.js`.
An unknown name shows the heading without a picture and logs which name was missing.

The pictures load from BetterTTV's public CDN (`cdn.betterttv.net/emote/<id>/2x.webp`), so there is nothing to sign up for or host.
Emotes are made by other people: stay with personal or small-scale use, and expect an emote to vanish if its owner removes it.
BetterTTV's search API answers scripts with "unauthorized", so ids are picked by hand on the site rather than looked up in code.

## Using it in an app
1. `package.json`: `"jacky-ui": "https://github.com/jackymayo/jacky-ui/archive/refs/tags/v0.2.1.tar.gz"` (pin a tag; bump it
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
