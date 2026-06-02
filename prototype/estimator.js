/* ============================================================
   LUSTIQUE CO. — live estimator + map-pin travel calculator
   Client-side. Pricing from PRICING.md. Exact venue location via
   a draggable Leaflet pin → OSRM driving distance from the studio.
   (Free/keyless in prototype; production swaps to Google Maps.)
   ============================================================ */

const PRICING = {
  brideCore: { short: 2690, medium: 2890, long: 3090, xlong: 3290 },
  makeup: { bridesmaid: 550, mother: 500, guest: 550, fgUnder: 250, fgOver: 500 },
  hairAdult: { short: 395, medium: 495, long: 595, xlong: 695 },
  hairFgUnder: { short: 200, medium: 250, long: 300, xlong: 400 },
  assistantTiers: [ { min: 13, fee: 2550 }, { min: 9, fee: 1700 }, { min: 5, fee: 850 } ],
  travel: { studio: 0, mid: 700, far: 1200, veryfar: 1900, destination: null },
};

const STUDIO = { lat: -25.7986, lng: 28.3127 }; // 242 Frangipani St, La Montagne, Pretoria (approx)
const RATE_PER_KM = 7, FREE_KM = 30, DEST_KM = 200;

let travelOverride = null; // { km, cost, destination }
let map, marker;

const $ = (id) => document.getElementById(id);
const n = (id) => { const e = $(id); return e ? (parseInt(e.value, 10) || 0) : 0; };
const v = (id, d = "") => { const e = $(id); return e ? e.value : d; };
const rand = (x) => x.toLocaleString("en-ZA").replace(/,/g, " ");
const travelForKm = (km) => (km <= FREE_KM ? 0 : Math.round(km * 2 * RATE_PER_KM));
const setBand = (show) => { const w = $("bandWrap"); if (w) w.style.display = show ? "" : "none"; };

// non-wedding occasions — per-person base prices (from PRICING.md §6)
const EVENT_BASE = { matric: 750, editorial: 750, engagement: 650, corporate: 650, pageant: 950, lessons: 600 };

function currentTravel() {
  if (travelOverride) return { cost: travelOverride.destination ? 0 : travelOverride.cost, destination: travelOverride.destination };
  const t = PRICING.travel[v("travelBand", "studio")];
  return { cost: t === null ? 0 : (t || 0), destination: t === null };
}

function computeEstimate() {
  const occasion = v("occasion", "wedding");
  const pl = v("partyHairLen", "medium");
  const trav = currentTravel();

  // Non-wedding occasions — simpler per-person event pricing
  if (occasion !== "wedding") {
    const base = EVENT_BASE[occasion] || 750;
    const faces = 1 + n("bmMakeup") + n("momMakeup") + n("fgMakeup") + n("guestMakeup");
    const hairCount = n("bmHair") + n("momHair") + n("fgHair") + n("guestHair");
    let total = base * Math.max(1, faces) + hairCount * (PRICING.hairAdult[pl] || PRICING.hairAdult.medium);
    if (!trav.destination) total += trav.cost;
    return { total, heads: Math.max(1, faces), destination: trav.destination, occasion };
  }

  // Wedding — full bridal logic
  const bl = v("brideHairLen", "medium");
  const people = [];
  let total = PRICING.brideCore[bl] || PRICING.brideCore.medium;
  people.push(total);

  const addRole = (mk, hr, mkPrice, hrTable, len) => {
    const heads = Math.max(mk, hr);
    for (let i = 0; i < heads; i++) {
      let c = 0;
      if (i < mk) c += mkPrice;
      if (i < hr) c += hrTable[len] || hrTable.medium;
      total += c;
      if (c > 0) people.push(c);
    }
    return heads;
  };

  let heads = 1;
  heads += addRole(n("bmMakeup"), n("bmHair"), PRICING.makeup.bridesmaid, PRICING.hairAdult, pl);
  heads += addRole(n("momMakeup"), n("momHair"), PRICING.makeup.mother, PRICING.hairAdult, pl);
  heads += addRole(n("guestMakeup"), n("guestHair"), PRICING.makeup.guest, PRICING.hairAdult, pl);
  const fgUnder = v("fgAge", "under") === "under";
  heads += addRole(n("fgMakeup"), n("fgHair"), fgUnder ? PRICING.makeup.fgUnder : PRICING.makeup.fgOver, fgUnder ? PRICING.hairFgUnder : PRICING.hairAdult, pl);

  for (const t of PRICING.assistantTiers) { if (heads >= t.min) { total += t.fee; break; } }
  if (!trav.destination) total += trav.cost;

  const promoOn = $("promoToggle") ? $("promoToggle").checked : true;
  if (promoOn && people.length >= 4) total -= Math.min(...people.filter((c) => c > 0));

  return { total, heads, destination: trav.destination, occasion: "wedding" };
}

