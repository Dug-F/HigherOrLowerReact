import React from "react";

export default React.memo(function Card(props) {
  function handleClick(event) {
    if (props.inactive) return;
    const action = props.selected ? { type: "deselect", id: props.id } : { type: "select", id: props.id };
    props.cardClick(action);
  }

  const inactive = props.inactive ? "fade" : "";
  const selected = props.selected ? "highlight" : "";

  // console.log("rendering: ", props);

  return <img className={`card ${inactive} ${selected}`} src={props.img} alt={props.alt} onClick={handleClick} />;
});
