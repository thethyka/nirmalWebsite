/**
 * SITE CONTENT — everything personal/editable about the site lives here:
 * his bio, his photo, the RSVP contact, and the Gallery playlist.
 *
 * To update:
 *  - Text (bio, rsvpContact): edit the strings below directly.
 *  - Photo: drop the new file into `public/`, then update `photo.src` to
 *    match its filename (e.g. "/nirmal.jpg").
 *  - Playlist: drop 5–10 audio files into `public/playlist/`, then replace
 *    the `playlist` array below with one entry per track.
 *
 * No other file should need to change to update any of this content.
 */

export const SITE_CONTENT = {
  photo: {
    src: "/placeholder-user.jpg",
    alt: "Dr. Nirmal Singh Ahluwalia",
    isPlaceholder: false,
  },

  bio: `Dr. Nirmal Singh Ahluwalia was born at the Indian Maternity Hospital in Nairobi, Kenya, in 1939. His parents, Sardar Dalip Singh Ahluwalia and Sardarni Tarlochan Kaur, emigrated from Jalandhar, Punjab, to Kenya in the 1930s to build the railway during the British Raj. As the eldest of six children, Nirmal embraced responsibility from an early age and became a role model through his leadership, humility and spirit of seva (selfless service).

At Jamhuri High School, he served as Head Boy and worked alongside his headmaster, Mr. Mwangi, to raise £9,500 to build the school's swimming pool. His academic excellence earned him a scholarship to study medicine at the University of Edinburgh, after which he returned to Kenya to serve as a consultant cardiologist at MP Shah, Aga Khan Hospital and Nairobi Hospital. Alongside his wife, Sukhnandan, he raised their four children, Jyoti, Sapna, Komal and Sandeep, while caring for countless patients and mentoring future doctors at the University of Nairobi.

The family later moved to the United Kingdom, where Nirmal continued serving others as a general practitioner, completing a Diploma in Addiction Medicine. In 1999, he and Sukhnandan settled in Australia, where he spent many years caring for Aboriginal communities in rural Western Australia before retiring in 2016, ending a medical career spanning more than five decades.

In retirement, Nirmal and Sukhnandan enjoyed travelling together until declining health led them back to Kenya in 2023. Surrounded by the love of his family, grandchildren and devoted local Kenyan nurses and carers, he spent his final years with dignity and peace.

Throughout his life, Nirmal embodied the Sikh values of seva, humility, honest hard work and compassion. He leaves a legacy as a devoted husband, loving father and grandfather, respected physician, inspiring teacher and a man whose life was dedicated to serving humanity with kindness, integrity and grace.`,

  rsvp: {
    contact: "Placeholder RSVP contact.",
    isPlaceholder: true,
  },

  playlist: [
    { title: "Track 1 (placeholder)", src: "/playlist/track-1.mp3" },
    { title: "Track 2 (placeholder)", src: "/playlist/track-2.mp3" },
    { title: "Track 3 (placeholder)", src: "/playlist/track-3.mp3" },
    { title: "Track 4 (placeholder)", src: "/playlist/track-4.mp3" },
    { title: "Track 5 (placeholder)", src: "/playlist/track-5.mp3" },
    { title: "Track 6 (placeholder)", src: "/playlist/track-6.mp3" },
  ],
};
