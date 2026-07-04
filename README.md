# 🎉 Birthday Website

A beautiful, dynamic multi-page birthday celebration website built with **Next.js**, **React**, and **Tailwind CSS**. This project features auto-playing music, stunning animations, a photo gallery, video section, and heartfelt messages — perfect for creating a digital birthday experience.

---

## ✏️ Personalize the Website

Before sharing or deploying, make sure to replace all instances of Sashah in the project files with your friend's name to personalize the experience.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **Yarn**

### Installation & Setup

1. **Clone or extract the project**
2. **Navigate to the project folder:**
   ```bash
   cd birthday-website
   ```
3. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. **Open your browser and visit:**
   [http://localhost:3000](http://localhost:3000)

🎊 That's it — the website should now be running locally!

---

## 📁 Project Structure

```
birthday-website/
├── app/                  # App Router structure
│   ├── layout.tsx        # Global layout
│   ├── page.tsx          # Home page
│   ├── gallery/          # Photo gallery
│   ├── peeeeeeeeeple/    # Peeeeeeeeeple
│   ├── video/            # Video section
│   └── globals.css       # Global styles
├── components/           # Reusable components
│   ├── navigation.tsx    # Navbar
│   ├── music-provider.tsx# Music logic
│   └── background-effects.tsx # Animations
├── public/               # Static assets
│   ├── birthday-song.mp3 # 🎵 Your music
│   ├── images/           # 📸 Your photos
│   └── videos/           # 🎬 Your video
├── package.json          # Project config
├── next.config.js        # Next.js settings
├── tailwind.config.ts    # Tailwind settings
└── README.md             # This file
```

---

## 🎵 Add Your Music

- Convert your file to `.mp3` and name it `birthday-song.mp3`.
- Place it inside the `public/` folder.
- Update the music logic in `components/music-provider.tsx` if needed.

## 📸 Add Your Photos

- Place your images in `public/images/`.
- Recommended formats: `.jpg`, `.png`, or `.webp`.
- Update the array in `app/gallery/page.tsx`:

```ts
const photos = [
  {
    src: "/images/photo1.jpg",
    title: "Your Title",
    description: "Your custom message",
  },
  // ...
];
```

## 🎬 Add Your Video

- Convert your video to `.mp4` or `.webm`.
- Place it in `public/videos/`.
- Replace the placeholder in `app/video/page.tsx`:

```jsx
<video controls className="w-full h-auto rounded-lg">
  <source src="/videos/your-video.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

---

## 🎨 Customization Options

- **Personal Messages**
  - Home: `app/page.tsx`
  - Photo captions: `app/gallery/page.tsx`
- **Theme & Styling**
  - Global styles: `app/globals.css`
  - Gradient colors: `.text-gradient` class
  - Card borders: Customize via Tailwind classes
- **Add More Pages**
  - Create a new folder in `app/`
  - Add a `page.tsx` file
  - Update navigation in `components/navigation.tsx`

---

## 🛠️ Available Scripts

```bash
npm run dev     # Start dev server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Lint the code
```

---

## 📱 Browser Compatibility

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

> ⚠️ Music autoplay may require user interaction due to browser policies

---

## 🧩 Troubleshooting

### "Module not found" errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 in use

```bash
npm run dev -- -p 3001
```

### Music not auto-playing

- Most browsers block autoplay; users can click the play button
- Playback begins after first interaction

### Images not showing?

- Ensure files are in `public/images/`
- File names and extensions must match (case-sensitive)

---

## 🌟 Features Overview

- **🎵 Music Player**
  - Auto-play with manual controls
  - Floating UI and persistent playback
- **📸 Photo Gallery**
  - Responsive grid
  - Modal viewer with animations
- **🎬 Video Section**
  - Full-screen video player
  - Easy customization
- **✨ Animations**
  - Balloons, confetti, hover effects, and gradient text
- **📱 Responsive Design**
  - Optimized for mobile, tablet, and desktop

---

## 💡 Enhancement Ideas

- Add a guest book (comments or messages)
- Implement a countdown timer
- Include birthday quizzes or trivia
- Create themed albums by year
- Add favorite quotes or jokes

---

## 🚀 Deployment Options

- **Vercel**
  - Connect GitHub repo → One-click deploy
- **Netlify**
  - Drag and drop build folder
  - Or connect to GitHub
- **Alternatives**
  - GitHub Pages
  - Firebase Hosting
  - DigitalOcean / VPS / Custom domains

---

## 📣 Final Notes

This project was designed as a customizable birthday celebration experience. Swap out media, personalize messages, and make it your own. Whether you're gifting it to a friend or showcasing it in your portfolio — it’s built to impress.

Built with ❤️ using Next.js, React, and Tailwind CSS.

Make it personal. Make it memorable. Make it yours. 🎂
