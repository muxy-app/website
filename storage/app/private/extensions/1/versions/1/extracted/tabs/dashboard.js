const data = muxy.data || {};

document.getElementById('repo-name').textContent = data.repo || '(unknown repo)';
document.getElementById('branch').textContent = data.branch || '(detached)';
document.getElementById('generated-at').textContent =
  data.generatedAt ? new Date(data.generatedAt).toLocaleString() : '—';

document.getElementById('stat-commits').textContent = formatCount(data.totalCommits);
document.getElementById('stat-changed').textContent = formatCount(data.changedFiles);
document.getElementById('stat-contributors').textContent = formatCount(data.contributors?.length);

const ahead = data.aheadBehind?.ahead;
const behind = data.aheadBehind?.behind;
document.getElementById('stat-ahead-behind').textContent =
  ahead == null && behind == null ? '—' : `${ahead ?? 0} / ${behind ?? 0}`;

const status = document.getElementById('status');
if (data.status && data.status.length) {
  status.textContent = data.status;
} else {
  status.textContent = 'clean working tree';
  status.classList.add('empty');
}

const commits = document.getElementById('commits');
if (Array.isArray(data.recentCommits) && data.recentCommits.length) {
  commits.innerHTML = '';
  for (const commit of data.recentCommits) {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="hash">${escapeHTML(commit.hash)}</span>
      <span class="subject">${escapeHTML(commit.subject)}</span>
      <span class="author">${escapeHTML(commit.author)}</span>
    `;
    commits.appendChild(li);
  }
} else {
  commits.outerHTML = '<div class="empty">no commits found</div>';
}

const contributors = document.getElementById('contributors');
if (Array.isArray(data.contributors) && data.contributors.length) {
  contributors.innerHTML = '';
  for (const person of data.contributors) {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="count">${formatCount(person.count)}</span>
      <span class="name">${escapeHTML(person.name)}</span>
    `;
    contributors.appendChild(li);
  }
} else {
  contributors.outerHTML = '<div class="empty">no contributors found</div>';
}

function formatCount(value) {
  if (value == null) return '—';
  return Number(value).toLocaleString();
}

function escapeHTML(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
