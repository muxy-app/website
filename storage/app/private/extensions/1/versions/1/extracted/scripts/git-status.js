function run(argv) {
  const result = muxy.exec(argv);
  return result.exitCode === 0 ? result.stdout.trim() : '';
}

const statusOutput = run(['git', 'status', '--short']);
const changedFiles = statusOutput.split('\n').filter(Boolean).length;

const branch = run(['git', 'rev-parse', '--abbrev-ref', 'HEAD']);
const repoPath = run(['git', 'rev-parse', '--show-toplevel']);
const repo = repoPath.split('/').filter(Boolean).pop() || '';
const totalCommits = Number(run(['git', 'rev-list', '--count', 'HEAD'])) || 0;

const recentCommits = run(['git', 'log', '-10', '--pretty=format:%h%x09%an%x09%s'])
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [hash, author, ...rest] = line.split('\t');
    return { hash, author, subject: rest.join('\t') };
  });

const contributorMap = new Map();
for (const name of run(['git', 'log', '--pretty=format:%an']).split('\n')) {
  if (!name) continue;
  contributorMap.set(name, (contributorMap.get(name) || 0) + 1);
}
const contributors = [...contributorMap.entries()]
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 10);

let aheadBehind = null;
const upstream = run(['git', 'rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']);
if (upstream) {
  const counts = run(['git', 'rev-list', '--left-right', '--count', `${upstream}...HEAD`]);
  const [behind, ahead] = counts.split('\t').map((n) => Number(n) || 0);
  aheadBehind = { ahead, behind };
}

console.log(`git dashboard: ${repo} on ${branch} (${changedFiles} changed)`);

muxy.tabs.open({
  kind: 'extensionWebView',
  extension: {
    id: muxy.extensionID,
    tabType: 'dashboard',
    data: {
      repo,
      branch,
      totalCommits,
      changedFiles,
      status: statusOutput,
      recentCommits,
      contributors,
      aheadBehind,
      generatedAt: new Date().toISOString(),
    },
  },
});
