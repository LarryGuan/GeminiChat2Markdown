# Gemini Chat to Markdown Converter

This Chrome extension allows you to convert shared Gemini chat records into a clean, question-and-answer formatted Markdown file.

## Features

- Extracts user queries and Gemini responses from shared Gemini chat pages.
- Converts the extracted content into a structured Markdown format.
- Automatically generates a filename based on the chat title and current date/time.
- Prompts you to choose a download location for the Markdown file.

## Installation

1.  **Download the extension:** Clone or download this repository to your local machine.
2.  **Open Chrome Extensions page:**
    *   Open Chrome browser.
    *   Type `chrome://extensions` in the address bar and press Enter.
    *   Alternatively, click on the three-dot menu (⋮) in the top-right corner, go to `More tools`, and then click `Extensions`.
3.  **Enable Developer mode:**
    *   On the Extensions page, toggle on the `Developer mode` switch located in the top-right corner.
4.  **Load the unpacked extension:**
    *   Click on the `Load unpacked` button that appears after enabling Developer mode.
    *   Navigate to the directory where you cloned/downloaded this repository (`GeminiChat2Markdown`).
    *   Select the folder and click `Select`.
5.  **Extension is installed:** The "Gemini Chat to Markdown Converter" extension should now appear in your list of installed extensions.

## Usage

1.  **Navigate to a Gemini Share Page:** Go to any shared Gemini chat page (e.g., `https://gemini.google.com/share/...`).
2.  **Click the Extension Icon:** Click on the "Gemini Chat to Markdown Converter" icon in your Chrome toolbar.
3.  **Click "Convert to Markdown":** In the popup, click the "Convert to Markdown" button.
4.  **Save the File:** A download prompt will appear, allowing you to choose where to save your Markdown file. The filename will be automatically generated based on the chat title and timestamp.

## Development Notes

*   **Icons:** The `images/` directory contains placeholder PNG files. **You MUST replace these with actual PNG image files** of the appropriate sizes (16x16, 48x48, 128x128 pixels) for the extension to load correctly. Chrome extensions do not support SVG icons directly for `action` icons.
*   **Reload Extension:** If you encounter errors like 'Could not load icon...' after updating the `manifest.json` or replacing icon files, please ensure you have reloaded the extension on the `chrome://extensions` page.
*   **Content Script:** The `content.js` script is injected into the Gemini share page to extract chat data. It relies on specific HTML structures (`<share-turn-viewer>`, `<user-query>`, `<response-container>`, `.query-text`, `.markdown.markdown-main-panel`). If Gemini's HTML structure changes, this script may need updates.
*   **Background Script:** The `background.js` handles messages from the content script and manages the file download process.

## License

This project is open source and available under the [MIT License](LICENSE). (Note: A `LICENSE` file is not included in this initial setup, but it's good practice to add one.)