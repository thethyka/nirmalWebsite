# 📁 Adding Your Media Files

## 🎵 Music File

- **Location:** `public/birthday-song.mp3`
- **Format:** MP3 (recommended)
- **Size:** Under 10MB for faster loading
- **Note:** Will auto-play when visitors arrive (if browser allows)

---

## 📸 Photos for Gallery

- **Location:** `public/images/`
- **Naming:** `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, etc.
- **Format:** JPG, PNG, or WebP
- **Size:** 800x800px or larger, under 2MB each
- **Quantity:** 7-8 photos recommended

### Update Photo Information

Edit `app/gallery/page.tsx` and update this array:

```javascript
const photos = [
  {
    src: "/images/photo1.jpg",
    title: "Beautiful Smile",
    description: "Your custom description! ✨",
  },
  {
    src: "/images/photo2.jpg",
    title: "Adventure Time",
    description: "Another custom description! 🌟",
  },
  // Add more photos...
];
```

---

## 🎬 Video File

- **Location:** `public/videos/your-video.mp4`
- **Format:** MP4 (recommended) or WebM
- **Size:** Under 50MB recommended
- **Resolution:** 1080p or lower

### Update Video Player

Edit `app/video/page.tsx` and replace the placeholder with:

```jsx
<video
  controls
  className="w-full h-auto rounded-lg"
  poster="/images/video-thumbnail.jpg"
>
  <source src="/videos/your-video.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

---

## 🔄 After Adding Files

The website will automatically refresh and show your new content!

---

## 💡 Pro Tips

- Compress large images before adding them
- Test the website on mobile devices
- Make sure file names match exactly (case-sensitive)
- Keep backup copies of your original files
