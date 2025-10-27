# Atlance Public-Facing Frontend - Development Plan

## Overview
Build a **mobile-first** public-facing frontend for Atlance that displays AI-generated travel stories with beautiful UI/UX. The app will showcase travel blogs created from photos, complete with interactive maps, location insights, and emotional highlights. Designed primarily for mobile devices where users naturally share and view travel content.

**Tech Stack:**
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling (mobile-first breakpoints)
- shadcn/ui for components
- Google Maps API for map features
- Mock data (no backend integration initially)

---

## Phase 1: Project Setup & Foundation

### 1.1 Initialize Project
- [ ] Set up Vite + React + TypeScript project
- [ ] Install and configure Tailwind CSS
- [ ] Set up shadcn/ui (initialize with `npx shadcn-ui@latest init`)
- [ ] Install React Router DOM
- [ ] Install Google Maps integration (@react-google-maps/api or @vis.gl/react-google-maps)
- [ ] Set up Google Maps API key (store in .env file)
- [ ] Configure path aliases (@/ for src)
- [ ] Set up ESLint and Prettier
- [ ] Create basic folder structure:
  ```
  src/
  ├── components/
  │   ├── ui/           # shadcn components
  │   ├── layout/       # Header, Footer, Navigation
  │   └── features/     # Feature-specific components
  ├── pages/
  ├── hooks/
  ├── lib/
  ├── types/
  ├── data/             # Mock data
  └── App.tsx
  ```

### 1.2 Design System & Theme (Mobile-First)
- [ ] Define color palette (travel-themed: blues for maps, warm tones for stories)
- [ ] Set up typography scale optimized for mobile readability
- [ ] Create consistent spacing system (mobile: 4/8/16px base)
- [ ] Add custom Tailwind configuration with mobile-first breakpoints
- [ ] Design for thumb-friendly tap targets (min 44x44px)
- [ ] Set up light/dark mode toggle
- [ ] Configure safe area insets for notched devices

---

## Phase 2: Core Components & Layout

### 2.1 Layout Components (Mobile-First)
- [ ] **Mobile Navigation**
  - Bottom navigation bar (iOS/Android style)
  - Icons with labels: Home, Stories, Map, Profile/About
  - Active state indicators
  - Sticky positioning
  - Hide on scroll down, show on scroll up (optional)
  
- [ ] **Header/App Bar**
  - Minimal header with logo/back button
  - Transparent/overlay on scroll (for story pages)
  - Share button in header (mobile context)
  - Desktop: Expand to full navigation bar
  
- [ ] **Footer**
  - Minimal on mobile (copyright only)
  - Expanded on desktop with social links
  
- [ ] **Container/Wrapper components**
  - Full-width on mobile (edge-to-edge for images)
  - Max-width containers for text content (readable line length)
  - Responsive padding (px-4 mobile, px-6 tablet, px-8 desktop)

### 2.2 shadcn/ui Components Setup
Install and customize these shadcn components (optimized for mobile):
- [ ] Button (large touch targets)
- [ ] Card (mobile-friendly spacing)
- [ ] Avatar
- [ ] Badge
- [ ] Separator
- [ ] Skeleton (for loading states)
- [ ] Sheet (mobile drawer/bottom sheet)
- [ ] Dialog/Modal (full-screen on mobile)
- [ ] Tabs (swipeable on mobile)
- [ ] Carousel/Slider (touch-enabled for images)
- [ ] Drawer (for mobile menus and filters)
- [ ] Toast (mobile-positioned notifications)

---

## Phase 3: Data Modeling & Mock Data

### 3.1 TypeScript Interfaces
Create types for:
- [ ] `Story` - Complete travel story with metadata
  ```typescript
  {
    id, title, date, location, coverImage,
    description, images, highlights, mapCoordinates
  }
  ```
- [ ] `Location` - Geographic data (Google Maps lat/lng format)
- [ ] `Image` - Image with metadata and captions
- [ ] `Highlight` - Key moments/emotional highlights
- [ ] `Trip` - Collection of stories

### 3.2 Mock Data Creation
- [ ] Create 3-5 sample travel stories with rich content
- [ ] Generate mock location data (coordinates, names, descriptions)
- [ ] Create sample images (use placeholder service or real travel photos)
- [ ] Mock story highlights and emotional moments
- [ ] Create data for interactive map view

