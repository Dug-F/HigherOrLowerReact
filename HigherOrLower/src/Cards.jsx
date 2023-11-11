import React from "react";
import Suits from "./Suits";

export default function Cards(props) {
  const suitsData = props.cardData.map((suit) => {
    return (
      <section key={suit[0].suit} className="suit-container">
        <Suits suitData={suit} inactive={props.inactive} cardClicked={props.cardClicked} />
      </section>
    );
  });

  return (
    <section className="cards-container">
        {suitsData}
    </section>
  );
}
