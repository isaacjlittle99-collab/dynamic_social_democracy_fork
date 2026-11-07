# Thunderous Applause: An Alternate History of the Galactic Republic

A political strategy game set in the Star Wars prequel era, built on Autumn Chen's
[*Social Democracy: An Alternate History*](https://github.com/aucchen/social_democracy) and its
*Dynamic Social Democracy* fork.

You lead the **Ruusan Caucus**, a bloc of reform-minded senators (Bail Organa, Mon Mothma, Padmé
Amidala, Garm Bel Iblis, Onaconda Farr), from 33 BBY to 19 BBY. History says the Republic will vote
itself into an Empire, with thunderous applause. Try to stop it, and to leave the Republic stronger
than you found it.

*Unofficial, non-commercial fan work. Star Wars is the property of Lucasfilm Ltd. No Lucasfilm
artwork, music or footage is included; all images are original abstract art.*

## How it plays

- **Turns** are quarters of a year: half-years in the quiet 31–25 BBY stretch, months during the
  Naboo and Geonosis crises, and days in the final act. Each turn you play one card from a hand of three.
- **Decks:**
  - *Caucus Affairs*: your bloc's own work: campaigns, media, investigations, the Jedi, the Rim, the Defence Pact.
  - *Senate Affairs*: unlocked by joining the government or chairing committees: laws, reforms, diplomacy and clone oversight.
  - *The Last Days*: the finale.
- **Advisors** are pinned cards that share one action every few turns.
- **The Senate** is made of blocs whose strength comes from regional support, recalculated every year.
  The Supreme Chancellor is elected by coalition, and can be brought down by a vote of no confidence.
- **The Republic fights back, and so does the Sith Lord.** The Senate bureaucracy (*"the true rulers of the Republic"*)
  turns on a Caucus that governs with reformers or succeeds too well; a hidden hand answers every success with a
  scheme; the Vice Chair buries bills and bought delegations follow the Chancellery's line. The Clone Wars come in
  almost every game. Endings must be earned, and the game can be lost early.
- **Leaders change with the times.** Every Senate bloc and every faction of the Caucus has a leader.
  A neglected Rim turns to radicals, a frightened Senate to hardliners, and a satisfied faction to pragmatists.
  Leaders decide how firmly a group holds its line, how it votes, whom it will govern with and, inside the Caucus,
  what a faction demands and how soon it breaks away. You can stay out of leadership fights or try to tip them.
- **The threat** is mostly hidden. Corruption, fear and emergency powers feed the Sith Lord's plan.
  Evidence, Senate resolve and structural safeguards work against it.

### Routes to victory, and their pitfalls

- Deny Palpatine the Chancellery.
- Clean up the Senate.
- Heal the Outer Rim.
- Unmask the Sith with evidence, a warrant and a lawful arrest.
- Bind the emergency powers with sunset clauses and term limits.
- Win the peace.
- Prepare loyal forces.
- Save Anakin Skywalker.
- Take the Chancellery yourself.

Each route has its own risks.

### Ten endings

- **The Republic Reborn**, with three variants.
- **The Republic Endures**
- **Victory in Blood**
- **The Galaxy Divided**
- **The Jedi Protectorate**
- **The Admirals' Republic**
- **The Hollow Crown**
- **Confederacy Triumphant**
- **A Republic Dissolved**
- **The Galactic Empire**

Legacy cards and achievements are shown at the end of every game.

## Install on Windows (one click to start)

The game can be installed from its website as an app. It gets its own Start-menu entry and
desktop icon, opens in its own window, and works offline. Saves are kept.

1. Open the game's site in **Microsoft Edge** or **Google Chrome**:
   <https://isaacjlittle99-collab.github.io/Thunderous_Applause_An_Alternate_History_of_the_Galactic_Republic/>
2. Click **Install game** in the links at the top of the page, then **Install**. Alternatively, click
   the install icon at the right of the address bar.
3. Optional: right-click the new **Thunderous Applause** icon in the Start menu and choose **Pin to taskbar**.

To remove it, right-click the icon and choose **Uninstall**.

If you installed the game before the repository was renamed (from the old
`.../dynamic_social_democracy_fork/` address), that copy no longer receives updates. Uninstall it and
install again from the address above. Your saves and achievements carry over.

**One-time GitHub setup** (needed before the site exists):

1. Open the fork's **Actions** tab and enable workflows.
2. Under **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Run the **Deploy static content to Pages** workflow, or push to `main`.

## Using your own art

Every image in the game is a named slot: the background (`bg_galaxy`), the decks (`deck_caucus`, `deck_senate`,
`deck_last_days`), the advisors (`adv_valorum`, `adv_farr` and so on), the cards (`card_jedi`, `card_rim` and so on) and
the event pictures (`ev_senate`, `ev_war` and so on). The full list is in **Options → Custom art**, and the file names
in `out/html/img/` match the slot names.

There are two ways to replace them:

1. **For yourself:** in the game, open **Options → Custom art** and click **Choose…** under any slot. The image is
   kept in your browser only. It is never uploaded, and other players won't see it. **Reset** puts the original back.
2. **For everyone who plays your copy:** put image files in `out/html/img/custom/` and list them in
   `out/html/img/custom/art.json`, for example:

   ```json
   {"adv_valorum": "valorum.jpg", "bg_galaxy": "my-map.jpg"}
   ```

   These files are published with the website, so only add images you have the right to share.

Cards display at 4:5 (for example 240×300), event pictures at 5:6 (300×360), and the background is best at
1920×1200 or larger. A player's own choices take priority over the folder, and the folder over the game's own art.

## Building

1. Install dependencies, which include the [dendrynexus](https://github.com/originn0/dendrynexus) engine:

   ```bash
   npm install
   ```

2. Compile the game into `out/game.json` and `out/html/core.js`:

   ```bash
   npm run dendrynexus make-html
   ```

3. Open `out/html/index.html` in a browser. For the deployed site, CI also copies `out/game.json`
   into `out/html/`.

## Project layout

| Path | What it is |
|---|---|
| `source/scenes/root.scene.dry` | Start menu, difficulty, intro |
| `source/scenes/post_event.scene.dry` | Turn processor: advances time, then routes to events or the hand |
| `source/scenes/main.scene.dry` | The hand, decks and pinned advisor cards |
| `source/scenes/caucus_affairs/`, `senate_affairs/`, `last_days/`, `advisors/` | Cards |
| `source/scenes/events/act1` … `act4`, `recurring/`, `finale/` | Events |
| `source/scenes/ending_slides.scene.dry` | Epilogues, legacy cards and run summary |
| `source/scenes/library.scene.dry` | The Holocron (in-game encyclopedia) |
| `out/html/sw.js` | Simulation logic: calendar, Senate support and seats, votes, coalitions, drift, forces, ending router |
| `out/html/sw_ui.js` | Sidebar, chart and achievement HTML |
| `out/html/img/` | Original art: card emblems, event pictures and advisor portraits (`tools/gen_art.py`), and the galaxy map (`tools/gen_map.js`) |
| `out/html/img/custom/` | Optional custom art for the published site (see *Using your own art*) |
| `out/html/manifest.webmanifest`, `out/html/offline-worker.js`, `out/html/icons/` | Installable-app support; icons regenerated by `tools/gen_icons.js` |

Scene ids are file names, so every file name must be unique (prefixes such as `a1_`, `rec_`, `fin_` help).
Any new quality used in JavaScript arithmetic needs a default in `SW.DEFAULTS` (`out/html/sw.js`), and
any new `*_timer` must be listed in `SW.TIMERS`.

## Testing tools

Build first, then run the tools from the repository root.

1. Static checks: missing defaults, timers and suspicious names.

   ```bash
   node tools/check.js "$PWD"
   ```

2. Headless simulation: 200 seeded games with the `random` policy (`passive` and `reform` also exist).
   It reports the ending distribution, soft-locks, `NaN` qualities and swallowed script errors.

   ```bash
   node tools/sim.js "$PWD" 200 random 1
   ```

3. Browser smoke test with Playwright: plays 2 full games through the real UI and saves screenshots.

   ```bash
   node tools/smoke.js "$PWD" /tmp/shots 2
   ```

## Adding music

The game ships without music. To add your own (for example, public-domain recordings):

1. Put the files in `out/html/music/`.
2. Add a line such as `audio: shuffle music/track1.mp3 music/track2.mp3` to a scene, for example `@setup` in `root.scene.dry`.

## Credits

- Original game: Autumn Chen, *Social Democracy: An Alternate History* (MIT). Fork: originn0 and contributors.
- Engine: dendrynexus (after Dendry by Ian Millington).
- Libraries: jQuery, d3.js and d3-parliament.
- Star Wars setting: Lucasfilm. Canon first, with Legends for the gaps. See the in-game Credits and the Holocron for details.
