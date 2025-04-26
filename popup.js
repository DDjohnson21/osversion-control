document.getElementById('clickme')
  .addEventListener('click', () => {
    chrome.storage.local.get('count', data => {
      let c = (data.count || 0) + 1;
      chrome.storage.local.set({ count: c });
      alert(`Clicked ${c} times`);
    });
  });