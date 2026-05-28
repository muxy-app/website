const out = document.getElementById('out');

document.getElementById('extension-id').textContent = muxy.extensionID;
document.getElementById('instance-id').textContent = muxy.tabInstanceID;
document.getElementById('data').textContent = JSON.stringify(muxy.data);

const themeBadge = document.createElement('span');
themeBadge.style.cssText = 'padding:1px 6px;border-radius:3px;background:var(--muxy-accent);color:var(--muxy-background);';
const updateThemeBadge = (theme) => {
  themeBadge.textContent = `${theme.colorScheme} · ${theme.accent}`;
};
updateThemeBadge(muxy.theme);
document.querySelector('.meta').appendChild(themeBadge);

muxy.onThemeChange((theme) => {
  updateThemeBadge(theme);
});

function log(label, value) {
  out.textContent = `${label}\n${typeof value === 'string' ? value : JSON.stringify(value, null, 2)}`;
}

const eventsOut = document.getElementById('events');
const eventLog = [];
const eventNames = ['tab.focused', 'pane.created', 'pane.closed'];
let eventUnsubscribers = [];

function appendEvent(name, payload) {
  const stamp = new Date().toLocaleTimeString();
  eventLog.push(`[${stamp}] ${name} ${JSON.stringify(payload)}`);
  if (eventLog.length > 20) eventLog.shift();
  eventsOut.textContent = eventLog.join('\n');
}

function subscribeAll() {
  unsubscribeAll();
  eventUnsubscribers = eventNames.map((name) =>
    muxy.events.subscribe(name, (payload) => appendEvent(name, payload))
  );
  appendEvent('(subscribed)', { events: eventNames });
}

function unsubscribeAll() {
  for (const unsub of eventUnsubscribers) unsub();
  eventUnsubscribers = [];
  appendEvent('(unsubscribed)', {});
}

async function run(label, fn) {
  try {
    const value = await fn();
    log(`${label} → ok`, value === undefined ? '(no value)' : value);
  } catch (err) {
    log(`${label} → error`, err.message || String(err));
  }
}

async function firstPaneID() {
  const panes = await muxy.panes.list();
  if (!panes.length) throw new Error('no panes available');
  return panes[0].id;
}

async function activeProjectID() {
  const projects = await muxy.projects.list();
  const active = projects.find((p) => p.isActive);
  if (!active) throw new Error('no active project');
  return active.id;
}

async function activeWorktreeID() {
  const worktrees = await muxy.worktrees.list();
  const active = worktrees.find((w) => w.isActive);
  if (!active) throw new Error('no active worktree');
  return active.id;
}

const handlers = {
  // Read
  'tabs.list':         () => run('tabs.list', () => muxy.tabs.list()),
  'panes.list':        () => run('panes.list', () => muxy.panes.list()),
  'projects.list':     () => run('projects.list', () => muxy.projects.list()),
  'worktrees.list':    () => run('worktrees.list', () => muxy.worktrees.list()),
  'theme':             () => run('theme (sync)', () => muxy.theme),

  // Tabs
  'tabs.new':          () => run('tabs.new', () => muxy.tabs.new()),
  'tabs.next':         () => run('tabs.next', () => muxy.tabs.next()),
  'tabs.previous':     () => run('tabs.previous', () => muxy.tabs.previous()),
  'tabs.switchTo.0':   () => run('tabs.switchTo(0)', () => muxy.tabs.switchTo(0)),
  'tabs.open.terminal':() => run('tabs.open(terminal)', () => muxy.tabs.open({ kind: 'terminal' })),
  'tabs.open.vcs':     () => run('tabs.open(vcs)', () => muxy.tabs.open({ kind: 'vcs' })),
  'tabs.open.editor':  () => run('tabs.open(editor)', async () => {
    const projects = await muxy.projects.list();
    const project = projects.find((p) => p.isActive) || projects[0];
    if (!project) throw new Error('no project to open a file from');
    return muxy.tabs.open({ kind: 'editor', filePath: `${project.path}/README.md` });
  }),
  'tabs.open.self':    () => run('tabs.open(self)', () => muxy.tabs.open({
    kind: 'extensionWebView',
    extension: {
      id: muxy.extensionID,
      tabType: 'playground',
      data: { openedFrom: 'self', nestedAt: new Date().toISOString() },
    },
  })),

  // Panes
  'panes.readScreen':  () => run('panes.readScreen(first, 5)', async () => {
    const id = await firstPaneID();
    return muxy.panes.readScreen(id, 5);
  }),
  'panes.send':        () => run('panes.send(first, "echo hi")', async () => {
    const id = await firstPaneID();
    return muxy.panes.send(id, 'echo hi\n');
  }),
  'panes.sendKeys':    () => run('panes.sendKeys(first, Enter)', async () => {
    const id = await firstPaneID();
    return muxy.panes.sendKeys(id, 'Enter');
  }),
  'panes.rename':      () => run('panes.rename(first, "Renamed")', async () => {
    const id = await firstPaneID();
    return muxy.panes.rename(id, 'Renamed by playground');
  }),

  // Projects & worktrees
  'projects.switchTo': () => run('projects.switchTo(active)', async () => {
    const id = await activeProjectID();
    return muxy.projects.switchTo(id);
  }),
  'worktrees.switchTo':() => run('worktrees.switchTo(active)', async () => {
    const id = await activeWorktreeID();
    return muxy.worktrees.switchTo(id);
  }),
  'worktrees.refresh': () => run('worktrees.refresh()', () => muxy.worktrees.refresh()),

  // Notifications & logging
  'toast':             () => run('toast', () => muxy.toast({
    title: 'From the playground',
    body: 'window.muxy.toast() works.',
  })),
  'console.log':       () => run('console.log', () => {
    console.log('playground log:', { now: new Date().toISOString(), panes: muxy.tabInstanceID });
    return 'wrote a [log] line to the Output panel';
  }),
  'console.warn':      () => run('console.warn', () => {
    console.warn('playground warning: this is what a [warn] line looks like.');
    return 'wrote a [warn] line to the Output panel';
  }),
  'console.error':     () => run('console.error', () => {
    console.error('playground error: this is what an [err] line looks like.');
    return 'wrote an [err] line to the Output panel';
  }),
  'throw':             () => run('throw', () => {
    throw new Error('uncaught from the playground; should appear as [err] in the Output panel');
  }),

  // Live events
  'events.subscribeAll':   () => { subscribeAll(); },
  'events.unsubscribeAll': () => { unsubscribeAll(); },

  // Shell exec
  'exec.argv':    () => run('exec(["git","status","--short"])', () =>
    muxy.exec(['git', 'status', '--short'])),
  'exec.shell':   () => run('exec({ shell: "git diff | wc -l" })', () =>
    muxy.exec({ shell: 'git diff | wc -l' })),
  'exec.cwd':     () => run('exec(["ls","-1"], { cwd: "~" })', () =>
    muxy.exec(['ls', '-1'], { cwd: '~' })),
  'exec.failure': () => run('exec(["false"])', () =>
    muxy.exec(['false'])),
  'exec.timeout': () => run('exec(["sleep","5"], { timeoutMs: 500 })', () =>
    muxy.exec(['sleep', '5'], { timeoutMs: 500 })),
};

for (const button of document.querySelectorAll('button[data-call]')) {
  button.addEventListener('click', () => handlers[button.dataset.call]?.());
}
