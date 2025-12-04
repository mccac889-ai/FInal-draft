// ==== DATA ============================================================
const paintings = [
  {
    id: "vangogh",
    artist: "Vincent van Gogh",
    title: "Orchard with Cypresses",
    year: 1888,
    deathYear: 1890,
    saleYear: 2022,
    priceMillions: 117.2,
    yearsAfterDeath: 2022 - 1890, // 132
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Vincent_Willem_van_Gogh_077.jpg/250px-Vincent_Willem_van_Gogh_077.jpg",
    tag: "Allen Collection, Christie's",
    description:
      "Painted in Arles in 1888 and sold from Paul Allen’s collection in 2022, this orchard sets Van Gogh’s auction record more than a century after his death."
  },
  {
    id: "picasso",
    artist: "Pablo Picasso",
    title: "Les Femmes d’Alger (Version O)",
    year: 1955,
    deathYear: 1973,
    saleYear: 2015,
    priceMillions: 179.4,
    yearsAfterDeath: 2015 - 1973, // 42
    image:
      "https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/Les_femmes_d%E2%80%99Alger%2C_Picasso%2C_version_O.jpg/330px-Les_femmes_d%E2%80%99Alger%2C_Picasso%2C_version_O.jpg",
    tag: "Christie’s, New York",
    description:
      "Part of Picasso’s tribute to Delacroix, Version O shattered records in 2015, about four decades after Picasso’s death."
  },
  {
    id: "basquiat",
    artist: "Jean-Michel Basquiat",
    title: "Untitled (Skull)",
    year: 1982,
    deathYear: 1988,
    saleYear: 2017,
    priceMillions: 110.5,
    yearsAfterDeath: 2017 - 1988, // 29
    image:
      "https://upload.wikimedia.org/wikipedia/en/f/f6/Untitled1982Basquiat.jpg",
    tag: "Sotheby’s, New York",
    description:
      "Basquiat’s electric skull jumped from a $4,000 gallery sale in 1982 to over $110M at auction, just under thirty years after his death."
  },
  {
    id: "klimt",
    artist: "Gustav Klimt",
    title: "Portrait of Elisabeth Lederer",
    year: 1914,
    deathYear: 1918,
    saleYear: 2025,
    priceMillions: 236.4,
    yearsAfterDeath: 2025 - 1918, // 107
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Gustav_Klimt_Bildnis_der_Elisabeth_Lederer.jpg/330px-Gustav_Klimt_Bildnis_der_Elisabeth_Lederer.jpg",
    tag: "Sotheby’s, New York",
    description:
      "A six-foot portrait with a dramatic Nazi-era provenance, this 2025 sale set a record for modern art more than a century after Klimt’s death."
  },
  {
    id: "kahlo",
    artist: "Frida Kahlo",
    title: "El sueño (La cama)",
    year: 1940,
    deathYear: 1954,
    saleYear: 2025,
    priceMillions: 54.7,
    yearsAfterDeath: 2025 - 1954, // 71
    image:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/El_sue%C3%B1o_%28La_cama%29.jpg/330px-El_sue%C3%B1o_%28La_cama%29.jpg",
    tag: "Sotheby’s, New York",
    description:
      "A surreal self-portrait of sleep and death that, in 2025, became the most expensive work by a woman at auction roughly seventy years after Kahlo died."
  }
];

// ==== HELPERS ========================================================

function formatMoney(millions) {
  return `${millions.toFixed(1)}M`;
}

// Simple “value multiple” model: 1 + 0.04 t − 0.00025 t²
function valueMultiple(yearsAfterDeath) {
  const t = yearsAfterDeath;
  const val = 1 + 0.04 * t - 0.00025 * t * t;
  return Math.max(val, 0);
}

// ==== CASE CARDS =====================================================

