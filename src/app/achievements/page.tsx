"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

type Progress = {
  totalXP: number;
  quizzesCompleted: number;
  perfectScores: number;
  bestScore: number;
  currentStreak: number;
};

const defaultProgress: Progress = {
  totalXP: 0,
  quizzesCompleted: 0,
  perfectScores: 0,
  bestScore: 0,
  currentStreak: 0,
};

type Badge = {
  icon: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress?: string;
};

export default function AchievementsPage() {
  const [progress, setProgress] =
    useState<Progress>(defaultProgress);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "gestura-progress"
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        setProgress({
          totalXP:
            typeof parsed.totalXP === "number"
              ? parsed.totalXP
              : 0,

          quizzesCompleted:
            typeof parsed.quizzesCompleted === "number"
              ? parsed.quizzesCompleted
              : 0,

          perfectScores:
            typeof parsed.perfectScores === "number"
              ? parsed.perfectScores
              : 0,

          bestScore:
            typeof parsed.bestScore === "number"
              ? parsed.bestScore
              : 0,

          currentStreak:
            typeof parsed.currentStreak === "number"
              ? parsed.currentStreak
              : 0,
        });
      }
    } catch (error) {
      console.error(
        "Unable to load Gestura progress:",
        error
      );
    }

    setLoaded(true);
  }, []);

  const levelInfo = getLevel(progress.totalXP);

  const badges: Badge[] = [
    {
      icon: "🎯",
      name: "Quiz Starter",
      description: "Complete your first BIM quiz.",
      unlocked: progress.quizzesCompleted >= 1,
      progress: `${Math.min(
        progress.quizzesCompleted,
        1
      )}/1`,
    },
    {
      icon: "⭐",
      name: "Perfect Score",
      description:
        "Score 10/10 in a Gestura quiz.",
      unlocked: progress.perfectScores >= 1,
      progress: `${Math.min(
        progress.perfectScores,
        1
      )}/1`,
    },
    {
      icon: "🔥",
      name: "On Fire",
      description:
        "Build a streak of 3 completed quizzes.",
      unlocked: progress.currentStreak >= 3,
      progress: `${Math.min(
        progress.currentStreak,
        3
      )}/3`,
    },
    {
      icon: "💎",
      name: "XP Explorer",
      description: "Earn a total of 500 XP.",
      unlocked: progress.totalXP >= 500,
      progress: `${Math.min(
        progress.totalXP,
        500
      )}/500 XP`,
    },
    {
      icon: "🧠",
      name: "Dedicated Learner",
      description: "Complete 10 BIM quizzes.",
      unlocked: progress.quizzesCompleted >= 10,
      progress: `${Math.min(
        progress.quizzesCompleted,
        10
      )}/10`,
    },
    {
      icon: "🏆",
      name: "BIM Champion",
      description:
        "Reach Level 4 in Gestura.",
      unlocked: levelInfo.level >= 4,
      progress: `Level ${levelInfo.level}/4`,
    },
  ];

  const unlockedBadges = badges.filter(
    (badge) => badge.unlocked
  ).length;

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4FBFE]">
        <div className="text-center">
          <div className="text-4xl">🏆</div>

          <p className="mt-4 font-bold text-[#176B87]">
            Loading achievements...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4FBFE] text-[#0B2545]">
      <Navbar />

      {/* HERO */}

      <section className="relative overflow-hidden">
        <div className="absolute left-[-150px] top-[-100px] h-[400px] w-[400px] rounded-full bg-[#BDECF6]/40 blur-3xl" />

        <div className="absolute right-[-100px] top-[20px] h-[350px] w-[350px] rounded-full bg-[#7BE1D6]/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16">
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
            }}
          >
            <div className="inline-flex rounded-full border border-[#BFE6EE] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#176B87]">
              Gestura Achievement Board
            </div>

            <h1 className="mt-5 text-4xl font-extrabold md:text-5xl">
              Your learning
              <span className="text-[#14B8A6]">
                {" "}journey.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-[#52738A]">
              Complete quizzes, earn XP and unlock
              achievements as you improve your BIM
              knowledge.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        {/* LEVEL CARD */}

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
            delay: 0.1,
          }}
          className="overflow-hidden rounded-[34px] bg-gradient-to-r from-[#0B2545] via-[#176B87] to-[#14B8A6] text-white shadow-xl shadow-[#176B87]/10"
        >
          <div className="grid gap-8 p-8 md:grid-cols-[1fr_auto] md:p-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/60">
                Current Level
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur">
                  {levelInfo.icon}
                </div>

                <div>
                  <h2 className="text-3xl font-extrabold">
                    Level {levelInfo.level}
                  </h2>

                  <p className="mt-1 text-lg font-bold text-[#BFF5EE]">
                    {levelInfo.name}
                  </p>
                </div>
              </div>

              <div className="mt-8 max-w-2xl">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-bold">
                    Level Progress
                  </p>

                  <p className="text-sm text-white/70">
                    {progress.totalXP} XP
                  </p>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/15">
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${levelInfo.progress}%`,
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.3,
                    }}
                    className="h-full rounded-full bg-white"
                  />
                </div>

                <p className="mt-3 text-sm text-white/60">
                  {levelInfo.nextLevelXP === null
                    ? "You have reached the highest Gestura level."
                    : `${
                        levelInfo.nextLevelXP -
                        progress.totalXP
                      } XP needed to reach the next level.`}
                </p>
              </div>
            </div>

            <div className="flex min-w-[180px] flex-col justify-center rounded-[26px] bg-white/10 p-6 text-center backdrop-blur">
              <p className="text-5xl font-extrabold">
                {progress.totalXP}
              </p>

              <p className="mt-2 text-sm font-bold text-white/65">
                TOTAL XP
              </p>
            </div>
          </div>
        </motion.div>

        {/* STATS */}

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon="📝"
            value={progress.quizzesCompleted}
            label="Quizzes Completed"
          />

          <StatCard
            icon="⭐"
            value={progress.perfectScores}
            label="Perfect Scores"
          />

          <StatCard
            icon="🎯"
            value={`${progress.bestScore}/10`}
            label="Best Score"
          />

          <StatCard
            icon="🔥"
            value={progress.currentStreak}
            label="Current Streak"
          />
        </div>

        {/* BADGES HEADER */}

        <div className="mt-14 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#14B8A6]">
              My Achievements
            </p>

            <h2 className="mt-2 text-3xl font-extrabold">
              Badge Collection
            </h2>

            <p className="mt-2 text-[#68889B]">
              Keep learning to unlock every Gestura
              achievement.
            </p>
          </div>

          <div className="rounded-full border border-[#CFE8ED] bg-white px-5 py-3 text-sm font-extrabold text-[#176B87]">
            🏅 {unlockedBadges}/{badges.length} Unlocked
          </div>
        </div>

        {/* BADGES */}

        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.name}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: 0.05 * index,
              }}
              whileHover={{
                y: -4,
              }}
              className={`relative overflow-hidden rounded-[28px] border p-6 ${
                badge.unlocked
                  ? "border-[#BEE9E2] bg-white"
                  : "border-[#DCE9ED] bg-[#F5F9FA]"
              }`}
            >
              {!badge.unlocked && (
                <div className="absolute right-5 top-5 rounded-full bg-[#E6EEF0] px-3 py-1 text-xs font-bold text-[#78909C]">
                  🔒 Locked
                </div>
              )}

              {badge.unlocked && (
                <div className="absolute right-5 top-5 rounded-full bg-[#E2F8F4] px-3 py-1 text-xs font-bold text-[#0F766E]">
                  ✓ Unlocked
                </div>
              )}

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl text-4xl ${
                  badge.unlocked
                    ? "bg-[#E7F8F5]"
                    : "bg-[#E9EFF1] grayscale"
                }`}
              >
                {badge.icon}
              </div>

              <h3
                className={`mt-5 text-xl font-extrabold ${
                  badge.unlocked
                    ? "text-[#0B2545]"
                    : "text-[#78909C]"
                }`}
              >
                {badge.name}
              </h3>

              <p className="mt-2 min-h-[44px] text-sm leading-6 text-[#68889B]">
                {badge.description}
              </p>

              {badge.progress && (
                <div className="mt-5 rounded-xl bg-[#F0F7F8] px-4 py-3 text-sm font-bold text-[#52738A]">
                  Progress: {badge.progress}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* NEXT ACTION */}

        <div className="mt-12 rounded-[32px] border border-[#CFE8ED] bg-white p-8 md:p-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#14B8A6]">
                Continue Learning
              </p>

              <h2 className="mt-2 text-2xl font-extrabold">
                Ready to earn more XP?
              </h2>

              <p className="mt-2 text-[#68889B]">
                Complete another 10-question BIM quiz
                and continue building your achievements.
              </p>
            </div>

            <Link
              href="/practice"
              className="rounded-2xl bg-[#14B8A6] px-7 py-4 font-extrabold text-white transition hover:bg-[#0F9F91]"
            >
              Start Practice →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =====================================================
   LEVEL SYSTEM
===================================================== */

function getLevel(totalXP: number) {
  if (totalXP >= 1500) {
    return {
      level: 4,
      name: "BIM Champion",
      icon: "🏆",
      progress: 100,
      nextLevelXP: null,
    };
  }

  if (totalXP >= 800) {
    return {
      level: 3,
      name: "Communicator",
      icon: "💬",
      progress:
        ((totalXP - 800) / (1500 - 800)) * 100,
      nextLevelXP: 1500,
    };
  }

  if (totalXP >= 300) {
    return {
      level: 2,
      name: "Explorer",
      icon: "🧭",
      progress:
        ((totalXP - 300) / (800 - 300)) * 100,
      nextLevelXP: 800,
    };
  }

  return {
    level: 1,
    name: "Beginner",
    icon: "🌱",
    progress: (totalXP / 300) * 100,
    nextLevelXP: 300,
  };
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string | number;
  label: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="rounded-[24px] border border-[#D5E9EE] bg-white p-6"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF8F8] text-2xl">
        {icon}
      </div>

      <p className="mt-5 text-3xl font-extrabold text-[#176B87]">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#68889B]">
        {label}
      </p>
    </motion.div>
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
            className="transition hover:text-[#14B8A6]"
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
            className="font-bold text-[#14B8A6]"
          >
            Achievements
          </Link>
        </nav>

        <Link
          href="/practice"
          className="rounded-full bg-[#0B2545] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#176B87]"
        >
          Earn XP
        </Link>
      </div>
    </header>
  );
}