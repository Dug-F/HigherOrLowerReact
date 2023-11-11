import { useState } from "react";
import Cards from "./Cards";
import Scores from "./Scores";

const cardData = [];
const activeCards = {};
["spades", "hearts", "diamonds", "clubs"].forEach((suit, suitIndex) => {
  const suitArray = [];
  ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"].forEach((rank, rankIndex) => {
    const rankNumber = rankIndex + 2;
    suitArray.push({
      suit: suit,
      rank: rank,
      rankNumber: rankNumber,
      suitIndex: suitIndex,
      rankIndex: rankIndex,
      img: `/${rank}${suit[0]}.png`,
      alt: `${rank} of ${suit}`,
    });
    activeCards.hasOwnProperty(rankNumber) ? (activeCards[rankNumber] += 1) : (activeCards[rankNumber] = 1);
  });
  cardData.push(suitArray);
});

console.log(cardData);

function App() {
  const [cardCounts, setCardCounts] = useState(activeCards);
  const [stats, setStats] = useState({ higher: 0, lower: 0, equal: 0 });
  const [inactive, setInactive] = useState({});

  function cardClicked(rankNumber, suit, countChange) {
    console.log("Rank number: ", rankNumber);
    setCardCounts((prevCardCounts) => {
      return { ...prevCardCounts, [rankNumber]: prevCardCounts[rankNumber] + countChange };
    });
    setInactive(prevInactive => ({...prevInactive, [`${rankNumber}${suit}`]: true}));
    updateTotals(rankNumber);
  }

  function updateTotals(rankNumber) {
    const totals = { higher: 0, lower: 0, equal: 0 };

    // for each entry in the cardsCounts object, add the counts for the value to the appropriate totals object,
    // depending on whether the entry is higher, lower or equal to the passed rank number
    for (const [key, count] of Object.entries(cardCounts)) {
      if (key > rankNumber) {
        totals.higher += count;
      } else if (key < rankNumber) {
        totals.lower += count;
      } else {
        totals.equal += count;
      }
    }
    setStats(totals);
  }

  return (
    <main className="outer-container">
      <h1>Higher or Lower</h1>
      <Cards cardData={cardData} inactive={inactive} cardClicked={cardClicked} />
      <Scores stats={stats} />
    </main>
  );
}

export default App;
