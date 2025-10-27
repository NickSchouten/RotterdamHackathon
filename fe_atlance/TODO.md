# Atlance Frontend - TODO List

## 📱 Phase 1: Project Setup & Foundation

### 1.1 Initialize Project
- [ ] Set up Vite + React + TypeScript project
- [ ] Install and configure Tailwind CSS
- [ ] Set up shadcn/ui (`npx shadcn-ui@latest init`)
- [ ] Install React Router DOM
- [ ] Install Google Maps integration (@react-google-maps/api)
- [ ] Set up Google Maps API key in .env
- [ ] Configure path aliases (@/ for src)
- [ ] Set up ESLint and Prettier
- [ ] Create folder structure (components, pages, hooks, lib, types, data)

### 1.2 Design System & Theme
- [ ] Define color palette (blues for maps, warm tones for stories)
- [ ] Set up mobile-optimized typography scale
- [ ] Configure Tailwind with mobile-first breakpoints
- [ ] Design thumb-friendly tap targets (min 44x44px)
- [ ] Set up light/dark mode toggle
- [ ] Configure safe area insets for notched devices

---

## 🎨 Phase 2: Core Components & Layout

### 2.1 Layout Components
- [ ] Build bottom navigation bar (iOS/Android style)
- [ ] Create minimal header with back button + share button
- [ ] Build footer component (minimal on mobile)
- [ ] Create container/wrapper components with responsive padding
- [ ] Implement sticky header with scroll behavior

### 2.2 shadcn/ui Components
- [ ] Install Button (large touch targets)
- [ ] Install Card (mobile-friendly spacing)
- [ ] Install Avatar
- [ ] Install Badge
- [ ] Install Separator
- [ ] Install Skeleton (loading states)
- [ ] Install Sheet (mobile drawer/bottom sheet)
- [ ] Install Dialog/Modal (full-screen on mobile)
- [ ] Install Tabs (swipeable)
- [ ] Install Carousel/Slider (touch-enabled)
- [ ] Install Drawer (menus and filters)
- [ ] Install Toast (mobile-positioned)

---

## 📊 Phase 3: Data Modeling & Mock Data

### 3.1 TypeScript Interfaces
- [ ] Create `Story` type (id, title, date, location, images, highlights, coordinates)
- [ ] Create `Location` type (Google Maps lat/lng format)
- [ ] Create `Image` type (with metadata and captions)
- [ ] Create `Highlight` type (key moments/emotional highlights)
- [ ] Create `Trip` type (collection of stories)

### 3.2 Mock Data Creation
- [ ] Create 3-5 sample travel stories with rich content
- [ ] Generate mock location data (coordinates, names, descriptions)
- [ ] Add sample images (placeholder service or real photos)
- [ ] Create mock story highlights and emotional moments
- [ ] Create data for interactive map view

---

## 📄 Phase 4: Page Development

### 4.1 Home Page
- [ ] Build hero section with mobile-optimized typography
- [ ] Create large, thumb-friendly CTA button
- [ ] Build featured stories feed (single column on mobile)
- [ ] Add tap/touch feedback animations
- [ ] Create "How It Works" section with swipeable cards
- [ ] Add sticky bottom CTA on mobile
- [ ] Build mobile-optimized email signup form

### 4.2 Story Detail Page (Core Experience!)
- [ ] Create full-width hero image layout
- [ ] Build title overlay with mobile typography
- [ ] Add sticky header with back + share buttons
- [ ] Create floating share FAB (mobile)
- [ ] Build swipeable photo carousel with touch gestures
- [ ] Add snap scrolling and pagination dots
- [ ] Implement tap-to-expand lightbox with pinch-to-zoom
- [ ] Create mobile-optimized reading layout
- [ ] Add pull quotes and emotional highlight badges
- [ ] Build embedded Google Map with tap-to-expand
- [ ] Add "Open in Google Maps" deep link button
- [ ] Create horizontal scroll for related stories (mobile)

