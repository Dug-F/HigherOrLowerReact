import React from "react";

export default function Card(props) {
  function handleClick(event) {
    if (props.cardStatus.inactive) return;
    if (!props.cardStatus.selected) {
      props.selectCard(props.cardData.rank, props.cardData.rankNumber, props.cardData.suit);
      return
    }
    props.deselectCard(props.cardData.rank, props.cardData.rankNumber, props.cardData.suit);
    
  }

  const inactive = props.cardStatus.inactive ? "fade" : "";
  const selected = props.cardStatus.selected ? "highlight" : "";

  return <img className={`card ${inactive} ${selected}`}
              src={props.cardData.img} 
              alt={props.cardData.alt} 
              onClick={handleClick} />;
}
