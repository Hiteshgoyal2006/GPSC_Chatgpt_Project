const ROOT = window.location.pathname.includes("/events/") ? "../" : "";
const DATA = {
  site: `${ROOT}data/site.json`,
  board: `${ROOT}data/board-members.json`,
  members: `${ROOT}data/members.json`,
  events: `${ROOT}data/events.json`,
  gallery: `${ROOT}data/gallery.json`
};

const state = {
  site: null,
  board: [],
  members: [],
  events: {},
  gallery: []
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const formatDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
};

const safeLink = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `https://${url}`;
};

const pageLink = (url) => `${ROOT}${url}`;

async function loadData() {
  const [site, board, members, events, gallery] = await Promise.all(
    Object.values(DATA).map((url) => fetch(url).then((response) => response.json()))
  );
  state.site = site;
  state.board = board.items || board;
  state.members = members.items || members;
  state.events = events;
  state.gallery = gallery.items || gallery;
}

function initChrome() {
  const header = $("#site-header");
  const footer = $("#site-footer");
  const currentPath = window.location.pathname.endsWith("/")
    ? "/"
    : window.location.pathname.split("/").pop();

  header.innerHTML = `
    <div class="container nav-shell">
      <a class="brand" href="${pageLink("index.html")}">
        <span class="brand-mark">GPSC</span>
        <span>
          <span class="brand-title">${state.site.name}</span>
          <span class="brand-subtitle">${state.site.fullName}</span>
        </span>
      </a>
      <button class="nav-toggle" type="button" aria-label="Open navigation" aria-expanded="false">☰</button>
      <ul class="nav-menu">
        ${state.site.navigation.map((item) => {
          const itemPath = item.url === "/" ? "/" : item.url.split("/").pop();
          const active = currentPath === itemPath || (currentPath === "/" && item.url === "/");
          return `<li><a class="${active ? "active" : ""}" href="${pageLink(item.url)}">${item.label}</a></li>`;
        }).join("")}
        <li><a href="${ROOT}admin/">Admin</a></li>
      </ul>
    </div>
  `;

  $(".nav-toggle").addEventListener("click", (event) => {
    const expanded = event.currentTarget.getAttribute("aria-expanded") === "true";
    event.currentTarget.setAttribute("aria-expanded", String(!expanded));
    document.body.classList.toggle("nav-open", !expanded);
  });

  footer.innerHTML = `
    <div class="container footer-grid">
      <div>
        <h3>${state.site.name}</h3>
        <p>${state.site.description}</p>
      </div>
      <div>
        <h3>Quick Links</h3>
        <div class="footer-links">
          ${state.site.navigation.map((item) => `<a href="${pageLink(item.url)}">${item.label}</a>`).join("")}
        </div>
      </div>
      <div>
        <h3>Contact</h3>
        <p><a href="mailto:${state.site.email}">${state.site.email}</a></p>
        <p>Gurugram, Haryana</p>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">© ${new Date().getFullYear()} ${state.site.name}. Built for GitHub deployment.</div>
    </div>
  `;
}

function pageHero(title, copy) {
  return `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">${state.site.fullName}</span>
        <h1>${title}</h1>
        <p>${copy}</p>
      </div>
    </section>
  `;
}

function detailRows(items) {
  return `<div class="details">${items.filter(Boolean).join("")}</div>`;
}

function profileCard(member) {
  return `
    <article class="card profile-card">
      <img class="card-media" src="${member.image}" alt="${member.name}">
      <div class="card-body">
        <p class="profile-role">${member.role}</p>
        <h3>${member.name}</h3>
        ${detailRows([
          `<span>${member.designation || ""}</span>`,
          `<span>${member.school}</span>`,
          `<span>${member.location}</span>`,
          member.email ? `<a href="mailto:${member.email}">${member.email}</a>` : "",
          member.phone ? `<a href="tel:${member.phone.replaceAll(" ", "")}">${member.phone}</a>` : ""
        ])}
      </div>
    </article>
  `;
}

function schoolCard(school) {
  return `
    <article class="card school-card">
      <img class="card-media" src="${school.image}" alt="${school.name}">
      <div class="card-body">
        <div class="card-meta">
          <span class="pill">${school.sector}</span>
          <span class="pill gold">Member School</span>
        </div>
        <h3>${school.name}</h3>
        ${detailRows([
          `<span>${school.address}</span>`,
          `<span>Principal: ${school.principal}</span>`,
          `<a href="mailto:${school.email}">${school.email}</a>`,
          `<a href="tel:${school.phone.replaceAll(" ", "")}">${school.phone}</a>`
        ])}
        <div class="school-actions">
          <a class="button secondary" href="${safeLink(school.website)}" target="_blank" rel="noreferrer">Website</a>
        </div>
      </div>
    </article>
  `;
}