### 4.3 Map View Page
- [ ] Integrate Google Maps JavaScript API
- [ ] Build full-screen map layout for mobile
- [ ] Add touch gestures (pinch to zoom, drag to pan)
- [ ] Create custom markers with story cover images
- [ ] Implement marker clustering
- [ ] Build bottom sheet for story list
- [ ] Add swipe up/down to expand/minimize sheet
- [ ] Connect locations with journey polylines
- [ ] Create mobile-positioned map controls
- [ ] Add FAB for toggling trip lines
- [ ] Implement "My Location" button
- [ ] Add recenter button to fit all markers

### 4.4 Stories List Page
- [ ] Build single column feed layout (mobile)
- [ ] Create responsive grid (2 col tablet, 3 col desktop)
- [ ] Add filter button that opens bottom sheet
- [ ] Create dismissible filter chips
- [ ] Build horizontal scrollable quick filters
- [ ] Add fixed search bar at top
- [ ] Implement live filter as you type
- [ ] Add pull-to-refresh functionality
- [ ] Implement infinite scroll
- [ ] Create "Back to top" FAB after scrolling
- [ ] Add loading skeletons between batches

### 4.5 About Page
- [ ] Create mobile-optimized app description
- [ ] Build vertical timeline for agent workflow
- [ ] Add animated illustrations
- [ ] Create vertical stack of feature cards
- [ ] Build swipeable testimonials section
- [ ] Add interactive before/after comparison slider

---

## ✨ Phase 5: Advanced Features & Interactions

### 5.1 Story Sharing
- [ ] Implement Web Share API (native share on mobile)
- [ ] Create fallback custom share sheet
- [ ] Add copy link with toast confirmation
- [ ] Add mock social media buttons (Twitter, Facebook, WhatsApp)
- [ ] Create mock email sharing
- [ ] Add QR code generation
- [ ] Configure Open Graph meta tags for each story
- [ ] Create dynamic meta images

### 5.2 Mobile Gestures & Animations
- [ ] Implement swipe gestures for navigation
- [ ] Add pull-to-refresh on story lists
- [ ] Create swipe between images in galleries
- [ ] Add long-press for quick actions
- [ ] Build native-feeling page transitions
- [ ] Add scroll-triggered animations (fade in, slide up)
- [ ] Create image loading animations with placeholders
- [ ] Build skeleton screens for all loading states
- [ ] Add spring physics for touch interactions
- [ ] Implement reduce motion support

### 5.3 Responsive Design
- [ ] Test all breakpoints (mobile, tablet, desktop)
- [ ] Verify 44x44px minimum tap targets
- [ ] Test on actual iOS devices
- [ ] Test on actual Android devices
- [ ] Test portrait and landscape orientations
- [ ] Verify thumb-zone optimization
- [ ] Test with slow network simulation

### 5.4 Performance Optimization
- [ ] Lazy load images below the fold
- [ ] Implement responsive images (srcset)
- [ ] Convert images to WebP with fallbacks
- [ ] Add blur-up placeholder technique
- [ ] Prioritize hero/above-fold images
- [ ] Implement code splitting by route
- [ ] Lazy load Map and Lightbox components
- [ ] Add service worker for offline support
- [ ] Cache Google Maps assets
- [ ] Optimize for 3G/4G connections
- [ ] Defer non-critical CSS

---

## 💅 Phase 6: Polish & Details

### 6.1 UI Enhancements
- [ ] Add haptic feedback for key actions
- [ ] Create touch ripple effects
- [ ] Add button press states
- [ ] Build skeleton screens for loading
- [ ] Create empty states with illustrations
- [ ] Add error states with retry buttons
- [ ] Implement success toast confirmations
- [ ] Add offline mode indicator
- [ ] Implement smooth scroll behavior
- [ ] Add scroll progress indicator for long stories
- [ ] Enable snap scroll for carousels
- [ ] Maintain scroll position on back navigation

### 6.2 Mobile Accessibility
- [ ] Use semantic HTML throughout
- [ ] Implement proper heading hierarchy
- [ ] Add landmark regions (nav, main, footer)
- [ ] Create skip to content link
- [ ] Verify 44x44px touch targets everywhere
- [ ] Add visible focus states
- [ ] Ensure keyboard navigation works
- [ ] Optimize for screen readers
- [ ] Add ARIA labels for icon buttons
- [ ] Write alt text for all images
- [ ] Verify WCAG AA color contrast
- [ ] Support text resize up to 200%
- [ ] Implement reduce motion support
- [ ] Test high contrast mode
- [ ] Add proper form labels
- [ ] Use mobile-friendly input types

