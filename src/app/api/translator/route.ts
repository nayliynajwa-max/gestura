import {
  NextRequest,
  NextResponse,
} from "next/server";

/* =========================================================
   CLOSED BIM VOCABULARY
========================================================= */

const BIM_VOCABULARY = [
  {
    sign: "TERIMA KASIH",
    malay: "Terima Kasih",
    english: "Thank You",
  },
  {
    sign: "SAMA-SAMA",
    malay: "Sama-sama",
    english: "You're Welcome",
  },
  {
    sign: "TOLONG",
    malay: "Tolong",
    english: "Help / Please",
  },
  {
    sign: "AYAH",
    malay: "Ayah",
    english: "Father",
  },
  {
    sign: "IBU",
    malay: "Ibu",
    english: "Mother",
  },
  {
    sign: "MAKAN",
    malay: "Makan",
    english: "Eat",
  },
  {
    sign: "BERJALAN",
    malay: "Berjalan",
    english: "Walk",
  },
  {
    sign: "BERLARI",
    malay: "Berlari",
    english: "Run",
  },
  {
    sign: "BETUL",
    malay: "Betul",
    english: "Correct",
  },
  {
    sign: "SALAH",
    malay: "Salah",
    english: "Wrong",
  },
];

/* =========================================================
   TYPES
========================================================= */

type ParsedFrame = {
  mimeType: string;
  data: string;
};

type GeminiRecognition = {
  detected?: boolean;
  sign?: string;
  confidence?: number;
};

/* =========================================================
   WAIT
========================================================= */

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

/* =========================================================
   PARSE CAMERA FRAME
========================================================= */

function parseFrame(
  frame: string
): ParsedFrame | null {
  const match = frame.match(
    /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
  );

  if (!match) {
    return null;
  }

  return {
    mimeType: match[1],
    data: match[2],
  };
}

/* =========================================================
   NORMALISE CONFIDENCE
========================================================= */

function normaliseConfidence(
  value: unknown
) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.min(
    1,
    Math.max(0, number)
  );
}

/* =========================================================
   GEMINI REQUEST WITH RETRY

   Attempt 1
      ↓
   503?
      ↓
   wait 1 second
      ↓
   Attempt 2
      ↓
   503?
      ↓
   wait 2 seconds
      ↓
   Attempt 3

   IMPORTANT:
   The SAME five frames are reused.
========================================================= */

async function callGeminiWithRetry(
  apiKey: string,
  parts: Array<
    | {
        text: string;
      }
    | {
        inline_data: {
          mime_type: string;
          data: string;
        };
      }
  >
) {
  const maxAttempts = 3;

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {
    console.log(
      `Gemini attempt ${attempt}/${maxAttempts}`
    );

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            "x-goog-api-key":
              apiKey,
          },

          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts,
              },
            ],

            generationConfig: {
              temperature: 0.1,

              responseMimeType:
                "application/json",
            },
          }),
        }
      );

      /*
        SUCCESS
      */

      if (response.ok) {
        console.log(
          `Gemini success on attempt ${attempt}`
        );

        return response;
      }

      /*
        READ ERROR
      */

      const errorText =
        await response.text();

      console.error(
        `Gemini API error attempt ${attempt}:`,
        response.status,
        errorText
      );

      /*
        ONLY RETRY 503

        Other errors such as:
        400
        401
        403
        404
        429

        are returned immediately.
      */

      if (
        response.status !== 503
      ) {
        return new Response(
          errorText,
          {
            status:
              response.status,

            headers: {
              "Content-Type":
                response.headers.get(
                  "Content-Type"
                ) ||
                "application/json",
            },
          }
        );
      }

      /*
        LAST ATTEMPT

        Do not wait again.
      */

      if (
        attempt === maxAttempts
      ) {
        return new Response(
          errorText,
          {
            status: 503,

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );
      }

      /*
        RETRY DELAY

        Attempt 1 failed:
        wait 1 second

        Attempt 2 failed:
        wait 2 seconds
      */

      const delay =
        attempt * 1000;

      console.log(
        `Gemini busy. Retrying in ${
          delay / 1000
        } second(s)...`
      );

      await wait(delay);
    } catch (error) {
      console.error(
        `Gemini network error attempt ${attempt}:`,
        error
      );

      /*
        Retry temporary network errors too.
      */

      if (
        attempt === maxAttempts
      ) {
        throw error;
      }

      const delay =
        attempt * 1000;

      await wait(delay);
    }
  }

  throw new Error(
    "Gemini retry process failed."
  );
}

