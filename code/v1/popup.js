// 初始化国际化文本
function initializeI18n() {
  document.getElementById('downloadText').textContent = chrome.i18n.getMessage('downloadButton');
  document.getElementById('copyText').textContent = chrome.i18n.getMessage('copyButton');
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', initializeI18n);

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
            statusEl.textContent = chrome.i18n.getMessage('downloadSuccess');
            statusEl.className = 'status-success show';
          } else {
            const statusEl = document.getElementById('status');
             statusEl.textContent = chrome.i18n.getMessage('extractionFailed');
             statusEl.className = 'status-error show';
          }
        });
      });
    } else {
      const statusEl = document.getElementById('status');
        statusEl.textContent = chrome.i18n.getMessage('openGeminiShare');
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
              statusEl.textContent = chrome.i18n.getMessage('copySuccess');
              statusEl.className = 'status-success show';
            }).catch(err => {
              console.error('复制失败:', err);
              const statusEl = document.getElementById('status');
           statusEl.textContent = chrome.i18n.getMessage('extractionFailed');
           statusEl.className = 'status-error show';
            });
          } else {
            const statusEl = document.getElementById('status');
            statusEl.textContent = chrome.i18n.getMessage('extractionFailed');
            statusEl.className = 'status-error show';
           }
         });
       });
     } else {
       const statusEl = document.getElementById('status');
       statusEl.textContent = chrome.i18n.getMessage('openGeminiShare');
       statusEl.className = 'status-info show';
    }
  });
});