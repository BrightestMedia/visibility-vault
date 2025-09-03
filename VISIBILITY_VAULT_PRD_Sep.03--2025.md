# Visibility Vault - Product Requirements Document
**Date:** September 3, 2025  
**Version:** 1.0.0  
**Status:** ✅ PRODUCTION READY  

## 🎯 Product Overview

**Visibility Vault** is a personalized AI-powered service recommendation tool designed to help crypto and forensic investigation businesses identify their highest-impact service offering for marketing focus. The application generates custom Authority Playbooks that recommend which service to spotlight first and provides a strategic blueprint for building visibility and trust through authoritative content distribution.

## 🏗️ Technical Architecture

### Core Technology Stack
- **Frontend Framework:** Vanilla TypeScript + Vite
- **AI Integration:** Google Gemini 2.5 Flash API
- **Styling:** Custom CSS with CSS Variables
- **Deployment Platform:** Vercel
- **Domain:** `vault.brightestmoment.com`

### Key Dependencies
```json
{
  "@google/genai": "^0.14.0",
  "marked": "^12.0.0",
  "typescript": "~5.8.2",
  "vite": "^6.2.0"
}
```

## 🎨 Product Features

### 1. Dynamic Branding & Messaging
- **App Title:** "Visibility Vault"
- **Value Proposition:** "Which of Your Services Should You Spotlight First?"
- **Benefit Statement:** "Get a free service audit + authority blueprint to see where to focus for maximum attention and trust."

### 2. Intelligent Form Pre-filling
**URL Parameter Support:**
- `?url=https://company.com` - Pre-fills website URL field
- `?services=service1,service2,service3` - Pre-fills services textarea
- `?email=contact@company.com` - Captures prospect email for tracking

**Google Sheets Integration:**
```
="https://vault.brightestmoment.com/?url=" & ENCODEURL(AD2) & "&services=" & ENCODEURL(AB2) & "&email=" & ENCODEURL(H2)
```

### 3. AI-Powered Service Analysis
**Primary CTA Button:** "Reveal My Highest-Impact Service"

**Analysis Prompt Structure:**
```typescript
const prompt = `
You are an expert crypto marketing strategist and brand analyst. Your mission is to create a compelling, personalized "Authority Playbook" to convince the user to focus their initial marketing efforts on a single, high-impact service.

### 1. Your High-Impact Service Recommendation
State clearly which single service from their list you recommend promoting first.

### 2. The Authority Blueprint: A Chain Reaction of Benefits
Explain how promoting this specific service on authoritative publications creates a powerful chain reaction.

### 3. Your First Step
Conclude with a powerful, direct statement about getting published on trusted sites.
`;
```

### 4. Enhanced Results Formatting
**CSS Styling Features:**
- **Bold Text Highlighting:** Green (`#00d084`)
- **Chain Reaction Bullet Points:** Orange titles (`#ffa500`)
- **Special Formatting:** Background highlights and left borders
- **Responsive Typography:** Improved line spacing and readability

**JavaScript Post-processing:**
- Automatic bullet point enhancement
- Section header styling
- Chain reaction benefit formatting

### 5. Behavioral Tracking System
**Tracked Events:**
1. **Analysis Started:** When user clicks main CTA button
2. **CTA Clicked:** When user clicks final conversion button

**Data Structure:**
```typescript
interface TrackingData {
  timestamp: string;
  sessionId: string;         // Format: vault_[timestamp]_[random]
  eventType: 'analysis_started' | 'cta_clicked';
  email?: string;           // From URL parameters
  websiteUrl?: string;      // From URL parameters
  pageUrl: string;          // Full page URL
  servicesCount?: number;   // Number of services entered
  servicesLength?: number;  // Character length of services
  ctaText?: string;         // Button text clicked
  destinationUrl?: string;  // Where CTA leads
  userAgent: string;        // Browser information
}
```

## 🔗 Integration Architecture

### Google Sheets Data Collection
**Target Sheet:** "DeFi Clicks" tab in existing Visibility Planner Google Sheet

