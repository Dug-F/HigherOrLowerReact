import React from "react";

export default function Card(props) {
  function handleClick(event) {
    if (props.cardStatus.inactive) return;
    if (!props.cardStatus.selected) {
      props.selectCard(props.cardData);
      return
    }
    props.deselectCard(props.cardData);
    
  }

  const inactive = props.cardData.inactive ? "fade" : "";
  const selected = props.cardData.selected ? "highlight" : "";
  console.log("card rendered, props.cardData: ", props.cardData);

  return <img className={`card ${inactive} ${selected}`}
              src={props.cardData.img} 
              alt={props.cardData.alt} 
              onClick={handleClick} />;
}
