/* ============================================================
   LUSTIQUE CO. — live estimator + map-pin travel calculator (client)
   Pricing imported from @lustique/pricing — one source of truth,
   shared with the future Worker. Map uses free Photon/OSRM.
   ============================================================ */
import {
  computeEstimate, travelForKm, DEST_KM,
  type EstimateInput, type HairLength, type Occasion, type TravelBand,
} from "@lustique/pricing";

declare const L: any; // Leaflet global (loaded via the CDN <script> on the quote page)

const STUDIO = { lat: -25.7986, lng: 28.3127 }; // 242 Frangipani St, La Montagne (approx)
const FREE_KM = 30;

let travelOverride: { km: number; cost: number; destination: boolean } | null = null;
let map: any, marker: any;

const el = (id: string) => document.getElementById(id);
const fld = (id: string) => document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
const num = (id: string) => { const e = fld(id); return e ? (parseInt(e.value, 10) || 0) : 0; };
const val = (id: string, d = "") => { const e = fld(id); return e ? e.value : d; };
const rand = (x: number) => x.toLocaleString("en-ZA").replace(/,/g, " ");
const setBand = (show: boolean) => { const w = el("bandWrap"); if (w) w.style.display = show ? "" : "none"; };

function readInput(): EstimateInput {
  return {
    occasion: val("occasion", "wedding") as Occasion,
    brideHairLen: val("brideHairLen", "medium") as HairLength,
    partyHairLen: val("partyHairLen", "medium") as HairLength,
    bmMakeup: num("bmMakeup"), bmHair: num("bmHair"),
    momMakeup: num("momMakeup"), momHair: num("momHair"),
    fgAge: val("fgAge", "under") === "under" ? "under" : "over",
    fgMakeup: num("fgMakeup"), fgHair: num("fgHair"),
    guestMakeup: num("guestMakeup"), guestHair: num("guestHair"),
    promoOn: (el("promoToggle") as HTMLInputElement | null)?.checked ?? true,
    travel: travelOverride
      ? { cost: travelOverride.cost, destination: travelOverride.destination }
      : { band: val("travelBand", "studio") as TravelBand },
  };
}

function renderEstimate() {
  const out = el("estimateAmount");
  if (!out) return;
  const r = computeEstimate(readInput());
  out.textContent = r.destination ? "Destination — we’ll tailor it" : "from R " + rand(r.total);
  const sub = el("estimateSub");
  if (sub) {
    if (r.destination) sub.textContent = "Over 200 km — we’ll send a personalised destination quote";
    else if (r.occasion !== "wedding") sub.textContent = `${r.heads} ${r.heads === 1 ? "face" : "faces"} · approximate event estimate`;
    else sub.textContent = `${r.heads} ${r.heads === 1 ? "look" : "looks"} · incl. trial & touch-ups`;
  }
}

function routeFrom(lat: number, lng: number) {
  const res = el("travelResult");
  if (res) res.textContent = "Measuring the drive from our studio…";
  fetch(`https://router.project-osrm.org/route/v1/driving/${STUDIO.lng},${STUDIO.lat};${lng},${lat}?overview=false`)
    .then((r) => r.json())
    .then((r: any) => {
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

function initMap(center: { lat: number; lng: number }) {
  const node = el("venueMap");
  if (!node || typeof L === "undefined") return false;
  node.style.display = "block";
  const hint = el("mapHint"); if (hint) hint.style.display = "block";
  if (!map) {
    map = L.map(node).setView([center.lat, center.lng], 11);
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
  const town = val("townInput").trim();
  const res = el("travelResult");
  if (!town) { if (res) res.textContent = "Add your town or area above, then we’ll show it on the map."; return; }
  if (res) res.textContent = "Finding your location…";
  const prov = val("provinceInput");
  const q = town + (prov && prov.indexOf("Other") === -1 ? ", " + prov : "") + ", South Africa";
  try {
    const g = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=1&lat=${STUDIO.lat}&lon=${STUDIO.lng}&lang=en`).then((r) => r.json());
    const f = g.features && g.features[0];
    if (!f) throw new Error("no geocode");
    const c = f.geometry.coordinates;
    const center = { lat: c[1], lng: c[0] };
    initMap(center);
    routeFrom(center.lat, center.lng);
  } catch {
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
  const btn = el("checkTravel");
  if (btn) btn.addEventListener("click", lookupTravel);
  renderEstimate();
});
