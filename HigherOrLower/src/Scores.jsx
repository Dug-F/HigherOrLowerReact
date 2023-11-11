import React from "react";

export default function Scores(props) {
  const cardTotals = props.stats.higher + props.stats.lower;
  const higherPercent = `${((props.stats.higher / cardTotals) * 100).toFixed(2)}%`;
  const lowerPercent = `${((props.stats.lower / cardTotals) * 100).toFixed(2)}%`;
  return (
    <section className="scores-container">
      <article className="scores">
        <p className="thumb-img">👍</p>
        <p className="higher score">{higherPercent}</p>
      </article>
      <article className="scores">
        <p className="thumb-img">👎</p>
        <p className="higher score">{lowerPercent}</p>
      </article>
    </section>
  );
}
