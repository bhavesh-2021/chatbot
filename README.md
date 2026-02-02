# React AI bot with SSE Streaming

This app demonstrats how to integrate Server-Sent Events (SSE) for streaming AI responses in a React.js application. The project provides a simple example of real-time AI output, simulating a ChatGPT-like interface with incremental, typewriter-style updates.

## 🚀 Features

* **Real-time Streaming**: Word-by-word "typewriter" effect using `ReadableStream`.
* **Custom Hook Logic**: Encapsulated streaming logic in `useChatBotResponse`.
* **Modern UI**: Styled with Tailwind CSS and `@tailwindcss/typography` for professional Markdown rendering.
* **Type Safe**: Fully typed with TypeScript, including React 19 specific event handling.

## 🛠️ Tech Stack

* **Framework**: [React 19](https://react.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Language**: [TypeScript](https://www.typescript.org/)
* **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown)
* **API**: [Hugging Face Inference Router](https://huggingface.co/docs/inference-providers/tasks/chat-completion)

## ⚙️ Local Setup
1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Copy the `.env.sample` file to a new file named `.env`:
    ```bash
    cp .env.sample .env
    ```
    Open `.env` and paste Hugging Face token:
    ```env
    VITE_HF_TOKEN=hf_your_token_here
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## 🧠 Architecture: How it Works

The project is split into two main parts:

### 1. The Logic Hook (`useChatBotResponse.ts`)
This hook manages the binary stream. It uses `fetch` to connect to the Hugging Face SSE endpoint. It uses a **buffer** strategy to handle partial JSON chunks, ensuring the app doesn't crash if a network packet cuts a JSON string in half.

### 2. The UI Component (`App.tsx`)
A clean, responsive Tailwind interface that consumes the hook. It uses `react-markdown` to render the AI's response with proper formatting (bold, lists, etc.) and handles auto-scrolling to the bottom as new text arrives.
