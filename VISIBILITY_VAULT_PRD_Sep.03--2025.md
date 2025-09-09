# Visibility Vault - Product Requirements Document
**Date:** September 3, 2025  
**Version:** 1.1.0  
**Status:** ✅ PRODUCTION READY - ENHANCED PERSONALIZATION  

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
- **App Title:** "Who's Willing to Publish Your Project?"
- **Value Proposition:** "Get a free crypto media audit to see which trusted outlets you can get published on (Google News, CoinDesk, Business Insider, more)."
- **Field Prompt:** "What's your site + what do you offer in crypto?"
- **CTA Button:** "Reveal My Media Access Map"
- **Bonus Tip:** "🔐 This tool reveals where your project can appear — and unlocks your exclusive 30% off access."

### 2. Auto-Start Analysis & Enhanced Personalization
**URL Parameter Support:**
- `?url=https://company.com` - Pre-fills website URL field
- `?services=service1,service2,service3` - Pre-fills services textarea  
- `?email=contact@company.com` - Captures prospect email for tracking

**🆕 AUTO-START FEATURE:**
When both `url` and `services` parameters are present, analysis begins automatically after 500ms, creating seamless personalized experience.

**🆕 SERVICE SCANNING EFFECT:**
During auto-started analysis, services are displayed one-by-one with scanning animation:
- Format: "Scanning: **[service name]**" in highlighted blue
- Each service displays for 0.8 seconds
- Creates impression of intelligent service analysis
- Transitions to regular rotating messages after scanning

**Google Sheets Integration:**
```
="https://vault.brightestmoment.com/?url=" & ENCODEURL(AD2) & "&services=" & ENCODEURL(AB2) & "&email=" & ENCODEURL(H2)
```

### 3. AI-Powered Service Analysis
**🆕 Primary CTA Button:** "Reveal My Media Access Map"

**🆕 Updated Analysis Prompt Structure:**
```typescript
const prompt = `
You are an expert crypto marketing strategist and brand analyst. Your mission is to create a compelling, personalized "Visibility Blueprint" that shows where their project deserves to be seen.

## 📡 Here's Where Your Project Deserves to Be Seen

### Your highest-impact service = [identify the most media-worthy service from their list]
This is your "media magnet" — the most press-worthy part of your project that makes publishers say yes.

### Your Visibility Blueprint
We've matched this to crypto-specific Google News sites + trusted mainstream platforms like AP News, Business Insider & CoinDesk.

🛡️ These placements aren't open to everyone. But they are to you (for now).
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
**🆕 Manual Start:**
1. User clicks "Reveal My Media Access Map"  
2. **Tracking Event:** `analysis_started` recorded
3. Loading indicator with rotating messages (6-second duration):
   - "Analyzing Market Signals & Media Openings..."
   - "Identifying which of your services will attract the most media trust..."
   - "Scanning crypto media to match your offer with publisher demand..."
   - "Locating high-authority sites that would feature your brand..."
   - "Mapping visibility pathways across 75+ crypto news outlets..."

**🆕 Auto-Start (Personalized Links):**
1. Analysis begins automatically after 500ms delay
2. **Service Scanning Phase:** Shows "Scanning: [service]" for each service (0.8s each)
3. **Regular Messages Phase:** Transitions to rotating analysis messages
4. **Total Duration:** 6 seconds minimum
5. **Tracking Event:** `analysis_started` with `autoStarted: true` flag

### 4. Results Display
1. Streaming AI-generated content with markdown parsing
2. Enhanced formatting applied via JavaScript post-processing
3. Three-section Authority Playbook displayed

### 5. Conversion
**🆕 Updated CTA Section:**
1. CTA section reveals: "Get Featured on 75+ Crypto Outlets — with 30% Off"
2. Description: "We've matched this to crypto-specific Google News sites + trusted mainstream platforms like AP News, Business Insider & CoinDesk."
3. Exclusivity message: "🛡️ These placements aren't open to everyone. But they are to you (for now)."
4. User clicks "Claim My Visibility Campaign Now"
5. **Tracking Event:** `cta_clicked` recorded
6. Redirect to sales page: `https://visibility.brightestmoment.com/defi-distribution-offer.html`

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

## 🆕 Recent Updates - Version 1.1.0

### September 9, 2025 - Enhanced Personalization Update

**🎯 Copy & Messaging Overhaul:**
- Updated all three stages (Landing, Analyzing, Results) with media-focused messaging
- Changed from "Authority Playbook" to "Visibility Blueprint" framework
- Emphasized specific publication names (CoinDesk, Business Insider, AP News)
- Added exclusivity messaging: "These placements aren't open to everyone"

**🚀 Auto-Start Analysis Feature:**
- Implemented seamless auto-analysis for personalized links with URL + services parameters
- Added service scanning animation showing individual services being processed
- Creates professional, intelligent analysis impression for prospects
- Maintains 6-second minimum duration for optimal user experience

**💫 Enhanced User Experience:**
- Service scanning displays each service individually during auto-analysis  
- Updated rotating messages focused on media opportunities
- Improved visual hierarchy with better color highlighting
- Streamlined conversion flow with urgency-focused CTAs

**📊 Tracking Enhancements:**
- Added `autoStarted: true` flag for auto-initiated analysis
- Enhanced session tracking for personalized link performance
- Improved analytics for A/B testing different approaches

---

**Document Created:** September 3, 2025  
**Last Updated:** September 9, 2025  
**Version:** 1.1.0  
**Status:** ✅ Production Ready - Enhanced Personalization  
**Next Review:** September 16, 2025 (Post-personalization analysis)