document.addEventListener('DOMContentLoaded', () => {
  // 1) Render the top-4 tasks
  const tasks = [
    { rank: 1, title: 'Hello World', payout: '5 fake' },
    { rank: 2, title: 'Dummy Task 1', payout: '4 ETH' },
    { rank: 3, title: 'Dummy Task 2', payout: '3 ETH' },
    { rank: 4, title: 'Dummy Task 3', payout: '2 ETH' },
  ];
  const list = document.getElementById('rankingList');
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.textContent = `#${t.rank} – ${t.title} (${t.payout})`;
    list.appendChild(li);
  });

  // 2) Wire up your “Add task” button
  const btn = document.getElementById('addTask');
  if (btn) {
    btn.addEventListener('click', () => {
      chrome.storage.local.get('count', data => {
        let c = (data.count || 0) + 1;
        chrome.storage.local.set({ count: c });
        alert(`Clicked ${c} times`);
      });
    });
  }
});