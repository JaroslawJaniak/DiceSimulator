import { useState } from "react";
import { binomialCoefficient } from "../utils/binomialCoefficient";
import { simulateDiceRolls } from "../utils/simulateDiceRolls";
import { howManySuccessfulRollsMinimum } from "../utils/howManySuccessfulRollsMinimum";
import { howManySuccessfulRollsStrict } from "../utils/howManySuccessfulRollsStrict";

type DifficultyButtonProps = {
  handleClick: () => void;
  text: string;
  className: string;
};

function DifficultyButton({
  handleClick,
  text,
  className,
}: DifficultyButtonProps) {
  return (
    <button type="button" onClick={handleClick} className={className}>
      {text}
    </button>
  );
}

const MIN = 1;
const MAX = 10;
const START = 5;

export default function Ndice10Simulator() {
  // Widoczne jest zawsze 10 pól; zapełnione na starcie 5.
  const [filled, setFilled] = useState(() =>
    // Używamy funkcji inicjalizującej, aby uniknąć ponownego obliczania przy każdym renderowaniu
    Array.from({ length: MAX }, (_, i) => i < START),
  );

  const [difficultyLevel, setDifficultyLevel] = useState(6);
  const [successNumber, setSuccessNumber] = useState(3);

  function updateDifficultyLevel(newDifficultyLevel: number) {
    setDifficultyLevel(Math.max(1, Math.min(10, newDifficultyLevel)));
  }

  function updateSuccessNumber(newSuccessNumber: number) {
    setSuccessNumber(Math.max(1, Math.min(10, newSuccessNumber)));
  }

  const diceNumber = filled.filter(Boolean).length;
  const diceRollsNk10 = simulateDiceRolls(100000, diceNumber, 1, 10); // Symulacja 10000 rzutów pulą diceNumber kości k10

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

  // const handleClick = (index: number) => {
  //   setFilled((prev) => {
  //     const next = [...prev]; // Tworzymy kopię tablicy filled, aby nie modyfikować stanu bezpośrednio

  //     if (next[index]) {
  //       // Pole pełne -> opróżnij (ale nie schodź poniżej minimum)
  //       // Pole pełne -> opróżnij (ale nie schodź poniżej minimum)
  //       const firstEmpty = next.indexOf(false); // Znajdź pierwsze puste pole
  //       if (diceNumber <= MIN ) return prev;
  //       next[firstEmpty-1] = false;
  //     } else {
  //       // Pole puste -> zapełnij kolejne puste pole po kolei (od lewej),
  //       // niezależnie od tego, które puste pole kliknięto
  //       const firstEmpty = next.indexOf(false);

  //       if (firstEmpty === -1) return prev;
  //       if (diceNumber >= MAX) return prev;
  //       next[firstEmpty] = true; // Zapełniamy pierwsze puste pole
  //     }
  //     return next;
  //   });
  // };
  // const handleClick = (index: number) => {
  //   setFilled((prev) => {
  //     const next = [...prev];
  //     if (next[index]) {
  //       // Pole pełne -> opróżnij (ale nie schodź poniżej minimum)
  //       if (diceNumber <= MIN) return prev;
  //       next[index] = false;
  //     } else {
  //       // Pole puste -> zapełnij (maksimum wynika z liczby pól)
  //       next[index] = true;
  //     }
  //     return next;
  //   });
  // };

  function probabilityOfStrictNumberSucessForNumberDice(
    difficultyLevel: number,
    diceNumber: number,
    successNumber: number,
  ): number {
    // Możesz dostosować tę funkcję według własnych potrzeb.
    return (
      (binomialCoefficient(diceNumber, successNumber) *
        Math.pow(11 - difficultyLevel, successNumber) *
        Math.pow(difficultyLevel - 1, diceNumber - successNumber)) /
      Math.pow(10, diceNumber)
    );
  }

  function probabilityOfMinimumNumberSuccessForNumberDice(
    difficultyLevel: number,
    diceNumber: number,
    successNumber: number,
  ): number {
    // Możesz dostosować tę funkcję według własnych potrzeb.
    let sum = 0;
    for (let k = successNumber; k <= diceNumber; k++) {
      sum += probabilityOfStrictNumberSucessForNumberDice(
        difficultyLevel,
        diceNumber,
        k,
      );
    }

    return sum;
  }

  return (
    <main className="my-6 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-800 shadow-sm sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* OPIS POZIOMÓW TRUDNOŚCI */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              d10 challenge guide
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Difficulty reference
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Suggested difficulty levels for a pool of ten-sided dice.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Very easy
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">2–3</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Minimum successes: 3
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Easy
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">4–5</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Minimum successes: 3
              </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Moderate
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">6</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Minimum successes: 3
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-700">
                Hard
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">7–8</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Minimum successes: 3
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 sm:col-span-2 lg:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                Very hard
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">9–10</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Minimum successes: 3
              </p>
            </div>
          </div>
        </section>

        {/* PARAMETRY TESTU */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-600">
                Number of successes
              </span>
              <span className="rounded-lg bg-emerald-100 px-3 py-1 text-lg font-bold tabular-nums text-emerald-800">
                {successNumber}
              </span>
            </div>
            <div className="flex gap-2">
              <DifficultyButton
                handleClick={() => updateSuccessNumber(successNumber - 1)}
                text="-1"
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <DifficultyButton
                handleClick={() => updateSuccessNumber(successNumber + 1)}
                text="+1"
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-600">
                Difficulty level
              </span>
              <span className="rounded-lg bg-amber-100 px-3 py-1 text-lg font-bold tabular-nums text-amber-800">
                {difficultyLevel}
              </span>
            </div>
            <div className="flex gap-2">
              <DifficultyButton
                handleClick={() => updateDifficultyLevel(difficultyLevel - 1)}
                text="-1"
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <DifficultyButton
                handleClick={() => updateDifficultyLevel(difficultyLevel + 1)}
                text="+1"
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
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
              <span className="text-xl font-medium text-slate-400">d{MAX}</span>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Click an empty field to add a die. Click a filled field to remove
              the last die from the pool.
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
                  aria-label={`Field ${i + 1}: ${isFilled ? "filled" : "empty"}`}
                  title={isLast ? "At least one field must be filled" : undefined}
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
                ).toFixed(4)}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {diceNumber}d{MAX} · difficulty {difficultyLevel}
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
                ).toFixed(4)}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {diceNumber}d{MAX} · difficulty {difficultyLevel}
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
              100,000 simulated rolls
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Statistical results for the current dice pool and difficulty.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">
                At least {successNumber} successes
              </p>
              <p className="mt-3 text-2xl font-bold tabular-nums text-slate-900">
                {howManySuccessfulRollsMinimum(
                  diceRollsNk10,
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
                    diceRollsNk10,
                    difficultyLevel,
                    successNumber,
                  ) / diceRollsNk10.length
                ).toFixed(4)}
              </p>
            </article>

            <article className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">
                Exactly {successNumber} successes
              </p>
              <p className="mt-3 text-2xl font-bold tabular-nums text-slate-900">
                {howManySuccessfulRollsStrict(
                  diceRollsNk10,
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
                    diceRollsNk10,
                    difficultyLevel,
                    successNumber,
                  ) / diceRollsNk10.length
                ).toFixed(4)}
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
