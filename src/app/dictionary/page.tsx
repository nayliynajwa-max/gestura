"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, type Variants } from "motion/react";

import {
  bimSigns,
  bimCategories,
  type BIMSign,
} from "@/data/bimData";

/* =====================================================
   ANIMATION
===================================================== */

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

/* =====================================================
   PAGE
===================================================== */

export default function DictionaryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("All");

  const [selectedSign, setSelectedSign] =
    useState<BIMSign | null>(null);

  const categories = [
    "All",
    ...bimCategories,
  ];

  /* =====================================================
     SEARCH + FILTER
  ===================================================== */

  const filteredSigns = useMemo(() => {
    const keyword = search
      .toLowerCase()
      .trim();

    return bimSigns.filter((sign) => {
      const matchesSearch =
        sign.word
          .toLowerCase()
          .includes(keyword) ||
        sign.english
          .toLowerCase()
          .includes(keyword) ||
        sign.category
          .toLowerCase()
          .includes(keyword);

      const matchesCategory =
        activeCategory === "All" ||
        sign.category === activeCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [search, activeCategory]);

  return (
    <main className="min-h-screen bg-[#F4FBFE] text-[#0B2545]">

      {/* =================================================
          NAVBAR
      ================================================= */}

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
              className="transition hover:text-[#14B8A6]"
            >
              Learn BIM
            </Link>

            <Link
              href="/dictionary"
              className="font-bold text-[#14B8A6]"
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
            href="/learn"
            className="rounded-full bg-[#0B2545] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#176B87]"
          >
            Start Learning
          </Link>

        </div>
      </header>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative overflow-hidden border-b border-[#D7EDF2]">

        <div className="absolute left-[-120px] top-[-150px] h-[380px] w-[380px] rounded-full bg-[#BFEFF5]/50 blur-3xl" />

        <div className="absolute right-[-100px] top-[20px] h-[350px] w-[350px] rounded-full bg-[#8BE3D9]/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 text-center">

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
          >

            <div className="inline-flex rounded-full border border-[#BFE6EE] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#176B87] shadow-sm">
              Gestura BIM Dictionary
            </div>

            <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-extrabold tracking-tight md:text-6xl">
              Find the sign you
              <span className="text-[#14B8A6]">
                {" "}want to learn.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#52738A]">
              Search Malaysian Sign Language
              vocabulary by Malay or English
              words and explore signs by
              category.
            </p>

          </motion.div>

          {/* SEARCH */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
            className="mx-auto mt-10 max-w-3xl"
          >

            <div className="flex items-center gap-4 rounded-[24px] border border-[#CFE8EE] bg-white p-3 shadow-lg shadow-[#176B87]/5">

              <div className="pl-3 text-2xl">
                🔎
              </div>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search in Malay or English..."
                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-base text-[#0B2545] outline-none placeholder:text-[#8BA6B5]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="rounded-full bg-[#EDF7FA] px-4 py-2 text-sm font-bold text-[#52738A]"
                >
                  Clear
                </button>
              )}

            </div>

          </motion.div>

        </div>
      </section>

      {/* =================================================
          DICTIONARY
      ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-16">

        {/* CATEGORY FILTER */}

        <div className="flex flex-wrap gap-3">

          {categories.map(
            (category) => (
              <motion.button
                key={category}
                type="button"
                onClick={() =>
                  setActiveCategory(
                    category
                  )
                }
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                  activeCategory ===
                  category
                    ? "bg-[#14B8A6] text-white shadow-md shadow-[#14B8A6]/20"
                    : "border border-[#D1E8EE] bg-white text-[#52738A] hover:border-[#14B8A6]"
                }`}
              >
                {category}
              </motion.button>
            )
          )}

        </div>

        {/* RESULT INFORMATION */}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#14B8A6]">
              BIM Vocabulary
            </p>

            <h2 className="mt-2 text-3xl font-extrabold">
              {activeCategory === "All"
                ? "All Signs"
                : activeCategory}
            </h2>

          </div>

          <div className="rounded-full bg-[#E4F6F8] px-5 py-2 text-sm font-bold text-[#176B87]">
            {filteredSigns.length} signs found
          </div>

        </div>

        {/* =================================================
            SIGN CARDS
        ================================================= */}

        {filteredSigns.length > 0 ? (

          <motion.div
            key={`${activeCategory}-${search}`}
            variants={stagger}
            initial="hidden"
            animate="show"
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >

            {filteredSigns.map(
              (sign) => (
                <SignCard
                  key={sign.id}
                  sign={sign}
                  onView={() =>
                    setSelectedSign(
                      sign
                    )
                  }
                />
              )
            )}

          </motion.div>

        ) : (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="mt-12 rounded-[32px] border border-[#D5EBF0] bg-white px-6 py-16 text-center"
          >

            <div className="text-6xl">
              🔍
            </div>

            <h3 className="mt-5 text-2xl font-extrabold">
              No signs found
            </h3>

            <p className="mt-3 text-[#627F91]">
              Try another Malay or English
              word.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory(
                  "All"
                );
              }}
              className="mt-6 rounded-full bg-[#14B8A6] px-6 py-3 font-bold text-white"
            >
              Show All Signs
            </button>

          </motion.div>
        )}

      </section>

      {/* =================================================
          HOW TO USE
      ================================================= */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-20">

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            variants={fadeUp}
            className="text-center"
          >

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#14B8A6]">
              Learn with Gestura
            </p>

            <h2 className="mt-4 text-4xl font-extrabold">
              From dictionary to practice
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#52738A]">
              Discover a BIM sign, watch its
              video and continue practising
              through Gestura.
            </p>

          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            className="mt-12 grid gap-6 md:grid-cols-3"
          >

            <StepCard
              number="01"
              icon="🔎"
              title="Search"
              text="Find a BIM word using Malay or English."
            />

            <StepCard
              number="02"
              icon="🤟"
              title="Learn"
              text="Watch the BIM sign video and understand its meaning."
            />

            <StepCard
              number="03"
              icon="📷"
              title="Practice"
              text="Use AI recognition to practise the sign."
            />

          </motion.div>

        </div>

      </section>

      {/* =================================================
          CTA
      ================================================= */}

      <section className="px-6 py-20">

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mx-auto max-w-7xl rounded-[38px] bg-gradient-to-r from-[#176B87] via-[#0E9FA4] to-[#14B8A6] px-8 py-12 text-white md:px-12"
        >

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/70">
                Ready to practise?
              </p>

              <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
                Try recognising a BIM sign
                with AI.
              </h2>

            </div>

            <Link
              href="/translator"
              className="inline-flex w-fit rounded-full bg-white px-7 py-4 font-bold text-[#0B2545] transition hover:scale-105"
            >
              Open Live Translator →
            </Link>

          </div>

        </motion.div>

      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="bg-[#071F38] text-white">

        <div className="mx-auto max-w-7xl px-6 py-12">

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">

            <div>

              <div className="inline-flex rounded-2xl bg-white p-2">

                <Image
                  src="/gestura-logo.png"
                  alt="Gestura Logo"
                  width={280}
                  height={100}
                  className="h-auto w-[190px]"
                />

              </div>

              <p className="mt-4 text-sm text-white/50">
                Learn • Recognise • Communicate
              </p>

            </div>

            <div className="flex flex-wrap gap-6 text-sm text-white/60">

              <Link href="/">
                Home
              </Link>

              <Link href="/learn">
                Learn BIM
              </Link>

              <Link href="/dictionary">
                Dictionary
              </Link>

              <Link href="/translator">
                Live Translator
              </Link>

              <Link href="/practice">
                Practice
              </Link>

              <Link href="/achievements">
                Achievements
              </Link>

              <Link href="/about">
                About
              </Link>

            </div>

          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/35">
            © 2026 Gestura. Malaysian Sign
            Language Learning Platform.
          </div>

        </div>

      </footer>

      {/* =================================================
          VIDEO MODAL
      ================================================= */}

      {selectedSign && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071F38]/70 p-4 backdrop-blur-sm"
          onClick={() =>
            setSelectedSign(null)
          }
        >

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="relative w-full max-w-2xl overflow-hidden rounded-[32px] bg-white shadow-2xl"
          >

            <button
              type="button"
              onClick={() =>
                setSelectedSign(null)
              }
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#071F38]/80 font-bold text-white"
            >
              ✕
            </button>

            <div className="bg-[#EAF8FC] p-5">

              <video
                key={selectedSign.id}
                src={selectedSign.video}
                controls
                autoPlay
                playsInline
                className="aspect-video w-full rounded-[22px] bg-black object-contain"
              />

            </div>

            <div className="p-7">

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#14B8A6]">
                {selectedSign.category}
              </p>

              <h2 className="mt-2 text-3xl font-extrabold">
                {selectedSign.word}
              </h2>

              <p className="mt-2 text-lg text-[#68889B]">
                {selectedSign.english}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <Link
                  href={`/translator?sign=${encodeURIComponent(
                    selectedSign.word
                  )}`}
                  className="rounded-full bg-[#14B8A6] px-6 py-3 font-bold text-white transition hover:bg-[#0F9F91]"
                >
                  📷 Practice This Sign
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedSign(
                      null
                    )
                  }
                  className="rounded-full border border-[#CDE5EB] px-6 py-3 font-bold text-[#176B87]"
                >
                  Close
                </button>

              </div>

            </div>

          </motion.div>

        </div>
      )}

    </main>
  );
}

/* =====================================================
   SIGN CARD
===================================================== */

function SignCard({
  sign,
  onView,
}: {
  sign: BIMSign;
  onView: () => void;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{
        y: -7,
        scale: 1.015,
      }}
      className="group overflow-hidden rounded-[28px] border border-[#D5EBF0] bg-white shadow-sm"
    >

      {/* VIDEO PREVIEW */}

      <div className="relative flex h-[190px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#E7F8FB] to-[#DDF7F3]">

        <video
          src={sign.video}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-contain"
        />

        <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#0F766E] shadow-sm">
          BIM
        </span>

      </div>

      {/* DETAILS */}

      <div className="p-6">

        <div className="flex items-start justify-between gap-4">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#14B8A6]">
              {sign.category}
            </p>

            <h3 className="mt-2 text-2xl font-extrabold">
              {sign.word}
            </h3>

            <p className="mt-1 text-[#68889B]">
              {sign.english}
            </p>

          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E3F7F7] text-lg">
            🤟
          </div>

        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">

          <button
            type="button"
            onClick={onView}
            className="rounded-xl border border-[#CDE5EB] px-3 py-3 text-sm font-bold text-[#176B87] transition hover:border-[#14B8A6] hover:bg-[#F2FBFC]"
          >
            ▶ View Sign
          </button>

          <Link
            href={`/translator?sign=${encodeURIComponent(
              sign.word
            )}`}
            className="flex items-center justify-center rounded-xl bg-[#14B8A6] px-3 py-3 text-center text-sm font-bold text-white transition hover:bg-[#0F9F91]"
          >
            📷 Practice
          </Link>

        </div>

      </div>

    </motion.div>
  );
}

/* =====================================================
   STEP CARD
===================================================== */

function StepCard({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{
        y: -6,
      }}
      className="rounded-[28px] border border-[#D8EDF2] bg-[#F8FDFF] p-7"
    >

      <div className="flex items-center justify-between">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DDF7F7] text-2xl">
          {icon}
        </div>

        <span className="text-sm font-extrabold text-[#14B8A6]">
          {number}
        </span>

      </div>

      <h3 className="mt-6 text-2xl font-extrabold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-[#5F7C8D]">
        {text}
      </p>

    </motion.div>
  );
}