function renderEstimate() {
  const out = $("estimateAmount");
  if (!out) return;
  const r = computeEstimate();
  out.textContent = r.destination ? "Destination — we'll tailor it" : "from R " + rand(r.total);
  const sub = $("estimateSub");
  if (sub) {
    if (r.destination) sub.textContent = "Over 200 km — we'll send a personalised destination quote";
    else if (r.occasion && r.occasion !== "wedding") sub.textContent = `${r.heads} ${r.heads === 1 ? "face" : "faces"} · approximate event estimate`;
    else sub.textContent = `${r.heads} ${r.heads === 1 ? "look" : "looks"} · incl. trial & touch-ups`;
  }
}

// route studio → (lat,lng), update travel + UI
function routeFrom(lat, lng) {
  const res = $("travelResult");
  if (res) res.textContent = "Measuring the drive from our studio…";
  fetch(`https://router.project-osrm.org/route/v1/driving/${STUDIO.lng},${STUDIO.lat};${lng},${lat}?overview=false`)
    .then((r) => r.json())
    .then((r) => {
      const m = r.routes && r.routes[0] && r.routes[0].distance;
      if (m == null) throw new Error("no route");
      const km = Math.round(m / 1000);
      const destination = km > DEST_KM;
      travelOverride = { km, cost: destination ? 0 : travelForKm(km), destination };
      if (res) {
        if (destination) res.textContent = `📍 ≈ ${km} km away — a destination wedding. We’ll tailor travel + accommodation in your quote.`;
        else if (km <= FREE_KM) res.textContent = `📍 ≈ ${km} km from our studio — travel is free (within 30 km). ✓`;
        else res.textContent = `📍 ≈ ${km} km from our studio — travel ≈ R ${rand(travelOverride.cost)} round trip. ✓`;
      }
      setBand(false);
      renderEstimate();
    })
    .catch(() => {
      travelOverride = null;
      if (res) res.textContent = "Couldn’t calculate that route — pick a distance band below and we’ll confirm personally.";
      setBand(true);
      renderEstimate();
    });
}

function initMap(center) {
  const el = $("venueMap");
  if (!el || typeof L === "undefined") return false;
  el.style.display = "block";
  const hint = $("mapHint"); if (hint) hint.style.display = "block";
  if (!map) {
    map = L.map(el).setView([center.lat, center.lng], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(map);
    marker = L.marker([center.lat, center.lng], { draggable: true }).addTo(map);
    marker.on("dragend", () => { const p = marker.getLatLng(); routeFrom(p.lat, p.lng); });
  } else {
    map.setView([center.lat, center.lng], 11);
    marker.setLatLng([center.lat, center.lng]);
  }
  setTimeout(() => map.invalidateSize(), 250);
  return true;
}

async function lookupTravel() {
  const town = v("townInput").trim();
  const res = $("travelResult");
  if (!town) { if (res) res.textContent = "Add your town or area above, then we’ll show it on the map."; return; }
  if (res) res.textContent = "Finding your location…";
  const prov = v("provinceInput");
  const q = town + (prov && prov.indexOf("Other") === -1 ? ", " + prov : "") + ", South Africa";
  try {
    const g = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=1&lat=${STUDIO.lat}&lon=${STUDIO.lng}&lang=en`).then((r) => r.json());
    const f = g.features && g.features[0];
    if (!f) throw new Error("no geocode");
    const c = f.geometry.coordinates;
    const center = { lat: c[1], lng: c[0] };
    initMap(center);
    routeFrom(center.lat, center.lng);
  } catch (e) {
    travelOverride = null;
    if (res) res.textContent = "We couldn’t pin that automatically — pick a distance band below and we’ll confirm travel personally.";
    setBand(true);
    renderEstimate();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quoteForm");
  if (!form) return;
  form.addEventListener("input", renderEstimate);
  form.addEventListener("change", renderEstimate);
  const btn = $("checkTravel");
  if (btn) btn.addEventListener("click", lookupTravel);
  renderEstimate();
});
