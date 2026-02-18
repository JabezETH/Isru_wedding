const config = window.INVITATION_CONFIG;

if (!config) {
  throw new Error("Missing INVITATION_CONFIG. Ensure config.js is loaded before script.js.");
}

const openingOverlay = document.getElementById("openingOverlay");
const openInviteBtn = document.getElementById("openInviteBtn");
const musicToggleBtn = document.getElementById("musicToggleBtn");
const bgMusic = document.getElementById("bgMusic");

let isMusicPlaying = false;
let autoPlayFallbackBound = false;

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderCoupleNames(id, partner1, partner2, separatorText) {
  const el = document.getElementById(id);
  if (!el) return;

  el.textContent = "";
  const p1 = document.createElement("span");
  p1.textContent = partner1;
  const sep = document.createElement("span");
  sep.className = "couple-separator";
  sep.textContent = separatorText;
  const p2 = document.createElement("span");
  p2.textContent = partner2;

  el.appendChild(p1);
  el.appendChild(sep);
  el.appendChild(p2);
}

function renderDetails() {
  const container = document.getElementById("detailsGrid");
  if (!container) return;

  container.textContent = "";
  for (const item of config.details) {
    const article = document.createElement("article");
    article.className = "card";

    const title = document.createElement("h4");
    title.textContent = item.title;
    article.appendChild(title);

    for (const line of item.lines) {
      const p = document.createElement("p");
      p.textContent = line;
      article.appendChild(p);
    }

    container.appendChild(article);
  }
}

function renderGallery() {
  const container = document.getElementById("gallery");
  if (!container) return;

  container.textContent = "";
  for (const photo of config.gallery.photos) {
    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.alt;
    img.loading = "lazy";
    container.appendChild(img);
  }
}

function applyConfig() {
  document.title = config.meta.pageTitle;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute("content", config.meta.description);

  const separatorText = config.couple.separator || " & ";
  renderCoupleNames("openingNames", config.couple.partner1, config.couple.partner2, separatorText);
  renderCoupleNames("heroNames", config.couple.partner1, config.couple.partner2, separatorText);

  setText("openingEyebrow", config.opening.eyebrow);
  setText("openingSubtitle", config.opening.subtitle);
  setText("openInviteBtn", config.opening.openButtonLabel);

  setText("heroEyebrow", config.hero.eyebrow);
  setText("heroDate", config.hero.dateLine);

  setText("inviteHeading", config.invitation.heading);
  setText("inviteBody", config.invitation.body);

  setText("galleryHeading", config.gallery.heading);
  renderDetails();
  renderGallery();

  setText("mapHeading", config.map.heading);
  setText("mapDescription", config.map.description);

  const mapIframe = document.getElementById("mapIframe");
  if (mapIframe) {
    mapIframe.title = config.map.iframeTitle;
    mapIframe.src = config.map.embedUrl;
  }

  const mapLink = document.getElementById("mapLink");
  if (mapLink) {
    mapLink.href = config.map.openUrl;
    mapLink.textContent = config.map.openLabel;
  }

  setText("footerPrimary", config.footer.primary);
  setText("footerSecondary", config.footer.secondary);
  setText("audioUnsupportedText", config.system.audioUnsupportedText);

  const audioSource = bgMusic.querySelector("source");
  if (audioSource) {
    audioSource.src = config.resources.musicSrc;
  }
  bgMusic.src = config.resources.musicSrc;
  bgMusic.load();

  document.documentElement.style.setProperty(
    "--opening-bg-image",
    `url("${config.resources.openingBackgroundUrl}")`
  );
  document.documentElement.style.setProperty(
    "--hero-bg-image",
    `url("${config.resources.heroBackgroundUrl}")`
  );
}

function updateMusicButton() {
  musicToggleBtn.textContent = isMusicPlaying
    ? config.hero.musicPauseLabel
    : config.hero.musicPlayLabel;
  musicToggleBtn.setAttribute("aria-pressed", String(isMusicPlaying));
}

async function playMusic() {
  try {
    await bgMusic.play();
    isMusicPlaying = true;
    return true;
  } catch (err) {
    isMusicPlaying = false;
    return false;
  } finally {
    updateMusicButton();
  }
}

function pauseMusic() {
  bgMusic.pause();
  isMusicPlaying = false;
  updateMusicButton();
}

openInviteBtn.addEventListener("click", async () => {
  openingOverlay.classList.add("hidden");
  await playMusic();
});

musicToggleBtn.addEventListener("click", async () => {
  if (isMusicPlaying) {
    pauseMusic();
  } else {
    await playMusic();
  }
});

bgMusic.addEventListener("ended", () => {
  isMusicPlaying = false;
  updateMusicButton();
});

async function attemptAutoPlay() {
  const ok = await playMusic();
  if (ok || autoPlayFallbackBound) return;

  autoPlayFallbackBound = true;
  const startOnFirstInteraction = async () => {
    await playMusic();
    window.removeEventListener("click", startOnFirstInteraction);
    window.removeEventListener("touchstart", startOnFirstInteraction);
    window.removeEventListener("keydown", startOnFirstInteraction);
  };

  window.addEventListener("click", startOnFirstInteraction, { once: true });
  window.addEventListener("touchstart", startOnFirstInteraction, { once: true });
  window.addEventListener("keydown", startOnFirstInteraction, { once: true });
}

applyConfig();
updateMusicButton();
attemptAutoPlay();
window.addEventListener("DOMContentLoaded", attemptAutoPlay);
window.addEventListener("load", attemptAutoPlay);
