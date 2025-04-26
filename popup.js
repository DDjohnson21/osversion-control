// popup.js
const REPO = 'DDjohnson21/testRepo';
const DEFAULT_PAYOUT = '5 ETH';

async function fetchOpenIssues() {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/issues?state=open&sort=created&direction=desc`
  );
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

function renderIssues(issues) {
  const ul = document.getElementById('rankingList');
  ul.innerHTML = '';

  if (issues.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No open issues';
    ul.appendChild(li);
    return;
  }

  issues.forEach((issue, idx) => {
    const li = document.createElement('li');
    // You can rank them by creation order (1 = newest), or show the issue number:
    li.textContent = `#${idx + 1} – ${issue.title} (Issue #${issue.number}, ${DEFAULT_PAYOUT})`;
    ul.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  let issues = [];
  try {
    issues = await fetchOpenIssues();
  } catch (e) {
    console.error('GitHub API error', e);
  }
  renderIssues(issues);

  // Optional: keep your “Add/Pin” button if you still want manual overrides:
  document.getElementById('addTask').style.display = 'none';
});