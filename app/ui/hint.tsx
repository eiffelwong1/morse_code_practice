import React from "react";

interface CardProps {
  currentWord: string;
  showHint: boolean;
}

export function MorseHint({ currentWord, showHint }: CardProps) {
  return (
    <div className="flex justify-center items-center h-20">
      <div className="flex justify-center items-center h-20">
        <div
          className={`${
            showHint ? "block" : "hidden"
          } bg-gray-100 border border-gray-300 rounded-lg p-4`}
        >
          <div className="text-center">
            <p className="text-gray-800 text-xl">{currentWord}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