---

## Phase 4: Page Development

### 4.1 Home Page (`/`) - Mobile-First
- [ ] **Hero Section**
  - Compelling headline about Atlance (mobile-optimized typography)
  - Tagline: "Your Personal Atlas at a Glance"
  - Large, thumb-friendly CTA button
  - Full-width background image (mobile)
  - Shorter hero on mobile (above the fold)
  
- [ ] **Featured Stories Feed**
  - Mobile: Single column, full-width cards
  - Tablet: 2 columns
  - Desktop: 3 columns grid
  - Large cover images (priority on mobile)
  - Story preview text (truncated on mobile)
  - Location badges
  - Date information
  - Tap/touch feedback animations
  - Pull-to-refresh gesture (optional)
  
- [ ] **How It Works Section**
  - Mobile: Vertical stack with simple icons
  - Visual explanation of the 3-question process
  - Swipeable cards showing workflow (mobile)
  
- [ ] **Call to Action**
  - Sticky bottom CTA on mobile
  - Share your story prompt
  - Email signup (mobile-optimized form)

### 4.2 Story Detail Page (`/story/:id`) - Mobile-First
This is the core experience - optimize for mobile reading and sharing!

- [ ] **Story Header**
  - Full-width hero image (mobile: edge-to-edge)
  - Title overlay with elegant mobile typography
  - Sticky header with back button + share button
  - Location and date metadata below image
  - Floating share FAB (mobile)
  
- [ ] **Interactive Photo Gallery**
  - Swipeable carousel for story images (touch gestures)
  - Snap scrolling between photos
  - Pagination dots indicator
  - Tap to expand full-screen lightbox
  - Pinch to zoom in lightbox
  - Image captions (overlay on mobile)
  - Native-feeling transitions
  
- [ ] **Story Content**
  - Mobile-optimized reading experience
  - Larger line height and font size for mobile
  - AI-generated blog text with beautiful typography
  - Full-width pull quotes
  - Location insights as expandable cards (mobile)
  - Emotional highlights as inline badges
  - Progressive disclosure for long content
  
- [ ] **Location Section**
  - Embedded Google Map (mobile-optimized height)
  - Tap to open full-screen map
  - Location pins with touch-friendly tap targets
  - "Open in Google Maps" button (deep link on mobile)
  
- [ ] **Related Stories**
  - Horizontal scroll on mobile (swipeable)
  - Vertical stack on tablet+
  - Suggested stories from same trip or location

### 4.3 Map View Page (`/map`) - Mobile-First
- [ ] **Interactive Map Integration**
  - Full-screen map on mobile
  - Use Google Maps JavaScript API
  - Integrate @react-google-maps/api or @vis.gl/react-google-maps
  - Touch gestures: pinch to zoom, drag to pan
  - Show all story locations as pins
  - Cluster markers when zoomed out
  
- [ ] **Story Pins**
  - Custom markers with story cover images
  - Tap to show story preview card (bottom sheet on mobile)
  - Link to full story
  - Smooth animations when opening/closing
  
- [ ] **Trip Timeline/List**
  - Mobile: Drawer/sheet that slides up from bottom
  - Shows chronological story list
  - Swipe up to expand, down to minimize
  - Tap story to fly to location on map
  - Connect locations with journey polylines
  - Filter by date range (mobile sheet with date picker)
  
- [ ] **Map Controls**
  - Mobile-positioned controls (corners)
  - Larger touch targets for zoom buttons
  - FAB for toggling trip lines on/off
  - Map style switcher in drawer
  - "My Location" button
  - Recenter to fit all markers button

### 4.4 Stories List Page (`/stories`) - Mobile-First
- [ ] **Story Feed/Grid View**
  - Mobile: Single column list with large preview cards
  - Tablet: 2 columns
  - Desktop: 3 columns grid
  - Large touch targets for each story
  
- [ ] **Filter & Sort**
  - Mobile: Filter button opens bottom sheet
  - Chips for active filters (dismissible)
  - Sort options in sheet: newest, oldest, location
  - Filter by date range, location, trip
  - Quick filters as horizontal scrollable chips
  
- [ ] **Search Functionality**
  - Fixed search bar at top on mobile
  - Search by location or title
  - Live filter results as you type
  - Recent searches (mobile)
  