function buildCaseCards() {
  const grid = document.getElementById("case-grid");
  if (!grid) return;

  paintings.forEach((p) => {
    const card = document.createElement("article");
    card.className = "case-card";

    card.innerHTML = `
      <div class="case-image-wrap">
        <img class="case-image" src="${p.image}" alt="${p.title} by ${p.artist}" loading="lazy">
        <span class="case-chip">${p.tag}</span>
      </div>
      <div class="case-body">
        <h3 class="case-title">${p.title}</h3>
        <div class="case-artist">${p.artist} · ${p.year}</div>
        <div class="case-meta">
          <span class="meta-pill">Sold ${p.saleYear}</span>
          <span class="meta-pill">${p.yearsAfterDeath} yrs after death</span>
          <span class="meta-pill">${formatMoney(p.priceMillions)}</span>
        </div>
        <p class="case-description">${p.description}</p>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ==== TIMELINE VIZ ===================================================

function buildTimeline() {
  const svg = document.getElementById("timeline-svg");
  if (!svg) return;

  const marginLeft = 70;
  const marginRight = 40;
  const axisY = 160;
  const maxYears = Math.max(...paintings.map((p) => p.yearsAfterDeath));
  const maxX = maxYears * 1.05;

  function xScale(years) {
    const width = 800 - marginLeft - marginRight;
    return marginLeft + (years / maxX) * width;
  }

  // Clear existing content
  svg.innerHTML = "";

  // Axis line
  const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  axis.setAttribute("x1", marginLeft);
  axis.setAttribute("x2", 800 - marginRight);
  axis.setAttribute("y1", axisY);
  axis.setAttribute("y2", axisY);
  axis.setAttribute("stroke", "rgba(255,255,255,0.4)");
  axis.setAttribute("stroke-width", "1.2");
  svg.appendChild(axis);

  // Golden band (roughly 30–80 years after death)
  const sweetStart = 30;
  const sweetEnd = 80;
  const sweet = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  sweet.setAttribute("x", xScale(sweetStart));
  sweet.setAttribute("y", axisY - 14);
  sweet.setAttribute("width", xScale(sweetEnd) - xScale(sweetStart));
  sweet.setAttribute("height", 28);
  sweet.setAttribute(
    "fill",
    "url(#sweetGradient)"
  );
  sweet.setAttribute("opacity", "0.75");
  svg.appendChild(sweet);

  // Gradient def
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const grad = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "linearGradient"
  );
  grad.setAttribute("id", "sweetGradient");
  grad.setAttribute("x1", "0");
  grad.setAttribute("x2", "1");
  grad.setAttribute("y1", "0");
  grad.setAttribute("y2", "0");

  const stop1 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "stop"
  );
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("stop-color", "#f9e39d");
  stop1.setAttribute("stop-opacity", "0.4");

  const stop2 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "stop"
  );
  stop2.setAttribute("offset", "100%");
  stop2.setAttribute("stop-color", "#f0c86f");
  stop2.setAttribute("stop-opacity", "0.7");

  grad.appendChild(stop1);
  grad.appendChild(stop2);
  defs.appendChild(grad);
  svg.insertBefore(defs, svg.firstChild);

  // Tick labels
  const tickYears = [0, 25, 50, 75, 100, 125];
  tickYears.forEach((t) => {
    const x = xScale(t);
    const tick = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    tick.setAttribute("x1", x);
    tick.setAttribute("x2", x);
    tick.setAttribute("y1", axisY - 6);
    tick.setAttribute("y2", axisY + 6);
    tick.setAttribute("stroke", "rgba(255,255,255,0.3)");
    tick.setAttribute("stroke-width", "1");
    svg.appendChild(tick);

    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    label.textContent = t.toString();
    label.setAttribute("x", x);
    label.setAttribute("y", axisY + 22);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("fill", "rgba(240,240,255,0.7)");
    label.setAttribute("font-size", "10");
    svg.appendChild(label);
  });

  // Axis title
  const axisTitle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  axisTitle.textContent = "Years after artist’s death";
  axisTitle.setAttribute("x", (marginLeft + (800 - marginRight)) / 2);
  axisTitle.setAttribute("y", axisY + 45);
  axisTitle.setAttribute("text-anchor", "middle");
  axisTitle.setAttribute("fill", "rgba(240,240,255,0.8)");
  axisTitle.setAttribute("font-size", "12");
  svg.appendChild(axisTitle);

  // Points
  paintings.forEach((p, index) => {
    const x = xScale(p.yearsAfterDeath);
    const y = axisY - 40 - index * 8;

    const glow = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    glow.setAttribute("cx", x);
    glow.setAttribute("cy", y);
    glow.setAttribute("r", "14");
    glow.setAttribute("fill", "rgba(249,227,157,0.25)");
    svg.appendChild(glow);

    const dot = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    dot.setAttribute("cx", x);
    dot.setAttribute("cy", y);
    dot.setAttribute("r", "6");
    dot.setAttribute("fill", "#f9e39d");
    svg.appendChild(dot);

    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    label.textContent = p.artist.split(" ")[0]; // first name
    label.setAttribute("x", x);
    label.setAttribute("y", y - 12);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("fill", "rgba(240,240,255,0.9)");
    label.setAttribute("font-size", "10");
    svg.appendChild(label);

    const sub = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    sub.textContent = `${p.yearsAfterDeath} yrs · ${formatMoney(
      p.priceMillions
    )}`;
    sub.setAttribute("x", x);
    sub.setAttribute("y", y + 18);
    sub.setAttribute("text-anchor", "middle");
    sub.setAttribute("fill", "rgba(176,172,196,0.9)");
    sub.setAttribute("font-size", "9");
    svg.appendChild(sub);
  });
}

// ==== PRICE BAR CHART ===============================================

function buildPriceBars() {
  const container = document.getElementById("price-bars");
  if (!container) return;

  const maxPrice = Math.max(...paintings.map((p) => p.priceMillions));

  paintings.forEach((p) => {
    const wrap = document.createElement("div");
    wrap.className = "price-bar";

    const rect = document.createElement("div");
    rect.className = "price-bar-rect";

    const height = 40 + (p.priceMillions / maxPrice) * 120; // 40–160 px
    rect.style.height = `${height}px`;

    const labelArtist = document.createElement("div");
    labelArtist.className = "price-label-artist";
    labelArtist.textContent = p.artist.split(" ")[0];

    const labelMeta = document.createElement("div");
    labelMeta.className = "price-label-meta";
    labelMeta.textContent = `${p.yearsAfterDeath} yrs • ${formatMoney(
      p.priceMillions
    )}`;

    wrap.appendChild(rect);
    wrap.appendChild(labelArtist);
    wrap.appendChild(labelMeta);

    container.appendChild(wrap);
  });
}

// ==== FORMULA PLAYGROUND ============================================

function initFormulaPlayground() {
  const slider = document.getElementById("year-slider");
  const yearDisplay = document.getElementById("year-display");
  const valueDisplay = document.getElementById("value-display");
  const dot = document.getElementById("graph-dot");

  if (!slider || !yearDisplay || !valueDisplay || !dot) return;

  function updateFromSlider() {
    const t = Number(slider.value);
    const val = valueMultiple(t);
    yearDisplay.textContent = `${t} years`;
    valueDisplay.textContent = `≈ ${val.toFixed(2)}× baseline`;

    const minX = 12;
    const maxX = 92;
    const x = minX + ((t / 140) * (maxX - minX));
    const clampedX = Math.max(minX, Math.min(maxX, x));

    const maxVal = valueMultiple(70); // approximate peak
    const normalized = Math.max(val / maxVal, 0);
    const extra = 6 + normalized * 14; // 6–20px “curve”
    dot.style.left = `${clampedX}%`;
    dot.style.bottom = `${20 + extra}px`;
  }

  slider.addEventListener("input", updateFromSlider);
  updateFromSlider();
}

// ==== METRICS IN HERO ================================================

function populateHeroMetrics() {
  const recordEl = document.getElementById("metric-record");
  const windowEl = document.getElementById("metric-window");
  const artistsEl = document.getElementById("metric-artists");
  if (!recordEl || !windowEl || !artistsEl) return;

  const maxPrice = Math.max(...paintings.map((p) => p.priceMillions));
  recordEl.textContent = `${maxPrice.toFixed(1)}M`;

  const years = paintings.map((p) => p.yearsAfterDeath).sort((a, b) => a - b);
  const minCluster = years[1]; // ignore extreme low/high a bit
  const maxCluster = years[years.length - 2];
  windowEl.textContent = `${minCluster}–${maxCluster} yrs`;

  artistsEl.textContent = paintings.length.toString();
}

// ==== INIT ===========================================================

document.addEventListener("DOMContentLoaded", () => {
  buildCaseCards();
  buildTimeline();
  buildPriceBars();
  initFormulaPlayground();
  populateHeroMetrics();
});
