// Single source of truth for the nine Lustique artists + the portfolio gallery.
// Both the Team page and the Portfolio filter read from here, so the artist
// names on the filter chips can never drift from the Team page.
//
// This maps 1:1 onto the future Sanity `team` + `galleries` schemas (TODO Tier 2):
// when the Studio is live, each array below is replaced by a Sanity query and
// nothing else in the components has to change. `id` is the stable join key —
// the gallery filter value today, the Sanity document ref tomorrow.

export type Artist = {
  id: string;    // stable slug — filter key now, Sanity _id ref later (no accents)
  name: string;  // display name (accents intact)
  role: string;
  blurb: string; // short bio — placeholder until Zandeline writes the nine
};

// Order = how they appear on the Team page and in the filter row (founder first).
export const ARTISTS: Artist[] = [
  { id: "zandeline", name: "Zandeline", role: "Founder",       blurb: "A bridal artist since 2018 — Lustique Co. began with her." },
  { id: "monique",   name: "Monique",   role: "Bridal Artist", blurb: "Bridal-specialised artist. A short bio is on the way." },
  { id: "marize",    name: "Marize",    role: "Bridal Artist", blurb: "Bridal-specialised artist. A short bio is on the way." },
  { id: "jana",      name: "Jana",      role: "Bridal Artist", blurb: "Bridal-specialised artist. A short bio is on the way." },
  { id: "janeke",    name: "Janeke",    role: "Bridal Artist", blurb: "Bridal-specialised artist. A short bio is on the way." },
  { id: "elria",     name: "Elria",     role: "Bridal Artist", blurb: "Bridal-specialised artist. A short bio is on the way." },
  { id: "marone",    name: "Maroné",    role: "Bridal Artist", blurb: "Bridal-specialised artist. A short bio is on the way." },
  { id: "rene",      name: "René",      role: "Bridal Artist", blurb: "Bridal-specialised artist. A short bio is on the way." },
  { id: "samantha",  name: "Samantha",  role: "Bridal Artist", blurb: "Bridal-specialised artist. A short bio is on the way." },
];

// Category vocabulary (derived from the real work, not invented). The filter
// engine in site.js already supports a category row too — kept here so adding
// that row later is a markup-only change.
export type GalleryCat = "makeup" | "hair" | "party";
export const CATEGORIES: { id: GalleryCat; label: string }[] = [
  { id: "makeup", label: "Makeup" },
  { id: "hair",   label: "Hair" },
  { id: "party",  label: "Bridal Party" },
];

export type GalleryImage = {
  src: string;       // path under /assets (no leading slash — matches existing links)
  alt: string;
  cat: GalleryCat;
  artist: string;    // Artist.id of whoever created this look
};

// Every image below is Zandeline's own work (confirmed by the studio). As each
// of the other artists shares hers, add her images here with her `artist` id and
// her chip lights up automatically — no code change needed.
const ALT = {
  makeup: "Bridal makeup — Lustique Co., Pretoria",
  hair:   "Bridal hair — Lustique Co., Pretoria",
  party:  "Bridal party hair & makeup — Lustique Co., Pretoria",
} as const;

export const GALLERY: GalleryImage[] = [
  { src: "assets/hero.jpg", alt: ALT.makeup, cat: "makeup", artist: "zandeline" },
  { src: "assets/s2.jpg",   alt: ALT.hair,   cat: "hair",   artist: "zandeline" },
  { src: "assets/t1.jpg",   alt: ALT.makeup, cat: "makeup", artist: "zandeline" },
  { src: "assets/res.jpg",  alt: ALT.party,  cat: "party",  artist: "zandeline" },
  { src: "assets/s1.jpg",   alt: ALT.makeup, cat: "makeup", artist: "zandeline" },
  { src: "assets/t3.jpg",   alt: ALT.hair,   cat: "hair",   artist: "zandeline" },
  { src: "assets/s3.jpg",   alt: ALT.party,  cat: "party",  artist: "zandeline" },
  { src: "assets/t2.jpg",   alt: ALT.makeup, cat: "makeup", artist: "zandeline" },
  { src: "assets/t4.jpg",   alt: ALT.hair,   cat: "hair",   artist: "zandeline" },
  { src: "assets/g10.jpg",  alt: ALT.party,  cat: "party",  artist: "zandeline" },
  { src: "assets/g11.jpg",  alt: ALT.makeup, cat: "makeup", artist: "zandeline" },
  { src: "assets/g12.jpg",  alt: ALT.hair,   cat: "hair",   artist: "zandeline" },
  { src: "assets/g13.jpg",  alt: ALT.party,  cat: "party",  artist: "zandeline" },
  { src: "assets/g14.jpg",  alt: ALT.makeup, cat: "makeup", artist: "zandeline" },
  { src: "assets/g15.jpg",  alt: ALT.hair,   cat: "hair",   artist: "zandeline" },
];

// Count of live images per artist — lets the Portfolio page render every artist's
// chip while knowing which ones have work yet (the rest show a friendly
// "coming soon" panel rather than a blank gallery).
export const imageCountByArtist: Record<string, number> = ARTISTS.reduce((acc, a) => {
  acc[a.id] = GALLERY.filter((g) => g.artist === a.id).length;
  return acc;
}, {} as Record<string, number>);
