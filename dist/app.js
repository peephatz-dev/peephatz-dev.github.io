const email = 'peeraphat.noiy@mail.kmutt.ac.th';
const linkedin = 'https://www.linkedin.com/in/peeraphat-noiyaem-68a03038b';
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const visuals = {
  modhew: '<img src="assets/modhew.png" alt="MODHEW campus food delivery" width="1090" height="613">',
  met: `<div class="met-visual" aria-hidden="true"><span></span><span></span><span></span>${icon('check')}</div>`,
  cake: '<div class="cake-visual" aria-hidden="true"><span class="cake-flame"></span><span class="cake-candle"></span><span class="cake-top"></span><span class="cake-base"></span><span class="cake-plate"></span></div>',
  portal: `<div class="portal-visual" aria-hidden="true"><div class="portal-top"><i></i><i></i><i></i></div><div class="portal-content">${icon('users')}<div class="portal-lines"><span></span><span></span><span></span></div></div></div>`,
  community: `<div class="community-visual" aria-hidden="true"><span class="person"></span><span class="person"></span><span class="person"></span>${icon('spark')}</div>`,
  superai: '<div class="ai-chip" aria-hidden="true"><span>AI</span></div>'
};
const projects = [
  {
    id: 'modhew', category: 'product', type: 'Live product', name: 'MODHEW',
    short: 'Campus food delivery, built at Bangmod. From a one-day first build to a service shaped by real users and riders.',
    description: 'Built and launched a campus food delivery platform at KMUTT Bangmod. The first usable version came together in approximately one day, followed by iterations with users, riders, and real operational feedback. The platform handles orders, rider workflows, payment processes, and real-time service operations.',
    metric: '<strong>300+ users</strong> & 30 orders on launch day',
    stack: 'Next.js / Supabase / LINE LIFF', tags: ['Full-stack development', 'Campus startup', 'Payment integration'],
    links: [['Open live application', 'https://modhew.vercel.app/'], ['Read more on LinkedIn', linkedin]],
    note: 'Launch metrics are reported in my LinkedIn post.', label: 'Built for Bangmod', visual: 'modhew'
  },
  {
    id: 'met', category: 'product', type: 'Event technology', name: 'MET Safety Day 2026',
    short: 'A connected event experience, from LINE check-ins to activity tracking, live leaderboards, and reporting.',
    description: 'Planned and developed an event management platform in collaboration with Pakdee Organizer Co., Ltd. It connects LINE LIFF authentication, real-time check-ins, activity tracking across 12 safety stations, live dashboards, leaderboards, and reporting.',
    metric: '<strong>377 registered</strong> / 91.5% check-in rate',
    stack: 'LINE LIFF / Real-time analytics', tags: ['12 safety stations', 'Live dashboards', 'Event operations'],
    links: [['View event showcase', 'https://lnkd.in/gdSatK6p'], ['Open live application', 'https://lnkd.in/g5ZWdnUX'], ['Explore statistics dashboard', 'https://lnkd.in/gGUHH4FJ']],
    note: 'Participation figures are reported in my LinkedIn post. These links use LinkedIn short URLs.', label: 'Connected experiences', visual: 'met'
  },
  {
    id: 'cake', category: 'ai', type: 'Competition prototype', name: 'S&P Crack The Cake',
    short: 'An AI-powered LINE Bot exploring a more playful loyalty experience. The idea: “365 cakes in one day.”',
    description: 'Created an AI-powered LINE Bot concept and working prototype for the S&P Crack The Cake competition. “I Will Eat 365 Cakes in One Day” explores turning a loyalty channel into an interactive celebration experience.',
    metric: '<strong>AI × LINE</strong> / A working experiment',
    stack: 'AI agent / LINE chatbot', tags: ['AI agent', 'Working prototype', 'Product concept'],
    links: [['Try the working prototype', 'https://lnkd.in/e6kx-w4C'], ['Explore the project', 'https://lnkd.in/eUUYhp5f']],
    note: 'A competition prototype, not an S&P production service. These links use LinkedIn short URLs.', label: 'A sweeter interaction', visual: 'cake'
  },
  {
    id: 'portal', category: 'community', type: 'Community platform', name: 'Sam Hao Web Portal',
    short: 'A digital home for the Sam Hao Youth Community, built to support the people behind the events.',
    description: 'Served as Project Manager and Lead Developer for the Sam Hao Youth Community web portal. The platform was built to support community event operations and bring the initiative into a shared online space.',
    metric: '<strong>Project Manager</strong> & Lead Developer',
    stack: 'Web development / Community', tags: ['Web portal', 'Project management', 'Event operations'],
    links: [['Visit the community portal', 'https://lnkd.in/eyDCwuZ7']],
    note: 'The portal link is reproduced as shared on LinkedIn.', label: 'Built for connection', visual: 'portal'
  },
  {
    id: 'community', category: 'community', type: 'Social impact', name: 'Sam Hao Youth Community',
    short: 'Bringing young people and partners together through film, design, and a shared community initiative.',
    description: 'Managed a regional youth initiative with partner organizations and community activities. The project included 19 short-film contest teams and 15 design submissions. A subsequent Season 2 initiative involved sponsor onboarding and event execution.',
    metric: '<strong>233 attendees</strong> / 200K+ digital views',
    stack: 'Project management / Social impact', tags: ['Youth community', 'Partner collaboration', 'Season 2'],
    links: [['Explore the project & event', 'https://lnkd.in/e7aGFwbD']],
    note: 'Attendance, submissions, and view counts are reported in my LinkedIn post.', label: 'People make it possible', visual: 'community'
  },
  {
    id: 'superai', category: 'ai', type: 'Learning & participation', name: 'Super AI Engineer · S6',
    short: 'Learning by doing, through AI courses, workshops, and hands-on hackathon activities.',
    description: 'Participated in Super AI Engineer Season 6 through AI courses, workshops, and practical hackathon activities. A space to keep learning, experiment with ideas, and build hands-on experience in AI.',
    metric: '<strong>Courses + workshops</strong> + hackathons',
    stack: 'AI learning / Hands-on experience', tags: ['Season 6', 'Workshops', 'Hackathon participation'],
    links: [['Read the public write-up on LinkedIn', linkedin]],
    note: 'This is a training and participation experience rather than a separately shipped software product.', label: 'Keep the curiosity going', visual: 'superai'
  }
];

