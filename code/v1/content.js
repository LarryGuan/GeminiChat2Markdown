// content.js

// Function to extract chat data
function extractChatData() {
  const chatTurns = document.querySelectorAll('share-turn-viewer');
  const chatData = [];

  chatTurns.forEach(turn => {
    const userQuery = turn.querySelector('user-query');
    const responseContainer = turn.querySelector('response-container');

    if (userQuery) {
      const userTextElement = userQuery.querySelector('.query-text');
      if (userTextElement) {
        const clonedUserTextElement = userTextElement.cloneNode(true);
        const codeBlocks = clonedUserTextElement.querySelectorAll('pre, code');
        let codeBlockMarkdown = [];
        codeBlocks.forEach((block, index) => {
          const placeholder = `CODE_BLOCK_PLACEHOLDER_USER_${index}`;
          if (block.tagName === 'PRE') {
            codeBlockMarkdown.push(`\n\`\`\`\n${block.innerText}\n\`\`\`\n`);
          } else if (block.tagName === 'CODE') {
            codeBlockMarkdown.push(`\`${block.innerText}\` `);
          }
          block.replaceWith(document.createTextNode(placeholder));
        });

        let textContent = clonedUserTextElement.innerText || '';

        codeBlockMarkdown.forEach((md, index) => {
          const placeholder = `CODE_BLOCK_PLACEHOLDER_USER_${index}`;
          textContent = textContent.replace(placeholder, md);
        });
        chatData.push({ speaker: 'User', text: textContent.trim() });
      }
    }

    if (responseContainer) {
      const responsePanel = responseContainer.querySelector('.markdown.markdown-main-panel');
      if (responsePanel) {
        // Clone the response panel to manipulate it without affecting the original DOM
        const clonedResponsePanel = responsePanel.cloneNode(true);

        // Extract and replace code blocks with placeholders
        const codeBlocks = clonedResponsePanel.querySelectorAll('pre, code');
        let codeBlockMarkdown = [];
        codeBlocks.forEach((block, index) => {
          const placeholder = `CODE_BLOCK_PLACEHOLDER_${index}`;
          if (block.tagName === 'PRE') {
            codeBlockMarkdown.push(`\n\`\`\`\n${block.innerText}\n\`\`\`\n`);
          } else if (block.tagName === 'CODE') {
            codeBlockMarkdown.push(`\`${block.innerText}\` `);
          }
          block.replaceWith(document.createTextNode(placeholder));
        });

        // Get the remaining text content
        let textContent = clonedResponsePanel.innerText || '';

        // Replace placeholders with actual markdown code blocks
        codeBlockMarkdown.forEach((md, index) => {
          const placeholder = `CODE_BLOCK_PLACEHOLDER_${index}`;
          textContent = textContent.replace(placeholder, md);
        });
        chatData.push({ speaker: 'Gemini', text: textContent.trim() });
      }
    }
  });

  return chatData;
}

// Function to convert chat data to Markdown
function convertToMarkdown(chatData) {
  let markdown = '';

  // Extract title and creation time from the page
  // Extract title from document.title and clean it for filename usage
  let title = document.title.replace(/\s*-\s*Gemini$/i, '').trim(); // Remove " - Gemini" suffix
  if (!title) {
    title = 'Gemini Chat Record';
  }
  // Clean title for filename: remove special characters, keep only alphanumeric, Chinese, and spaces
  title = title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5\s]/g, '').trim();
  // Replace multiple spaces with a single underscore
  title = title.replace(/\s+/g, '_');

  const publishTimeElement = document.querySelector('.publish-time-text');
  const publishTime = publishTimeElement ? publishTimeElement.innerText.replace('发布时间：', '') : 'Unknown Date';

  const sourceUrl = window.location.href;

  markdown += `# ${title}\n\n`;
  markdown += `**Source:** [${sourceUrl}](${sourceUrl})\n`;
  markdown += `**Created:** ${publishTime}\n\n`;
  markdown += `---\n\n`;

  chatData.forEach(item => {
    if (item.speaker === 'User') {
      markdown += `## User\n${item.text}\n\n`;
    } else if (item.speaker === 'Gemini') {
      markdown += `## Gemini\n${item.text}\n\n`;
    }
  });

  return markdown;
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getMarkdown') {
    const chatData = extractChatData();
    const markdownContent = convertToMarkdown(chatData);
    sendResponse({ markdownContent: markdownContent });
  }
});