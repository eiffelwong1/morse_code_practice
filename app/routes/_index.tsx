import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { morseToText, textToMorse } from "~/utils/translation";
import { type Timeout } from "node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { useDebounce } from "~/utils/useDebounce";
import { clsx } from "clsx";
import * as Tone from "tone";
import { dah, dit } from "~/ui/sound";
import { MorseHint } from "~/ui/hint";
import { CharScore } from "~/utils/calculation";

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
    "FOX PARIS ABCD EFGH IJKL MNOP QRST UVWX YZ 1234 5678 90"
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
      setMorse((prev) => prev + e.key);
      if (e.key === ".") {
        dit();
      } else if (e.key === "-") {
        dah();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault();
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
    if (!text || !quest) return;
    if (text.slice(-1) === quest[0]) {
      //count score
      setScore((prev) => prev + CharScore(quest[0]));

      //advance text
      setQuest((prev) => {
        const next = prev.slice(1);
        //passing over space
        if (next && next[0] === " ") {
          setText((prev) => prev + " ");
          setScore((prev) => prev + 2); // why is this line triggered twice?
        }
        return next.trimStart();
      });
    } else {
      // wrong input
      setShowHint(true);
    }
  }, [text]);

  return (
    <div className="font-mono flex flex-col overflow-x-hidden justify-around h-screen">
      <h1>Morse Code Typing</h1>

      <div className="relative min-h-36 m-auto flex items-center">
        <p className="text-3xl overflow-clip text-nowrap whitespace-nowrap absolute right-1/2 -translate-x-[75px]">
          {text}
        </p>
        <div className="flex bg-sky-300 items-center gap-4 font-bold text-nowrap whitespace-nowrap absolute left-1/2 -translate-x-[60px] p-3 pl-5 rounded-3xl">
          <p className="text-9xl z-10">{quest[0]}</p>
          <p className="text-7xl z-10 text-nowrap whitespace-nowrap">{quest.slice(1)}</p>
        </div>
      </div>

      <div className="z-10">
        <MorseHint
          currentChar={quest[0]}
          showHint={showHint}
          setShowHint={setShowHint}
        />
      </div>

      <div className="w-full flex justify-center min-h-32">
        <p className="text-9xl text-nowrap">{morse}</p>
        {!(morse || text) && (
          <p className="">
            <span className="mx-4">start typing with</span>
            <kbd className="kbd kbd-lg">.</kbd>
            <span className="mx-4">or</span>
            <kbd className="kbd kbd-lg">-</kbd>
          </p>
        )}
      </div>

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
