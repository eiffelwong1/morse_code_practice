import clsx from "clsx";
import { textToMorse } from "~/utils/translation";

interface CardProps {
  currentChar: string;
  showHint: boolean;
  setShowHint: React.Dispatch<React.SetStateAction<boolean>>;
}


export function MorseHint({ currentChar, showHint, setShowHint }: CardProps) {
  return (
    <div className="flex flex-col justify-center items-center">
      <button
        className={clsx(
          "bg-primary px-4 py-1 text-neutral",
          showHint ? "rounded-t-2xl" : "rounded-2xl"
        )}
        onClick={() => setShowHint((prev) => !prev)}
      >
        Hint
      </button>
      <div
        className={clsx(
          "bg-primary rounded-lg px-4 pb-2",
          showHint ? "visible" : "invisible"
        )}
      >
        <p className="flex items-center gap-6">
          <span className="text-8xl text-neutral">
            {textToMorse[currentChar]}
          </span>
        </p>
      </div>
    </div>
  );
}
