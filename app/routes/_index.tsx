import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { morseToText, textToMorse } from "~/utils/translation";
import { type Timeout } from "node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { useDebounce } from "~/utils/useDebounce";
import { clsx } from "clsx";
import * as Tone from "tone";
import { dah, dit } from "~/ui/sound";

export const meta: MetaFunction = () => {
  return [
    { title: "Morse Code Practice" },
    {
      name: "description",
      content: "Welcome and enjoy a morse code practice session",
    },
  ];
};

export default function Index() {
  const [morse, setMorse] = useState("");
  const debounceMorse = useDebounce(morse, "", 500);
  const [text, setText] = useState("");
  const [quest, setQuest] = useState(
    //"SOS ABCD EFGH IJKL MNOP QRST UVWX YZ 1234 5678 90"
    "ETETETETETETETETETETETETETETETETETETETETE"
  );
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  //close hint after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [showHint]);

  // allow dit and dah input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key !== "." && e.key !== "-") return;
      console.log("key down");
      setMorse((prev) => prev + e.key);
      if (e.key === ".") {
        dit();
      } else if (e.key === "-") {
        dah();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault();
      console.log("key up");
    };
    document.addEventListener("keydown", handleKeyDown, false);
    document.addEventListener("keyup", handleKeyUp, false);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  //submit morse code after delay
  useEffect(() => {
    if (debounceMorse.length > 0) {
      if (morseToText[debounceMorse]) {
        setText((prev) => prev + morseToText[debounceMorse]);
      }
      setMorse("");
    }
  }, [debounceMorse]);

  //post input action (score counting + quest advancing)
  useEffect(() => {
    console.log(text.slice(-1));
    if (!text || !quest) return;
    if (text.slice(-1) === quest[0]) {
      setScore((prev) => prev + 1);
      setQuest((prev) => prev.slice(1));
    } else {
      setShowHint(true);
    }
  }, [text]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Morse Code Typing</h1>

      <p className="text-3xl overflow-clip text-nowrap absolute top-1/3 right-1/2 -translate-y-1/2">
        {text}
      </p>
      <div className="flex items-center gap-4 font-bold text-nowrap absolute top-1/3 left-1/2 -translate-y-1/2">
        <div className="bg-sky-300 w-24 h-32 absolute"></div>
        <p className="text-9xl z-10">{quest[0]}</p>
        <p className="text-7xl z-10">{quest.slice(1)}</p>
      </div>

      <div
        className={clsx(
          "absolute top-1/2 left-1/2 translate-y-1/2 bg-sky-200 rounded-3xl px-6",
          { hidden: !showHint }
        )}
      >
        <p className="flex items-center gap-6">
          Hint:
          <span className="text-8xl text-orange-700">
            {textToMorse[quest[0]]}
          </span>
        </p>
      </div>

      <p className="text-9xl text-nowrap absolute top-2/3 left-1/2 -translate-1/2 ">
        {morse}
      </p>

      <p>{score}</p>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <p>{error.status}</p>;
  }

  if (error instanceof Error) {
    return <p>{error.message}</p>;
  }

  return <p>Unkown Error Have Occured</p>;
}
