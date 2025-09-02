// 下载 Markdown 功能
document.getElementById('downloadButton').addEventListener('click', () => {
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
            const statusEl = document.getElementById('status');
            statusEl.textContent = '✅ Markdown 文件已下载！';
            statusEl.className = 'status-success show';
          } else {
            const statusEl = document.getElementById('status');
             statusEl.textContent = '❌ 获取 Markdown 内容失败。';
             statusEl.className = 'status-error show';
          }
        });
      });
    } else {
      const statusEl = document.getElementById('status');
        statusEl.textContent = 'ℹ️ 请打开 Gemini 分享页面。';
        statusEl.className = 'status-info show';
    }
  });
});

// 复制 Markdown 功能
document.getElementById('copyButton').addEventListener('click', () => {
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
            // Copy to clipboard
            navigator.clipboard.writeText(response.markdownContent).then(() => {
              const statusEl = document.getElementById('status');
              statusEl.textContent = '📋 Markdown 已复制到剪贴板！';
              statusEl.className = 'status-success show';
            }).catch(err => {
              console.error('复制失败:', err);
              const statusEl = document.getElementById('status');
           statusEl.textContent = '❌ 复制失败，请重试。';
           statusEl.className = 'status-error show';
            });
          } else {
            const statusEl = document.getElementById('status');
            statusEl.textContent = '❌ 获取 Markdown 内容失败。';
            statusEl.className = 'status-error show';
           }
         });
       });
     } else {
       const statusEl = document.getElementById('status');
       statusEl.textContent = 'ℹ️ 请打开 Gemini 分享页面。';
       statusEl.className = 'status-info show';
    }
  });
});