function eventCard(item, type = "event") {
  const title = item.title || item.number;
  const subtitle = item.theme || item.speakers || item.venue || item.year;
  return `
    <article class="card event-card">
      <img class="card-media" src="${item.image || item.coverImage}" alt="${title}">
      <div class="card-body">
        <div class="card-meta">
          ${item.date ? `<span class="pill">${formatDate(item.date)}</span>` : ""}
          ${item.academicYear ? `<span class="pill gold">${item.academicYear}</span>` : ""}
          ${type ? `<span class="pill gold">${type}</span>` : ""}
        </div>
        <h3>${title}</h3>
        ${subtitle ? `<p class="muted" style="margin-top:10px">${subtitle}</p>` : ""}
        ${item.description ? `<p class="muted" style="margin-top:12px">${item.description}</p>` : ""}
        <div class="links-row">
          ${item.youtubeUrl ? `<a class="button secondary" href="${safeLink(item.youtubeUrl)}" target="_blank" rel="noreferrer">Video</a>` : ""}
          ${item.detailsUrl ? `<a class="button secondary" href="${safeLink(item.detailsUrl)}" target="_blank" rel="noreferrer">Details</a>` : ""}
          ${item.photosUrl ? `<a class="button secondary" href="${safeLink(item.photosUrl)}" target="_blank" rel="noreferrer">Photos</a>` : ""}
          ${item.minutesUrl ? `<a class="button secondary" href="${safeLink(item.minutesUrl)}" target="_blank" rel="noreferrer">Minutes</a>` : ""}
          ${item.fileUrl ? `<a class="button secondary" href="${safeLink(item.fileUrl)}" target="_blank" rel="noreferrer">View Publication</a>` : ""}
        </div>
      </div>
    </article>
  `;
}

