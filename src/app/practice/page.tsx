"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/* =====================================================
   TYPES
===================================================== */

type TextQuestion = {
  id: number;
  type: "image-to-text";
  question: string;
  image: string;
  options: string[];
  answer: string;
};

type ImageOption = {
  label: string;
  image: string;
};

type ImageQuestion = {
  id: number;
  type: "text-to-image";
  question: string;
  word: string;
  options: ImageOption[];
  answer: string;
};

type Question = TextQuestion | ImageQuestion;

type QuizState = "start" | "quiz" | "result";

type GesturaProgress = {
  totalXP: number;
  quizzesCompleted: number;
  perfectScores: number;
  bestScore: number;
  currentStreak: number;
};

/* =====================================================
   QUIZ DATA
===================================================== */

const questions: Question[] = [
  {
    id: 1,
    type: "image-to-text",
    question: "Apakah maksud isyarat BIM ini?",
    image: "/bim-signs/terima-kasih.png",
    options: ["Terima Kasih", "Tolong", "Sama-sama", "Betul"],
    answer: "Terima Kasih",
  },
  {
    id: 2,
    type: "image-to-text",
    question: "Pilih perkataan yang sepadan dengan isyarat ini.",
    image: "/bim-signs/ayah.png",
    options: ["Ibu", "Ayah", "Tolong", "Makan"],
    answer: "Ayah",
  },
  {
    id: 3,
    type: "text-to-image",
    question: "Gambar manakah menunjukkan isyarat BIM untuk:",
    word: "IBU",
    options: [
      {
        label: "Ibu",
        image: "/bim-signs/ibu.png",
      },
      {
        label: "Ayah",
        image: "/bim-signs/ayah.png",
      },
      {
        label: "Makan",
        image: "/bim-signs/makan.png",
      },
      {
        label: "Tolong",
        image: "/bim-signs/tolong.png",
      },
    ],
    answer: "Ibu",
  },
  {
    id: 4,
    type: "image-to-text",
    question: "Apakah aktiviti yang ditunjukkan oleh isyarat ini?",
    image: "/bim-signs/berlari.png",
    options: ["Berjalan", "Berlari", "Makan", "Tolong"],
    answer: "Berlari",
  },
  {
    id: 5,
    type: "text-to-image",
    question: "Pilih gambar BIM yang betul untuk perkataan:",
    word: "TOLONG",
    options: [
      {
        label: "Tolong",
        image: "/bim-signs/tolong.png",
      },
      {
        label: "Terima Kasih",
        image: "/bim-signs/terima-kasih.png",
      },
      {
        label: "Betul",
        image: "/bim-signs/betul.png",
      },
      {
        label: "Salah",
        image: "/bim-signs/salah.png",
      },
    ],
    answer: "Tolong",
  },
  {
    id: 6,
    type: "image-to-text",
    question: "Apakah maksud isyarat BIM ini?",
    image: "/bim-signs/makan.png",
    options: ["Minum", "Makan", "Berjalan", "Ibu"],
    answer: "Makan",
  },
  {
    id: 7,
    type: "image-to-text",
    question: "Pilih jawapan yang tepat untuk isyarat ini.",
    image: "/bim-signs/betul.png",
    options: ["Salah", "Betul", "Tolong", "Sama-sama"],
    answer: "Betul",
  },
  {
    id: 8,
    type: "text-to-image",
    question: "Gambar manakah menunjukkan isyarat BIM untuk:",
    word: "SAMA-SAMA",
    options: [
      {
        label: "Sama-sama",
        image: "/bim-signs/sama-sama.png",
      },
      {
        label: "Terima Kasih",
        image: "/bim-signs/terima-kasih.png",
      },
      {
        label: "Salah",
        image: "/bim-signs/salah.png",
      },
      {
        label: "Ayah",
        image: "/bim-signs/ayah.png",
      },
    ],
    answer: "Sama-sama",
  },
  {
    id: 9,
    type: "image-to-text",
    question: "Apakah maksud isyarat BIM ini?",
    image: "/bim-signs/salah.png",
    options: ["Betul", "Salah", "Berjalan", "Berlari"],
    answer: "Salah",
  },
  {
    id: 10,
    type: "image-to-text",
    question: "Apakah aktiviti yang ditunjukkan oleh isyarat ini?",
    image: "/bim-signs/berjalan.png",
    options: ["Berlari", "Berjalan", "Makan", "Tolong"],
    answer: "Berjalan",
  },
];

