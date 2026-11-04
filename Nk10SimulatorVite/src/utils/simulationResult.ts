// import React, { useEffect, useState } from 'react';

// const DicePoolDisplay = () => {
//     const [dicePoolRoll, setDicePoolRoll] = useState<number[]>([]);
//     const [displayedDice, setDisplayedDice] = useState<number[]>([]);
//     const [index, setIndex] = useState(0);

//     const rollDice = () => {
//         // Generowanie nowych liczb (przykładowo pięć losowych kostek od 1 do 6)
//         const newRoll = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
//         setDicePoolRoll(newRoll);
//         setDisplayedDice([]);
//         setIndex(0);
//     };

//     useEffect(() => {
//         if (index < dicePoolRoll.length) {
//             const timeoutId = setTimeout(() => {
//                 setDisplayedDice((prev) => [...prev, dicePoolRoll[index]]);
//                 setIndex(index + 1);
//             }, 1000); // Czas opóźnienia w milisekundach

//             return () => clearTimeout(timeoutId); // Czyszczenie timeoutu po odmontowaniu komponentu
//         }
//     }, [index, dicePoolRoll]);

//     return (
//         <div>
//             <h2>Wyrzuty kostek:</h2>
//             <ul>
//                 {displayedDice.map((dice, idx) => (
//                     <li key={idx}>{dice}</li>
//                 ))}
//             </ul>
//             <button onClick={rollDice}>Ponownie wylosuj kostki</button>
//         </div>
//     );
// };

// export default DicePoolDisplay;
