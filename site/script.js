/* ============================================================
   SHOP DETAILS — edit these to match the real business.
   Everything on the page (phone, address, hours, map, prices)
   is filled in from this block.
   ============================================================ */
const SHOP = {
  phone: "(724) 555-0123",          // PLACEHOLDER — replace with real number
  email: "service@example.com",     // PLACEHOLDER — where booking requests go
  address: "Street address here",   // PLACEHOLDER
  city: "Grove City, PA 16127",
  mapQuery: "Grove City, PA 16127", // change to full street address once known
  // 24h times; null = closed. Index 0 = Sunday.
  hours: [
    null,
    ["08:00", "17:30"],
    ["08:00", "17:30"],
    ["08:00", "17:30"],
    ["08:00", "17:30"],
    ["08:00", "17:30"],
    ["08:00", "12:00"],
  ],
};

const SERVICES = [
  { id: "oil", cat: "maintenance", name: "Oil & filter change", desc: "Conventional, blend or full synthetic. Includes fluid top-off and a tire pressure check.", time: "30 min", lo: 45, hi: 95 },
  { id: "inspection", cat: "inspection", name: "PA state inspection & emissions", desc: "Official Pennsylvania safety inspection with emissions where required.", time: "1 hr", lo: 55, hi: 85 },
  { id: "brakes", cat: "repair", name: "Brake pads & rotors", desc: "Per axle. We measure, photograph, and show you before replacing anything.", time: "1–2 hr", lo: 180, hi: 420 },
  { id: "diag", cat: "repair", name: "Check engine light diagnostics", desc: "Scan plus hands-on testing to find the actual cause, not just the code.", time: "1 hr", lo: 90, hi: 140 },
  { id: "tires", cat: "maintenance", name: "Tire rotation & balance", desc: "Rotate, balance and inspect all four. Mounting and new tires available.", time: "45 min", lo: 40, hi: 80 },
  { id: "align", cat: "maintenance", name: "Wheel alignment", desc: "Four-wheel alignment with before-and-after printout.", time: "1 hr", lo: 95, hi: 150 },
  { id: "battery", cat: "repair", name: "Battery test & replacement", desc: "Free load test. Replacement batteries ready for cold western PA mornings.", time: "30 min", lo: 140, hi: 260 },
  { id: "ac", cat: "repair", name: "A/C service & recharge", desc: "Leak check, evacuate and recharge to factory spec.", time: "1–2 hr", lo: 150, hi: 300 },
  { id: "susp", cat: "repair", name: "Suspension & steering", desc: "Shocks, struts, ball joints, tie rods. Pothole season specialists.", time: "2–4 hr", lo: 250, hi: 900 },
  { id: "exhaust", cat: "repair", name: "Exhaust & muffler", desc: "Pipes, hangers, mufflers and catalytic converters.", time: "1–3 hr", lo: 150, hi: 1200 },
  { id: "trans", cat: "maintenance", name: "Transmission fluid service", desc: "Drain-and-fill or flush, depending on what your manufacturer calls for.", time: "1 hr", lo: 120, hi: 260 },
  { id: "winter", cat: "inspection", name: "Winter readiness check", desc: "Battery, coolant, wipers, tires, belts and hoses before the snow flies.", time: "45 min", lo: 35, hi: 35 },
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = n => "$" + Math.round(n).toLocaleString();

/* ---------- Shop details ---------- */
const telHref = "tel:" + SHOP.phone.replace(/[^\d+]/g, "");
$$("[data-phone]").forEach(el => (el.textContent = SHOP.phone));
$$("[data-phone-link]").forEach(el => (el.href = telHref));
$$("[data-email]").forEach(el => (el.textContent = SHOP.email));
$$("[data-email-link]").forEach(el => (el.href = "mailto:" + SHOP.email));
$$("[data-address-line]").forEach(el => (el.textContent = SHOP.address));
$$("[data-city-line]").forEach(el => (el.textContent = SHOP.city));
$$("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));
$("[data-map]").src = "https://www.google.com/maps?q=" + encodeURIComponent(SHOP.mapQuery) + "&output=embed";

/* ---------- Hours + open-now status ---------- */
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const fmt = t => {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "pm" : "am";
  const hh = ((h + 11) % 12) + 1;
  return m ? `${hh}:${String(m).padStart(2, "0")}${ampm}` : `${hh}${ampm}`;
};
const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };

(function hours() {
  const now = new Date();
  const today = now.getDay();
  const tbody = $("[data-hours]");
  [1, 2, 3, 4, 5, 6, 0].forEach(d => {
    const tr = document.createElement("tr");
    if (d === today) tr.className = "today";
    const h = SHOP.hours[d];
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
  } else {
    status.classList.add("is-closed");
    for (let i = 0; i < 8; i++) {
      const d = (today + i) % 7;
      const hh = SHOP.hours[d];
      if (!hh) continue;
      if (i === 0 && mins >= toMin(hh[0])) continue;
      const when = i === 0 ? "today" : i === 1 ? "tomorrow" : DAYS[d];
      text.textContent = `Closed now. Opens ${when} at ${fmt(hh[0])}`;
      break;
    }
  }
})();

/* ---------- Service board ---------- */
const board = $("[data-board]");
function renderBoard(filter) {
  board.innerHTML = SERVICES.filter(s => filter === "all" || s.cat === filter)
    .map(s => `<li>
      <div><h3>${s.name}</h3><p>${s.desc}</p></div>
      <span class="time">${s.time}</span>
      <span class="price">${s.lo === s.hi ? money(s.lo) : "<small>from</small>" + money(s.lo)}</span>
    </li>`).join("");
}
renderBoard("all");
$$("[data-filter]").forEach(btn => btn.addEventListener("click", () => {
  $$("[data-filter]").forEach(b => b.setAttribute("aria-selected", b === btn));
  renderBoard(btn.dataset.filter);
}));

/* ---------- Booking form ---------- */
const select = $("[data-service-select]");
SERVICES.forEach(s => select.add(new Option(s.name, s.name)));
select.add(new Option("Something else / not sure", "Other"));

const ro = String(Date.now()).slice(-5);
$$("[data-ro]").forEach(el => (el.textContent = ro));

const dateInput = $("[data-date]");
const iso = d => d.toISOString().slice(0, 10);
const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
dateInput.min = iso(tomorrow);

const form = $("#book");
form.addEventListener("submit", e => {
  e.preventDefault();
  const err = $(".form-error", form);
  let firstBad = null;
  $$("[required]", form).forEach(el => {
    const bad = !el.value.trim();
    el.setAttribute("aria-invalid", bad);
    if (bad && !firstBad) firstBad = el;
  });
  if (!firstBad && dateInput.value) {
    const day = new Date(dateInput.value + "T12:00").getDay();
    if (!SHOP.hours[day]) {
      firstBad = dateInput;
      dateInput.setAttribute("aria-invalid", "true");
      err.textContent = "We're closed that day. Pick a Monday through Saturday.";
      err.hidden = false; firstBad.focus(); return;
    }
  }
  if (firstBad) {
    err.textContent = "Fill in the highlighted fields so we can call you back.";
    err.hidden = false; firstBad.focus(); return;
  }
  err.hidden = true;
  const f = new FormData(form);
  const body = [
    `Repair order #${ro}`,
    `Name: ${f.get("name")}`,
    `Phone: ${f.get("phone")}`,
    `Vehicle: ${f.get("year")} ${f.get("vehicle")}`.trim(),
    `Service: ${f.get("service")}`,
    `Preferred: ${f.get("date")}, ${f.get("time")}`,
    `Waiting at shop: ${f.get("wait") ? "Yes" : "No"}`,
    "", `Notes: ${f.get("notes") || "None"}`,
  ].join("\n");
  const subject = `Appointment request: ${f.get("service")} (${f.get("vehicle")})`;
  window.location.href = `mailto:${SHOP.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const c = $(".ticket-confirm", form);
  c.hidden = false; c.focus();
});
$$("input, select", form).forEach(el => el.addEventListener("input", () => el.removeAttribute("aria-invalid")));

/* ---------- Estimator ---------- */
const estList = $("[data-est-list]");
estList.innerHTML = SERVICES.map(s => `<label>
  <span><input type="checkbox" value="${s.id}"> ${s.name}</span>
  <span class="r">${s.lo === s.hi ? money(s.lo) : money(s.lo) + "–" + money(s.hi)}</span>
</label>`).join("");

function updateEstimate() {
  const mult = Number($("input[name=vt]:checked").value);
  const picked = $$("input:checked", estList).map(i => SERVICES.find(s => s.id === i.value));
  const lo = picked.reduce((a, s) => a + s.lo, 0) * mult;
  const hi = picked.reduce((a, s) => a + s.hi, 0) * mult;
  $("[data-est-range]").textContent = picked.length ? (lo === hi ? money(lo) : `${money(lo)}–${money(hi)}`) : "$0";
  $("[data-est-items]").textContent = picked.length
    ? `${picked.length} service${picked.length > 1 ? "s" : ""}: ${picked.map(s => s.name).join(", ")}. Parts and labor, before tax.`
    : "Nothing selected yet. Check a service to start.";
}
estList.addEventListener("change", updateEstimate);
$$("input[name=vt]").forEach(r => r.addEventListener("change", updateEstimate));
$("[data-est-book]").addEventListener("click", () => {
  const picked = $$("input:checked", estList).map(i => SERVICES.find(s => s.id === i.value));
  if (!picked.length) return;
  select.value = picked[0].name;
  if (picked.length > 1) form.notes.value = "Also: " + picked.slice(1).map(s => s.name).join(", ");
});

/* ---------- Oil change reminder ---------- */
$("[data-oil]").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target;
  const out = $("[data-oil-result]");
  const last = Number(f.last.value), interval = Number(f.interval.value), weekly = Number(f.weekly.value);
  if (!last || !weekly) { out.textContent = "Enter your last mileage and weekly miles."; return; }
  const dueAt = last + interval;
  const due = new Date(); due.setDate(due.getDate() + Math.round((interval / weekly) * 7));
  // Most manufacturers also cap intervals at ~6 months regardless of mileage.
  const cap = new Date(); cap.setMonth(cap.getMonth() + 6);
  const when = due < cap ? due : cap;
  out.className = "oil-result";
  out.innerHTML = `Next change at <strong>${dueAt.toLocaleString()} miles</strong>, around <strong>${when.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</strong>. <a href="#book">Book it now</a>`;
});

/* ---------- Reviews ---------- */
(function reviews() {
  const items = $$(".review");
  const count = $("[data-rev-count]");
  let i = 0;
  const show = n => {
    items[i].removeAttribute("data-active");
    i = (n + items.length) % items.length;
    items[i].setAttribute("data-active", "");
    count.textContent = `${i + 1} of ${items.length}`;
  };
  $("[data-rev=prev]").addEventListener("click", () => show(i - 1));
  $("[data-rev=next]").addEventListener("click", () => show(i + 1));
})();

/* ---------- Mobile nav ---------- */
const toggle = $(".nav-toggle"), nav = $("#nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
$$("a", nav).forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", false); }));