const XP_PER_CORRECT = 20;
const MAX_XP = questions.length * XP_PER_CORRECT;

/* =====================================================
   MAIN
===================================================== */

export default function PracticePage() {
  const [quizState, setQuizState] =
    useState<QuizState>("start");

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [answered, setAnswered] = useState(false);

  const [finalScore, setFinalScore] = useState(0);
  const [finalXP, setFinalXP] = useState(0);

  const question = questions[currentQuestion];

  const quizProgress =
    ((currentQuestion + 1) / questions.length) * 100;

  /* =====================================================
     START
  ===================================================== */

  function startQuiz() {
    setQuizState("quiz");
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setXp(0);
    setFinalScore(0);
    setFinalXP(0);
    setAnswered(false);
  }

  /* =====================================================
     ANSWER
  ===================================================== */

  function selectAnswer(option: string) {
    if (answered) return;

    setSelectedAnswer(option);
    setAnswered(true);

    if (option === question.answer) {
      setScore((previous) => previous + 1);
      setXp((previous) => previous + XP_PER_CORRECT);
    }
  }

  /* =====================================================
     SAVE PROGRESS
  ===================================================== */

  function saveQuizProgress(
    completedScore: number,
    completedXP: number
  ) {
    try {
      const saved =
        localStorage.getItem("gestura-progress");

      const defaultProgress: GesturaProgress = {
        totalXP: 0,
        quizzesCompleted: 0,
        perfectScores: 0,
        bestScore: 0,
        currentStreak: 0,
      };

      let oldProgress = defaultProgress;

      if (saved) {
        try {
          const parsed = JSON.parse(saved);

          oldProgress = {
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
          };
        } catch {
          oldProgress = defaultProgress;
        }
      }

      const newProgress: GesturaProgress = {
        totalXP:
          oldProgress.totalXP + completedXP,

        quizzesCompleted:
          oldProgress.quizzesCompleted + 1,

        perfectScores:
          oldProgress.perfectScores +
          (completedScore === questions.length ? 1 : 0),

        bestScore: Math.max(
          oldProgress.bestScore,
          completedScore
        ),

        currentStreak:
          oldProgress.currentStreak + 1,
      };

      localStorage.setItem(
        "gestura-progress",
        JSON.stringify(newProgress)
      );
    } catch (error) {
      console.error(
        "Unable to save Gestura progress:",
        error
      );
    }
  }

  /* =====================================================
     NEXT
  ===================================================== */

  function nextQuestion() {
    if (!answered) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(
        (previous) => previous + 1
      );

      setSelectedAnswer(null);
      setAnswered(false);

      return;
    }

    const completedScore = score;
    const completedXP = xp;

    setFinalScore(completedScore);
    setFinalXP(completedXP);

    saveQuizProgress(
      completedScore,
      completedXP
    );

    setQuizState("result");
  }

  /* =====================================================
     START SCREEN
  ===================================================== */

  if (quizState === "start") {
    return (
      <main className="min-h-screen bg-[#F4FBFE] text-[#0B2545]">
        <Navbar />

        <section className="relative overflow-hidden">
          <div className="absolute left-[-160px] top-[-100px] h-[400px] w-[400px] rounded-full bg-[#BDECF6]/50 blur-3xl" />

          <div className="absolute right-[-100px] top-[80px] h-[350px] w-[350px] rounded-full bg-[#7BE1D6]/30 blur-3xl" />

          <div className="relative mx-auto max-w-5xl px-6 py-20">
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="text-center"
            >
              <div className="inline-flex rounded-full border border-[#BFE6EE] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#176B87]">
                Visual BIM Quiz
              </div>

              <h1 className="mt-6 text-4xl font-extrabold md:text-6xl">
                Learn BIM through
                <span className="text-[#14B8A6]">
                  {" "}visual practice.
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#52738A]">
                Look at BIM sign images, identify
                their meanings and choose the correct
                sign from visual options.
              </p>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 35,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.15,
              }}
              className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-[34px] border border-[#D3EBF0] bg-white shadow-xl shadow-[#176B87]/10"
            >
              <div className="bg-gradient-to-r from-[#176B87] to-[#14B8A6] p-8 text-white">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/70">
                      Beginner
                    </p>

                    <h2 className="mt-2 text-3xl font-extrabold">
                      👋 BIM Visual Challenge
                    </h2>

                    <p className="mt-3 text-white/75">
                      10 visual questions using BIM
                      learning images.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/15 px-6 py-4 text-center">
                    <p className="text-3xl font-extrabold">
                      {MAX_XP}
                    </p>

                    <p className="text-xs text-white/70">
                      Maximum XP
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid gap-4 sm:grid-cols-3">
                  <InfoCard
                    icon="🖼️"
                    value="10"
                    label="Visual Questions"
                  />

                  <InfoCard
                    icon="⭐"
                    value="+20"
                    label="XP / Correct"
                  />

                  <InfoCard
                    icon="🏆"
                    value="10/10"
                    label="Perfect Badge"
                  />
                </div>

                <div className="mt-7 rounded-2xl bg-[#F2FAFC] p-5 text-sm leading-7 text-[#52738A]">
                  <strong className="text-[#0B2545]">
                    Quiz format:
                  </strong>{" "}
                  Some questions show a BIM image
                  and ask for its meaning. Other
                  questions show a word and ask you
                  to select the correct BIM image.
                </div>

                <motion.button
                  type="button"
                  onClick={startQuiz}
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="mt-7 w-full rounded-2xl bg-[#14B8A6] px-7 py-4 text-lg font-extrabold text-white"
                >
                  Start Visual Quiz →
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    );
  }

  /* =====================================================
     RESULT
  ===================================================== */

  if (quizState === "result") {
    const percentage = Math.round(
      (finalScore / questions.length) * 100
    );

    const perfect =
      finalScore === questions.length;

    return (
      <main className="min-h-screen bg-[#F4FBFE] text-[#0B2545]">
        <Navbar />

        <section className="mx-auto max-w-4xl px-6 py-16">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="overflow-hidden rounded-[36px] border border-[#D4EAF0] bg-white shadow-xl"
          >
            <div className="bg-gradient-to-r from-[#176B87] to-[#14B8A6] p-10 text-center text-white">
              <div className="text-7xl">
                {perfect
                  ? "🏆"
                  : percentage >= 60
                    ? "🎉"
                    : "📚"}
              </div>

              <h1 className="mt-5 text-4xl font-extrabold">
                {perfect
                  ? "Perfect Score!"
                  : percentage >= 80
                    ? "Excellent!"
                    : percentage >= 60
                      ? "Great Work!"
                      : "Keep Practising!"}
              </h1>

              <p className="mt-3 text-white/75">
                BIM Visual Quiz completed.
              </p>
            </div>

            <div className="p-8 md:p-10">
              <div className="grid gap-4 sm:grid-cols-3">
                <ResultStat
                  value={`${finalScore}/10`}
                  label="Correct"
                />

                <ResultStat
                  value={`${percentage}%`}
                  label="Accuracy"
                />

                <ResultStat
                  value={`+${finalXP}`}
                  label="XP Earned"
                  highlight
                />
              </div>

              <div className="mt-7 rounded-[24px] bg-[#EEFAF8] p-6">
                <p className="font-extrabold text-[#0F766E]">
                  ✓ Progress Saved
                </p>

                <p className="mt-2 text-sm text-[#52738A]">
                  Your score and XP have been added
                  to your Achievement Board.
                </p>
              </div>

              {perfect && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mt-6 rounded-[24px] border border-[#F0D68A] bg-[#FFF9E7] p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">
                      ⭐
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9A7420]">
                        Badge Unlocked
                      </p>

                      <h3 className="mt-1 text-xl font-extrabold">
                        Perfect Score
                      </h3>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={startQuiz}
                  className="rounded-2xl border border-[#CFE5EB] px-6 py-4 font-extrabold text-[#176B87]"
                >
                  ↻ Try Again
                </button>

                <Link
                  href="/achievements"
                  className="flex items-center justify-center rounded-2xl bg-[#0B2545] px-6 py-4 font-extrabold text-white"
                >
                  🏆 Achievement Board →
                </Link>
              </div>

              <Link
                href="/dictionary"
                className="mt-4 flex justify-center rounded-2xl bg-[#E7F7F8] px-6 py-4 font-extrabold text-[#0F766E]"
              >
                📖 BIM Dictionary
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    );
  }

  /* =====================================================
     QUIZ
  ===================================================== */

  return (
    <main className="min-h-screen bg-[#F4FBFE] text-[#0B2545]">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-10">
        {/* HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#14B8A6]">
              BIM Visual Challenge
            </p>

            <h1 className="mt-1 text-2xl font-extrabold">
              Question {currentQuestion + 1} of 10
            </h1>
          </div>

          <div className="flex gap-3">
            <div className="rounded-full bg-white px-5 py-3 text-sm font-bold shadow-sm">
              ⭐ {xp} XP
            </div>

            <div className="rounded-full bg-[#0B2545] px-5 py-3 text-sm font-bold text-white">
              {score}/10
            </div>
          </div>
        </div>

        {/* PROGRESS */}

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#DCEEF2]">
          <motion.div
            animate={{
              width: `${quizProgress}%`,
            }}
            className="h-full rounded-full bg-gradient-to-r from-[#176B87] to-[#14B8A6]"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
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
            className="mt-7 rounded-[34px] border border-[#D5EBF0] bg-white p-6 shadow-lg md:p-9"
          >
            {/* IMAGE TO TEXT */}

            {question.type === "image-to-text" && (
              <>
                <div className="overflow-hidden rounded-[28px] border border-[#DDECEF] bg-[#F7FCFD]">
                  <div className="flex min-h-[320px] items-center justify-center p-5">
                    <Image
                      src={question.image}
                      alt="BIM sign quiz"
                      width={700}
                      height={500}
                      priority
                      className="max-h-[380px] w-auto max-w-full object-contain"
                    />
                  </div>
                </div>

                <p className="mt-7 text-sm font-bold uppercase tracking-[0.15em] text-[#14B8A6]">
                  Look at the BIM sign
                </p>

                <h2 className="mt-2 text-2xl font-extrabold">
                  {question.question}
                </h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {question.options.map(
                    (option, index) => (
                      <TextAnswerButton
                        key={option}
                        option={option}
                        index={index}
                        answer={question.answer}
                        selectedAnswer={selectedAnswer}
                        answered={answered}
                        onSelect={selectAnswer}
                      />
                    )
                  )}
                </div>
              </>
            )}

            {/* TEXT TO IMAGE */}

            {question.type === "text-to-image" && (
              <>
                <div className="rounded-[26px] bg-gradient-to-r from-[#176B87] to-[#14B8A6] p-7 text-center text-white">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/70">
                    Find the correct BIM sign
                  </p>

                  <h2 className="mt-3 text-xl font-bold">
                    {question.question}
                  </h2>

                  <p className="mt-3 text-4xl font-extrabold">
                    {question.word}
                  </p>
                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  {question.options.map(
                    (option, index) => {
                      const isCorrect =
                        option.label ===
                        question.answer;

                      const isSelected =
                        option.label ===
                        selectedAnswer;

                      let style =
                        "border-[#D5E8ED] bg-white hover:border-[#14B8A6]";

                      if (
                        answered &&
                        isCorrect
                      ) {
                        style =
                          "border-[#14B8A6] bg-[#E4F9F5]";
                      }

                      if (
                        answered &&
                        isSelected &&
                        !isCorrect
                      ) {
                        style =
                          "border-[#EF7777] bg-[#FFF1F1]";
                      }

                      return (
                        <motion.button
                          type="button"
                          key={option.label}
                          disabled={answered}
                          onClick={() =>
                            selectAnswer(
                              option.label
                            )
                          }
                          whileHover={
                            !answered
                              ? { y: -4 }
                              : {}
                          }
                          className={`relative overflow-hidden rounded-[24px] border-2 p-3 text-left transition ${style}`}
                        >
                          <div className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#0B2545] text-sm font-extrabold text-white shadow">
                            {String.fromCharCode(
                              65 + index
                            )}
                          </div>

                          <div className="flex h-[220px] items-center justify-center rounded-[18px] bg-[#F6FBFC] p-3">
                            <Image
                              src={option.image}
                              alt="BIM answer option"
                              width={450}
                              height={350}
                              className="max-h-[200px] w-auto max-w-full object-contain"
                            />
                          </div>

                          {answered &&
                            isCorrect && (
                              <div className="mt-3 text-center font-extrabold text-[#0F766E]">
                                ✓ Correct
                              </div>
                            )}

                          {answered &&
                            isSelected &&
                            !isCorrect && (
                              <div className="mt-3 text-center font-extrabold text-[#B54A4A]">
                                ✕ Incorrect
                              </div>
                            )}
                        </motion.button>
                      );
                    }
                  )}
                </div>
              </>
            )}

            {/* FEEDBACK */}

            {answered && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className={`mt-6 rounded-2xl p-5 ${
                  selectedAnswer ===
                  question.answer
                    ? "bg-[#E4F9F5]"
                    : "bg-[#FFF2F2]"
                }`}
              >
                {selectedAnswer ===
                question.answer ? (
                  <>
                    <p className="font-extrabold text-[#0F766E]">
                      ✓ Correct! +20 XP
                    </p>

                    <p className="mt-1 text-sm text-[#52738A]">
                      Well done. You recognised the
                      BIM sign correctly.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-extrabold text-[#B54A4A]">
                      ✕ Not quite.
                    </p>

                    <p className="mt-1 text-sm text-[#52738A]">
                      Correct answer:{" "}
                      <strong>
                        {question.answer}
                      </strong>
                    </p>
                  </>
                )}
              </motion.div>
            )}

            {answered && (
              <button
                type="button"
                onClick={nextQuestion}
                className="mt-6 w-full rounded-2xl bg-[#0B2545] px-7 py-4 font-extrabold text-white transition hover:bg-[#176B87]"
              >
                {currentQuestion ===
                questions.length - 1
                  ? "Complete Quiz & View Result →"
                  : "Next Question →"}
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  );
}

/* =====================================================
   TEXT ANSWER BUTTON
===================================================== */

function TextAnswerButton({
  option,
  index,
  answer,
  selectedAnswer,
  answered,
  onSelect,
}: {
  option: string;
  index: number;
  answer: string;
  selectedAnswer: string | null;
  answered: boolean;
  onSelect: (option: string) => void;
}) {
  const isCorrect = option === answer;
  const isSelected = option === selectedAnswer;

  let style =
    "border-[#D5E8ED] bg-white hover:border-[#14B8A6]";

  if (answered && isCorrect) {
    style =
      "border-[#14B8A6] bg-[#E4F9F5] text-[#0F766E]";
  }

  if (
    answered &&
    isSelected &&
    !isCorrect
  ) {
    style =
      "border-[#EF7777] bg-[#FFF1F1] text-[#B54A4A]";
  }

  return (
    <motion.button
      type="button"
      disabled={answered}
      onClick={() => onSelect(option)}
      whileHover={
        !answered ? { y: -2 } : {}
      }
      className={`flex min-h-[72px] items-center gap-4 rounded-2xl border-2 p-4 text-left font-bold transition ${style}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF7F9] text-sm font-extrabold">
        {String.fromCharCode(65 + index)}
      </span>

      <span className="flex-1">
        {option}
      </span>

      {answered && isCorrect && (
        <span>✓</span>
      )}

      {answered &&
        isSelected &&
        !isCorrect && <span>✕</span>}
    </motion.button>
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

          <Link
            href="/practice"
            className="font-bold text-[#14B8A6]"
          >
            Practice
          </Link>

          <Link href="/achievements">
            Achievements
          </Link>
        </nav>

        <Link
          href="/achievements"
          className="rounded-full bg-[#0B2545] px-5 py-3 text-sm font-bold text-white"
        >
          🏆 My Progress
        </Link>
      </div>
    </header>
  );
}

/* =====================================================
   INFO CARD
===================================================== */

function InfoCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-[#D8EBF0] bg-[#FAFEFF] p-5 text-center">
      <div className="text-2xl">
        {icon}
      </div>

      <p className="mt-2 text-xl font-extrabold">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#68889B]">
        {label}
      </p>
    </div>
  );
}

/* =====================================================
   RESULT STAT
===================================================== */

function ResultStat({
  value,
  label,
  highlight = false,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[22px] p-5 text-center ${
        highlight
          ? "bg-[#E1F8F4]"
          : "bg-[#F2F8FA]"
      }`}
    >
      <p
        className={`text-3xl font-extrabold ${
          highlight
            ? "text-[#0F9F91]"
            : "text-[#176B87]"
        }`}
      >
        {value}
      </p>

      <p className="mt-2 text-sm text-[#68889B]">
        {label}
      </p>
    </div>
  );
}