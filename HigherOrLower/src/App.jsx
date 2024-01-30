import { useState, useEffect, useReducer } from "react";
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
      id: cardId,
    });
    cards[cardId] = {
      id: cardId,
      suit: suit,
      rank: rank,
      rankNumber: rankNumber,
      img: `/${rank}${suit[0]}.png`,
      alt: `${rank} of ${suit}`,
      selected: false,
      inactive: false,
    };
    rankNumber in activeCards ? (activeCards[rankNumber] += 1) : (activeCards[rankNumber] = 1);
  });
  cardData.push(suitArray);
});

// styling attributes for cards
const selected = {selected: true, inactive: false};
const inactive = {selected: false, inactive: true};
const normal = {selected: false, inactive: false};

function cardClick(state, action) {
  // console.log("state on entering cardClick: ", state);
  let updatedCards = { ...state.cards };
  let updatedCardCounts = { ...state.cardCounts };
  let updatedSelectedIds = [...state.selectedIds];
  let cardsToUpdate = [];
  let prevSelectedId;

  switch (action.type) {
    case "select":
      prevSelectedId = updatedSelectedIds.at(-1);
      // set styling props for selected and previously selected (if any) cards
      cardsToUpdate.push({ id: action.id, status: selected });
      if (prevSelectedId) cardsToUpdate.push({ id: prevSelectedId, status: inactive });
      updatedCards = updateCards(updatedCards, cardsToUpdate);
      // decrement active card count for selected card
      updatedCardCounts = updateCardCounts(updatedCardCounts, updatedCards[action.id].rankNumber, -1);
      // add selected card to selected cards sequence array
      updatedSelectedIds.push(action.id);
      break;
    case "deselect":
      // previously selected card was the one before the currently selected card in the selected card sequence
      prevSelectedId = updatedSelectedIds.at(-2);
      // set styling props for selected and previously selected (if any) cards
      cardsToUpdate.push({ id: action.id, status: normal });
      if (prevSelectedId) cardsToUpdate.push({ id: prevSelectedId, status: selected });
      updatedCards = updateCards(updatedCards, cardsToUpdate);
      // increment active card count for selected card
      updatedCardCounts = updateCardCounts(updatedCardCounts, updatedCards[action.id].rankNumber, 1);
      // remove selected card from selected cards sequence array
      updatedSelectedIds.pop();
      break;
    default:
      return state;
  }

  return { ...state, cards: updatedCards, cardCounts: updatedCardCounts, selectedIds: updatedSelectedIds };
}

/**
 * Update selected and inactive props in updatedCards state for cards passed in cardsToUpdate
 * @param {{}} updatedCards - copy of state cards object
 * @param {[{id: int, status: {selected: boolean, inactive: boolean}}]} cardsToUpdate - array of object defining ids of cards to update and the props values
 * @returns updated copy of state cards object
 */
function updateCards(updatedCards, cardsToUpdate) {
  for (let card of cardsToUpdate) {
    updatedCards[card.id].selected = card.status.selected;
    updatedCards[card.id].inactive = card.status.inactive;
  }
  return updatedCards;
}
/**
 * update active card totals in the cardCounts state with passed value
 * @param {{}} cardCounts - copy of state cardCounts object
 * @param {int} rankNumber rank number of selected card
 * @param {int} adjustmentValue -1 when card is selected, 1 when card is deselected
 * @returns 
 */
function updateCardCounts(cardCounts, rankNumber, adjustmentValue) {
  // update card totals in the total counts with passed value
  cardCounts[rankNumber] += adjustmentValue;
  return cardCounts;
}

export default function App() {
  const [stats, setStats] = useState({});

  const [state, dispatcher] = useReducer(cardClick, {
    cards: cards,
    cardCounts: activeCards,
    selectedIds: [],
  });

  // update the totals on what the probability stats are calculated
  function updateTotals() {
    // set stats to null to show no proabilities if no card is selected
    if (state.selectedIds.length == 0) {
      return setStats(null);
    }

    const totals = { higher: 0, lower: 0, equal: 0 };

    // for each entry in the cardsCounts object, add the counts for the value to the appropriate totals object,
    // depending on whether the entry is higher, lower or equal to the last selected card rank number
    const rankNumber = state.cards[state.selectedIds.at(-1)].rankNumber;
    for (const [key, count] of Object.entries(state.cardCounts)) {
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
    const showStats = state.selectedIds.length > 0 && state.selectedIds.length < 52;
    updateTotals(showStats ? state.selectedIds.at(-1).rankNumber : null);
  }, [state.selectedIds]);

  // compile an array containing a Card component for each card in the card array
  function cardsInSuit(suit) {
    return suit.map((card) => {
      return <Card key={`${card.id}`} {...state.cards[card.id]} cardClick={dispatcher} />;
    });
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
