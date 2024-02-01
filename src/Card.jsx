import React from "react";

export default React.memo(function Card(props) {
  function handleClick(event) {
    if (props.inactive) return;
    const id = props.cardsRefData.id;
    const action = props.selected ? { type: "deselect", id: id } : { type: "select", id: id };
    props.cardClick(action);
  }

  const inactive = props.inactive ? "fade" : "";
  const selected = props.selected ? "highlight" : "";

  // console.log("rendering: ", props);

  return <img className={`card ${inactive} ${selected}`} src={props.cardsRefData.img} alt={props.cardsRefData.alt} onClick={handleClick} />;
});
