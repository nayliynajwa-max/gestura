export type BIMCategory =
  | "Family"
  | "Greetings"
  | "Emotion"
  | "Colour"
  | "Daily Activities"
  | "Time";

export type BIMSign = {
  id: string;
  word: string;
  english: string;
  category: BIMCategory;
  video: string;
  image?: string;
};

export const bimSigns: BIMSign[] = [
  /* =====================================================
     FAMILY
  ===================================================== */

  {
    id: "ayah",
    word: "Ayah",
    english: "Father",
    category: "Family",
    video: "/bim-videos/ayah.mp4",
    image: "/bim-signs/ayah.png",
  },
  {
    id: "ibu",
    word: "Ibu",
    english: "Mother",
    category: "Family",
    video: "/bim-videos/ibu.mp4",
    image: "/bim-signs/ibu.png",
  },
  {
    id: "atuk",
    word: "Atuk",
    english: "Grandfather",
    category: "Family",
    video: "/bim-videos/atuk.mp4",
  },
  {
    id: "nenek",
    word: "Nenek",
    english: "Grandmother",
    category: "Family",
    video: "/bim-videos/nenek.mp4",
  },
  {
    id: "adik-perempuan",
    word: "Adik Perempuan",
    english: "Younger Sister",
    category: "Family",
    video: "/bim-videos/adik perempuan.mp4",
  },
  {
    id: "adik-lelaki",
    word: "Adik Lelaki",
    english: "Younger Brother",
    category: "Family",
    video: "/bim-videos/adik lelaki.mp4",
  },

  /* =====================================================
     GREETINGS
  ===================================================== */

  {
    id: "assalammualaikum",
    word: "Assalammualaikum",
    english: "Peace Be Upon You",
    category: "Greetings",

    // ikut nama fail video yang sedia ada
    video: "/bim-videos/assalammualikum.mp4",
  },
  {
    id: "waalaikumussalam",
    word: "Waalaikumussalam",
    english: "And Peace Be Upon You",
    category: "Greetings",
    video: "/bim-videos/waalaikumussalam.mp4",
  },
  {
    id: "terima-kasih",
    word: "Terima Kasih",
    english: "Thank You",
    category: "Greetings",
    video: "/bim-videos/terima-kasih.mp4",
    image: "/bim-signs/terima-kasih.png",
  },
  {
    id: "sama-sama",
    word: "Sama-sama",
    english: "You're Welcome",
    category: "Greetings",
    video: "/bim-videos/sama-sama.mp4",
    image: "/bim-signs/sama-sama.png",
  },
  {
    id: "selamat",
    word: "Selamat",
    english: "Greetings / Safe",
    category: "Greetings",
    video: "/bim-videos/selamat.mp4",
  },

  /* =====================================================
     EMOTION / RESPONSE
  ===================================================== */

  {
    id: "marah",
    word: "Marah",
    english: "Angry",
    category: "Emotion",
    video: "/bim-videos/marah.mp4",
  },
  {
    id: "gembira",
    word: "Gembira",
    english: "Happy",
    category: "Emotion",
    video: "/bim-videos/gembira.mp4",
  },
  {
    id: "risau",
    word: "Risau",
    english: "Worried",
    category: "Emotion",
    video: "/bim-videos/risau.mp4",
  },
  {
    id: "keliru",
    word: "Keliru",
    english: "Confused",
    category: "Emotion",
    video: "/bim-videos/keliru.mp4",
  },
  {
    id: "sedih",
    word: "Sedih",
    english: "Sad",
    category: "Emotion",
    video: "/bim-videos/sedih.mp4",
  },
  {
    id: "betul",
    word: "Betul",
    english: "Correct",
    category: "Emotion",
    video: "/bim-videos/betul.mp4",
    image: "/bim-signs/betul.png",
  },
  {
    id: "salah",
    word: "Salah",
    english: "Wrong",
    category: "Emotion",
    video: "/bim-videos/salah.mp4",
    image: "/bim-signs/salah.png",
  },

  /* =====================================================
     COLOUR
  ===================================================== */

  {
    id: "kuning",
    word: "Kuning",
    english: "Yellow",
    category: "Colour",
    video: "/bim-videos/kuning.mp4",
  },
  {
    id: "hijau",
    word: "Hijau",
    english: "Green",
    category: "Colour",
    video: "/bim-videos/hijau.mp4",
  },
  {
    id: "biru",
    word: "Biru",
    english: "Blue",
    category: "Colour",
    video: "/bim-videos/biru.mp4",
  },
  {
    id: "merah",
    word: "Merah",
    english: "Red",
    category: "Colour",
    video: "/bim-videos/merah.mp4",
  },
  {
    id: "putih",
    word: "Putih",
    english: "White",
    category: "Colour",
    video: "/bim-videos/putih.mp4",
  },

  /* =====================================================
     DAILY ACTIVITIES
  ===================================================== */

  {
    id: "makan",
    word: "Makan",
    english: "Eat",
    category: "Daily Activities",
    video: "/bim-videos/makan.mp4",
    image: "/bim-signs/makan.png",
  },
  {
    id: "minum",
    word: "Minum",
    english: "Drink",
    category: "Daily Activities",
    video: "/bim-videos/minum.mp4",
  },
  {
    id: "tidur",
    word: "Tidur",
    english: "Sleep",
    category: "Daily Activities",
    video: "/bim-videos/tidur.mp4",
  },
  {
    id: "masak",
    word: "Masak",
    english: "Cook",
    category: "Daily Activities",
    video: "/bim-videos/masak.mp4",
  },
  {
    id: "beli",
    word: "Beli",
    english: "Buy",
    category: "Daily Activities",
    video: "/bim-videos/beli.mp4",
  },
  {
    id: "jual",
    word: "Jual",
    english: "Sell",
    category: "Daily Activities",
    video: "/bim-videos/jual.mp4",
  },
  {
    id: "tolong",
    word: "Tolong",
    english: "Help / Please",
    category: "Daily Activities",
    video: "/bim-videos/tolong.mp4",
    image: "/bim-signs/tolong.png",
  },
  {
    id: "berjalan",
    word: "Berjalan",
    english: "Walk",
    category: "Daily Activities",
    video: "/bim-videos/berjalan.mp4",
    image: "/bim-signs/berjalan.png",
  },
  {
    id: "berlari",
    word: "Berlari",
    english: "Run",
    category: "Daily Activities",
    video: "/bim-videos/berlari.mp4",
    image: "/bim-signs/berlari.png",
  },
  {
    id: "belum",
    word: "Belum",
    english: "Not Yet",
    category: "Daily Activities",
    video: "/bim-videos/belum.mp4",
  },
  {
    id: "sudah",
    word: "Sudah",
    english: "Already / Done",
    category: "Daily Activities",
    video: "/bim-videos/sudah.mp4",
  },

  /* =====================================================
     TIME
  ===================================================== */

  {
    id: "pagi",
    word: "Pagi",
    english: "Morning",
    category: "Time",
    video: "/bim-videos/pagi.mp4",
  },
  {
    id: "tengahari",
    word: "Tengahari",
    english: "Noon",
    category: "Time",
    video: "/bim-videos/tengahari.mp4",
  },
  {
    id: "petang",
    word: "Petang",
    english: "Afternoon",
    category: "Time",
    video: "/bim-videos/petang.mp4",
  },
  {
    id: "malam",
    word: "Malam",
    english: "Night",
    category: "Time",
    video: "/bim-videos/malam.mp4",
  },
];

/* =========================================================
   CATEGORIES
========================================================= */

export const bimCategories: BIMCategory[] = [
  "Family",
  "Greetings",
  "Emotion",
  "Colour",
  "Daily Activities",
  "Time",
];

/* =========================================================
   SEARCH HELPER
========================================================= */

export function searchBIMSigns(
  query: string
) {
  const search =
    query.trim().toLowerCase();

  if (!search) {
    return bimSigns;
  }

  return bimSigns.filter((sign) => {
    return (
      sign.word
        .toLowerCase()
        .includes(search) ||
      sign.english
        .toLowerCase()
        .includes(search) ||
      sign.category
        .toLowerCase()
        .includes(search)
    );
  });
}

/* =========================================================
   CATEGORY HELPER
========================================================= */

export function getBIMSignsByCategory(
  category: BIMCategory
) {
  return bimSigns.filter(
    (sign) =>
      sign.category === category
  );
}