import React from "react";

export default function Card(props) {
  function handleClick(event) {
    props.cardClicked(props.cardData.rankNumber, props.cardData.suit, -1);
  }

  // console.log("card ", props.cardData.rank, props.cardData.suit, "rendered")

  return <img className={`card ${props.inactive ? "fade" : ""}` }
              src={props.cardData.img} 
              alt={props.cardData.alt} 
              onClick={handleClick} />;
}