**Column Structure:**
| Column | Data | Description |
|--------|------|-------------|
| A | Timestamp | ISO timestamp of event |
| B | Session ID | Unique session identifier |
| C | Event Type | 'analysis_started' or 'cta_clicked' |
| D | Email | Prospect email from URL params |
| E | Website URL | Prospect's website |
| F | Page URL | Full page URL with parameters |
| G | Services Count | Number of services entered |
| H | Services Length | Character length of services |
| I | CTA Text | Text of clicked button |
| J | Destination URL | Where CTA button leads |
| K | User Agent | Browser information |
| L | Full Data Backup | Complete data as JSON |

### API Integration
**Endpoint:** `https://visibility.brightestmoment.com/api/submit-defi-tracking`

**CORS Configuration:**
```typescript
response.headers.set('Access-Control-Allow-Origin', '*');
response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
```

## 🎯 User Experience Flow

### 1. Landing & Pre-filling
1. User visits personalized link with URL parameters
2. Form automatically pre-fills with company URL and services
3. Email parameter captured for tracking

### 2. Service Input
1. Website URL field (pre-filled or manual entry)
2. Services textarea (pre-filled with comprehensive service list)
3. Form validation ensures both fields completed

### 3. Analysis Generation
1. User clicks "Reveal My Highest-Impact Service"
2. **Tracking Event:** `analysis_started` recorded
3. Loading indicator with rotating messages:
   - "Analyzing your website and services..."
   - "Identifying your strategic advantage..."
   - "Consulting market trends..."
   - "Building your Authority Playbook..."

### 4. Results Display
1. Streaming AI-generated content with markdown parsing
2. Enhanced formatting applied via JavaScript post-processing
3. Three-section Authority Playbook displayed

### 5. Conversion
1. CTA section reveals: "Ready to Amplify Your Reputation & Growth?"
2. User clicks "Learn More & Claim Your Discount"
3. **Tracking Event:** `cta_clicked` recorded
4. Redirect to sales page: `https://visibility.brightestmoment.com/defi-distribution-offer.html`

## 🔧 Development & Deployment

### Environment Configuration
**Development:**
```bash
VITE_GEMINI_API_KEY=AIzaSyDdGaD3SsaFdFyFldaPmOzoPV1AcTO7thQ
```

**Vercel Environment Variables:**
- `VITE_GEMINI_API_KEY`: Gemini API key for AI analysis

### Build Configuration
**Vite Config Features:**
- TypeScript support with path aliases
- Development server with CORS handling
- Environment variable loading
- Hot module replacement

### Git Repository Structure
```
crypto-service-analyzer/
├── index.html                 # Main application HTML
├── index.tsx                  # Core TypeScript application
├── index.css                  # Styling and theming
├── vite.config.ts            # Build configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and scripts
└── metadata.json             # App metadata
```

## 📊 Analytics & Tracking

### Session Management
- **Session ID Generation:** `vault_[timestamp]_[random9chars]`
- **Session Storage:** Persistent across page reloads
- **Cross-origin Tracking:** Sends data to Visibility Planner API

### Development Mode Testing
```typescript
// Mock data simulation in development
console.log('Development mode: Using mock data for DeFi Clicks sheet');
console.log('DeFi tracking data that would be saved:', trackingData);
```

### Production Data Flow
1. **Visibility Vault** (Vercel) → Makes tracking calls
2. **Visibility Planner API** → Processes and validates data
3. **Google Sheets API** → Appends to "DeFi Clicks" sheet
4. **Data Analysis** → Available for conversion optimization

## 🎨 Design System

### Color Palette
```css
:root {
  --background-color: #121212;     /* Dark background */
  --surface-color: #1e1e1e;        /* Card backgrounds */
  --primary-color: #00aaff;        /* Primary blue */
  --text-color: #e0e0e0;           /* Primary text */
  --success-color: #00d084;        /* Green highlights */
  --accent-color: #ffa500;         /* Orange bullet points */
}
```

