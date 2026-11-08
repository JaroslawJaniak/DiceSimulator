export function isSuccessfulRollMinimum(
  rolls: number[],
  difficultyLevel: number,
  numberOfSuccesses: number,
): boolean {
  // Funkcja sprawdzająca, czy rzut pulą kości jest udany
  const successfulRolls = rolls.filter((roll) => roll >= difficultyLevel); // Filtrujemy rzuty, które są większe lub równe poziomowi trudności, tworząc nową tablicę successfulRolls
  return successfulRolls.length >= numberOfSuccesses; // Zwracamy true, jeśli istnieje przynajmniej jeden udany rzut, w przeciwnym razie false
}

export function numberOfSuccessfulRolls(
  rolls: number[],
  difficultyLevel: number,
): number {
  // Funkcja zwracająca liczbę udanych rzutów
  const successfulRolls = rolls.filter((roll) => roll >= difficultyLevel); // Filtrujemy rzuty, które są większe lub równe poziomowi trudności, tworząc nową tablicę successfulRolls
  return successfulRolls.length; // Zwracamy liczbę udanych rzutów
}
