import React from "react";
import Card from "./Card";

export default function Cards(props) {
  const cardsData = props.suitData.map((card) => {
    return <Card key={`${card.rank}${card.suit}`} 
                 cardData={card} 
                 inactive={props.inactive.hasOwnProperty(`${card.rank}${card.suit}`)}
                 cardClicked={props.cardClicked} />;
  });

  return (
    <>
        {cardsData}
    </>
  );
}
