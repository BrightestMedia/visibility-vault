/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI } from '@google/genai';
import { marked } from 'marked';

// --- CONFIGURATION ---
// IMPORTANT: Your sales page URL goes here.
const SALES_PAGE_URL = 'https://visibility.brightestmoment.com/defi-distribution-offer.html'; 

// --- DOM ELEMENT SELECTORS ---
const websiteUrlInput = document.getElementById('website-url-input');
const servicesInput = document.getElementById('services-input');
const analyzeBtn = document.getElementById('analyze-btn');
const inputContainer = document.getElementById('input-container');
const loadingIndicator = document.getElementById('loading-indicator');
const loadingText = document.getElementById('loading-text');
const resultsContainer = document.getElementById('results-container');
const ctaContainer = document.getElementById('cta-container');
const ctaButton = document.querySelector('.cta-button');


// --- GEMINI API SETUP ---
let ai;
try {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not set in environment variables");
  }
  ai = new GoogleGenAI({ apiKey });
} catch (error) {
  console.error("Failed to initialize GoogleGenAI:", error);
  alert("Could not initialize the AI service. Please ensure the API key is set up correctly in .env.local file.");
}

// --- CORE FUNCTIONS ---

/**
 * Creates the prompt for the Gemini API based on user-provided services and website URL.
 * @param {string} websiteUrl - The user's website URL.
 * @param {string} services - A string containing the user's services.
 * @returns {string} The formatted prompt.
 */
function createPrompt(websiteUrl, services) {
  return `
You are an expert crypto marketing strategist and brand analyst. Your mission is to create a compelling, personalized "Authority Playbook" to convince the user to focus their initial marketing efforts on a single, high-impact service.

Analyze the user's business based on their website URL (${websiteUrl}) and their list of services. Then, generate a report using Markdown with the following structure:

### 1. Your High-Impact Service Recommendation
State clearly which single service from their list you recommend promoting first. Justify your choice concisely, explaining why it's the best strategic starting point to attract high-value clients and establish market leadership in the current crypto landscape.

### 2. The Authority Blueprint: A Chain Reaction of Benefits
Explain how promoting this specific service on authoritative, Google News-approved crypto publications creates a powerful chain reaction of benefits. Frame this as "The Compound Effect of Brand Strength."

Use a "benefit of the benefit" structure. Integrate these points naturally:
- **Initial Action:** Getting featured on trusted crypto sites and publications like USA Today or Business Insider.
- **Immediate Result:** This triggers higher search rankings, often overnight.
- **Customer Perception:** Potential customers searching for solutions see you as the obvious, trusted choice.
- **AI & Algorithm Amplification:** AI platforms (like Google's SGE) begin to cite you as a trusted source, and social/search algorithms start recommending your content.
- **Ultimate Outcome:** This builds massive authority, making client acquisition easier and establishing you as a leader.

### 3. Your First Step
Conclude with a powerful, direct statement that this entire chain reaction starts with one strategic decision: getting published on the world's most trusted sites.

Keep the entire report under 400 words. Be direct, insightful, and highly persuasive.

Here is the user's data:
- Website: ${websiteUrl}
- Services:
---
${services}
---
  `;
}

/**
 * Runs the Gemini analysis and streams the results.
 * @param {string} websiteUrl - The user-provided website URL.
 * @param {string} services - The user-provided services.
 */
async function runAnalysis(websiteUrl, services) {
  if (!ai) {
    alert("AI service is not available.");
    return;
  }
  
  // Hide input and show loader
  analyzeBtn?.setAttribute('disabled', 'true');
  inputContainer?.classList.add('hidden');
  loadingIndicator?.classList.remove('hidden');
  resultsContainer?.classList.remove('hidden');

  // Loading messages
  const loadingMessages = [
    "Analyzing your website and services...",
    "Identifying your strategic advantage...",
    "Consulting market trends...",
    "Building your Authority Playbook...",
  ];
  let messageIndex = 0;
  const messageInterval = setInterval(() => {
    messageIndex = (messageIndex + 1) % loadingMessages.length;
    if (loadingText) loadingText.textContent = loadingMessages[messageIndex];
  }, 2500);

  try {
    const prompt = createPrompt(websiteUrl, services);
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let fullResponse = '';
    for await (const chunk of responseStream) {
      fullResponse += chunk.text;
      if (resultsContainer) {
        resultsContainer.innerHTML = marked.parse(fullResponse) as string;
      }
    }
  } catch (error) {
    console.error("Error during Gemini API call:", error);
    if(resultsContainer) {
      let errorMessage = '<p style="color: #ff4d4d;">An error occurred while generating your report.</p>';
      
      if (error instanceof Error) {
        if (error.message.includes('API_KEY')) {
          errorMessage = '<p style="color: #ff4d4d;">API key is missing or invalid. Please check your .env.local file.</p>';
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          errorMessage = '<p style="color: #ff4d4d;">API quota exceeded. Please try again later.</p>';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = '<p style="color: #ff4d4d;">Network error. Please check your connection and try again.</p>';
        }
      }
      
      resultsContainer.innerHTML = errorMessage + '<button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Try Again</button>';
    }
  } finally {
    clearInterval(messageInterval);
    loadingIndicator?.classList.add('hidden');
    ctaContainer?.classList.remove('hidden');
  }
}

/**
 * Initializes the application.
 */
function initializeApp() {
  if (ctaButton) {
    (ctaButton as HTMLAnchorElement).href = SALES_PAGE_URL;
  }

  analyzeBtn?.addEventListener('click', () => {
    const services = (servicesInput as HTMLTextAreaElement)?.value;
    const websiteUrl = (websiteUrlInput as HTMLInputElement)?.value;
    
    if (!websiteUrl.trim() || !services.trim()) {
      alert('Please enter your website URL and at least one service.');
      return;
    }

    try {
        new URL(websiteUrl);
    } catch (_) {
        alert('Please enter a valid website URL (e.g., https://example.com).');
        return;
    }

    runAnalysis(websiteUrl, services);
  });
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', initializeApp);