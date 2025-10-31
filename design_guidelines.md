# RDS Resume Checker - Design Guidelines

## Design Approach: Professional Productivity Tool

**Selected Approach**: Design System-inspired (Linear + Grammarly hybrid)
**Justification**: This is a utility-focused professional tool where trust, clarity, and efficiency are paramount. Users are sharing sensitive career documents and need confidence in the service.

## Core Design Elements

### A. Color Palette

**Light Mode**:
- Primary: 236 100% 59% (Vibrant blue - trust, professionalism)
- Background: 0 0% 100% (Pure white)
- Surface: 220 13% 97% (Light gray for cards)
- Text Primary: 220 13% 18%
- Text Secondary: 220 9% 46%
- Success: 142 76% 36% (Pass indicators)
- Warning: 38 92% 50% (Needs improvement)
- Error: 0 84% 60% (Fail indicators)

**Dark Mode**:
- Primary: 236 100% 59%
- Background: 220 13% 10%
- Surface: 220 13% 15%
- Text Primary: 220 13% 91%
- Text Secondary: 220 9% 65%

### B. Typography

**Font Family**: 
- Primary: Inter (via Google Fonts)
- Monospace: 'Fira Code' for scores/data

**Hierarchy**:
- Hero Headline: text-5xl/6xl, font-bold, tracking-tight
- Section Headers: text-3xl/4xl, font-semibold
- Card Titles: text-xl, font-semibold
- Body: text-base, font-normal
- Small/Meta: text-sm, text-secondary

### C. Layout System

**Spacing Units**: Consistent use of 4, 6, 8, 12, 16, 24 (e.g., p-4, gap-6, py-8, space-y-12, px-16, py-24)

**Container Widths**:
- Hero/Full sections: max-w-7xl
- Content sections: max-w-6xl
- Form areas: max-w-2xl
- Reading content: max-w-prose

**Grid System**: 
- Upload section: Single column, centered
- Results categories: 2-column grid (lg:grid-cols-2)
- Individual checks: Single column list with clear spacing

### D. Component Library

**Hero Section**:
- Clean, professional hero with subtle gradient background (primary to lighter tint)
- Large, confident headline emphasizing "Free, Fast, AI-Powered"
- Concise value proposition (1-2 sentences)
- Prominent "Upload Resume" CTA button
- Trust indicators: "No signup required • Secure • Results in seconds"
- Small visual element: Abstract illustration of resume/document analysis (not a large hero image)

**File Upload Component**:
- Large drag-and-drop zone with dashed border
- File type/size specifications clearly displayed
- Upload icon and clear microcopy
- Progress indicator during upload
- Immediate parsing simulation feedback

**Score Display Cards**:
- Two prominent score circles/badges side-by-side
- Left: ATS Parseability Score (0-100)
- Right: Writing Quality Score (0-100)
- Color-coded by performance (green 80+, yellow 60-79, red <60)
- Overall grade prominently displayed above

**Check Categories Section**:
- Five expandable category cards: Content, Format, Skills, Sections, Style
- Each card shows: category icon, name, checks passed/total
- Click to expand reveals individual checks
- Each check has: name, status icon, brief explanation, action button

**Individual Check Items**:
- Clear pass/fail/warning indicator (colored icon)
- Check name in semibold
- Brief explanation text
- "How to improve" expandable section for failed checks
- Visual hierarchy separating passed from failed

**Action Task List**:
- Numbered list of improvements
- Priority indicators (High/Medium/Low)
- Expandable for detailed rewrite suggestions
- Copy-to-clipboard buttons for AI prompts

**Email Capture Form**:
- Simple, focused form at results page bottom
- Clear value: "Get detailed report via email"
- Single input + button (inline layout)
- Privacy note below

**Footer**:
- Minimal design with RDS branding
- Links: About, Privacy, Contact
- Social proof: "Trusted by X job seekers"
- No newsletter clutter

### E. Animations

**Minimal & Purposeful**:
- Upload zone: Gentle pulse on drag-over
- Score reveal: Smooth count-up animation (1 second)
- Check expansion: Smooth accordion (300ms ease)
- Progress indicators: Smooth bar fill
- NO scroll-triggered animations, NO unnecessary motion

## Page Structure

**Homepage/Upload Page**:
1. Hero (60vh) - Headline, value prop, upload CTA
2. How It Works (auto-height) - 3-column grid explaining the process
3. What We Check (auto-height) - 5 category preview cards
4. Why It Matters (auto-height) - 2-column: text + visual
5. Upload Section (auto-height) - Prominent drag-drop zone
6. Footer

**Results Page**:
1. Header with scores (auto-height)
2. Category breakdown (auto-height) - 2-column grid
3. Detailed checks list (auto-height) - Single column, expandable
4. Action items (auto-height) - Prioritized task list
5. Email form (auto-height) - Get detailed report
6. Footer

## Images

**Hero Section**: Small abstract illustration (not photo) showing document with checkmarks/highlights - positioned right side, 400x400px max
**How It Works Icons**: Simple, line-style icons for each step
**Category Icons**: Minimal, professional icons for each of the 5 categories
**No large hero images** - keep focus on functionality

## Key Design Principles

1. **Clarity Over Creativity**: Every element serves a functional purpose
2. **Progressive Disclosure**: Show overview first, details on demand
3. **Immediate Feedback**: Users see parsing happen in real-time
4. **Action-Oriented**: Every failed check has a clear improvement path
5. **Trust Building**: Professional aesthetics, clear privacy messaging
6. **Mobile-First**: Fully responsive, touch-friendly controls

## Accessibility

- WCAG AA contrast ratios throughout
- Keyboard navigation for all interactive elements
- Screen reader labels for scores and status indicators
- Focus states clearly visible
- Color never the only indicator (icons + text always)