- [ ] **Infinite Scroll**
  - Pull-to-refresh at top
  - Infinite scroll at bottom
  - Loading skeletons between batches
  - "Back to top" FAB appears after scrolling

### 4.5 About Page (`/about`) - Mobile-First
- [ ] **App Description**
  - What is Atlance (mobile-optimized reading)
  - How it works (3 questions concept)
  - Agent workflow as vertical timeline (mobile)
  - Animated illustrations
  
- [ ] **Features Showcase**
  - Vertical stack of feature cards on mobile
  - Icon + title + description format
  - Benefits for travelers and their loved ones
  - Swipeable testimonials (if applicable)
  
- [ ] **Sample Story Demo**
  - Before/after concept
  - Interactive toggle/comparison slider

---

## Phase 5: Advanced Features & Interactions (Mobile-Optimized)

### 5.1 Story Sharing (Mobile-First)
- [ ] **Native Share Sheet**
  - Use Web Share API on mobile (when supported)
  - Fallback to custom share sheet
  - Share with device's native apps
  
- [ ] **Share Options**
  - Copy link to clipboard (with toast confirmation)
  - Mock social media buttons (Twitter, Facebook, WhatsApp)
  - Mock email sharing
  - QR code generation (for desktop-to-mobile sharing)
  
- [ ] **Public Story Links**
  - Each story has unique sharable URL
  - Beautiful Open Graph meta tags for social previews
  - Dynamic meta images for each story

### 5.2 Mobile Gestures & Animations
- [ ] **Touch Gestures**
  - Swipe gestures for navigation (back/forward)
  - Pull-to-refresh on story lists
  - Swipe between images in galleries
  - Long-press for quick actions
  - Double-tap to like/favorite (optional)
  
- [ ] **Animations & Transitions**
  - Native-feeling page transitions
  - Scroll-triggered animations (fade in, slide up)
  - Image loading animations with placeholders
  - Skeleton screens for loading states
  - Spring physics for touch interactions
  - Reduce motion support (accessibility)

### 5.3 Responsive Breakpoints
- [ ] **Mobile-First Breakpoints**
  - Base: 0-639px (mobile portrait)
  - sm: 640px+ (mobile landscape, small tablets)
  - md: 768px+ (tablets)
  - lg: 1024px+ (laptops)
  - xl: 1280px+ (desktops)
  
- [ ] **Touch-Optimized**
  - Minimum 44x44px tap targets
  - Generous spacing between interactive elements
  - Bottom-sheet patterns for mobile forms
  - Thumb-zone optimization for primary actions
  
- [ ] **Testing**
  - Test on actual devices (iPhone, Android)
  - Various screen sizes (small phones to tablets)
  - Portrait and landscape orientations
  - Test with slow network (mobile data simulation)

### 5.4 Performance Optimization (Mobile Networks)
- [ ] **Image Optimization**
  - Lazy load images below the fold
  - Responsive images (srcset) for different screen sizes
  - WebP format with fallbacks
  - Blur-up placeholder technique
  - Prioritize hero/above-fold images
  
- [ ] **Code Optimization**
  - Code splitting by route
  - Lazy load heavy components (Map, Lightbox)
  - Tree shaking unused code
  - Minimize bundle size
  
- [ ] **Mobile Performance**
  - Add loading skeletons for perceived performance
  - Implement error boundaries
  - Service worker for offline support (progressive)
  - Cache Google Maps assets
  - Optimize for slow 3G/4G connections
  - Reduce JavaScript execution time
  - Defer non-critical CSS

---

## Phase 6: Polish & Details (Mobile-Focused)

### 6.1 UI Enhancements
- [ ] **Micro-interactions**
  - Haptic feedback for key actions (mobile)
  - Touch ripple effects
  - Button press states
  - Smooth transitions between states
  
- [ ] **Feedback & States**
  - Loading states for all async operations
  - Skeleton screens while loading
  - Empty states with illustrations (no stories, etc.)
  - Error states with retry buttons
  - Success confirmations (toasts)
  - Offline mode indicator
  
- [ ] **Scroll Behavior**
  - Smooth scroll to anchor links
  - Scroll progress indicator for long stories
  - Snap scroll for carousels
  - Maintain scroll position on back navigation

