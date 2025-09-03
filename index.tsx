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

// --- TRACKING FUNCTIONS ---

/**
 * Generates a unique session ID for tracking
 */
function generateSessionId(): string {
  return 'vault_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Tracks user interactions and sends to Google Sheets
 */
async function trackUserInteraction(eventType: 'analysis_started' | 'cta_clicked', additionalData: any = {}) {
  try {
    const sessionId = sessionStorage.getItem('visibilityVaultSessionId') || generateSessionId();
    if (!sessionStorage.getItem('visibilityVaultSessionId')) {
      sessionStorage.setItem('visibilityVaultSessionId', sessionId);
    }

    // Get prospect email from URL parameters if available
    const urlParams = new URLSearchParams(window.location.search);
    const prospectEmail = urlParams.get('email') || (window as any).prospectEmail;
    const websiteUrl = urlParams.get('url');

    const trackingData = {
      timestamp: new Date().toISOString(),
      sessionId: sessionId,
      eventType: eventType,
      email: prospectEmail || undefined,
      websiteUrl: websiteUrl || undefined,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent.substring(0, 200), // Truncate for sheet storage
      ...additionalData
    };

    // Send to Visibility Planner API endpoint
    const response = await fetch('https://visibility.brightestmoment.com/api/submit-defi-tracking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackingData)
    });

    if (!response.ok) {
      console.warn('Tracking request failed:', response.status);
    }
  } catch (error) {
    console.error('Error tracking user interaction:', error);
    // Fail silently - don't disrupt user experience
  }
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
 * Enhances the formatting of results for better readability.
 */
function enhanceResultsFormatting() {
  if (!resultsContainer) return;
  
  // Find and enhance bullet point formatting
  const paragraphs = resultsContainer.querySelectorAll('p');
  paragraphs.forEach(p => {
    const text = p.innerHTML;
    
    // Format the "benefit of benefit" structure bullet points
    const bulletPatterns = [
      /^(Initial Action:|Immediate Result:|Customer Perception:|AI & Algorithm Amplification:|Ultimate Outcome:)(.*)/i,
      /^(\*\*Initial Action:\*\*|\*\*Immediate Result:\*\*|\*\*Customer Perception:\*\*|\*\*AI & Algorithm Amplification:\*\*|\*\*Ultimate Outcome:\*\*)(.*)/i
    ];
    
    bulletPatterns.forEach(pattern => {
      if (pattern.test(text)) {
        p.innerHTML = text.replace(pattern, '<strong class="chain-bullet">$1</strong><span class="chain-text">$2</span>');
        p.classList.add('chain-benefit');
      }
    });
  });
  
  // Add better line breaks around sections
  const strongElements = resultsContainer.querySelectorAll('strong');
  strongElements.forEach(strong => {
    if (strong.textContent && strong.textContent.includes(':')) {
      strong.style.display = 'block';
      strong.style.marginTop = '0.8rem';
      strong.style.marginBottom = '0.3rem';
    }
  });
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
        enhanceResultsFormatting();
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
 * Parses URL parameters and pre-fills form fields for personalized outreach.
 */
function parseUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const companyUrl = urlParams.get('url');
  const services = urlParams.get('services');
  const email = urlParams.get('email');

  // Pre-fill website URL if provided
  if (companyUrl && websiteUrlInput) {
    (websiteUrlInput as HTMLInputElement).value = companyUrl;
  }

  // Pre-fill services if provided
  if (services && servicesInput) {
    (servicesInput as HTMLTextAreaElement).value = services;
  }

  // Store email for analytics/tracking (optional - you can use this in your prompt)
  if (email) {
    console.log('Prospect email:', email);
    // You can use this email in the analysis prompt if needed
    (window as any).prospectEmail = email;
  }
}

/**
 * Initializes the application.
 */
function initializeApp() {
  if (ctaButton) {
    (ctaButton as HTMLAnchorElement).href = SALES_PAGE_URL;
    
    // Add click tracking to CTA button
    ctaButton.addEventListener('click', () => {
      trackUserInteraction('cta_clicked', {
        ctaText: ctaButton.textContent,
        destinationUrl: SALES_PAGE_URL
      });
    });
  }

  // Parse URL parameters and pre-fill form fields
  parseUrlParameters();

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

    // Track analysis started
    trackUserInteraction('analysis_started', {
      websiteUrl: websiteUrl,
      servicesCount: services.split(',').length,
      servicesLength: services.length
    });

    runAnalysis(websiteUrl, services);
  });
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', initializeApp);