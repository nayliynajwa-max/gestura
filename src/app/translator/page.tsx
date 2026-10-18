"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";

type RecognitionResult = {
  detected: boolean;
  sign: string;
  malay: string;
  english: string;
  confidence: number;
};

type RecentTranslation =
  RecognitionResult & {
    id: number;
    time: string;
  };

export default function TranslatorPage() {
  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const activeRef = useRef(false);
  const sessionRef = useRef(false);

  const [cameraActive, setCameraActive] =
    useState(false);

  const [cameraError, setCameraError] =
    useState("");

  const [aiError, setAiError] =
    useState("");

  const [isAnalysing, setIsAnalysing] =
    useState(false);

  const [status, setStatus] =
    useState("Camera is off");

  const [countdown, setCountdown] =
    useState(5);

  const [
    capturedFrames,
    setCapturedFrames,
  ] = useState(0);

  const [result, setResult] =
    useState<RecognitionResult | null>(
      null
    );

  const [recent, setRecent] = useState<
    RecentTranslation[]
  >([]);

  /* =====================================================
     WAIT
  ===================================================== */

  function wait(ms: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  /* =====================================================
     START CAMERA
  ===================================================== */

  async function startCamera() {
    if (sessionRef.current) {
      return;
    }

    try {
      setCameraError("");
      setAiError("");
      setResult(null);

      setCountdown(5);
      setCapturedFrames(0);

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              width: {
                ideal: 1280,
              },

              height: {
                ideal: 720,
              },

              facingMode: "user",
            },

            audio: false,
          }
        );

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream;

        await videoRef.current.play();
      }

      activeRef.current = true;
      sessionRef.current = true;

      setCameraActive(true);

      setStatus(
        "Get ready to perform your BIM sign..."
      );
    } catch (error) {
      console.error(
        "Camera error:",
        error
      );

      setCameraError(
        "Camera access failed. Please allow camera permission."
      );

      activeRef.current = false;
      sessionRef.current = false;

      setCameraActive(false);
    }
  }

  /* =====================================================
     STOP CAMERA
  ===================================================== */

  function stopCamera() {
    activeRef.current = false;
    sessionRef.current = false;

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
    setIsAnalysing(false);

    setStatus("Camera is off");

    setCountdown(5);
    setCapturedFrames(0);
  }

  /* =====================================================
     CAPTURE ONE FRAME
  ===================================================== */

  function captureFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      return null;
    }

    if (
      video.readyState <
      HTMLMediaElement.HAVE_CURRENT_DATA
    ) {
      return null;
    }

    const sourceWidth =
      video.videoWidth || 640;

    const sourceHeight =
      video.videoHeight || 480;

    /*
      Resize frames before sending them
      to Gemini.

      This keeps the request lighter.
    */

    const targetWidth = 640;

    const targetHeight = Math.round(
      (sourceHeight / sourceWidth) *
        targetWidth
    );

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context =
      canvas.getContext("2d");

    if (!context) {
      return null;
    }

    /*
      Mirror captured image so it matches
      the webcam preview.
    */

    context.save();

    context.translate(
      targetWidth,
      0
    );

    context.scale(-1, 1);

    context.drawImage(
      video,
      0,
      0,
      targetWidth,
      targetHeight
    );

    context.restore();

    return canvas.toDataURL(
      "image/jpeg",
      0.72
    );
  }

  /* =====================================================
     5 SECOND / 5 FRAME SCAN

     FRAME 1 -> start
     FRAME 2 -> movement
     FRAME 3 -> middle
     FRAME 4 -> movement
     FRAME 5 -> end

     Gemini is NOT called for every frame.

     All 5 frames are sent together
     in ONE API request.
  ===================================================== */

  async function capture5SecondSequence() {
    const frames: string[] = [];

    setCapturedFrames(0);
    setCountdown(5);

    setStatus(
      "Get ready..."
    );

    /*
      Small delay allows the webcam
      to stabilise before capture.
    */

    await wait(500);

    if (!activeRef.current) {
      return frames;
    }

    setStatus(
      "Perform your BIM sign"
    );

    /*
      Exactly five capture opportunities,
      approximately one per second.
    */

    for (let i = 0; i < 5; i++) {
      if (!activeRef.current) {
        break;
      }

      setCountdown(5 - i);

      const frame =
        captureFrame();

      if (frame) {
        frames.push(frame);

        setCapturedFrames(
          frames.length
        );
      }

      /*
        Do not wait after final frame.
      */

      if (i < 4) {
        await wait(1000);
      }
    }

    /*
      IMPORTANT:
      Capture ends here.

      No additional camera frames are
      collected while Gemini is analysing.
    */

    setCountdown(0);

    setStatus(
      `${frames.length}/5 frames captured`
    );

    return frames;
  }

  /* =====================================================
     SEND 5 FRAMES TO GEMINI
  ===================================================== */

  async function recogniseSign(
    frames: string[]
  ) {
    setIsAnalysing(true);

    setStatus(
      "AI analysing 5-frame sequence..."
    );

    try {
      const response = await fetch(
        "/api/translator",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            frames,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            "AI recognition failed."
        );
      }

      const recognised:
        RecognitionResult =
        data.result;

      setResult(recognised);

      if (recognised.detected) {
        setStatus(
          `Detected: ${recognised.sign}`
        );

        setRecent((previous) => {
          /*
            Avoid immediate duplicate
            entries in history.
          */

          if (
            previous[0]?.sign ===
            recognised.sign
          ) {
            return previous;
          }

          const item:
            RecentTranslation = {
            ...recognised,

            id: Date.now(),

            time:
              new Date().toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              ),
          };

          return [
            item,
            ...previous,
          ].slice(0, 5);
        });
      } else {
        setStatus(
          "No clear sign detected"
        );
      }
    } catch (error) {
      console.error(
        "Recognition error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "AI recognition failed.";

      setAiError(message);

      setStatus(
        "Recognition error"
      );
    } finally {
      setIsAnalysing(false);
    }
  }

  /* =====================================================
     ONE RECOGNITION SESSION

     START
       ↓
     Camera ON
       ↓
     5-second observation
       ↓
     Exactly 5 frames
       ↓
     CAPTURE STOPS
       ↓
     ONE Gemini request
       ↓
     AI result
       ↓
     Camera OFF
  ===================================================== */

  useEffect(() => {
    if (!cameraActive) {
      return;
    }

    let cancelled = false;

    async function runSession() {
      const frames =
        await capture5SecondSequence();

      if (
        cancelled ||
        !activeRef.current
      ) {
        return;
      }

      /*
        For this version Gestura expects
        exactly 5 valid frames.
      */

      if (frames.length !== 5) {
        setResult({
          detected: false,

          sign: "UNKNOWN",

          malay:
            "Tidak dapat dikenal pasti",

          english:
            "Unable to recognise",

          confidence: 0,
        });

        setAiError(
          `Only ${frames.length}/5 frames were captured. Please try again.`
        );

        stopCamera();

        return;
      }

      /*
        Five frames are sent together
        in ONE Gemini API call.
      */

      await recogniseSign(frames);

      /*
        Analysis finished.

        Camera stops automatically.
      */

      if (!cancelled) {
        stopCamera();
      }
    }

    runSession();

    return () => {
      cancelled = true;
    };
  }, [cameraActive]);

  /* =====================================================
     PAGE CLEANUP
  ===================================================== */

  useEffect(() => {
    return () => {
      activeRef.current = false;
      sessionRef.current = false;

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }
    };
  }, []);

  /* =====================================================
     UI
  ===================================================== */

  return (
    <main className="min-h-screen bg-[#F4FBFE] text-[#0B2545]">
      <Navbar />

      {/* HERO */}

      <section className="relative overflow-hidden">
        <div className="absolute left-[-180px] top-[-120px] h-[450px] w-[450px] rounded-full bg-[#BDECF6]/40 blur-3xl" />

        <div className="absolute right-[-130px] top-[30px] h-[400px] w-[400px] rounded-full bg-[#7BE1D6]/25 blur-3xl" />

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
            <div className="inline-flex items-center gap-2 rounded-full border border-[#BFE6EE] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#176B87] shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#14B8A6]" />

              AI Live Translator
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight md:text-6xl">
              Translate BIM
              <span className="text-[#14B8A6]">
                {" "}
                in real time.
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#52738A]">
              Start recognition and perform one
              Bahasa Isyarat Malaysia sign
              naturally for 5 seconds. Gestura
              captures 5 frames across the
              movement and analyses them together
              using AI.
            </p>
          </motion.div>
        </div>
      </section>

      {/* TRANSLATOR */}

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-7 lg:grid-cols-[1.35fr_0.85fr]">

          {/* CAMERA */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="overflow-hidden rounded-[34px] border border-[#D5E9EE] bg-white shadow-xl shadow-[#176B87]/5"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E1EDF0] px-7 py-5">
              <div>
                <p className="text-sm font-extrabold">
                  Live Camera
                </p>

                <p className="mt-1 text-xs text-[#7893A2]">
                  5-second scan • 5-frame AI
                  analysis
                </p>
              </div>

              <div
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
                  cameraActive
                    ? "bg-[#E4F9F5] text-[#0F766E]"
                    : "bg-[#EEF3F5] text-[#6B818D]"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    cameraActive
                      ? "animate-pulse bg-[#14B8A6]"
                      : "bg-[#9AAAB2]"
                  }`}
                />

                {cameraActive
                  ? isAnalysing
                    ? "AI Analysing"
                    : "Scanning Sign"
                  : "Camera Off"}
              </div>
            </div>

            <div className="p-5 md:p-7">
              <div className="relative aspect-video overflow-hidden rounded-[28px] bg-[#0B2545]">

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`h-full w-full scale-x-[-1] object-cover ${
                    cameraActive
                      ? "block"
                      : "hidden"
                  }`}
                />

                {!cameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-5xl">
                      📷
                    </div>

                    <h3 className="mt-6 text-2xl font-extrabold">
                      Start 5-Second Scan
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-white/60">
                      Press Start Recognition and
                      perform one BIM sign
                      naturally. Gestura will
                      capture 5 frames over
                      approximately 5 seconds.
                    </p>
                  </div>
                )}

                {cameraActive && (
                  <>
                    <div className="pointer-events-none absolute inset-[8%] rounded-[26px] border-2 border-dashed border-white/40" />

                    <div className="absolute left-5 top-5 rounded-full bg-black/40 px-4 py-2 text-xs font-bold text-white backdrop-blur">
                      Keep hands & upper body
                      visible
                    </div>

                    {/* COUNTDOWN + FRAME COUNTER */}

                    <div className="absolute right-5 top-5 flex min-w-[92px] flex-col items-center rounded-2xl bg-black/55 px-4 py-3 text-white backdrop-blur">
                      <span className="text-xl font-black">
                        {countdown}s
                      </span>

                      <span className="mt-1 text-[10px] font-bold text-white/70">
                        {capturedFrames}/5 frames
                      </span>
                    </div>

                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                      <div className="flex items-center gap-2 whitespace-nowrap rounded-full bg-black/50 px-5 py-3 text-xs font-bold text-white backdrop-blur">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            isAnalysing
                              ? "animate-pulse bg-yellow-300"
                              : "animate-pulse bg-[#32E6CB]"
                          }`}
                        />

                        {status}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <canvas
                ref={canvasRef}
                className="hidden"
              />

              {cameraError && (
                <div className="mt-4 rounded-2xl border border-[#F4CCCC] bg-[#FFF3F3] p-4 text-sm text-[#A74343]">
                  {cameraError}
                </div>
              )}

              {aiError && (
                <div className="mt-4 rounded-2xl border border-[#F4CCCC] bg-[#FFF3F3] p-4 text-sm text-[#A74343]">
                  {aiError}
                </div>
              )}

              <div className="mt-5">
                {!cameraActive ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="w-full rounded-2xl bg-[#14B8A6] px-6 py-4 font-extrabold text-white shadow-lg shadow-[#14B8A6]/20 transition hover:bg-[#0FAF9D]"
                  >
                    ● Start 5-Second Recognition
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    disabled={isAnalysing}
                    className={`w-full rounded-2xl border px-6 py-4 font-extrabold ${
                      isAnalysing
                        ? "cursor-not-allowed border-[#E4ECEE] bg-[#F5F8F9] text-[#A2B1B8]"
                        : "border-[#D5E5E9] bg-white text-[#52738A]"
                    }`}
                  >
                    {isAnalysing
                      ? "AI is Analysing..."
                      : "■ Stop Recognition"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* AI RESULT */}

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
              delay: 0.1,
            }}
            className="overflow-hidden rounded-[34px] border border-[#D5E9EE] bg-white shadow-xl shadow-[#176B87]/5"
          >
            <div className="border-b border-[#E1EDF0] px-7 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-extrabold">
                    AI Recognition
                  </p>

                  <p className="mt-1 text-xs text-[#7893A2]">
                    Current BIM result
                  </p>
                </div>

                <div className="rounded-full bg-[#E7F8F6] px-3 py-2 text-xs font-bold text-[#0F766E]">
                  ✨ AI
                </div>
              </div>
            </div>

            <div className="p-7">
              {isAnalysing ? (
                <Analysing />
              ) : result ? (
                <RecognitionCard
                  result={result}
                />
              ) : (
                <Waiting />
              )}
            </div>
          </motion.div>
        </div>

        {/* RECENT TRANSLATIONS */}

        <div className="mt-7 rounded-[30px] border border-[#D5E9EE] bg-white p-7 shadow-lg shadow-[#176B87]/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold">
                Recent Translations
              </h2>

              <p className="mt-1 text-sm text-[#7893A2]">
                Latest signs recognised during
                this session.
              </p>
            </div>

            <div className="rounded-full bg-[#EEF8FA] px-4 py-2 text-xs font-bold text-[#176B87]">
              {recent.length} detected
            </div>
          </div>

          {recent.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-[#F6FAFB] p-7 text-center text-sm text-[#7893A2]">
              No signs recognised yet.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {recent.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E2EDF0] p-4"
                >
                  <div>
                    <p className="font-extrabold">
                      {item.sign}
                    </p>

                    <p className="mt-1 text-xs text-[#7893A2]">
                      {item.malay} ·{" "}
                      {item.english}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-extrabold text-[#0F766E]">
                      {Math.round(
                        item.confidence *
                          100
                      )}
                      %
                    </p>

                    <p className="text-xs text-[#9AAAB2]">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INFORMATION */}

        <div className="mt-7 rounded-[24px] border border-[#D5E8EC] bg-white p-6">
          <p className="font-extrabold text-[#176B87]">
            Prototype Live Recognition
          </p>

          <p className="mt-2 text-sm leading-6 text-[#68889B]">
            Each recognition session captures
            exactly 5 visual frames across a
            5-second BIM gesture. The frames are
            sent together in one AI request so
            Gestura can examine changes in hand
            position and movement across the
            sequence. No additional frames are
            captured while the AI is analysing.
          </p>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   WAITING
========================================================= */

function Waiting() {
  return (
    <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-[#EEF8FA] text-4xl">
        🤟
      </div>

      <h3 className="mt-5 text-xl font-extrabold">
        Waiting for BIM sign
      </h3>

      <p className="mt-2 max-w-xs text-sm leading-6 text-[#7893A2]">
        Press Start 5-Second Recognition and
        perform one BIM sign naturally in front
        of the camera.
      </p>
    </div>
  );
}

/* =========================================================
   ANALYSING
========================================================= */

function Analysing() {
  return (
    <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
        className="h-14 w-14 rounded-full border-4 border-[#D6EEEF] border-t-[#14B8A6]"
      />

      <h3 className="mt-6 text-xl font-extrabold">
        Analysing 5-frame sequence...
      </h3>

      <p className="mt-2 max-w-xs text-sm leading-6 text-[#7893A2]">
        Capture is complete. Gestura AI is now
        analysing the hand and upper-body
        movement across the five captured
        frames.
      </p>
    </div>
  );
}

/* =========================================================
   RESULT
========================================================= */

function RecognitionCard({
  result,
}: {
  result: RecognitionResult;
}) {
  const confidence = Math.round(
    result.confidence * 100
  );

  if (!result.detected) {
    return (
      <div className="min-h-[430px]">
        <div className="rounded-[26px] border border-[#F3D7B7] bg-[#FFF8EF] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#B66B24]">
            No clear match
          </p>

          <h3 className="mt-2 text-2xl font-extrabold">
            Sign not recognised
          </h3>

          <p className="mt-3 text-sm leading-6 text-[#80664D]">
            Gestura could not confidently
            recognise the sign. Try again and
            keep your hands and upper body
            clearly visible throughout the
            5-second scan.
          </p>
        </div>

        <ResultRow
          label="Detected Sign"
          value="UNKNOWN"
        />

        <ResultRow
          label="Confidence"
          value={`${confidence}%`}
        />
      </div>
    );
  }

  return (
    <div className="min-h-[430px]">
      <div className="rounded-[26px] bg-gradient-to-br from-[#E9FBF7] to-[#EEF9FD] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#0F766E]">
              Sign recognised
            </p>

            <h2 className="mt-3 text-3xl font-black">
              {result.sign}
            </h2>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#14B8A6] text-2xl text-white">
            ✓
          </div>
        </div>
      </div>

      <ResultRow
        label="Bahasa Melayu"
        value={result.malay}
      />

      <ResultRow
        label="English"
        value={result.english}
      />

      <div className="mt-3 rounded-2xl border border-[#E0ECEF] p-4">
        <div className="flex justify-between">
          <span className="text-sm text-[#68889B]">
            AI Confidence
          </span>

          <span className="font-extrabold text-[#0F766E]">
            {confidence}%
          </span>
        </div>

        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#E7F0F2]">
          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${confidence}%`,
            }}
            className="h-full rounded-full bg-[#14B8A6]"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   RESULT ROW
========================================================= */

function ResultRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="mt-3 flex items-center justify-between gap-5 rounded-2xl border border-[#E0ECEF] bg-white p-4">
      <span className="text-sm text-[#68889B]">
        {label}
      </span>

      <span className="text-right font-extrabold">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   NAVBAR
========================================================= */

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

          <Link
            href="/translator"
            className="font-bold text-[#14B8A6]"
          >
            Live Translator
          </Link>

          <Link href="/practice">
            Practice
          </Link>

          <Link href="/achievements">
            Achievements
          </Link>
        </nav>

        <Link
          href="/learn"
          className="rounded-full bg-[#0B2545] px-5 py-3 text-sm font-bold text-white"
        >
          Learn BIM
        </Link>
      </div>
    </header>
  );
}