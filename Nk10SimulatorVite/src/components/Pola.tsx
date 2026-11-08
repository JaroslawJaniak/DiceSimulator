import { useEffect, useState } from "react";
import { binomialCoefficient } from "../utils/binomialCoefficient";
import { simulateDiceRolls } from "../utils/simulateDiceRolls";
import { howManySuccessfulRollsMinimum } from "../utils/howManySuccessfulRollsMinimum";
import { howManySuccessfulRollsStrict } from "../utils/howManySuccessfulRollsStrict";
import {
  isSuccessfulRollMinimum,
  numberOfSuccessfulRolls,
} from "../utils/isSuccessfulRollMinimum";

type DefaultButtonProps = {
  handleClick: () => void;
  text: string;
  className: string;
};

function DefaultButton({ handleClick, text, className }: DefaultButtonProps) {
  return (
    <button type="button" onClick={handleClick} className={className}>
      {text}
    </button>
  );
}

const MIN = 1;
const MAX = 10;
const START = 5;

export default function PolaKlikane() {
  const [dicePoolRoll, setDicePoolRoll] = useState<number[]>([]);
  const [displayedDice, setDisplayedDice] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [isTestSuccessful, setIsTestSuccessful] = useState(Boolean);
  const diceTypes = [4, 6, 8, 10, 12, 20, 50, 100];
  const [activeDiceTypeButtonIndex, setActiveDiceTypeButtonIndex] = useState(1); // Domyślnie aktywna jest k6
  const [difficultyLevel, setDifficultyLevel] = useState(4);
  const [successNumber, setSuccessNumber] = useState(3);

  const [defaultDiceType, setDefaultDiceType] = useState(6); // Domyślny typ kości (k6)

  const rollDice = () => {
    // Generowanie nowych liczb (przykładowo pięć losowych kostek od 1 do 6)
    const newRoll = simulateDiceRolls(1, diceNumber, 1, defaultDiceType)[0];
    setDicePoolRoll(newRoll);
    setDisplayedDice([]);
    setIndex(0);
  };

  useEffect(() => {
    if (index < dicePoolRoll.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedDice((prev) => [...prev, dicePoolRoll[index]]);
        setIndex((prev) => prev + 1);
      }, 600);

      return () => clearTimeout(timeoutId);
    } else {
      const isTestSuccessful = isSuccessfulRollMinimum(
        dicePoolRoll,
        difficultyLevel,
        successNumber,
      );

      setIsTestSuccessful(isTestSuccessful);
    }
  }, [index, dicePoolRoll]);

  // Widoczne jest zawsze 10 pól; zapełnione na starcie 5.
  const [filled, setFilled] = useState(() =>
    // Używamy funkcji inicjalizującej, aby uniknąć ponownego obliczania przy każdym renderowaniu
    Array.from({ length: MAX }, (_, i) => i < START),
  );

  const [diceTypesButton, _setDiceTypesButton] = useState(
    () => Array.from({ length: 8 }, (_, i) => i < 7), // Używamy funkcji inicjalizującej, aby uniknąć ponownego obliczania przy każdym renderowaniu
  );

  function updateDefaultDiceType(
    newDefaultDiceType: number,
    newActiveButtonIndex: number,
  ) {
    setActiveDiceTypeButtonIndex(newActiveButtonIndex);
    setDefaultDiceType(newDefaultDiceType);
    setDifficultyLevel(newDefaultDiceType / 2); // Aktualizujemy poziom trudności na podstawie nowego typu kości
  }

  function updateDifficultyLevel(
    newDifficultyLevel: number,
    newDefaultDiceType: number = defaultDiceType,
  ) {
    setDifficultyLevel(
      Math.max(1, Math.min(newDefaultDiceType, newDifficultyLevel)),
    );
  }

  function updateSuccessNumber(newSuccessNumber: number) {
    setSuccessNumber(Math.max(1, Math.min(10, newSuccessNumber)));
  }

  const diceNumber = filled.filter(Boolean).length;

  const handleClick = (index: number) => {
    setFilled((prev) => {
      const next = [...prev];

      if (next[index]) {
        // Kliknięto pełne pole
        const lastFilled = next.lastIndexOf(true);

        // Opróżnij tylko ostatnie pełne pole
        if (index !== lastFilled || diceNumber <= MIN) {
          return prev;
        }

        next[index] = false;
      } else {
        // Kliknięto puste pole
        const firstEmpty = next.indexOf(false);

        if (firstEmpty === -1 || diceNumber >= MAX) {
          return prev;
        }

        // Zapełnij pierwsze puste pole
        next[firstEmpty] = true;
      }

      return next;
    });
  };

  const diceRollsNkD = simulateDiceRolls(
    110000,
    diceNumber,
    1,
    defaultDiceType,
  ); // Symulacja 110000 rzutów pulą diceNumber kości

  function probabilityOfStrictNumberSucessForNumberDice(
    difficultyLevel: number,
    diceNumber: number,
    successNumber: number,
    diceType: number = 10, // Domyślny typ kości to k10
  ): number {
    // Możesz dostosować tę funkcję według własnych potrzeb.
    return (
      (binomialCoefficient(diceNumber, successNumber) *
        Math.pow(diceType + 1 - difficultyLevel, successNumber) *
        Math.pow(difficultyLevel - 1, diceNumber - successNumber)) /
      Math.pow(diceType, diceNumber)
    );
  }

  function probabilityOfMinimumNumberSuccessForNumberDice(
    difficultyLevel: number,
    diceNumber: number,
    successNumber: number,
    diceType: number = 10,
  ): number {
    // Możesz dostosować tę funkcję według własnych potrzeb.
    let sum = 0;
    for (let k = successNumber; k <= diceNumber; k++) {
      sum += probabilityOfStrictNumberSucessForNumberDice(
        difficultyLevel,
        diceNumber,
        k,
        diceType,
      );
    }

    return sum;
  }

  return (
    <div className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-900 mt-4 mb-4 text-2xl">
      <style>{`
        .pole {
          aspect-ratio: 1;
          border-radius: 999px;
          cursor: pointer;
          
          background: transparent;
          
        }
        .pole:hover {  }
        .pole:active {  }
        .pole:focus-visible {  }
        .pole[aria-pressed="true"] {
          background: black;
        
        }
        .pole[aria-pressed="true"]:active {  }
        .pole[aria-disabled="true"] { cursor: not-allowed; }
        .pole[aria-disabled="true"]:hover { transform: none; }
        @media (prefers-reduced-motion: reduce) {
          .pole { transition: none; }
        }
      `}</style>

      <div className="text-center mb-4 ">
        <div>Number of successes: {successNumber}</div>

        <DefaultButton
          handleClick={() => updateSuccessNumber(successNumber - 1)}
          text="-1"
          className="text-black bg-gray-300 hover:bg-gray-400 hover:text-white  font-medium rounded text-sm px-5 py-2.5  my-2  mr-2 w-24 dark:bg-gray-300 dark:hover:bg-gray-700 dark:focus:ring-green-700 dark:border-gray-700"
        />
        <DefaultButton
          handleClick={() => updateSuccessNumber(successNumber + 1)}
          text="+1"
          className="text-black bg-gray-300 hover:bg-gray-400 hover:text-white  font-medium rounded text-sm px-5 py-2.5  my-2  mr-2 w-24 dark:bg-gray-300 dark:hover:bg-gray-700 dark:focus:ring-green-700 dark:border-gray-700"
        />
      </div>
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div>Difficulty level: {difficultyLevel}</div>

        <DefaultButton
          handleClick={() =>
            updateDifficultyLevel(difficultyLevel - 1, defaultDiceType)
          }
          text="-1"
          className="text-black bg-gray-300 hover:bg-gray-400 hover:text-white  font-medium rounded text-sm px-5 py-2.5  my-2  mr-2 w-24 dark:bg-gray-300 dark:hover:bg-gray-700 dark:focus:ring-green-700 dark:border-gray-700"
        />
        <DefaultButton
          handleClick={() =>
            updateDifficultyLevel(difficultyLevel + 1, defaultDiceType)
          }
          text="+1"
          className="text-black bg-gray-300 hover:bg-gray-400 hover:text-white  font-medium rounded text-sm px-5 py-2.5  my-2  mr-2 w-24 dark:bg-gray-300 dark:hover:bg-gray-700 dark:focus:ring-green-700 dark:border-gray-700"
        />
      </div>

      <div style={{ textAlign: "center" }}>
        <div>
          {diceTypesButton.map((_isActive, index) => {
            return (
              <DefaultButton
                handleClick={() =>
                  updateDefaultDiceType(diceTypes[index], index)
                }
                text={`d${diceTypes[index]}`}
                className={`text-black  bg-gray-300 hover:bg-gray-400 hover:text-white focus:bg-green-700 focus:text-white font-medium rounded text-sm px-5 py-2.5  my-2  mr-2 w-24 dark:bg-gray-300 dark:hover:bg-green-700 dark:focus:ring-green-700 dark:border-gray-700 ${activeDiceTypeButtonIndex === index ? "bg-green-700 text-white" : ""}`}
              />
            );
          })}
        </div>

        <div style={{ fontSize: 32, lineHeight: 1, fontWeight: 700 }}>
          {diceNumber}

          <span style={{ fontSize: 24, fontWeight: 400, opacity: 0.6 }}>
            {" "}
            d {defaultDiceType} (your dice type pool)
          </span>
          <div
            className="inline-block"
            style={{
              fontSize: 16,
              lineHeight: 1,
              fontWeight: 400,
              opacity: 0.6,
            }}
          ></div>
        </div>
        <p style={{ margin: "10px 0 0", fontSize: 16, opacity: 0.75 }}>
          Click on empty fields to fill them. Click on filled fields to empty
          them. Each filled field represents one die in your dice pool. The
          number of filled fields is the number of dice you will roll. The
          minimum number of filled fields is 1, and the maximum is 10.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, minmax(0, 1fr))",
          gap: 32,
          width: "100%",
          maxWidth: 660,
          padding: "4px 0px 6px",
          margin: "24px auto",
          textAlign: "center",
        }}
      >
        {filled.map((isFilled, i) => {
          const isLast = isFilled && diceNumber <= MIN;
          return (
            <button
              key={i}
              type="button"
              className="pole text-xxs text-gray-100  border border-black dark:border-gray-600"
              aria-pressed={isFilled}
              aria-disabled={isLast}
              aria-label={`Pole ${i + 1}: ${isFilled ? "pełne" : "puste"}`}
              title={
                isLast ? "Przynajmniej jedno pole musi być pełne" : undefined
              }
              onClick={() => handleClick(i)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 20 }}>
        <p>
          The probability of rolling at least {successNumber} successes with{" "}
          {diceNumber} dice d{defaultDiceType} and difficulty level {difficultyLevel}:{" "}
          {probabilityOfMinimumNumberSuccessForNumberDice(
            difficultyLevel,
            diceNumber,
            successNumber,
            defaultDiceType,
          ).toFixed(4)}
        </p>
        <p>
          The probability of rolling exactly {successNumber} successes with{" "}
          {diceNumber} dice d{defaultDiceType} and difficulty level{" "}
          {difficultyLevel}:{" "}
          {probabilityOfStrictNumberSucessForNumberDice(
            difficultyLevel,
            diceNumber,
            successNumber,
            defaultDiceType,
          ).toFixed(4)}
        </p>
      </div>
      <div style={{ marginTop: 20 }}>
        <h2>----------------------------------------------</h2>
        <p>
          ({diceNumber}d{defaultDiceType} - DIFFICULTY LEVEL: {difficultyLevel}{" "}
          - number of expected successes: {successNumber} or more) - rolls{" "}
          {diceNumber}d{defaultDiceType}:{" "}
          {howManySuccessfulRollsMinimum(
            diceRollsNkD,
            difficultyLevel,
            successNumber,
          )}
        </p>
        <p>
          Number of successful rolls / total rolls:{" "}
          {(
            howManySuccessfulRollsMinimum(
              diceRollsNkD,
              difficultyLevel,
              successNumber,
            ) / diceRollsNkD.length
          ).toFixed(4)}
        </p>

        <h2>----------------------------------------------</h2>
        <p>
          ({diceNumber}d{defaultDiceType} - DIFFICULTY LEVEL: {difficultyLevel}{" "}
          - number of expected successes: {successNumber} and exactly that many)
          - rolls
          {diceNumber}d{defaultDiceType}:{" "}
          {howManySuccessfulRollsStrict(
            diceRollsNkD,
            difficultyLevel,
            successNumber,
          )}
        </p>
        <p>
          Number of successful rolls / total rolls:{" "}
          {(
            howManySuccessfulRollsStrict(
              diceRollsNkD,
              difficultyLevel,
              successNumber,
            ) / diceRollsNkD.length
          ).toFixed(4)}
        </p>
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>----------------------------------------------</h2>

        <DefaultButton
          handleClick={rollDice}
          text={`Click to roll ${diceNumber}d${defaultDiceType}
(difficulty level ${difficultyLevel},  
${successNumber} or more successes)`}
          className={`text-white  bg-black hover:bg-gray-900 font-medium rounded text-sm px-5 py-2.5  my-2  mr-2 w-36  `}
        />
      </div>
      <div style={{ marginTop: 10 }} className="text-center inline-block">
        {dicePoolRoll.length > 0 && (
          <>
            <span>
              {displayedDice.map((dice, idx) => (
                <span
                  key={idx}
                  className={`bg-black  text-white py-1 px-2 m-1 inline-block ${dice >= difficultyLevel ? "bg-green-700 text-white" : ""} `}
                >
                  {dice}
                </span>
              ))}
            </span>
          </>
        )}
      </div>
      <div>
        <p style={{ marginTop: 10 }}>
          Number of successful rolls in the last roll:{" "}
          {`${numberOfSuccessfulRolls(displayedDice, difficultyLevel)}`}
        </p>
        <p style={{ marginTop: 10 }}>
          Test status: {isTestSuccessful ? "PASSED" : "FAILED"}
        </p>
      </div>
    </div>
  );
}
