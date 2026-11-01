/* ============================================================
   SHOP DETAILS: edit these to match the real business.
   ============================================================ */
const SHOP = {
  phone: "(724) 555-0123",          // PLACEHOLDER: replace with real number
  email: "service@example.com",     // PLACEHOLDER: where service requests go
  address: "Street address here",   // PLACEHOLDER
  city: "Grove City, PA 16127",
  mapQuery: "Grove City, PA 16127", // change to full street address once known
  // 24h times; null = closed. Index 0 = Sunday.
  hours: [
    null,
    ["08:00", "17:00"],
    ["08:00", "17:00"],
    ["08:00", "17:00"],
    ["08:00", "17:00"],
    ["08:00", "17:00"],
    null,
  ],
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* Fill in shop details */
const telHref = "tel:" + SHOP.phone.replace(/[^\d+]/g, "");
$$("[data-phone]").forEach(el => (el.textContent = SHOP.phone));
$$("[data-phone-link]").forEach(el => (el.href = telHref));
$$("[data-address-line]").forEach(el => (el.textContent = SHOP.address));
$$("[data-city-line]").forEach(el => (el.textContent = SHOP.city));
$$("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));
$("[data-map]").src = "https://www.google.com/maps?q=" + encodeURIComponent(SHOP.mapQuery) + "&output=embed";

/* Hours table + open/closed badge */
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const fmt = t => {
  const [h, m] = t.split(":").map(Number);
  const hh = ((h + 11) % 12) + 1;
  return (m ? `${hh}:${String(m).padStart(2, "0")}` : `${hh}`) + (h >= 12 ? "pm" : "am");
};
const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };

(function hours() {
  const now = new Date();
  const today = now.getDay();
  const tbody = $("[data-hours]");
  [1, 2, 3, 4, 5, 6, 0].forEach(d => {
    const h = SHOP.hours[d];
    const tr = document.createElement("tr");
    if (d === today) tr.className = "today";
    tr.innerHTML = `<td>${DAYS[d]}</td><td>${h ? fmt(h[0]) + "–" + fmt(h[1]) : "Closed"}</td>`;
    tbody.appendChild(tr);
  });

  const status = $("[data-status]");
  const text = $("[data-status-text]");
  const mins = now.getHours() * 60 + now.getMinutes();
  const h = SHOP.hours[today];
  if (h && mins >= toMin(h[0]) && mins < toMin(h[1])) {
    status.classList.add("is-open");
    text.textContent = `Open now until ${fmt(h[1])}`;
    return;
  }
  status.classList.add("is-closed");
  for (let i = 0; i < 8; i++) {
    const d = (today + i) % 7;
    const hh = SHOP.hours[d];
    if (!hh || (i === 0 && mins >= toMin(hh[0]))) continue;
    const when = i === 0 ? "today" : i === 1 ? "tomorrow" : DAYS[d];
    text.textContent = `Closed now. Opens ${when} at ${fmt(hh[0])}`;
    break;
  }
})();

/* Service request form: opens the customer's email app pre-filled */
const form = $("[data-request]");
form.addEventListener("submit", e => {
  e.preventDefault();
  const err = $(".form-error", form);
  const bad = $$("[required]", form).filter(el => !el.value.trim());
  $$("[required]", form).forEach(el => el.setAttribute("aria-invalid", bad.includes(el)));
  if (bad.length) { err.hidden = false; bad[0].focus(); return; }
  err.hidden = true;

  const f = new FormData(form);
  const body = `Name: ${f.get("name")}\nPhone: ${f.get("phone")}\nVehicle: ${f.get("vehicle")}\n\n${f.get("notes")}`;
  const subject = `Service request: ${f.get("vehicle")}`;
  window.location.href = `mailto:${SHOP.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const done = $(".form-done", form);
  done.hidden = false; done.focus();
});
$$("input, textarea", form).forEach(el => el.addEventListener("input", () => el.removeAttribute("aria-invalid")));
