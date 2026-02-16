# AI Prompts Documentation

This document outlines both the **System Prompts** used within the application logic and the **Development Prompts** used to assist in generating the code, ensuring transparency in the development process.

---

## Part 1: Application Prompts (Internal Logic)

The following prompt is injected into the Llama 3.3 model (System Message) to define the assistant's persona and behavior within the application.

**System Prompt:**
> "You are an expert financial trading assistant. You specialize in HFT, Algorithms, and Market Structure. Provide technical, concise, and accurate answers. Use Markdown for code."

**Context Strategy:**
* The application injects the last 10 turns of conversation history from Cloudflare KV before the new user query to simulate memory.

---

## Part 2: Development Prompts (AI-Assisted Coding)

I utilized an LLM (Gemini/ChatGPT) to assist with debugging, code structure, and frontend generation. Below are the primary prompts used during development:

### 1. Project Setup & Debugging
> "I am getting a Node.js version error when installing Wrangler on WSL. How do I fix this using NVM?"
> "How do I resolve 'TLS peer certificate not trusted' error when running wrangler dev locally?"

### 2. Core Logic Implementation
> "Write a Cloudflare Worker script in TypeScript that uses Workers AI (Llama 3.3) and Workers KV to store chat history. It needs to handle a sliding window of context."
> "How do I split the monolithic index.ts file into separate files for types, UI, and logic?"

### 3. Frontend & UI
> "Create a simple HTML/CSS frontend for a chat interface. It should support Markdown rendering for code blocks."
> "Update the frontend code to fetch the API response and display it with a loading state."

### 4. Documentation
> "Generate a professional README.md for a Cloudflare AI project, including setup instructions for KV and Wrangler."