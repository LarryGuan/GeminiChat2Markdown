document.getElementById('convertButton').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab.url.startsWith('https://gemini.google.com/share/')) {
      chrome.scripting.executeScript({
        target: {tabId: activeTab.id},
        files: ['content.js']
      }, () => {
        console.log('Content script executed');
        // Request markdown content from the content script
        chrome.tabs.sendMessage(activeTab.id, { action: 'getMarkdown' }, (response) => {
          if (response && response.markdownContent) {
            // Send the markdown content to the background script for download
            chrome.runtime.sendMessage({ action: 'downloadMarkdown', content: response.markdownContent });
            document.getElementById('status').textContent = 'Markdown downloaded!';
          } else {
            document.getElementById('status').textContent = 'Failed to get markdown content.';
          }
        });
      });
    } else {
      document.getElementById('status').textContent = 'Please open a Gemini share page.';
    }
  });
});