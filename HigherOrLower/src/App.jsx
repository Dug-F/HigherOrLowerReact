import { useState, useEffect } from "react";
import Scores from "./Scores";
import Card from "./Card";

const cardData = [];
const activeCards = {};
const cards = {};
["spades", "hearts", "diamonds", "clubs"].forEach((suit) => {
  const suitArray = [];
  ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"].forEach((rank, rankIndex) => {
    const rankNumber = rankIndex + 2;
    const cardId = `${rank}${suit[0]}`;
    suitArray.push({
      id: cardId
    });
    cards[cardId] = {
        suit: suit,
        rank: rank,
        rankNumber: rankNumber,
        img: `/${rank}${suit[0]}.png`,
        alt: `${rank} of ${suit}`,
        selected: false,
        inactive: false
      };
    activeCards.hasOwnProperty(rankNumber) ? (activeCards[rankNumber] += 1) : (activeCards[rankNumber] = 1);
  });
  cardData.push(suitArray);
});

export default function App() {
  // used to track counts of each rankNumber of active cards
  const [cardCounts, setCardCounts] = useState(activeCards);
  // re-calculated when new card is selected/deselected and contains higher/lower/equal count for selected card
  const [stats, setStats] = useState({});
  // keeps the history of selected cards (last entry is removed when a card is de-selected)
  const [cardsSelected, setCardsSelected] = useState([]);
  // marker to control when the updateTotals useEffect function runs
  const [runUpdateStats, setRunUpdateStats] = useState(true);

  // unselect the selected card and restore the previously selected card as the selected card
  function deselectCard(selectedCard) {
    // add selected card back to the total counts
    setCardCounts((prevCardCounts) => {
      return { ...prevCardCounts, [selectedCard.rankNumber]: prevCardCounts[selectedCard.rankNumber] + 1 };
    });

    // get the previously selected card
    const prevSelectedCard = cardsSelected.length > 1 ? cardsSelected[cardsSelected.length - 2] : null;

    // update the status of the selected cards and (if any) the previously selected card
    setCardStatus(prevCardStatus => {
      const newCardsStatus = { ...prevCardStatus, [selectedCard.id]: { selected: false, inactive: false } };
      // set status to re-select and re-activate the previously selected card, if any
      if (prevSelectedCard) {
        newCardsStatus[prevSelectedCard.id] = { selected: true, inactive: false };
      }
      return newCardsStatus;
    });

    // remove the selected card from the cards selected list
    setCardsSelected((prevCardsSelected) => prevCardsSelected.slice(0, -1));

    // set the run update stats marker - stats have to run as a useEffect as the state updates in this function are asynchronous
    setRunUpdateStats(true);
  }

  // make the card clicked on the selected card
  function selectCard(selectedCard) {
    // subtract selected card from the total counts
    setCardCounts((prevCardCounts) => {
      return { ...prevCardCounts, [selectedCard.rankNumber]: prevCardCounts[selectedCard.rankNumber] - 1 };
    });

    // update the status of the selected cards and (if any) the previously selected card
    setCardStatus((prevCardStatus) => {
      const newCardsStatus = { ...prevCardStatus, [selectedCard.id]: { selected: true, inactive: false } };
      // set status to deselect and deactivate the previously selected card, if any
      if (cardsSelected.length > 0) {
        const lastSelected = cardsSelected[cardsSelected.length - 1];
        newCardsStatus[lastSelected.id] = { selected: false, inactive: true };
      }
      return newCardsStatus;
    });

    // add the selected card to the cards selected list
    setCardsSelected((prevCardsSelected) => [...prevCardsSelected, selectedCard]);

    // set the run update stats marker - stats have to run as a useEffect as the state updates in this function are asynchronous
    setRunUpdateStats(true);
  }

  // update the totals on what the probability stats are calculated
  function updateTotals(rankNumber) {
    // set stats to null to show no proabilities if no card is selected
    if (rankNumber === null) {
      return setStats(null);
    }

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

  useEffect(() => {
    // update stats - this has to run as a useEffect as the state updates in the selectCard and deselectCard functions are asynchronous
    setRunUpdateStats(false);
    const showStats = cardsSelected.length > 0 && cardsSelected.length < 52;
    updateTotals(showStats ? cardsSelected[cardsSelected.length - 1].rankNumber : null);
  }, [runUpdateStats]);

  // compile an array containing a Card component for each card in the card array
  function cardsInSuit(suit) {
    return suit.map(card => {
      return <Card key={`${card.id}`} 
                   cardData={cards[card.id]} 
                   selectCard={selectCard} 
                   deselectCard={deselectCard} />;      
    })
  }

  // compose cards array with outer cards-container and inner suit-container (for grid/flexbox styling)
  const cardsArray = (
    <div className="cards-container">
      {cardData.map((suit) => {
        return (
          <div key={suit[0].id} className="suit-container">
            {cardsInSuit(suit)};
          </div>
        );
      })}
    </div>
  );

  return (
    <main className="outer-container">
      <h1>Higher or Lower</h1>
      {cardsArray}
      <Scores stats={stats} />
    </main>
  );
}