### 6.2 Mobile Accessibility (a11y)
- [ ] **Semantic & Structure**
  - Semantic HTML throughout
  - Proper heading hierarchy
  - Landmark regions (nav, main, footer)
  - Skip to content link
  
- [ ] **Touch & Interaction**
  - Minimum 44x44px touch targets
  - Visible focus states for interactive elements
  - Keyboard navigation support (for physical keyboards)
  - Screen reader optimizations
  - ARIA labels for icon buttons
  
- [ ] **Visual Accessibility**
  - Alt text for all images
  - WCAG AA color contrast compliance
  - Text resize support (up to 200%)
  - Reduce motion preference support
  - High contrast mode support
  
- [ ] **Form Accessibility**
  - Proper input labels
  - Error message associations
  - Mobile-friendly input types (tel, email, url)
  - Autocomplete attributes

### 6.3 Mobile SEO & Meta
- [ ] **Meta Tags**
  - Descriptive meta tags on all pages
  - Open Graph tags for social sharing
  - Twitter Card tags
  - Mobile-optimized meta viewport
  
- [ ] **Content Structure**
  - Semantic heading hierarchy (h1-h6)
  - Descriptive page titles
  - Meta descriptions for each page
  
- [ ] **Mobile Indexing**
  - Ensure mobile-friendly (Google's mobile-first index)
  - Fast page load times
  - No mobile usability issues

### 6.4 Final Mobile Touches
- [ ] **App-Like Experience**
  - Web App Manifest (PWA basics)
  - Custom favicon and app icons (180x180, 192x192, 512x512)
  - Apple touch icons
  - Theme color for browser chrome
  - Splash screens for iOS
  
- [ ] **Error & Edge Cases**
  - Beautiful 404 page with navigation back
  - Network error page
  - Loading spinner/skeleton screens
  - Toast notifications (mobile-positioned)
  - Pull-to-refresh on error state
  
- [ ] **Final QA**
  - Consistent spacing and alignment
  - All images have proper alt text
  - Test all touch interactions
  - Verify safe area on notched devices
  - Check dark mode across all screens

---

## Phase 7: Testing & Deployment Prep

### 7.1 Mobile Testing
- [ ] **Device Testing**
  - Test on real iOS devices (iPhone 12+, iPhone SE)
  - Test on real Android devices (various manufacturers)
  - Test on tablets (iPad, Android tablets)
  - Portrait and landscape orientations
  - Different screen sizes (small, medium, large)
  
- [ ] **Browser Testing**
  - Mobile Safari (iOS)
  - Chrome Mobile (Android)
  - Samsung Internet
  - Desktop: Chrome, Firefox, Safari (for responsive)
  
- [ ] **User Flow Testing**
  - Browse stories → view story → share flow
  - Navigate map → view story pin → open story
  - Search stories → filter → view results
  - All touch gestures work correctly
  - Back button behavior
  
- [ ] **Performance Testing**
  - Test on slow 3G network
  - Test with throttled CPU
  - Lighthouse mobile audit (aim for 90+ score)
  - Check Core Web Vitals (LCP, FID, CLS)
  
- [ ] **Edge Cases**
  - Notched devices (safe areas)
  - Very long story titles
  - No network scenarios
  - Low battery mode (iOS)
  - Fix any bugs or inconsistencies

### 7.2 Documentation
- [ ] Component documentation
- [ ] Setup instructions in README
- [ ] Mock data documentation
- [ ] Future backend integration notes

### 7.3 Deployment Ready
- [ ] Build optimization
- [ ] Environment variables setup (Google Maps API key, etc.)
- [ ] Deployment configuration (Vercel/Netlify)
- [ ] Configure Google Maps API key restrictions for production
- [ ] Preview deployments

---

## Future Considerations (Post-MVP)

### Backend Integration
- API client setup
- Real data fetching
- Loading and error handling
- Authentication (if needed)

### Additional Features
- User profiles (for story authors)
- Comments or reactions
- Story collections/albums
- Email subscriptions
- RSS feed
- PWA capabilities
- Offline support

### Advanced Map Features
- Google Maps 3D view and tilt
- Custom Google Maps styles/themes
- Google Maps Street View integration
- Advanced marker clustering
- Drawing trip routes with Polylines
- Trip statistics overlay

---

## Design Inspiration & References

**Similar Apps:**
- Polarsteps - trip tracking and storytelling
- Google Travel - clean story layouts
- Medium - beautiful typography for long-form content
- Instagram - photo galleries and grids

**UI Patterns to Implement (Mobile-First):**
- Hero sections with overlay text (full-screen on mobile)
- Card-based layouts with shadows (single column on mobile)
- Bottom navigation bar (iOS/Android style)
- Floating action buttons (FAB) for primary actions
- Bottom sheets/drawers for filters and forms
- Sticky headers with scroll behavior
- Swipeable carousels for images
- Pull-to-refresh pattern
- Infinite scroll with loading states
- Full-screen modal image viewers with pinch zoom
- Horizontal scrollable chips for filters
- Tag/badge systems for locations
- Native share sheet integration
- Skeleton screens for loading
- Toast notifications (bottom-positioned on mobile)

**Color Palette Ideas:**
- Primary: Blue/teal (maps, travel, trust)
- Secondary: Warm orange/coral (highlights, CTAs)
- Neutral: Gray scale for text and backgrounds
- Accent: Green for success states

---

## Success Criteria

✅ **MVP Complete When:**
1. **Mobile Experience is Excellent**
   - App feels native and responsive on mobile devices
   - All touch interactions work smoothly
   - Navigation is intuitive with bottom bar
   - Stories are beautiful and easy to read on small screens
   
2. **Core Features Work**
   - All pages render beautifully (mobile-first)
   - Mock data displays realistic travel stories
   - Google Maps integration works on all devices
   - Map view shows story locations interactively
   - Share functionality works (native share on mobile)
   
3. **Performance & Quality**
   - Fast load times on mobile networks (3G/4G)
   - Lighthouse mobile score 90+
   - Individual stories are engaging and shareable
   - Images load efficiently with placeholders
   - Design feels polished and professional
   
4. **Code Quality**
   - Code is clean, typed, and maintainable
   - Responsive design works across all breakpoints
   - Accessibility standards met (WCAG AA)
   - Ready for backend integration

---

## Timeline Estimate

- **Phase 1-2:** 1-2 days (Setup + Core Components)
- **Phase 3:** 0.5 day (Data Modeling)
- **Phase 4:** 3-4 days (Page Development)
- **Phase 5:** 2-3 days (Advanced Features)
- **Phase 6:** 1-2 days (Polish)
- **Phase 7:** 1 day (Testing)

**Total: ~8-14 days** for a polished MVP

---

## Mobile-First Best Practices

### Design Principles
1. **Thumb-Friendly Design**
   - Place primary actions in easy-to-reach zones (bottom of screen)
   - Avoid requiring stretches to top corners
   - Use bottom navigation instead of top tabs

2. **Content Hierarchy**
   - Mobile screens are narrow - prioritize vertical layouts
   - Show one primary action per screen
   - Use progressive disclosure (show details on demand)
   - Hero images should be full-width and impactful

3. **Touch Interactions**
   - Every interactive element should be 44x44px minimum
   - Provide immediate visual feedback on tap
   - Support common gestures (swipe, pinch, pull)
   - No hover states dependency (they don't exist on mobile)

4. **Performance First**
   - Images are the biggest bottleneck on mobile
   - Lazy load everything below the fold
   - Prioritize perceived performance (skeletons, placeholders)
   - Test on real devices with real network conditions

5. **Native Feel**
   - Use platform conventions (bottom nav, sheets, etc.)
   - Implement native share when available
   - Consider device features (safe areas, status bar)
   - Smooth 60fps animations

### Technical Considerations
- Use CSS Grid and Flexbox for responsive layouts
- Leverage Tailwind's mobile-first breakpoint system
- Test on Chrome DevTools mobile emulation, but verify on real devices
- Consider using viewport units (vh, vw) carefully (iOS Safari issues)
- Handle orientation changes gracefully
- Support both iOS and Android design patterns

---

## Notes

- **Mobile-first mindset**: Design for mobile, enhance for desktop
- Focus on storytelling and visual appeal optimized for small screens
- Make it feel like a native app with web flexibility
- Prioritize the story detail page as the hero mobile reading experience
- Keep mock data realistic but inspiring
- Ensure easy path to backend integration later
- Test early and often on real mobile devices
- Remember: Most users will view travel content on their phones

