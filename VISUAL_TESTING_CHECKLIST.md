# Visual Testing Checklist - Hyper-Minimalist Design

## 🎯 Quick Visual Test (5 Minutes)

### 1. Light Mode Default
- [ ] Page loads with white background
- [ ] Text is pure black
- [ ] Theme toggle shows "Dark Mode" button with Moon icon
- [ ] All borders are subtle (10% opacity)

### 2. Dark Mode Toggle
- [ ] Click theme toggle button
- [ ] Background instantly turns OLED black (#000000)
- [ ] Text turns pure white
- [ ] Button changes to "Light Mode" with Sun icon
- [ ] No flash or loading delay

### 3. Theme Persistence
- [ ] Refresh page after switching to dark mode
- [ ] Dark mode persists after reload
- [ ] Check browser console: `localStorage.getItem('theme')` returns `"dark"`
- [ ] HTML element has `class="dark"`

### 4. Navigation Elements
- [ ] **Top-Left**: Hamburger menu icon visible
- [ ] **Left**: Theme toggle button (ghost style)
- [ ] **Center**: MediTranslate logo with icon
- [ ] **Right**: Live clock updating every second
- [ ] **Far-Right**: Circular profile avatar

### 5. Mobile Responsiveness (< 768px)
- [ ] Open DevTools, set viewport to 375px width
- [ ] Hamburger menu is visible
- [ ] Logo text may be hidden on very small screens
- [ ] All touch targets are 44×44px minimum
- [ ] Click hamburger → menu slides in from left
- [ ] Backdrop overlay appears behind menu
- [ ] Click outside menu → menu closes

---

## 📋 Detailed Component Checklist

### Header (All Pages)

| Element | Light Mode | Dark Mode | Notes |
|---------|------------|-----------|-------|
| Background | Pure white | OLED black | No gradient |
| Border-bottom | 10% black opacity | 10% white opacity | Subtle separator |
| Hamburger icon | Black | White | 3 horizontal lines |
| Theme button border | 20% black opacity | 20% white opacity | Ghost style |
| Logo icon | Black | White | MessageSquare icon |
| Logo text | Black | White | "MediTranslate" |
| Time text | 60% black opacity | 60% white opacity | Readable secondary |
| Profile border | 20% black opacity | 20% white opacity | 2px border |

### Home Page

| Element | Light Mode | Dark Mode | Verification |
|---------|------------|-----------|--------------|
| Page background | White | Black | Full viewport |
| Heading "Real-Time..." | Black | White | 4xl, bold |
| Description text | 60% black | 60% white | Secondary color |
| Card background | White | Black | Same as page (relies on border) |
| Card border | 10% black | 10% white | Defines card edge |
| Select dropdowns | White bg, black text | Black bg, white text | Native styling |
| Doctor select ring | Blue on focus | Blue lighter on focus | Focus indicator |
| Patient select ring | Green on focus | Green lighter on focus | Focus indicator |
| Start button | Black bg, white text | White bg, black text | Inverted colors |
| Feature icons | Colored backgrounds | Same (opacity adjusted) | Blue, green, purple |

### Conversation Page

| Element | Light Mode | Dark Mode | Check |
|---------|------------|-----------|-------|
| Page background | White | Black | ✓ |
| Back button text | 60% black | 60% white | ✓ |
| Language info | 60% black | 60% white | ✓ |
| Doctor button (active) | Blue solid | Blue lighter solid | ✓ |
| Patient button (active) | Green solid | Green lighter solid | ✓ |
| Inactive role buttons | 5% black bg | 5% white bg | ✓ |
| Message area bg | White | Black | ✓ |
| Empty state text | 60% black | 60% white | ✓ |
| Input border | 20% black | 20% white | ✓ |
| Send button | Blue | Blue lighter | ✓ |
| Record button | Red | Red lighter | ✓ |

### Message Bubbles

| Element | Light Mode | Dark Mode | Visual Check |
|---------|------------|-----------|--------------|
| Doctor avatar bg | Blue 10% opacity | Blue 10% lighter opacity | ✓ |
| Doctor avatar border | Blue 20% opacity | Blue 20% lighter opacity | ✓ |
| Doctor bubble bg | Blue 10% | Blue 10% lighter | ✓ |
| Doctor bubble text | Blue-900 | Blue-100 | ✓ |
| Patient avatar bg | Green 10% | Green 10% lighter | ✓ |
| Patient avatar border | Green 20% | Green 20% lighter | ✓ |
| Patient bubble bg | Green 10% | Green 10% lighter | ✓ |
| Patient bubble text | Green-900 | Green-100 | ✓ |
| Translation box bg | 5% black | 5% white | ✓ |
| Translation box border | 10% black | 10% white | ✓ |
| Timestamp | 50% black | 50% white | ✓ |

### Conversation History

| Element | Light Mode | Dark Mode | Status |
|---------|------------|-----------|--------|
| Page background | White | Black | ✓ |
| Heading | Black | White | ✓ |
| Search input bg | White | Black | ✓ |
| Search input border | 20% black | 20% white | ✓ |
| Search icon | 40% black | 40% white | ✓ |
| Card background | White | Black | ✓ |
| Card border | 10% black | 10% white | ✓ |
| Card hover border | Blue 50% | Blue 50% lighter | ✓ |
| Match highlight bg | Yellow 10% | Yellow 10% lighter | ✓ |
| Match highlight border | Yellow 20% | Yellow 20% lighter | ✓ |
| Summary badge bg | Purple 10% | Purple 10% lighter | ✓ |
| Summary badge border | Purple 20% | Purple 20% lighter | ✓ |

---

## 🔍 Typography Verification

### Font Loading Test

1. Open DevTools → Network tab
2. Filter by "Font"
3. Verify these fonts load:
   - [ ] `NotoSans-Regular.woff2`
   - [ ] `NotoSans-Medium.woff2`
   - [ ] `NotoSansDevanagari-Regular.woff2` (for Hindi/Marathi)
   - [ ] `NotoSansTelugu-Regular.woff2`
   - [ ] `NotoSansTamil-Regular.woff2`
   - [ ] `NotoSansKannada-Regular.woff2`

### Multilingual Display Test

1. Go to Home page
2. Select **Hindi (हिन्दी)** in dropdown
   - [ ] Hindi text renders clearly (no □ symbols)
3. Select **Telugu (తెలుగు)**
   - [ ] Telugu script displays correctly
4. Select **Tamil (தமிழ்)**
   - [ ] Tamil characters render properly
5. Select **Kannada (ಕನ್ನಡ)**
   - [ ] Kannada script shows correctly
6. Select **Marathi (मराठी)**
   - [ ] Devanagari script works (same as Hindi)

---

## 🎨 Color Contrast Verification

### Using Browser DevTools

1. **Inspect any text element**
2. **Check computed styles**
3. **Look for contrast ratio** (Chrome shows this automatically)

Expected Results:
- Body text: **21:1** (pure black on white or vice versa)
- Secondary text: **7.5:1** (60% opacity)
- Buttons: **4.5:1 minimum** (WCAG AA Large)

### Manual Contrast Checker

Visit: https://webaim.org/resources/contrastchecker/

**Light Mode Tests:**
- Background: `#FFFFFF`
- Text: `#000000`
- Result: **21:1** ✅

**Dark Mode Tests:**
- Background: `#000000`
- Text: `#FFFFFF`
- Result: **21:1** ✅

---

## 📱 Mobile Testing

### Device Testing Matrix

| Device | Viewport | Hamburger Menu | Touch Targets | Scrolling |
|--------|----------|----------------|---------------|-----------|
| iPhone SE | 375×667 | ✓ Visible | ✓ 44px min | ✓ Smooth |
| iPhone 12 | 390×844 | ✓ Visible | ✓ 44px min | ✓ Smooth |
| Pixel 5 | 393×851 | ✓ Visible | ✓ 44px min | ✓ Smooth |
| iPad Mini | 768×1024 | ✗ Hidden | ✓ 44px min | ✓ Smooth |
| iPad Pro | 1024×1366 | ✗ Hidden | ✓ 44px min | ✓ Smooth |

### Touch Target Test

1. Open DevTools
2. Enable "Show rulers" (Settings → Devices)
3. Hover over buttons
4. Verify dimensions in tooltip:
   - [ ] All buttons ≥ 44×44px
   - [ ] Profile avatar = 40×40px (acceptable with padding)
   - [ ] Icon buttons = 44×44px total (icon + padding)

---

## ⚡ Performance Testing

### Lighthouse Audit

1. Open DevTools → Lighthouse tab
2. Select "Desktop" or "Mobile"
3. Click "Generate report"

**Expected Scores:**
- Performance: **90+**
- Accessibility: **100**
- Best Practices: **95+**
- SEO: **90+**

### Theme Switch Performance

1. Open Performance tab in DevTools
2. Click "Record"
3. Toggle theme 5 times
4. Stop recording
5. Verify:
   - [ ] No layout shifts
   - [ ] < 16ms per frame (60fps)
   - [ ] No memory leaks

---

## 🧪 Accessibility Testing

### Keyboard Navigation

1. **Tab through all elements**
   - [ ] Focus moves in logical order (left to right, top to bottom)
   - [ ] All interactive elements are reachable
   - [ ] Focus indicator is visible (2px blue ring)

2. **Hamburger Menu**
   - [ ] Tab to hamburger button
   - [ ] Press Enter → menu opens
   - [ ] Tab through menu items
   - [ ] Press Escape → menu closes
   - [ ] Focus returns to hamburger button

3. **Theme Toggle**
   - [ ] Tab to button
   - [ ] Press Enter → theme switches
   - [ ] Button text updates ("Dark Mode" ↔ "Light Mode")
   - [ ] ARIA label describes action

4. **Profile Dropdown**
   - [ ] Tab to avatar
   - [ ] Press Enter → dropdown opens
   - [ ] Tab through menu items
   - [ ] Press Escape → dropdown closes

### Screen Reader Testing

**Using macOS VoiceOver:**

1. Enable: Cmd + F5
2. Navigate to hamburger menu
   - [ ] Announces: "Menu, button"
3. Navigate to theme toggle
   - [ ] Announces: "Switch to dark mode, button" (or vice versa)
4. Navigate to profile
   - [ ] Announces: "Profile menu, button"
5. Navigate to message input
   - [ ] Announces placeholder text

**Using Windows Narrator:**

1. Enable: Win + Ctrl + Enter
2. Verify same announcements as above

---

## 🎭 Visual Regression Checklist

### Before/After Comparison

| Component | Before (Old Design) | After (Hyper-Minimal) |
|-----------|---------------------|----------------------|
| Background | Gray (#F9FAFB) | Pure white/black |
| Borders | Solid gray | 10% opacity subtle |
| Buttons | Colored | Ghost (outline) + inverted primary |
| Shadows | Box shadows | None (borders only) |
| Gradients | None (already flat) | None (maintained) |
| Message bubbles | Solid colors | 10% opacity transparent |
| Icons | Colored | Monochrome (adapts to theme) |

---

## 🔧 Developer Console Checks

### No Errors

1. Open Console (F12)
2. Refresh page
3. Verify:
   - [ ] No red error messages
   - [ ] No yellow warnings (except font loading notices)
   - [ ] No 404 errors for fonts/assets

### LocalStorage Check

```javascript
// In browser console
localStorage.getItem('theme')
// Should return: "light" or "dark"

document.documentElement.classList.contains('dark')
// Should return: true (if dark mode) or false (if light mode)
```

### Theme State Debug

```javascript
// Check if ThemeProvider is working
const html = document.documentElement;
console.log('Current theme class:', html.classList.contains('dark') ? 'dark' : 'light');
console.log('LocalStorage theme:', localStorage.getItem('theme'));
```

---

## 📊 Final Verification Matrix

| Feature | Light Mode | Dark Mode | Mobile | Desktop |
|---------|-----------|-----------|--------|---------|
| Pure white/black bg | ✅ | ✅ | ✅ | ✅ |
| Hamburger menu | ✅ | ✅ | ✅ | ✅ |
| Theme toggle | ✅ | ✅ | ✅ | ✅ |
| Profile avatar | ✅ | ✅ | ✅ | ✅ |
| Live time display | ✅ | ✅ | ✅ | ✅ |
| Noto Sans fonts | ✅ | ✅ | ✅ | ✅ |
| Indian languages | ✅ | ✅ | ✅ | ✅ |
| 21:1 contrast | ✅ | ✅ | ✅ | ✅ |
| 44px touch targets | N/A | N/A | ✅ | N/A |
| Keyboard nav | ✅ | ✅ | ✅ | ✅ |
| Screen reader | ✅ | ✅ | ✅ | ✅ |
| Theme persists | ✅ | ✅ | ✅ | ✅ |

---

## 🎨 Color Accuracy Test

### Light Mode Color Values

Open DevTools → Inspect element → Computed styles:

| Element | Property | Expected Value |
|---------|----------|----------------|
| Body | background-color | `rgb(255, 255, 255)` |
| Body | color | `rgb(0, 0, 0)` |
| Border | border-color | `rgba(0, 0, 0, 0.1)` |

### Dark Mode Color Values

Toggle to dark mode, then inspect:

| Element | Property | Expected Value |
|---------|----------|----------------|
| Body | background-color | `rgb(0, 0, 0)` |
| Body | color | `rgb(255, 255, 255)` |
| Border | border-color | `rgba(255, 255, 255, 0.1)` |

---

## ✅ Final Signoff

### Critical Path Testing

- [ ] Can toggle theme and it persists
- [ ] All text is readable in both modes
- [ ] Hamburger menu works on mobile
- [ ] Hindi/Telugu/Tamil/Kannada/Marathi fonts load
- [ ] No accessibility errors in Lighthouse
- [ ] No console errors

### Ready for Deployment?

- [ ] All visual tests pass
- [ ] All functionality tests pass
- [ ] Accessibility score = 100
- [ ] Mobile responsive confirmed
- [ ] Documentation complete

---

**Test Date**: __________  
**Tester Name**: __________  
**Browser/Version**: __________  
**Device**: __________  
**Pass/Fail**: __________  

---

*Visual Testing Checklist v1.0.0*  
*MediTranslate Hyper-Minimalist Design System*
