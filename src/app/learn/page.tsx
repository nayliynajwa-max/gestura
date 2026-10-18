"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
} from "motion/react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  bimSigns,
  type BIMSign,
} from "@/data/bimData";

/* =====================================================
   TYPES
===================================================== */

type Category = {
  name: string;
  description: string;
  image: string;
};

/* =====================================================
   CATEGORIES
===================================================== */

const categories: Category[] = [
  {
    name: "Family",
    description:
      "Learn signs for family members.",
    image: "/category-icons/family.png",
  },
  {
    name: "Greetings",
    description:
      "Learn greetings and common expressions.",
    image: "/category-icons/greetings.png",
  },
  {
    name: "Emotion",
    description:
      "Learn signs used to express emotions.",
    image: "/category-icons/emotion.png",
  },
  {
    name: "Colour",
    description:
      "Learn common colour signs.",
    image: "/category-icons/colour.png",
  },
  {
    name: "Daily Activities",
    description:
      "Learn signs used in everyday activities.",
    image:
      "/category-icons/daily activities.png",
  },
  {
    name: "Time",
    description:
      "Learn signs related to time of day.",
    image: "/category-icons/time.png",
  },
];

const signs = bimSigns;

/* =====================================================
   PAGE
===================================================== */

export default function LearnPage() {
  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<string | null>(null);

  const [
    currentSignId,
    setCurrentSignId,
  ] = useState<string | null>(null);

  const [mastered, setMastered] =
    useState<string[]>([]);

  const [
    videoError,
    setVideoError,
  ] = useState(false);

  /* ===================================================
     LOAD PROGRESS
  =================================================== */

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          "gestura-mastered-signs"
        );

      if (saved) {
        const parsed =
          JSON.parse(saved);

        if (Array.isArray(parsed)) {
          const validIds =
            parsed.filter(
              (id): id is string =>
                typeof id === "string" &&
                signs.some(
                  (sign) =>
                    sign.id === id
                )
            );

          setMastered(validIds);
        }
      }
    } catch (error) {
      console.error(
        "Unable to load learning progress:",
        error
      );
    }
  }, []);

  /* ===================================================
     CATEGORY SIGNS
  =================================================== */

  const categorySigns =
    useMemo(() => {
      if (!selectedCategory) {
        return [];
      }

      return signs.filter(
        (sign) =>
          sign.category ===
          selectedCategory
      );
    }, [selectedCategory]);

  const currentIndex =
    categorySigns.findIndex(
      (sign) =>
        sign.id === currentSignId
    );

  const currentSign:
    | BIMSign
    | null =
    currentIndex >= 0
      ? categorySigns[currentIndex]
      : null;

  useEffect(() => {
    setVideoError(false);
  }, [currentSignId]);

  /* ===================================================
     SAVE PROGRESS
  =================================================== */

  function saveMastered(
    updated: string[]
  ) {
    setMastered(updated);

    localStorage.setItem(
      "gestura-mastered-signs",
      JSON.stringify(updated)
    );
  }

  function markAsLearned() {
    if (!currentSign) return;

    if (
      mastered.includes(
        currentSign.id
      )
    ) {
      return;
    }

    saveMastered([
      ...mastered,
      currentSign.id,
    ]);
  }

  /* ===================================================
     CATEGORY ACTIONS
  =================================================== */

  function openCategory(
    category: string
  ) {
    const firstSign =
      signs.find(
        (sign) =>
          sign.category ===
          category
      );

    setSelectedCategory(category);

    if (firstSign) {
      setCurrentSignId(
        firstSign.id
      );
    } else {
      setCurrentSignId(null);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function backToCategories() {
    setSelectedCategory(null);
    setCurrentSignId(null);
    setVideoError(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* ===================================================
     SIGN NAVIGATION
  =================================================== */

  function previousSign() {
    if (currentIndex > 0) {
      setCurrentSignId(
        categorySigns[
          currentIndex - 1
        ].id
      );
    }
  }

  function nextSign() {
    markAsLearned();

    if (
      currentIndex <
      categorySigns.length - 1
    ) {
      setCurrentSignId(
        categorySigns[
          currentIndex + 1
        ].id
      );
    }
  }

  function selectSign(
    id: string
  ) {
    setCurrentSignId(id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* ===================================================
     PROGRESS
  =================================================== */

  const validMastered =
    mastered.filter((id) =>
      signs.some(
        (sign) =>
          sign.id === id
      )
    );

  const learningPercentage =
    signs.length > 0
      ? (validMastered.length /
          signs.length) *
        100
      : 0;

  function categoryProgress(
    categoryName: string
  ) {
    const items =
      signs.filter(
        (sign) =>
          sign.category ===
          categoryName
      );

    if (
      items.length === 0
    ) {
      return {
        learned: 0,
        total: 0,
        percentage: 0,
      };
    }

    const learned =
      items.filter((sign) =>
        mastered.includes(
          sign.id
        )
      ).length;

    return {
      learned,
      total: items.length,
      percentage:
        (learned /
          items.length) *
        100,
    };
  }

  const selectedCategoryImage =
    categories.find(
      (category) =>
        category.name ===
        selectedCategory
    )?.image ||
    "/gestura-logo.png";

  /* ===================================================
     UI
  =================================================== */

  return (
    <main className="min-h-screen bg-[#F4FBFE] text-[#0B2545]">
      <Navbar />

      {/* HERO */}

      <section className="relative overflow-hidden">
        <div className="absolute left-[-160px] top-[-120px] h-[420px] w-[420px] rounded-full bg-[#BDECF6]/40 blur-3xl" />

        <div className="absolute right-[-120px] top-[50px] h-[380px] w-[380px] rounded-full bg-[#7BE1D6]/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-14">
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <div className="inline-flex rounded-full border border-[#BFE6EE] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#176B87]">
              Learn Bahasa Isyarat
              Malaysia
            </div>

            <h1 className="mt-5 text-4xl font-extrabold md:text-5xl">
              Learn BIM
              <span className="text-[#14B8A6]">
                {" "}
                visually.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-[#52738A]">
              Choose a learning
              category and study each
              BIM sign using video
              demonstrations and
              available reference
              images.
            </p>
          </motion.div>

          {/* OVERALL PROGRESS */}

          <div className="mt-8 max-w-3xl rounded-[24px] border border-[#D6EBF0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#176B87]">
                  Overall Learning
                  Progress
                </p>

                <p className="mt-1 text-xs text-[#68889B]">
                  {
                    validMastered.length
                  }{" "}
                  of {signs.length}{" "}
                  available signs
                  learned
                </p>
              </div>

              <div className="text-lg font-extrabold text-[#14B8A6]">
                {Math.round(
                  learningPercentage
                )}
                %
              </div>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#E2EFF2]">
              <motion.div
                animate={{
                  width: `${learningPercentage}%`,
                }}
                className="h-full rounded-full bg-gradient-to-r from-[#176B87] to-[#14B8A6]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          CATEGORIES
      ================================================= */}

      {!selectedCategory && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.17em] text-[#14B8A6]">
              Learning Categories
            </p>

            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">
              Choose a category
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-[#68889B]">
              Select a category to
              start learning BIM signs.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(
              (
                category,
                index
              ) => {
                const progress =
                  categoryProgress(
                    category.name
                  );

                return (
                  <motion.button
                    type="button"
                    key={
                      category.name
                    }
                    onClick={() =>
                      openCategory(
                        category.name
                      )
                    }
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index *
                        0.06,
                    }}
                    whileHover={{
                      y: -7,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="group overflow-hidden rounded-[30px] border border-[#D8E9ED] bg-white text-left shadow-lg shadow-[#176B87]/5 transition hover:border-[#14B8A6]"
                  >
                    <div className="relative flex h-[250px] items-center justify-center overflow-hidden bg-[#F8FCFD] p-6">
                      <Image
                        src={
                          category.image
                        }
                        alt={
                          category.name
                        }
                        width={500}
                        height={500}
                        className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                      />

                      {progress.total >
                        0 &&
                        progress.learned ===
                          progress.total && (
                          <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#14B8A6] font-bold text-white shadow-lg">
                            ✓
                          </div>
                        )}
                    </div>

                    <div className="border-t border-[#E5EFF1] p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-extrabold text-[#0B2545]">
                            {
                              category.name
                            }
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-[#68889B]">
                            {
                              category.description
                            }
                          </p>
                        </div>

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF8FA] font-bold text-[#176B87] transition group-hover:bg-[#14B8A6] group-hover:text-white">
                          →
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#68889B]">
                            {
                              progress.learned
                            }{" "}
                            /{" "}
                            {
                              progress.total
                            }{" "}
                            learned
                          </span>

                          <span className="font-extrabold text-[#14B8A6]">
                            {Math.round(
                              progress.percentage
                            )}
                            %
                          </span>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E4EFF2]">
                          <motion.div
                            animate={{
                              width: `${progress.percentage}%`,
                            }}
                            className="h-full rounded-full bg-[#14B8A6]"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              }
            )}
          </div>
        </section>
      )}

      {/* =================================================
          SELECTED CATEGORY
      ================================================= */}

      {selectedCategory && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          {/* CATEGORY HEADER */}

          <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <button
                type="button"
                onClick={
                  backToCategories
                }
                className="mb-4 inline-flex items-center gap-2 text-sm font-extrabold text-[#176B87] transition hover:text-[#14B8A6]"
              >
                ← All Categories
              </button>

              <p className="text-sm font-bold uppercase tracking-[0.17em] text-[#14B8A6]">
                BIM Category
              </p>

              <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">
                {selectedCategory}
              </h2>

              <p className="mt-2 text-[#68889B]">
                {
                  categorySigns.length
                }{" "}
                learning signs
                available
              </p>
            </div>

            <div className="flex h-[120px] w-[150px] items-center justify-center overflow-hidden rounded-[22px] border border-[#D8E9ED] bg-white p-3">
              <Image
                src={
                  selectedCategoryImage
                }
                alt={
                  selectedCategory
                }
                width={200}
                height={150}
                className="max-h-full w-auto object-contain"
              />
            </div>
          </div>

          {/* =================================================
              MAIN LESSON
          ================================================= */}

          {currentSign && (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={
                    currentSign.id
                  }
                  initial={{
                    opacity: 0,
                    x: 25,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -25,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="overflow-hidden rounded-[34px] border border-[#D5E9EE] bg-white shadow-xl shadow-[#176B87]/5"
                >
                  {/* SIGN TITLE */}

                  <div className="flex flex-col justify-between gap-5 border-b border-[#E2EFF2] p-7 md:flex-row md:items-center md:p-9">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-[#E5F8F5] px-4 py-2 text-xs font-bold text-[#0F766E]">
                          {
                            currentSign.category
                          }
                        </span>

                        {mastered.includes(
                          currentSign.id
                        ) && (
                          <span className="rounded-full bg-[#E7F3FF] px-4 py-2 text-xs font-bold text-[#176B87]">
                            ✓ Learned
                          </span>
                        )}
                      </div>

                      <h2 className="mt-4 text-4xl font-extrabold">
                        {
                          currentSign.word
                        }
                      </h2>

                      <p className="mt-2 text-xl font-semibold text-[#68889B]">
                        {
                          currentSign.english
                        }
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#F0F9FA] px-6 py-4 text-center">
                      <p className="text-2xl font-extrabold text-[#176B87]">
                        {currentIndex +
                          1}{" "}
                        /{" "}
                        {
                          categorySigns.length
                        }
                      </p>

                      <p className="mt-1 text-xs text-[#68889B]">
                        Current Sign
                      </p>
                    </div>
                  </div>

                  {/* REFERENCE + VIDEO */}

                  <div
                    className={`grid gap-6 p-7 md:p-9 ${
                      currentSign.image
                        ? "lg:grid-cols-2"
                        : "lg:grid-cols-1"
                    }`}
                  >
                    {/* REFERENCE IMAGE */}

                    {currentSign.image && (
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <p className="font-extrabold">
                            Reference
                            Image
                          </p>

                          <span className="rounded-full bg-[#EEF8FA] px-3 py-1 text-xs font-bold text-[#176B87]">
                            Image
                          </span>
                        </div>

                        <div className="flex min-h-[380px] items-center justify-center overflow-hidden rounded-[28px] border border-[#D9E9ED] bg-[#F8FCFD] p-5">
                          <Image
                            src={
                              currentSign.image
                            }
                            alt={`BIM ${currentSign.word}`}
                            width={700}
                            height={550}
                            priority
                            className="max-h-[400px] w-auto max-w-full object-contain"
                          />
                        </div>
                      </div>
                    )}

                    {/* VIDEO */}

                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <p className="font-extrabold">
                          Video
                          Demonstration
                        </p>

                        <span className="rounded-full bg-[#E9F8F5] px-3 py-1 text-xs font-bold text-[#0F766E]">
                          ▶ Video
                        </span>
                      </div>

                      {!videoError ? (
                        <div className="flex min-h-[380px] items-center justify-center overflow-hidden rounded-[28px] bg-[#0B2545] p-3">
                          <video
                            key={
                              currentSign.video
                            }
                            controls
                            playsInline
                            preload="metadata"
                            onError={() =>
                              setVideoError(
                                true
                              )
                            }
                            className="max-h-[400px] w-full rounded-[20px]"
                          >
                            <source
                              src={
                                currentSign.video
                              }
                              type="video/mp4"
                            />

                            Your browser
                            does not
                            support video.
                          </video>
                        </div>
                      ) : (
                        <div className="flex min-h-[380px] flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-[#CFE3E8] bg-[#F8FCFD] p-8 text-center">
                          <div className="text-5xl">
                            🎥
                          </div>

                          <p className="mt-4 font-extrabold text-[#176B87]">
                            Video
                            unavailable
                          </p>

                          <p className="mt-2 text-sm text-[#68889B]">
                            The video
                            file could
                            not be
                            loaded.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* VIDEO ONLY NOTE */}

                  {!currentSign.image && (
                    <div className="mx-7 mb-4 rounded-[22px] border border-[#D7EBEF] bg-[#F8FCFD] p-5 md:mx-9">
                      <p className="font-extrabold text-[#176B87]">
                        Video learning
                        material
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#68889B]">
                        Watch the BIM
                        video carefully
                        to study the
                        hand shape,
                        position and
                        movement.
                      </p>
                    </div>
                  )}

                  {/* TIP */}

                  <div className="mx-7 mb-7 rounded-[24px] bg-[#F0FAFA] p-6 md:mx-9 md:mb-9">
                    <p className="font-extrabold text-[#0F766E]">
                      Watch carefully
                    </p>

                    <p className="mt-2 text-sm leading-7 text-[#52738A]">
                      Observe the hand
                      shape, hand
                      position and
                      movement shown in
                      the BIM
                      demonstration.
                      Replay the video
                      as many times as
                      needed.
                    </p>
                  </div>

                  {/* NAVIGATION */}

                  <div className="grid gap-4 border-t border-[#E1EEF1] p-7 sm:grid-cols-3 md:p-9">
                    <button
                      type="button"
                      disabled={
                        currentIndex ===
                        0
                      }
                      onClick={
                        previousSign
                      }
                      className="rounded-2xl border border-[#CFE3E8] bg-white px-6 py-4 font-extrabold text-[#176B87] transition hover:border-[#14B8A6] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ← Previous
                    </button>

                    <button
                      type="button"
                      onClick={
                        markAsLearned
                      }
                      className={`rounded-2xl px-6 py-4 font-extrabold transition ${
                        mastered.includes(
                          currentSign.id
                        )
                          ? "bg-[#E3F7F3] text-[#0F766E]"
                          : "bg-[#14B8A6] text-white hover:bg-[#0F9F91]"
                      }`}
                    >
                      {mastered.includes(
                        currentSign.id
                      )
                        ? "✓ Learned"
                        : "Mark as Learned"}
                    </button>

                    {currentIndex <
                    categorySigns.length -
                      1 ? (
                      <button
                        type="button"
                        onClick={
                          nextSign
                        }
                        className="rounded-2xl bg-[#0B2545] px-6 py-4 font-extrabold text-white transition hover:bg-[#176B87]"
                      >
                        Next Sign →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          markAsLearned();
                          backToCategories();
                        }}
                        className="rounded-2xl bg-[#0B2545] px-6 py-4 font-extrabold text-white transition hover:bg-[#176B87]"
                      >
                        Finish
                        Category ✓
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* =================================================
                  SIGNS IN THIS CATEGORY
                  ALL CARDS USE VIDEO PREVIEW
              ================================================= */}

              <div className="mt-12">
                <p className="text-sm font-bold uppercase tracking-[0.17em] text-[#14B8A6]">
                  {selectedCategory}
                </p>

                <h2 className="mt-2 text-3xl font-extrabold">
                  Signs in this
                  category
                </h2>

                <p className="mt-2 text-[#68889B]">
                  Select any sign to
                  watch its BIM video
                  demonstration.
                </p>

                <div className="mt-7 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {categorySigns.map(
                    (sign) => {
                      const learned =
                        mastered.includes(
                          sign.id
                        );

                      const active =
                        currentSign.id ===
                        sign.id;

                      return (
                        <motion.button
                          type="button"
                          key={
                            sign.id
                          }
                          onClick={() =>
                            selectSign(
                              sign.id
                            )
                          }
                          whileHover={{
                            y: -4,
                          }}
                          className={`overflow-hidden rounded-[22px] border-2 bg-white text-left transition ${
                            active
                              ? "border-[#14B8A6] shadow-md"
                              : "border-[#DFECEF]"
                          }`}
                        >
                          {/* VIDEO PREVIEW */}

                          <div className="relative flex h-[190px] items-center justify-center overflow-hidden bg-[#EAF4F6]">
                            <video
                              key={
                                sign.video
                              }
                              src={
                                sign.video
                              }
                              muted
                              playsInline
                              preload="metadata"
                              className="h-full w-full object-contain"
                            />

                            <div className="absolute bottom-3 left-3 rounded-full bg-[#0B2545]/85 px-3 py-1 text-xs font-bold text-white">
                              ▶ Video
                            </div>

                            {learned && (
                              <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#14B8A6] text-sm font-bold text-white shadow">
                                ✓
                              </div>
                            )}
                          </div>

                          {/* SIGN NAME */}

                          <div className="border-t border-[#E5EFF1] p-4">
                            <p className="font-extrabold text-[#0B2545]">
                              {
                                sign.word
                              }
                            </p>

                            <p className="mt-1 text-xs text-[#78909C]">
                              {
                                sign.english
                              }
                            </p>
                          </div>
                        </motion.button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* QUIZ CTA */}

              <div className="mt-12 rounded-[32px] bg-gradient-to-r from-[#0B2545] to-[#176B87] p-8 text-white md:p-10">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.17em] text-[#72E0D2]">
                      Ready to
                      practise?
                    </p>

                    <h2 className="mt-2 text-3xl font-extrabold">
                      Test what you
                      learned.
                    </h2>

                    <p className="mt-2 text-white/65">
                      Continue to the
                      visual BIM quiz
                      and test your
                      recognition.
                    </p>
                  </div>

                  <Link
                    href="/practice"
                    className="rounded-2xl bg-[#14B8A6] px-7 py-4 text-center font-extrabold text-white transition hover:bg-[#10A595]"
                  >
                    Start Visual Quiz
                    →
                  </Link>
                </div>
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}

/* =====================================================
   NAVBAR
===================================================== */

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#D5EDF2] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Image
            src="/gestura-logo.png"
            alt="Gestura Logo"
            width={320}
            height={120}
            priority
            className="h-auto w-[200px] object-contain md:w-[250px]"
          />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-[#466A80] lg:flex">
          <Link
            href="/"
            className="transition hover:text-[#14B8A6]"
          >
            Home
          </Link>

          <Link
            href="/learn"
            className="font-bold text-[#14B8A6]"
          >
            Learn BIM
          </Link>

          <Link
            href="/dictionary"
            className="transition hover:text-[#14B8A6]"
          >
            Dictionary
          </Link>

          <Link
            href="/translator"
            className="transition hover:text-[#14B8A6]"
          >
            Live Translator
          </Link>

          <Link
            href="/practice"
            className="transition hover:text-[#14B8A6]"
          >
            Practice
          </Link>

          <Link
            href="/achievements"
            className="transition hover:text-[#14B8A6]"
          >
            Achievements
          </Link>

          <Link
            href="/about"
            className="transition hover:text-[#14B8A6]"
          >
            About
          </Link>
        </nav>

        <Link
          href="/practice"
          className="rounded-full bg-[#0B2545] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#176B87]"
        >
          Start Quiz
        </Link>
      </div>
    </header>
  );
}