# Portfolio — Taoufik Kassabi

E-learning and web projects. Plain HTML, CSS and JavaScript: no build step, runs on any static host.

## Structure

```
index.html            Hub page (links to every project)
cv/                   Public CV (PDF). The original stays in private/
assets/               Shared site.css and site.js (theme toggle, tabs), self-hosted fonts
labsoft/              LabSoft case study, with screenshots in img/
articles/             PDFs of my articles that aren't hosted elsewhere
verb-master/          Irregular verbs quiz (JS), with its course documents in docs/
dykyp/                Page for the Spotify game (DYKYP): demo, download, how to use it
```

Not published (git-ignored): `private/` (CV and personal files).

The Spotify game's source is a separate repo, [Kassabiii/DYKYP](https://github.com/Kassabiii/DYKYP),
kept next to this folder (`Desktop/DYKYP`), not inside it.

## Run locally

Any static server from this folder, for example:

```
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Updating the Spotify game download

After committing changes in the DYKYP repo, rebuild the zip from that folder:

```
git archive --format=zip --prefix=DYKYP/ -o ../portfolio/dykyp/DYKYP.zip HEAD
```

`git archive` only packs committed files, so `node_modules`, `dist` and `.env.local` never end up in it.