const grid = document.querySelector('#project-grid');
grid.innerHTML = projects.map(project => `
  <article class="project-card" data-category="${project.category}">
    <div class="project-visual ${project.visual}">${visuals[project.visual]}<div class="visual-label"><span>${project.label}</span>${icon('spark')}</div></div>
    <div class="project-body"><span class="project-type">${project.type}</span><h3>${project.name}</h3><p>${project.short}</p>
      <div class="project-metric">${project.metric}</div>
      <div class="project-bottom"><span class="project-stack">${project.stack}</span><button class="detail-button" data-project="${project.id}" aria-label="View ${project.name} details">Explore ${icon('plus')}</button></div>
    </div>
  </article>`).join('');

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    let count = 0;
    document.querySelectorAll('.project-card').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
      if (!card.hidden) count++;
    });
    document.querySelector('#result-count').textContent = `${count} things to explore`;
  });
});

const dialog = document.querySelector('#project-dialog');
let dialogOpener;
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-project]');
  if (!trigger) return;
  const project = projects.find(item => item.id === trigger.dataset.project);
  if (!project) return;
  dialogOpener = trigger;
  document.querySelector('#dialog-content').innerHTML = `
    <div class="project-visual dialog-visual ${project.visual}">${visuals[project.visual]}</div>
    <span class="project-type">${project.type}</span><h2 class="dialog-title" id="dialog-title">${project.name}</h2>
    <p class="dialog-description">${project.description}</p><div class="project-metric">${project.metric}</div>
    <div class="dialog-details">${project.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
    <div class="dialog-links">${project.links.map(([label, href]) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}${icon('arrow')}</a>`).join('')}</div>
    <p class="dialog-note">${project.note}</p>`;
  dialog.showModal();
  dialog.scrollTop = 0;
  document.querySelector('.dialog-close').focus({preventScroll: true});
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
dialog.addEventListener('close', () => dialogOpener?.focus({preventScroll: true}));

let toastTimeout;
function showToast(message) {
  const toast = document.querySelector('#toast');
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 3500);
}
document.querySelector('#copy-email').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(email);
    showToast('Email copied. Good things start with hello.');
  } catch {
    showToast('Please copy the email address shown, or use “Say hello”.');
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('#copy-email > span'));
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

function updateClock() {
  const now = new Date();
  const clock = document.querySelector('#bkk-time');
  clock.textContent = new Intl.DateTimeFormat('en-GB', {timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', hour12: false}).format(now);
  clock.dateTime = now.toISOString();
}
updateClock();
setInterval(updateClock, 30000);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      document.querySelectorAll('.main-nav a').forEach(link => {
        link.classList.toggle('nav-active', link.hash === (entry.target.id === 'home' ? '#links' : `#${entry.target.id}`));
      });
    }
  }, {rootMargin: '-15% 0px -55% 0px'});
  document.querySelectorAll('#home, #work, #about').forEach(section => observer.observe(section));
}
