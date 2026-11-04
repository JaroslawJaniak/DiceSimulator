export function isSuccessfulRollMinimum(
    rolls: number[],
    targetValue: number,
    numberOfSuccesses: number,
  ): boolean {
    // Funkcja sprawdzająca, czy rzut pulą kości jest udany
    const successfulRolls = rolls.filter((roll) => roll >= targetValue); // Filtrujemy rzuty, które są większe lub równe wartości docelowej, tworząc nową tablicę successfulRolls
    return successfulRolls.length >= numberOfSuccesses; // Zwracamy true, jeśli istnieje przynajmniej jeden udany rzut, w przeciwnym razie false ew ustalamy liczbe udanych rzutów, które muszą być większe lub równe wartości docelowej
  }

  