/* =========================================================
   POST /api/translator
========================================================= */

export async function POST(
  request: NextRequest
) {
  try {
    /* -----------------------------------------------------
       API KEY
    ----------------------------------------------------- */

    const apiKey =
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,

          error:
            "GEMINI_API_KEY is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    /* -----------------------------------------------------
       REQUEST BODY
    ----------------------------------------------------- */

    const body =
      await request.json();

    const frames =
      body.frames;

    /* -----------------------------------------------------
       EXACTLY FIVE FRAMES
    ----------------------------------------------------- */

    if (
      !Array.isArray(frames) ||
      frames.length !== 5
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Exactly 5 camera frames are required.",
        },
        {
          status: 400,
        }
      );
    }

    /* -----------------------------------------------------
       PARSE FIVE FRAMES
    ----------------------------------------------------- */

    const parsedFrames =
      frames
        .slice(0, 5)
        .map(parseFrame)
        .filter(
          (
            frame
          ): frame is ParsedFrame =>
            frame !== null
        );

    if (
      parsedFrames.length !== 5
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "One or more camera frames are invalid.",
        },
        {
          status: 400,
        }
      );
    }

    /* -----------------------------------------------------
       VOCABULARY
    ----------------------------------------------------- */

    const vocabularyText =
      BIM_VOCABULARY.map(
        (item) =>
          `${item.sign} | Malay: ${item.malay} | English: ${item.english}`
      ).join("\n");

    /* -----------------------------------------------------
       RECOGNITION PROMPT
    ----------------------------------------------------- */

    const prompt = `
You are the visual recognition component of an
educational Bahasa Isyarat Malaysia (BIM)
prototype called Gestura.

You will receive EXACTLY FIVE chronological
camera frames captured while a user may be
performing ONE sign.

The five images represent different moments
of ONE continuous gesture.

Frame 1 = beginning.
Frame 2 = early movement.
Frame 3 = middle.
Frame 4 = later movement.
Frame 5 = end.

Analyse ALL FIVE frames together.

Do not treat the frames as unrelated images.

Pay attention to:

- hand shape
- finger configuration
- number of visible hands
- palm orientation
- hand orientation
- hand location relative to the face and body
- starting hand position
- ending hand position
- movement between frames
- direction of movement
- relationship between both hands
- relevant upper-body movement

Do NOT classify using only one frame.

The Gestura prototype currently uses a CLOSED
vocabulary.

You may ONLY recognise one of the signs listed
below.

Do NOT invent a BIM sign.

Do NOT return a sign outside the allowed
vocabulary.

A person merely appearing in the camera is
NOT evidence that a sign has been performed.

If the hands are unclear, hidden, outside the
frame, blurred or insufficiently visible,
return detected=false.

If the sequence is ambiguous, return
detected=false.

If there is not enough evidence to distinguish
one allowed sign from another, return
detected=false.

Do NOT identify the person.

Do NOT infer personal characteristics.

Be conservative with confidence.

ALLOWED GESTURA VOCABULARY:

${vocabularyText}

Return ONLY valid JSON.

Do not include Markdown.
Do not include code fences.
Do not include explanations.

Recognised example:

{
  "detected": true,
  "sign": "TERIMA KASIH",
  "confidence": 0.82
}

Unknown example:

{
  "detected": false,
  "sign": "UNKNOWN",
  "confidence": 0.10
}

confidence must be a number from 0 to 1.
`;

    /* -----------------------------------------------------
       BUILD MULTIMODAL CONTENT
    ----------------------------------------------------- */

    const parts: Array<
      | {
          text: string;
        }
      | {
          inline_data: {
            mime_type: string;
            data: string;
          };
        }
    > = [
      {
        text: prompt,
      },
    ];

    parsedFrames.forEach(
      (frame, index) => {
        parts.push({
          text:
            `FRAME ${index + 1} OF 5`,
        });

        parts.push({
          inline_data: {
            mime_type:
              frame.mimeType,

            data:
              frame.data,
          },
        });
      }
    );

    /* -----------------------------------------------------
       GEMINI

       1 initial request
       + maximum 2 retries for 503
    ----------------------------------------------------- */

    const geminiResponse =
      await callGeminiWithRetry(
        apiKey,
        parts
      );

    /* -----------------------------------------------------
       GEMINI STILL FAILED
    ----------------------------------------------------- */

    if (!geminiResponse.ok) {
      const errorText =
        await geminiResponse.text();

      console.error(
        "Gemini final failure:",
        geminiResponse.status,
        errorText
      );

      /*
        Give the frontend a nicer message
        specifically for temporary 503.
      */

      if (
        geminiResponse.status === 503
      ) {
        return NextResponse.json(
          {
            success: false,

            error:
              "AI service is temporarily busy. Please try again.",
          },
          {
            status: 503,
          }
        );
      }

      return NextResponse.json(
        {
          success: false,

          error:
            "Gemini API request failed.",
        },
        {
          status:
            geminiResponse.status,
        }
      );
    }

    /* -----------------------------------------------------
       READ SUCCESS RESPONSE
    ----------------------------------------------------- */

    const geminiData =
      await geminiResponse.json();

    const responseText =
      geminiData?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;

    if (!responseText) {
      console.error(
        "Gemini returned no recognition result:",
        geminiData
      );

      return NextResponse.json(
        {
          success: false,

          error:
            "Gemini returned no recognition result.",
        },
        {
          status: 500,
        }
      );
    }

    /* -----------------------------------------------------
       PARSE JSON RESULT
    ----------------------------------------------------- */

    let recognition:
      GeminiRecognition;

    try {
      recognition =
        JSON.parse(responseText);
    } catch {
      console.error(
        "Invalid Gemini JSON:",
        responseText
      );

      return NextResponse.json(
        {
          success: false,

          error:
            "Unable to parse AI result.",
        },
        {
          status: 500,
        }
      );
    }

    /* -----------------------------------------------------
       CONFIDENCE
    ----------------------------------------------------- */

    const confidence =
      normaliseConfidence(
        recognition.confidence
      );

    /* -----------------------------------------------------
       UNKNOWN
    ----------------------------------------------------- */

    if (!recognition.detected) {
      return NextResponse.json({
        success: true,

        result: {
          detected: false,

          sign:
            "UNKNOWN",

          malay:
            "Tidak dapat dikenal pasti",

          english:
            "Unable to recognise",

          confidence,
        },
      });
    }

    /* -----------------------------------------------------
       NORMALISE SIGN
    ----------------------------------------------------- */

    const sign =
      String(
        recognition.sign || ""
      )
        .trim()
        .toUpperCase();

    /* -----------------------------------------------------
       VALIDATE AGAINST GESTURA VOCABULARY
    ----------------------------------------------------- */

    const allowed =
      BIM_VOCABULARY.find(
        (item) =>
          item.sign === sign
      );

    if (!allowed) {
      console.warn(
        "Unsupported Gemini sign:",
        sign
      );

      return NextResponse.json({
        success: true,

        result: {
          detected: false,

          sign:
            "UNKNOWN",

          malay:
            "Tidak dapat dikenal pasti",

          english:
            "Unable to recognise",

          confidence: 0,
        },
      });
    }

    /* -----------------------------------------------------
       LOW CONFIDENCE

       Do not force a classification when
       Gemini is not sufficiently confident.
    ----------------------------------------------------- */

    if (confidence < 0.45) {
      return NextResponse.json({
        success: true,

        result: {
          detected: false,

          sign:
            "UNKNOWN",

          malay:
            "Tidak dapat dikenal pasti",

          english:
            "Unable to recognise",

          confidence,
        },
      });
    }

    /* -----------------------------------------------------
       SUCCESS
    ----------------------------------------------------- */

    return NextResponse.json({
      success: true,

      result: {
        detected: true,

        sign:
          allowed.sign,

        malay:
          allowed.malay,

        english:
          allowed.english,

        confidence,
      },
    });
  } catch (error) {
    console.error(
      "Translator API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Unexpected translator error.",
      },
      {
        status: 500,
      }
    );
  }
}