function renderHome(root) {
  const latestConference = state.events.conferences[0];
  const latestMeetings = state.events.meetings.slice(0, 3);
  root.innerHTML = `
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <span class="eyebrow">${state.site.fullName}</span>
          <h1>${state.site.name}</h1>
          <p class="lead">${state.site.tagline}. ${state.site.description}</p>
          <div class="hero-actions">
            <a class="button" href="members.html">View Members</a>
            <a class="button secondary" href="join.html">Join GPSC</a>
            <a class="button secondary" href="contact.html">Contact Us</a>
          </div>
        </div>
      </div>
      <div class="hero-strip">
        <div class="container stat-grid">
          ${state.site.stats.map((stat) => `<div class="stat"><strong>${stat.value}</strong><span>${stat.label}</span></div>`).join("")}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container grid two">
        <div>
          <span class="eyebrow" style="color:var(--teal-dark)">Rising Together</span>
          <h2>Sahodaya is a forum for shared educational leadership.</h2>
          <p class="section-copy">The council enables CBSE schools to deliberate on policy, exchange innovative practices, strengthen pedagogy, and support learners through collaborative programs.</p>
        </div>
        <ul class="activity-list">
          ${state.site.activities.map((activity) => `<li>${activity}</li>`).join("")}
        </ul>
      </div>
    </section>
    <section class="section alt">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow" style="color:var(--teal-dark)">Featured</span>
            <h2>Latest from GPSC</h2>
          </div>
          <a class="button secondary" href="events.html">All Events</a>
        </div>
        <div class="grid two">
          ${eventCard(latestConference, "Conference")}
          <div class="grid">
            ${latestMeetings.map((meeting) => eventCard(meeting, "Meeting")).join("")}
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow" style="color:var(--teal-dark)">Network</span>
            <h2>Member Schools</h2>
            <p class="section-copy">A searchable directory of schools working together to build stronger learning communities across Gurugram.</p>
          </div>
          <a class="button" href="members.html">Explore Directory</a>
        </div>
        <div class="grid four">
          ${state.members.slice(0, 4).map(schoolCard).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderBoard(root) {
  const managing = state.board.filter((member) => member.category === "managing-committee").sort((a, b) => a.order - b.order);
  const founders = state.board.filter((member) => member.category === "founder-member").sort((a, b) => a.order - b.order);
  root.innerHTML = `
    ${pageHero("Board Members", "Meet the office bearers and founder members guiding the work of Gurgaon Progressive Schools Council.")}
    <section class="section">
      <div class="container">
        <div class="section-head"><h2>Managing Committee Members</h2></div>
        <div class="grid three">${managing.map(profileCard).join("")}</div>
      </div>
    </section>
    <section class="section alt">
      <div class="container">
        <div class="section-head"><h2>Founder Members</h2></div>
        <div class="grid three">${founders.map(profileCard).join("")}</div>
      </div>
    </section>
  `;
}

function renderMembers(root) {
  root.innerHTML = `
    ${pageHero("Member Schools", "Search and explore GPSC member schools by name, principal, sector, contact details, and website.")}
    <section class="section">
      <div class="container">
        <div class="toolbar">
          <input class="input" id="member-search" type="search" placeholder="Search by school, principal, sector or email">
          <select class="select" id="sector-filter">
            <option value="">All sectors</option>
            ${[...new Set(state.members.map((school) => school.sector))].sort().map((sector) => `<option value="${sector}">${sector}</option>`).join("")}
          </select>
          <select class="select" id="view-mode">
            <option value="grid">Grid view</option>
            <option value="table">Table view</option>
          </select>
        </div>
        <div id="members-output"></div>
      </div>
    </section>
  `;

  const render = () => {
    const query = $("#member-search").value.trim().toLowerCase();
    const sector = $("#sector-filter").value;
    const mode = $("#view-mode").value;
    const filtered = state.members
      .filter((school) => !sector || school.sector === sector)
      .filter((school) => [school.name, school.principal, school.sector, school.email].join(" ").toLowerCase().includes(query))
      .sort((a, b) => a.name.localeCompare(b.name));
    const output = $("#members-output");
    if (!filtered.length) {
      output.innerHTML = `<div class="empty">No member schools match this search.</div>`;
      return;
    }
    output.innerHTML = mode === "table"
      ? `<div class="table-wrap"><table><thead><tr><th>School</th><th>Sector</th><th>Principal</th><th>Email</th><th>Phone</th><th>Website</th></tr></thead><tbody>${filtered.map((school) => `<tr><td>${school.name}</td><td>${school.sector}</td><td>${school.principal}</td><td><a href="mailto:${school.email}">${school.email}</a></td><td>${school.phone}</td><td><a href="${safeLink(school.website)}" target="_blank" rel="noreferrer">Visit</a></td></tr>`).join("")}</tbody></table></div>`
      : `<div class="directory-list">${filtered.map(schoolCard).join("")}</div>`;
  };

  ["input", "change"].forEach((eventName) => {
    $("#member-search").addEventListener(eventName, render);
    $("#sector-filter").addEventListener(eventName, render);
    $("#view-mode").addEventListener(eventName, render);
  });
  render();
}

function renderEvents(root) {
  const categories = [
    { title: "Webinars", copy: "Professional learning sessions and online discussions.", href: "events/webinars.html", image: state.events.webinars[0].image },
    { title: "Conferences", copy: "Annual conferences, themes, videos and photographs.", href: "events/conferences.html", image: state.events.conferences[0].image },
    { title: "Meetings", copy: "General Body Meetings with venues and minutes.", href: "events/meetings.html", image: state.events.meetings[0].image },
    { title: "Publications", copy: "Annual publications, brochures and documents.", href: "events/publications.html", image: state.events.publications[0].coverImage }
  ];
  root.innerHTML = `
    ${pageHero("Events", "Browse GPSC webinars, conferences, meetings and publications in one structured event hub.")}
    <section class="section">
      <div class="container grid four">
        ${categories.map((item) => `
          <a class="card" href="${item.href}">
            <img class="card-media" src="${item.image}" alt="${item.title}">
            <div class="card-body">
              <h3>${item.title}</h3>
              <p class="muted" style="margin-top:10px">${item.copy}</p>
            </div>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function renderEventList(root, key, title, copy, type) {
  const items = state.events[key] || [];
  root.innerHTML = `
    ${pageHero(title, copy)}
    <section class="section">
      <div class="container">
        <div class="timeline">
          ${items.map((item) => `
            <div class="timeline-item">
              <div class="timeline-date">${item.date ? formatDate(item.date) : item.year}</div>
              ${eventCard(item, type)}
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderGallery(root) {
  root.innerHTML = `
    ${pageHero("Photo Gallery", "Explore visual archives from annual conferences, meetings and school network programs.")}
    <section class="section">
      <div class="container grid three">
        ${state.gallery.map((album) => `
          <article class="card">
            <img class="card-media" src="${album.coverImage}" alt="${album.title}">
            <div class="card-body">
              <div class="card-meta">
                <span class="pill">${album.year}</span>
                <span class="pill gold">${album.category}</span>
              </div>
              <h3>${album.title}</h3>
              <p class="muted" style="margin-top:10px">${album.images.length} photos available</p>
              <div class="links-row">
                ${album.externalUrl ? `<a class="button secondary" href="${safeLink(album.externalUrl)}" target="_blank" rel="noreferrer">Open Album</a>` : ""}
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderJoin(root) {
  root.innerHTML = `
    ${pageHero("Join GPSC", "Become part of a collaborative network of schools committed to learning, leadership and shared progress.")}
    <section class="section">
      <div class="container grid two">
        <div>
          <span class="eyebrow" style="color:var(--teal-dark)">Membership</span>
          <h2>Build stronger schools through shared practice.</h2>
          <p class="section-copy">GPSC membership helps schools participate in professional learning, conferences, inter-school initiatives, CBSE policy discussions and collaborative community programs.</p>
          <ul class="activity-list" style="margin-top:24px">
            <li>Access to seminars, workshops and orientation programs</li>
            <li>Participation in annual conferences and General Body Meetings</li>
            <li>Opportunities for student, teacher and principal collaboration</li>
            <li>Shared guidance on CBSE circulars, policies and implementation</li>
          </ul>
        </div>
        <form class="card card-body form" name="membership-interest">
          <h3>Apply for Membership</h3>
          <input class="input" name="school" placeholder="School name" required>
          <input class="input" name="principal" placeholder="Principal / Head of School" required>
          <input class="input" name="email" type="email" placeholder="Email address" required>
          <input class="input" name="phone" placeholder="Phone number" required>
          <textarea class="textarea" name="message" placeholder="Message"></textarea>
          <button class="button" type="submit">Submit Interest</button>
          <p class="muted">Connect this form to Formspree, Google Forms, Supabase or your preferred backend before production.</p>
        </form>
      </div>
    </section>
  `;
}

function renderContact(root) {
  const officeBearers = state.board.filter((member) => member.category === "managing-committee");
  root.innerHTML = `
    ${pageHero("Contact Us", "Reach the GPSC office bearers and connect with the council for membership, events and collaboration.")}
    <section class="section">
      <div class="container contact-grid">
        <div class="contact-panel">
          <span class="eyebrow">GPSC</span>
          <h2 style="color:#fff">Let’s connect.</h2>
          <p style="margin-top:16px">Main email</p>
          <p><a href="mailto:${state.site.email}">${state.site.email}</a></p>
          <p style="margin-top:18px">Gurugram, Haryana</p>
        </div>
        <form class="card card-body form" name="contact">
          <h3>Send a Message</h3>
          <input class="input" name="name" placeholder="Your name" required>
          <input class="input" name="email" type="email" placeholder="Email address" required>
          <input class="input" name="subject" placeholder="Subject" required>
          <textarea class="textarea" name="message" placeholder="Message"></textarea>
          <button class="button" type="submit">Send Message</button>
        </form>
      </div>
    </section>
    <section class="section alt">
      <div class="container">
        <div class="section-head"><h2>Office Bearers</h2></div>
        <div class="grid three">${officeBearers.map(profileCard).join("")}</div>
      </div>
    </section>
  `;
}

function route(root) {
  const page = document.body.dataset.page;
  const routes = {
    home: renderHome,
    board: renderBoard,
    members: renderMembers,
    events: renderEvents,
    webinars: (target) => renderEventList(target, "webinars", "Webinars", "Professional learning sessions and online discussions for the GPSC school community.", "Webinar"),
    conferences: (target) => renderEventList(target, "conferences", "Conferences", "Annual conferences with themes, venues, media links and archive details.", "Conference"),
    meetings: (target) => renderEventList(target, "meetings", "Meetings", "General Body Meetings with venues, dates and minutes links.", "Meeting"),
    publications: (target) => renderEventList(target, "publications", "Publications", "Annual publications and brochures available for viewing and download.", "Publication"),
    gallery: renderGallery,
    join: renderJoin,
    contact: renderContact
  };
  routes[page]?.(root);
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadData();
    initChrome();
    route($("#app"));
  } catch (error) {
    console.error(error);
    $("#app").innerHTML = `<section class="section"><div class="container empty">The website content could not be loaded. Please run through a local server or check the data files.</div></section>`;
  }
});