### 6.3 Mobile SEO & Meta
- [ ] Add meta tags to all pages
- [ ] Configure Open Graph tags
- [ ] Add Twitter Card tags
- [ ] Set mobile-optimized meta viewport
- [ ] Create semantic heading hierarchy
- [ ] Write descriptive page titles
- [ ] Add meta descriptions for each page
- [ ] Ensure mobile-friendly (Google mobile-first index)
- [ ] Optimize page load times

### 6.4 Final Mobile Touches
- [ ] Create Web App Manifest
- [ ] Add custom favicon
- [ ] Create app icons (180x180, 192x192, 512x512)
- [ ] Add Apple touch icons
- [ ] Set theme color for browser chrome
- [ ] Create splash screens for iOS
- [ ] Build beautiful 404 page
- [ ] Create network error page
- [ ] Add loading spinner/skeleton screens
- [ ] Position toast notifications for mobile
- [ ] Add pull-to-refresh on error state
- [ ] Verify consistent spacing and alignment
- [ ] Check dark mode across all screens
- [ ] Test safe area on notched devices

---

## 🧪 Phase 7: Testing & Deployment

### 7.1 Mobile Testing
- [ ] Test on iPhone 12+ (real device)
- [ ] Test on iPhone SE (real device)
- [ ] Test on various Android devices
- [ ] Test on iPad and Android tablets
- [ ] Test portrait orientation
- [ ] Test landscape orientation
- [ ] Test on Mobile Safari (iOS)
- [ ] Test on Chrome Mobile (Android)
- [ ] Test on Samsung Internet
- [ ] Test desktop responsiveness (Chrome, Firefox, Safari)
- [ ] Test browse → view → share flow
- [ ] Test map → pin → story flow
- [ ] Test search → filter → results flow
- [ ] Verify all touch gestures work
- [ ] Test back button behavior
- [ ] Test on slow 3G network
- [ ] Test with throttled CPU
- [ ] Run Lighthouse mobile audit (target 90+)
- [ ] Check Core Web Vitals (LCP, FID, CLS)
- [ ] Test on notched devices (safe areas)
- [ ] Test very long story titles
- [ ] Test no network scenarios
- [ ] Test iOS low battery mode

### 7.2 Documentation
- [ ] Document all components
- [ ] Write setup instructions in README
- [ ] Document mock data structure
- [ ] Add notes for backend integration
- [ ] Document API client setup for future

### 7.3 Deployment
- [ ] Optimize production build
- [ ] Set up environment variables (Google Maps API key)
- [ ] Configure deployment (Vercel/Netlify)
- [ ] Set up Google Maps API key restrictions for production
- [ ] Create preview deployments
- [ ] Test production build on mobile devices

---

## 🎯 Success Criteria Checklist

- [ ] App feels native and responsive on mobile devices
- [ ] All touch interactions work smoothly
- [ ] Bottom navigation is intuitive
- [ ] Stories are beautiful on small screens
- [ ] All pages render beautifully (mobile-first)
- [ ] Mock data displays realistic travel stories
- [ ] Google Maps works on all devices
- [ ] Share functionality works (native share on mobile)
- [ ] Fast load times on mobile networks
- [ ] Lighthouse mobile score 90+
- [ ] Images load efficiently with placeholders
- [ ] Design feels polished and professional
- [ ] Code is clean, typed, and maintainable
- [ ] Responsive design works across all breakpoints
- [ ] WCAG AA accessibility standards met
- [ ] Ready for backend integration

---

## 📝 Notes

**Priority Areas:**
1. Story Detail Page - This is the hero experience
2. Mobile navigation and gestures
3. Image loading and performance
4. Google Maps integration
5. Share functionality

**Remember:**
- Mobile-first mindset: Design for mobile, enhance for desktop
- Test early and often on real mobile devices
- Most users will view travel content on their phones
- Thumb-friendly design is crucial
- Performance on mobile networks is critical

**Estimated Timeline:** 8-14 days for polished MVP

