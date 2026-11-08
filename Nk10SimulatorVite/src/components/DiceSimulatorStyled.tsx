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
    <main className="my-6 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-800 shadow-sm sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* PARAMETRY TESTU */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Dice simulator
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Test parameters
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Configure the success threshold, difficulty and dice type.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-600">
                  Number of successes
                </span>
                <span className="rounded-lg bg-emerald-100 px-3 py-1 text-lg font-bold tabular-nums text-emerald-800">
                  {successNumber}
                </span>
              </div>
              <div className="flex gap-2">
                <DefaultButton
                  handleClick={() => updateSuccessNumber(successNumber - 1)}
                  text="-1"
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <DefaultButton
                  handleClick={() => updateSuccessNumber(successNumber + 1)}
                  text="+1"
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-600">
                  Difficulty level
                </span>
                <span className="rounded-lg bg-amber-100 px-3 py-1 text-lg font-bold tabular-nums text-amber-800">
                  {difficultyLevel}
                </span>
              </div>
              <div className="flex gap-2">
                <DefaultButton
                  handleClick={() =>
                    updateDifficultyLevel(difficultyLevel - 1, defaultDiceType)
                  }
                  text="-1"
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <DefaultButton
                  handleClick={() =>
                    updateDifficultyLevel(difficultyLevel + 1, defaultDiceType)
                  }
                  text="+1"
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-5 ">
            <p className="mb-3 text-sm font-medium text-slate-600">
              Choose dice type
            </p>
            <div className="flex flex-wrap gap-2 mx-auto max-w-2xl justify-center">
              {diceTypesButton.map((_isActive, index) => {
                return (
                  <DefaultButton
                    key={diceTypes[index]}
                    handleClick={() =>
                      updateDefaultDiceType(diceTypes[index], index)
                    }
                    text={`d${diceTypes[index]}`}
                    className={`min-w-16 rounded-lg border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      activeDiceTypeButtonIndex === index
                        ? "border-emerald-700 bg-emerald-700 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* PULA KOŚCI */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col items-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Your dice pool
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight text-slate-900 tabular-nums">
                {diceNumber}
              </span>
              <span className="text-xl font-medium text-slate-400">
                d{defaultDiceType}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Click an empty field to add a die. Click the last filled field to
              remove it. Your pool can contain between 1 and 10 dice.
            </p>
          </div>

          <div className="mx-auto mt-6 grid w-full max-w-2xl grid-cols-5 gap-3 sm:grid-cols-10 sm:gap-4">
            {filled.map((isFilled, i) => {
              const isLast = isFilled && diceNumber <= MIN;
              return (
                <button
                  key={i}
                  type="button"
                  className={`aspect-square rounded-full border text-sm font-semibold transition duration-150 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                    isFilled
                      ? "border-emerald-700 bg-emerald-700 text-white shadow-sm hover:bg-emerald-800"
                      : "border-slate-300 bg-slate-50 text-slate-400 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
                  } ${
                    isLast
                      ? "cursor-not-allowed opacity-70"
                      : "active:scale-95"
                  }`}
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
          <div className="mt-4 flex justify-center gap-5 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-700" />
              Selected
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full border border-slate-300 bg-slate-50" />
              Available
            </span>
          </div>
        </section>

        {/* PRAWDOPODOBIEŃSTWO */}
        <section className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Theoretical probability
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
              Probability calculations
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                At least {successNumber} successes
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-emerald-700">
                {probabilityOfMinimumNumberSuccessForNumberDice(
                  difficultyLevel,
                  diceNumber,
                  successNumber,
                  defaultDiceType,
                ).toFixed(4)}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                {diceNumber}d{defaultDiceType} · difficulty {difficultyLevel}
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Exactly {successNumber} successes
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-slate-800">
                {probabilityOfStrictNumberSucessForNumberDice(
                  difficultyLevel,
                  diceNumber,
                  successNumber,
                  defaultDiceType,
                ).toFixed(4)}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                {diceNumber}d{defaultDiceType} · difficulty {difficultyLevel}
              </p>
            </article>
          </div>
        </section>

        {/* SYMULACJA STATYSTYCZNA */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Monte Carlo simulation
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
              110,000 simulated rolls
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Results for the current dice pool and difficulty settings.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">
                At least {successNumber} successes
              </p>
              <p className="mt-3 text-2xl font-bold tabular-nums text-slate-900">
                {howManySuccessfulRollsMinimum(
                  diceRollsNkD,
                  difficultyLevel,
                  successNumber,
                )}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Successful rolls / total rolls
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-emerald-700">
                {(
                  howManySuccessfulRollsMinimum(
                    diceRollsNkD,
                    difficultyLevel,
                    successNumber,
                  ) / diceRollsNkD.length
                ).toFixed(4)}
              </p>
            </article>

            <article className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">
                Exactly {successNumber} successes
              </p>
              <p className="mt-3 text-2xl font-bold tabular-nums text-slate-900">
                {howManySuccessfulRollsStrict(
                  diceRollsNkD,
                  difficultyLevel,
                  successNumber,
                )}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Successful rolls / total rolls
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-emerald-700">
                {(
                  howManySuccessfulRollsStrict(
                    diceRollsNkD,
                    difficultyLevel,
                    successNumber,
                  ) / diceRollsNkD.length
                ).toFixed(4)}
              </p>
            </article>
          </div>
        </section>

        {/* RZUT KOŚĆMI */}
        <section className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm sm:p-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Roll the dice
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
              {diceNumber}d{defaultDiceType}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Difficulty {difficultyLevel} · {successNumber} or more successes
            </p>

            <div className="mt-5">
              <DefaultButton
                handleClick={rollDice}
                text={`Roll ${diceNumber}d${defaultDiceType}`}
                className="rounded-xl bg-emerald-500 px-7 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-300/30 active:scale-[0.98]"
              />
            </div>
          </div>

          <div className="mt-6 min-h-16 rounded-xl border border-slate-700 bg-slate-800/70 p-4">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-slate-400">
              Roll results
            </p>
            <div className="flex min-h-8 flex-wrap items-center justify-center gap-2">
              {dicePoolRoll.length > 0 ? (
                displayedDice.map((dice, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-base font-bold tabular-nums shadow-sm ${
                      dice >= difficultyLevel
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-700 text-slate-100"
                    }`}
                  >
                    {dice}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">
                  Your dice results will appear here.
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Successful dice
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-white">
                {`${numberOfSuccessfulRolls(displayedDice, difficultyLevel)}`}
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Test status
              </p>
              <p
                className={`mt-1 text-2xl font-extrabold tracking-wide ${
                  isTestSuccessful ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {isTestSuccessful ? "PASSED" : "FAILED"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
