# 🎤 Microphone Permission Setup Guide

## Overview

This application requires microphone access to record audio messages for doctor-patient communication. If you see a "Permission denied" error, follow the steps below for your browser.

---

## 🚀 Quick Fix

When you first load the application, a permission modal will appear. Click **"Allow Microphone Access"** and accept the browser prompt.

If you accidentally denied permission, follow the browser-specific instructions below.

---

## 🌐 Browser-Specific Instructions

### Google Chrome / Microsoft Edge

1. Look for the **lock icon** 🔒 or **microphone icon** 🎤 in the address bar (left side)
2. Click on it
3. Find **"Microphone"** in the permissions list
4. Change the dropdown to **"Allow"**
5. **Refresh the page** (F5 or Cmd+R)

**Alternative Method:**
1. Click the three dots menu (⋮) → **Settings**
2. Go to **Privacy and security** → **Site Settings**
3. Click **Microphone**
4. Find your site in the "Blocked" list and move it to "Allowed"
5. Refresh the page

---

### Mozilla Firefox

1. Look for the **microphone icon** 🎤 with a red X in the address bar
2. Click on it
3. Click **"Clear This Permission"** or select **"Allow"**
4. **Refresh the page** (F5 or Cmd+R)

**Alternative Method:**
1. Click the hamburger menu (☰) → **Settings**
2. Go to **Privacy & Security**
3. Scroll to **Permissions** → **Microphone** → **Settings**
4. Find your site and change status to **"Allow"**
5. Refresh the page

---

### Safari (macOS)

1. Go to **Safari** menu → **Settings** (or press Cmd+,)
2. Click the **Websites** tab
3. Select **Microphone** from the left sidebar
4. Find your site in the list
5. Change the dropdown to **"Allow"**
6. **Close Settings and refresh the page**

**For iOS/iPadOS Safari:**
1. Open **Settings** app
2. Scroll down to **Safari**
3. Tap **Camera** and **Microphone**
4. Ensure they are set to **"Ask"** or **"Allow"**
5. Return to Safari and refresh the page

---

## 🔍 Troubleshooting

### Still not working?

1. **Check system permissions:**
   - **Windows:** Settings → Privacy → Microphone → Ensure "Allow apps to access your microphone" is ON
   - **macOS:** System Settings → Privacy & Security → Microphone → Ensure your browser is checked
   - **Linux:** Check PulseAudio/PipeWire settings

2. **Ensure microphone is connected and working:**
   - Test your microphone in system settings
   - Make sure it's not muted
   - Try unplugging and reconnecting (for external mics)

3. **Browser extensions:**
   - Some privacy extensions block microphone access
   - Try disabling extensions temporarily

4. **HTTPS requirement:**
   - Microphone access requires a secure connection (HTTPS)
   - Localhost is also allowed for development

5. **Clear browser cache:**
   - Sometimes cached permissions cause issues
   - Clear site data and try again

6. **Try incognito/private mode:**
   - This can help identify if extensions are the issue

---

## 🔐 Privacy & Security

- Your microphone is **only active when you click the "Record" button**
- A red recording indicator will show when recording is active
- Audio is **only sent to the server when you choose to send a message**
- You can **stop recording at any time** by clicking the "Stop" button
- Your browser will show an indicator (usually in the address bar) when the microphone is in use

---

## 💡 In-App Help

The application provides real-time help:

- **Blue info box:** Click "Record" to enable microphone
- **Red error box:** Permission denied with detailed instructions
- **Permission modal:** Appears on first visit to request access
- **Success message:** Confirms when permission is granted

---

## 🆘 Still Need Help?

If you've followed all steps and still encounter issues:

1. Check the browser console for detailed error messages (F12 → Console)
2. Ensure you're using a supported browser (Chrome 60+, Firefox 55+, Safari 11+, Edge 79+)
3. Try a different browser to isolate the issue
4. Restart your browser completely
5. Restart your computer (sometimes system-level permissions need a reboot)

---

## 📝 Technical Details

The application uses the **Web Audio API** (`navigator.mediaDevices.getUserMedia`) to access your microphone. This is a standard web API supported by all modern browsers.

**Audio Settings:**
- Echo Cancellation: Enabled
- Noise Suppression: Enabled  
- Auto Gain Control: Enabled
- Format: WebM audio
- Sample Rate: Default (usually 48kHz)

---

## ✅ Verification

After enabling microphone access:
1. Navigate to a conversation
2. Click the **"Record"** button
3. You should see a **red recording indicator** and timer
4. Speak into your microphone
5. Click **"Stop"** to finish recording
6. The audio message will be sent automatically

If you see the timer counting, your microphone is working correctly! 🎉