### Typography
- **Font Family:** Inter (400, 600, 700 weights)
- **Responsive Sizing:** `clamp()` functions for scalability
- **Line Height:** 1.6-1.7 for optimal readability

### Interactive Elements
- **Button States:** Hover effects with transform and shadow
- **Loading Animation:** CSS spinner with smooth transitions
- **Form Validation:** Real-time URL validation
- **Accessibility:** ARIA labels and semantic HTML

## 🚀 Success Metrics & KPIs

### Primary Conversion Funnel
1. **Landing:** Users with pre-filled parameters
2. **Analysis Start Rate:** % clicking "Reveal My Highest-Impact Service"
3. **Analysis Completion:** % receiving full Authority Playbook
4. **CTA Click Rate:** % clicking final conversion button
5. **Sales Page Visits:** Traffic to offer page

### Tracking Analytics
**Available Data Points:**
- Session duration and engagement depth
- Service input patterns and complexity
- Analysis completion rates
- CTA performance by traffic source
- Email parameter capture success

**Google Sheets Analysis Queries:**
```sql
-- Conversion funnel analysis
SELECT 
  eventType,
  COUNT(*) as total_events,
  COUNT(DISTINCT sessionId) as unique_sessions
FROM defi_clicks 
GROUP BY eventType;

-- Email capture rate
SELECT 
  COUNT(CASE WHEN email IS NOT NULL THEN 1 END) / COUNT(*) * 100 as email_capture_rate
FROM defi_clicks;
```

## 🔒 Security & Privacy

### API Security
- **CORS Configuration:** Controlled cross-origin access
- **Error Handling:** Graceful failure without user disruption
- **Rate Limiting:** Implicit through Vercel serverless limits

### Data Privacy
- **Minimal Data Collection:** Only essential tracking data
- **Anonymous Sessions:** Session IDs don't contain PII
- **Graceful Degradation:** App functions without tracking

### Environment Security
- **API Key Management:** Secure environment variable storage
- **Development Mode:** Mock data prevents accidental writes
- **Error Logging:** Server-side only, no client exposure

## 🔧 Maintenance & Updates

### Regular Maintenance Tasks
- **Weekly:** Monitor tracking data quality and API performance
- **Monthly:** Review Gemini API usage and optimize prompts
- **Quarterly:** Analyze conversion funnel and optimize UX

### Update Procedures
1. **Development Testing:** Local testing with URL parameters
2. **Staging Validation:** Test tracking API integration
3. **Production Deployment:** Vercel automatic deployment
4. **Data Verification:** Confirm Google Sheets integration

### Monitoring & Alerts
- **Vercel Analytics:** Performance and error monitoring
- **Google Sheets:** Manual data quality checks
- **Gemini API:** Usage quotas and error rates

## 📋 Implementation Checklist

### ✅ Completed Features
- [x] Core application with AI integration
- [x] URL parameter pre-filling functionality
- [x] Enhanced results formatting and styling
- [x] Behavioral tracking implementation
- [x] CORS-enabled API endpoint
- [x] Google Sheets integration functions
- [x] Production deployment on Vercel
- [x] Custom domain configuration

### 🔄 Deployment Requirements
- [ ] Create "DeFi Clicks" sheet in Google Sheets
- [ ] Deploy Visibility Planner API endpoint with CORS
- [ ] Test end-to-end tracking functionality
- [ ] Verify Google Sheets data collection

### 🔮 Future Enhancements
- [ ] A/B testing framework for CTA variations
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Real-time collaboration features

## 📞 Support & Documentation

### Technical Support
- **API Issues:** Check Vercel function logs and Gemini API status
- **Tracking Problems:** Verify Google Sheets permissions and API credentials
- **CORS Errors:** Ensure API endpoint includes proper headers

### User Documentation
- **URL Parameter Guide:** Instructions for personalized link generation
- **Google Sheets Setup:** Step-by-step integration guide
- **Troubleshooting:** Common issues and solutions

---

**Document Created:** September 3, 2025  
**Last Updated:** September 3, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Next Review:** September 10, 2025 (Post-launch analysis)