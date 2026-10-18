"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";

/* =====================================================
   MOTION VARIANTS
===================================================== */

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeRight: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

/* =====================================================
   MAIN PAGE
===================================================== */

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F4FBFE] text-[#0B2545]">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="sticky top-0 z-50 border-b border-[#CFEAF2] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <motion.a
            href="#home"
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center"
          >
            <Image
              src="/gestura-logo.png"
              alt="Gestura Logo"
              width={320}
              height={120}
              priority
              className="h-auto w-[200px] object-contain md:w-[250px]"
            />
          </motion.a>

          <motion.nav
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hidden items-center gap-7 text-sm font-semibold text-[#36566B] lg:flex"
          >
            <NavItem href="#home">Home</NavItem>
            <NavItem href="/learn">Learn BIM</NavItem>
            <NavItem href="/dictionary">Dictionary</NavItem>
            <NavItem href="/translator">Live Translator</NavItem>
            <NavItem href="/practice">Practice</NavItem>
            <NavItem href="/achievements">Achievements</NavItem>
            <NavItem href="#about">About</NavItem>
          </motion.nav>

          <motion.a
            href="/learn"
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="rounded-full bg-[#0B2545] px-5 py-3 text-sm font-bold text-white shadow-sm"
          >
            Start Learning
          </motion.a>

        </div>
      </header>

      {/* =================================================
          HERO
      ================================================= */}

      <section
        id="home"
        className="relative overflow-hidden border-b border-[#D9EDF3]"
      >
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[-120px] top-[-100px] h-[420px] w-[420px] rounded-full bg-[#BDECF6]/50 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[-120px] top-[80px] h-[400px] w-[400px] rounded-full bg-[#79E1D5]/30 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">

          {/* HERO LEFT */}

          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#BFE6EE] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#176B87] shadow-sm"
            >
              <motion.span
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-2 w-2 rounded-full bg-[#14B8A6]"
              />

              Learn • Recognise • Communicate
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl"
            >
              Communication

              <span className="block bg-gradient-to-r from-[#14B8A6] via-[#0FA9B7] to-[#176B87] bg-clip-text text-transparent">
                beyond words.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-7 max-w-xl text-lg leading-8 text-[#52738A]"
            >
              Gestura helps users learn Bahasa Isyarat Malaysia through
              interactive lessons, guided practice and AI-powered sign
              recognition.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-3 max-w-xl text-base leading-7 text-[#68889B]"
            >
              Learn at your own pace, practise visually and build confidence
              in everyday communication.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-wrap gap-4"
            >
              <motion.a
                href="/learn"
                whileHover={{
                  scale: 1.05,
                  y: -3,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="rounded-full bg-[#14B8A6] px-7 py-4 font-bold text-white shadow-lg shadow-[#14B8A6]/20"
              >
                Start Learning →
              </motion.a>

              <motion.a
                href="/translator"
                whileHover={{
                  scale: 1.05,
                  y: -3,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="rounded-full border border-[#9ECFDC] bg-white px-7 py-4 font-bold text-[#0B2545] shadow-sm"
              >
                Try Live Translator
              </motion.a>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="mt-12 grid max-w-xl grid-cols-3 gap-4"
            >
              <StatCard number="100+" label="BIM signs" />
              <StatCard number="AI" label="Recognition" />
              <StatCard number="24/7" label="Practice anytime" />
            </motion.div>
          </motion.div>

          {/* HERO AI CARD */}

          <motion.div
            initial={{
              opacity: 0,
              x: 70,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 0.25,
            }}
            className="relative"
          >
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="relative rounded-[40px] border border-white/80 bg-gradient-to-br from-[#DFF7FC] via-[#B9EEF4] to-[#7EDBD4] p-5 shadow-2xl shadow-[#176B87]/15">
                <div className="rounded-[32px] bg-[#082E4C] p-6 text-white">

                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#83D8E6]">
                        AI Recognition
                      </p>

                      <h2 className="mt-2 text-2xl font-bold">
                        Live Sign Detection
                      </h2>
                    </div>

                    <motion.span
                      animate={{
                        scale: [1, 1.08, 1],
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="rounded-full bg-[#14B8A6] px-4 py-2 text-xs font-bold"
                    >
                      LIVE
                    </motion.span>
                  </div>

                  <div className="relative mt-6 flex min-h-[330px] items-center justify-center overflow-hidden rounded-[28px] border border-[#6ACDDD]/30 bg-gradient-to-br from-[#103C5B] to-[#071F38]">
                    <Corner className="left-6 top-6 border-l-4 border-t-4" />
                    <Corner className="right-6 top-6 border-r-4 border-t-4" />
                    <Corner className="bottom-6 left-6 border-b-4 border-l-4" />
                    <Corner className="bottom-6 right-6 border-b-4 border-r-4" />

                    <div className="text-center">
                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="text-8xl"
                      >
                        🤟
                      </motion.div>

                      <p className="mt-5 text-sm text-white/60">
                        Position your hand inside the frame
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <ResultMini
                      title="Detected Sign"
                      value="Terima Kasih"
                    />

                    <ResultMini
                      title="Confidence"
                      value="92%"
                      highlight
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =================================================
          WHY GESTURA
      ================================================= */}

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24">

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{
              once: true,
              amount: 0.25,
            }}
            variants={fadeUp}
            className="text-center"
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#14B8A6]">
              Why Gestura
            </p>

            <h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              Learn BIM in a simpler way.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#52738A]">
              A modern learning platform designed to make Malaysian Sign
              Language more accessible, interactive and engaging.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            <FeatureCard
              icon="🎓"
              title="Structured Learning"
              text="Follow step-by-step lessons covering common BIM signs."
            />

            <FeatureCard
              icon="📷"
              title="AI Sign Recognition"
              text="Use your camera to perform signs and receive recognition feedback."
            />

            <FeatureCard
              icon="📊"
              title="Guided Practice"
              text="Improve recall and confidence through repeated activities."
            />

            <FeatureCard
              icon="🤝"
              title="Inclusive Communication"
              text="Support communication between the Deaf and hearing community."
            />
          </motion.div>
        </div>
      </section>

      {/* =================================================
          LEARN BIM - CUSTOM CATEGORY IMAGES
      ================================================= */}

      <section
        id="learn"
        className="mx-auto max-w-7xl px-6 py-24"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#14B8A6]">
              Learn BIM
            </p>

            <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
              Explore sign categories
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#52738A]">
              Start with essential signs used in everyday communication.
            </p>
          </div>

          <motion.a
            href="/learn"
            whileHover={{
              x: 5,
            }}
            className="font-bold text-[#176B87]"
          >
            View All Categories →
          </motion.a>
        </motion.div>

        {/* 6 CUSTOM CATEGORY CARDS */}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <CategoryCard
            image="/category-icons/greetings.png"
            title="Greetings"
            description="Greetings & common expressions"
          />

          <CategoryCard
            image="/category-icons/family.png"
            title="Family"
            description="Family members"
          />

          <CategoryCard
            image="/category-icons/emotion.png"
            title="Emotion"
            description="Feelings & emotions"
          />

          <CategoryCard
            image="/category-icons/colour.png"
            title="Colour"
            description="Common colours"
          />

          <CategoryCard
            image="/category-icons/daily activities.png"
            title="Daily Activities"
            description="Everyday activities"
          />

          <CategoryCard
            image="/category-icons/time.png"
            title="Time"
            description="Time & daily periods"
          />
        </motion.div>
      </section>

      {/* =================================================
          LIVE TRANSLATOR
      ================================================= */}

      <section
        id="translator"
        className="bg-[#EAF8FC]"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2">

          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{
              once: true,
              amount: 0.25,
            }}
          >
            <div className="inline-flex rounded-full bg-[#D5F6F4] px-4 py-2 text-sm font-bold text-[#0F766E]">
              AI Live Translator
            </div>

            <h2 className="mt-5 text-4xl font-extrabold tracking-tight md:text-5xl">
              Practise signs with

              <span className="block text-[#14B8A6]">
                AI support.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#52738A]">
              Use your webcam to perform a BIM sign. Gestura analyses the
              visual input and displays the detected sign together with its
              Malay meaning, English meaning and confidence score.
            </p>

            <div className="mt-8 space-y-4">
              <TranslatorPoint text="Camera-based sign recognition" />
              <TranslatorPoint text="Malay and English meanings" />
              <TranslatorPoint text="Confidence score for every result" />
            </div>

            <motion.a
              href="/translator"
              whileHover={{
                scale: 1.05,
                y: -3,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="mt-9 inline-block rounded-full bg-[#14B8A6] px-7 py-4 font-bold text-white shadow-lg shadow-[#14B8A6]/20"
            >
              Open Live Translator →
            </motion.a>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="show"
            viewport={{
              once: true,
              amount: 0.25,
            }}
            className="rounded-[36px] bg-[#0B2545] p-6 text-white shadow-2xl shadow-[#0B2545]/15"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7EDFE6]">
                  Camera Preview
                </p>

                <h3 className="mt-1 text-2xl font-bold">
                  Sign Recognition
                </h3>
              </div>

              <motion.a
                href="/translator"
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                className="rounded-full bg-[#14B8A6] px-5 py-2 text-sm font-bold"
              >
                Try Now
              </motion.a>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">

              <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-[26px] border border-[#62D3DD]/30 bg-[#103956]">
                <Corner className="left-5 top-5 border-l-4 border-t-4" />
                <Corner className="right-5 top-5 border-r-4 border-t-4" />
                <Corner className="bottom-5 left-5 border-b-4 border-l-4" />
                <Corner className="bottom-5 right-5 border-b-4 border-r-4" />

                <motion.div
                  animate={{
                    scale: [1, 1.04, 1],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-center"
                >
                  <div className="text-7xl">🧍</div>

                  <p className="mt-4 text-sm text-white/50">
                    Camera stream
                  </p>
                </motion.div>
              </div>

              <div className="rounded-[26px] bg-[#123C5B] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#74E2D6]">
                  Detected Sign
                </p>

                <h4 className="mt-3 text-2xl font-bold">
                  Terima Kasih
                </h4>

                <div className="mt-6 space-y-3 text-sm">
                  <ResultRow
                    label="Malay"
                    value="Terima kasih"
                  />

                  <ResultRow
                    label="English"
                    value="Thank you"
                  />

                  <ResultRow
                    label="Confidence"
                    value="92%"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =================================================
          PRACTICE
      ================================================= */}

      <section
        id="practice"
        className="mx-auto max-w-7xl px-6 py-24"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          className="text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#14B8A6]">
            Practice
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">
            Build confidence through repeated practice.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#52738A]">
            Strengthen recognition, recall and sign performance through
            interactive activities designed for consistent learning.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          <PracticeCard
            number="01"
            icon="🃏"
            title="Flash Practice"
            text="Review BIM signs quickly and strengthen your visual memory."
          />

          <PracticeCard
            number="02"
            icon="🎯"
            title="Sign Challenge"
            text="Match signs with their correct meanings and test your recall."
          />

          <PracticeCard
            number="03"
            icon="📷"
            title="Camera Practice"
            text="Perform a BIM sign and receive AI recognition feedback."
          />
        </motion.div>
      </section>

      {/* =================================================
          AUDIENCE
      ================================================= */}

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2">

          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{
              once: true,
              amount: 0.25,
            }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#14B8A6]">
              Made for everyone
            </p>

            <h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              Communication should be accessible to everyone.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#52738A]">
              Gestura is designed for students, educators, university staff
              and members of the community who want to learn Bahasa Isyarat
              Malaysia.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <AudienceCard
              icon="🎓"
              title="Students"
            />

            <AudienceCard
              icon="👩‍🏫"
              title="Educators"
            />

            <AudienceCard
              icon="🏫"
              title="University Staff"
            />

            <AudienceCard
              icon="🤝"
              title="Community"
            />
          </motion.div>
        </div>
      </section>

      {/* =================================================
          CTA
      ================================================= */}

      <section className="px-6 py-24">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.94,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.7,
          }}
          className="mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-gradient-to-r from-[#176B87] via-[#0E9FA4] to-[#14B8A6] px-8 py-14 text-white shadow-xl shadow-[#176B87]/20 md:px-14"
        >
          <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/70">
                Be part of a more inclusive Malaysia
              </p>

              <h2 className="mt-4 text-4xl font-extrabold md:text-5xl">
                Start your BIM learning journey today.
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
                Learn new skills, support the Deaf community and help create
                a more inclusive society.
              </p>

              <motion.a
                href="/learn"
                whileHover={{
                  scale: 1.05,
                  y: -3,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="mt-8 inline-block rounded-full bg-white px-7 py-4 font-bold text-[#0B2545]"
              >
                Get Started →
              </motion.a>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <MiniValue
                icon="🧠"
                text="Learn New Skills"
              />

              <MiniValue
                icon="🤝"
                text="Support Community"
              />

              <MiniValue
                icon="💙"
                text="Create Inclusion"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer
        id="about"
        className="bg-[#071F38] text-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_0.8fr]">

            <div>
              <div className="inline-flex rounded-[24px] bg-white p-3">
                <Image
                  src="/gestura-logo.png"
                  alt="Gestura Logo"
                  width={320}
                  height={120}
                  className="h-auto w-[220px] object-contain"
                />
              </div>

              <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">
                Learn. Recognise. Communicate. A digital learning platform
                for Bahasa Isyarat Malaysia.
              </p>
            </div>

            <div>
              <p className="font-bold">
                Quick Links
              </p>

              <div className="mt-5 grid gap-3 text-sm text-white/60">
                <a
                  href="#home"
                  className="transition hover:text-[#6CE6D7]"
                >
                  Home
                </a>

                <a
                  href="/learn"
                  className="transition hover:text-[#6CE6D7]"
                >
                  Learn BIM
                </a>

                <a
                  href="/dictionary"
                  className="transition hover:text-[#6CE6D7]"
                >
                  Dictionary
                </a>

                <a
                  href="/translator"
                  className="transition hover:text-[#6CE6D7]"
                >
                  Live Translator
                </a>

                <a
                  href="/practice"
                  className="transition hover:text-[#6CE6D7]"
                >
                  Practice
                </a>

                <a
                  href="/achievements"
                  className="transition hover:text-[#6CE6D7]"
                >
                  Achievements
                </a>
              </div>
            </div>

            <div>
              <p className="font-bold">
                Gestura
              </p>

              <p className="mt-5 text-sm leading-6 text-white/55">
                Malaysian Sign Language Learning Platform
              </p>

              <p className="mt-5 text-sm text-white/40">
                © 2026 Gestura.
                <br />
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

function NavItem({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{
        y: -2,
      }}
      className="transition-colors hover:text-[#14B8A6]"
    >
      {children}
    </motion.a>
  );
}

/* =====================================================
   STATS
===================================================== */

function StatCard({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{
        y: -5,
        scale: 1.03,
      }}
      className="rounded-2xl border border-[#D5EBF1] bg-white p-4 shadow-sm"
    >
      <p className="text-2xl font-extrabold text-[#176B87]">
        {number}
      </p>

      <p className="mt-1 text-xs font-medium text-[#52738A]">
        {label}
      </p>
    </motion.div>
  );
}

/* =====================================================
   FEATURE CARD
===================================================== */

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{
        duration: 0.2,
      }}
      className="rounded-[28px] border border-[#D8EDF2] bg-[#F8FDFF] p-6 shadow-sm"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D7F5F7] text-2xl">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-extrabold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-[#5F7C8D]">
        {text}
      </p>
    </motion.div>
  );
}

/* =====================================================
   CATEGORY CARD - CUSTOM IMAGE
===================================================== */

function CategoryCard({
  image,
  title,
  description,
}: {
  image: string;
  title: string;
  description: string;
}) {
  return (
    <motion.a
      href="/learn"
      variants={fadeUp}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      className="group cursor-pointer overflow-hidden rounded-[30px] border border-[#D5EDF2] bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-[#176B87]/10"
    >
      <div className="relative flex h-[230px] items-center justify-center overflow-hidden bg-white p-5">
        <Image
          src={image}
          alt={`${title} BIM category`}
          width={500}
          height={400}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="border-t border-[#E2EFF2] p-7 text-center">
        <h3 className="text-2xl font-extrabold text-[#0B2545]">
          {title}
        </h3>

        <p className="mt-2 text-sm font-medium text-[#52738A]">
          {description}
        </p>

        <motion.p
          whileHover={{
            x: 4,
          }}
          className="mt-5 text-sm font-bold text-[#14B8A6]"
        >
          Start Learning →
        </motion.p>
      </div>
    </motion.a>
  );
}

/* =====================================================
   PRACTICE
===================================================== */

function PracticeCard({
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
        y: -8,
        scale: 1.02,
      }}
      className="rounded-[30px] border border-[#D8EDF2] bg-white p-7 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <motion.div
          whileHover={{
            rotate: 5,
            scale: 1.1,
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DDF7F7] text-xl"
        >
          {icon}
        </motion.div>

        <span className="text-sm font-extrabold text-[#14B8A6]">
          {number}
        </span>
      </div>

      <h3 className="mt-7 text-2xl font-extrabold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-[#5F7C8D]">
        {text}
      </p>

      <motion.a
        href="/practice"
        whileHover={{
          x: 5,
        }}
        className="mt-7 inline-block font-bold text-[#14B8A6]"
      >
        Start Practice →
      </motion.a>
    </motion.div>
  );
}

/* =====================================================
   SMALL RESULT
===================================================== */

function ResultMini({
  title,
  value,
  highlight = false,
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
      }}
      className="rounded-2xl border border-white/10 bg-white/10 p-4"
    >
      <p className="text-xs text-white/50">
        {title}
      </p>

      <p
        className={`mt-2 text-xl font-bold ${
          highlight
            ? "text-[#6CE6D7]"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </motion.div>
  );
}

/* =====================================================
   RESULT ROW
===================================================== */

function ResultRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
      <span className="text-white/50">
        {label}
      </span>

      <span className="font-bold text-white">
        {value}
      </span>
    </div>
  );
}

/* =====================================================
   TRANSLATOR FEATURE
===================================================== */

function TranslatorPoint({
  text,
}: {
  text: string;
}) {
  return (
    <motion.div
      whileHover={{
        x: 5,
      }}
      className="flex items-center gap-3"
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D6F7F3] text-sm font-bold text-[#0F766E]">
        ✓
      </div>

      <p className="font-medium text-[#466A80]">
        {text}
      </p>
    </motion.div>
  );
}

/* =====================================================
   AUDIENCE
===================================================== */

function AudienceCard({
  icon,
  title,
}: {
  icon: string;
  title: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{
        y: -5,
        scale: 1.02,
      }}
      className="flex items-center gap-4 rounded-[24px] border border-[#D7EDF2] bg-[#F7FCFE] p-5"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D9F6F7] text-2xl">
        {icon}
      </div>

      <p className="font-bold text-[#0B2545]">
        {title}
      </p>
    </motion.div>
  );
}

/* =====================================================
   CTA MINI CARD
===================================================== */

function MiniValue({
  icon,
  text,
}: {
  icon: string;
  text: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.03,
      }}
      className="rounded-2xl border border-white/10 bg-white/10 p-5 text-center backdrop-blur"
    >
      <div className="text-3xl">
        {icon}
      </div>

      <p className="mt-3 text-sm font-bold">
        {text}
      </p>
    </motion.div>
  );
}

/* =====================================================
   CAMERA CORNERS
===================================================== */

function Corner({
  className,
}: {
  className: string;
}) {
  return (
    <motion.div
      animate={{
        opacity: [0.4, 1, 0.4],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute h-10 w-10 border-[#55E3E1] ${className}`}
    />
  );
}