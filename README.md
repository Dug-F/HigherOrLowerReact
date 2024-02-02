# Higher Or Lower Project<

## Contents
1. [Problem](#problem)
2. [Solution](#solution)
3. [How To Use The App](#how-to-use-the-app)
4. [What I Learned](#what-i-learned)
5. [Tech Stack](#tech-stack)
6. [How To Run Locally](#how-to-run-locally)
7. [Personal Notes On Solving How To Re-render Only Specific Cards When Clicked](#personal-notes-on-solving-how-to-re-render-only-specific-cards-when-clicked)
	- [Attempt 1: Use useMemo](#attempt-1-use-usememo)


## Problem

At the School of Code, there are energiser activities which typically take place mid-afternoon, at the poinst where energy levels may be starting to drop.

One of the most popular energisers is Higher or Lower.  The instructor has a deck of cards and turns over the top card.  Bootcampers then need to guess individually whether the next card will be higher or lower.  If they guess wrong, they are eliminated.  If the next card draw has the same face value, no one is eliminated and another card is drawn.

This app was created as a useful add-on to the gameplay.  It is to help bootcampers be aware of the proabilities of the next card being higher or lower than the current exposed card so as to inform their guess.

## Solution

[Deployed here](https://higher-or-lower-react.onrender.com/)

<h3>Watch a demo video</h3>

<a href="https://youtu.be/3vNU_khFKkU" title="Watch the video">
    <img src="/public/HigherOrLowerDemoVideo.png" alt="Watch the video" width="500"/>
</a>

<br>

<br>

The app was originally written in vanilla javascript but was translated to React as a project to reinforce the React learning that took place on the course.  So the project served both as a learning project for React but also as a case study in how to translate an existing javascript project to React.

The first iteration implemented all the required functionality of the original javascript version, plus some stretch goals - the most significant being the ability to 'deselect' cards to go backwards through the cards that had previously been selected.

However, implementation approach using useState and props flowed down to the child components meant that all 52 cards were being re-rendered when a single card was clicked on.  Whilst the performance was not too badly affected, I was unsatisfied and wanted to find a solution which had more control over the re-renders of the cards.

I therefore created a second iteration of the app which re-renders only the card clicked on and the previously selected card (to disable it).  This took some figuring out, so I have included my personal notes on how this problem was solved at the end of this README in case anyone is interested.

You can find a link to the deployed site above or at the right-side of this page.

## How To Use The App

When a card is drawn by the game leader, click on the corresponding card shown in the app.  The card you have selected will become outlined in red.  If another card was previously selected, it will be deactivated as effectively removed from the game.  At the bottom of the screen, the probabilities of the next card being either higher or lower than the current card are shown.  Cards of the same face value are not included in the calculation, since if they are drawn then no players are eliminated and another card will be draw.

If you click on a card in error, you can just click on it again and it will be deselected and the game will return to its state prior to you first clicking on the card.  You can follow this process back through as many cards in the sequence they were selected as you wish.

Strategy hint: it is not necessarily the best strategy to always go for the most likely outcome, since most other players will be doing the same.  I have found it best to balance the probability of the outcome with where the majority of other players are putting their guesses.  This may give you a higher chance of being eliminated, but it potentially gives you a higher probability of winning if you are not eliminated.  Of course if everyone uses this strategy it is less effective ...

## What I Learned

The project was a rich learning experience.

I was my first significant project using React and I therefore gained a lot of valuable practical experience in how to 'think React'.

React considerably simplified the logic that had previously been implemented in the javascript version and made it more modular.

One of the most challenging aspects was that I wanted to have a responsive app that showed 4 rows of 13 cards by suit on wider screens but 4 columns of 13 cards by suit on narrow screens.  I had solved this problem in the javascript version by hard-coding the cards in the html with the associated CSS.  React made it easier to implement this functionality in a more automated way but it required some thinking as how to best implement it.

The biggest learning though was on the second iteration of the app, where I wanted to minimise re-rendering the cards when a single card was clicked on.  This required a fairly deep dive into React hooks and how props are flowed down to child objects to solve.  I gained a lot of insight into hooks that were new to me - useMemo, useRef, useCallback and useReducer.  I now have a much greater understanding of how these all work both in isolation and in combination.

## Tech Stack

React, Javascript, Vite, HTML, CSS

## How To Run Locally

Clone the project

```bash
  git clone https://github.com/Dug-F/HigherOrLowerReact.git
```

Go to the project directory

```bash
  cd HigherOrLowerReact
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

Click on the link shown to invoke the app in your browser

<hr>

[Back to top](#higher-or-lower-project)

## Personal Notes On Solving How To Re-render Only Specific Cards When Clicked

## Problem Definition

- In the Higher or Lower app, there are 52 cards, which are child components of the App component
	- each card receives a set of props specific to that card - image reference, face value, suit, etc.
	- the props for each card include 2 state props: selected and inactive
		- these are used to set the visible state for the card
	- the props also include 2 functions - select card and deselect card
		- these invoke the function in the parent component to change the state and update other state variables (e.g. active card counts) that are used to calculate the probabilities
- clicking on a card selects it
	- when selected, the border becomes red
	- it also changes the state on the previous card selected
		- the red outline is removed
		- the card is greyed out
- **the problem is that clicking on a card invokes a re-render of the parent, which in turn is re-rendering all 52 cards**

## What is causing the problem

- In the initial implementation, the default React behaviour is that when a parent component re-renders, all child components also re-render

## Attempts to fix the problem

### Attempt 1: Use useMemo

#### The approach

- useMemo is used in the child component to memoize the props passed to it
	- if the props have not changed since the last render, the child is not re-rendered

	```js
	export default React.memo(function Card(props) {
	  // child logic
	}
	```
#### Problem with the approach

- there are 2 problems with this approach
	1. the props comparison is shallow
		- so if the props passed down are an object, the comparison is of the object reference (not the key/value pair values) compared to the last render.
		- as part of the state change, the props object is rebuilt (in the normal React manner) and therefore has a different reference
		- therefore if the props passed down is an object, the child will always re-render
	2. the state update functions
		- the state update functions are built within the parent component (since they need to access the state variables)
		- therefore when the parent component is re-rendered the functions are rebuilt and have different references compared to the last render
		- since the props comparison in useMemo is shallow, the function references are compared to the last render and will always be different, forcing the child to re-render

### Attempt 2: Pass Individual Props

#### The approach

- pass the reference and state props as individual props instead of as an object
	- rather than this:
		```js
		function cardsInSuit(suit) {
		
			return suit.map((card) => {
			
			  return <Card key={`${card.id}`} cardData={cards[card.id]} selectCard={selectCard} deselectCard={deselectCard} />;
			});	
		}
		```
	- do this:
		 ```js
		function cardsInSuit(suit) {
		
			return suit.map((card) => {
			
			  return <Card key={`${card.id}`} {...cards[card.id]} selectCard={selectCard} deselectCard={deselectCard} />;
			});
		}
		```
	- and make the corresponding changes in the child object to receive them

#### Problem with the approach

- this approach works as long as the state update functions are not passed down as props
- it is therefore a necessary step in solving the problem, but not sufficient
- it does not solve the problem when state update functions are passed down

### Attempt 3: Use useCallback

#### The approach

- useCallback allows a function (i.e. the state update function) to be wrapped in a callback
- the key point is that the useCallback is memoized, so provides the same reference even when the containing component is re-rendered
	```js
	  const selectCard = useCallback((id) => {
	    // function logic
	  }, [<dependencies>])
	```

#### Problem with this approach

- this does work to a point
- however, the problem comes when the callback wants to access state variables
	- if the dependencies are left empty, the callback is never rebuilt and retains the same reference, meaning that the child objects that it is passed to are not forced to re-render (if they are using useMemo)
		- however, the callback function can only access state objects as they were when the function was first built - it is essentially a closure.
			- the callback function can set/update state variables, but it cannot do so with a knowledge of their current state
	- if the state variables to be changed are specified in the dependencies
		- the callback function can now access the current state of the dependency
		- but the callback function is rebuilt and therefore has a new reference
			- this forces the child components to re-render even if they are using useMemo

### Attempt 4: Use useReducer

#### The approach

- useReducer is an alternative to useState for managing changes to state variables.
	- it is especially useful where there is complex state management required
- useReducer takes in:
	- a reducer function which is used as a callback when the reducer is invoked, and
	- an initial state variable
- it returns:
	- a dispatcher function,  and 
	- a state variable
- the dispatcher function is used to invoke the reducer function.  It has 2 key properties that make it suitable for trying to solve the re-render problem
	- the dispatcher function is guaranteed to always have the same reference, even after re-renders
	- it can be passed down as a prop
- so the approach is to use useReducer with a reducer function that updates the card and tracking props and pass down the dispatcher to the child components so that they can invoke the reducer when a card is clicked.

#### How it is implemented

- implementation of useReducer is a bit more involved that useState
- firstly, create a reducer function outside of any components:

	```js
	function cardClick(state, action) {
	  let updatedCards = { ...state.cards };
	  let updatedCardCounts = { ...state.cardCounts };
	  let updatedSelectedIds = [...state.selectedIds];
	  
	  switch (action.type) {
	    case "select":
		  // select logic
	      break;
	    case "deselect":
		  // deselect logic
	      break;
	
	    default:
	      return state;
	 }
	 return { cards: updatedCards, 
	          cardCounts: updatedCardCounts, 
	          selectedIds: updatedSelectedIds }; 
	}
	```
	- **it is important to return a copy of the state, not the current state itself.**
		- React uses the state reference to determine if the state has changed, so you need to copy it to generate a new reference and trigger a re-render of the parent component
	- **it is also important to make sure that the reducer function has access to all the state variables it needs**
		- an easy way to do this is to create a wrapper for all state variables and pass it to the useReducer function so that it can access all state variables
- next, in the parent component, use the useReducer hook to create the state variable and the dispatcher function
	```js
	  const [state, dispatcher] = useReducer(cardClick, {
	    cards: cards,
	    cardCounts: activeCards,
	    selectedIds: [],
	  });
	```
- next, pass the dispatcher down as a prop to the child components
	```js
	  function cardsInSuit(suit) {
	    return suit.map((card) => {
	      return <Card key={`${card.id}`} 
	               {...state.cards[card.id]} cardClick={dispatcher} 
	             />;
	    });
	  }
	```
- finally, in the child component:
	- create the `action` argument
	- invoke the dispatcher when a button is clicked, passing the `action` argument
		```js
		export default React.memo(function Card(props) {
		  function handleClick(event) {
		    if (props.inactive) return;
		    const action = props.selected 
		      ? { type: "deselect", id: props.id } 
		      : { type: "select", id: props.id };
		    props.cardClick(action);
		  }
		
		  const inactive = props.inactive ? "fade" : "";
		  const selected = props.selected ? "highlight" : "";
		
		  return <img className={`card ${inactive} ${selected}`} 
		              src={props.img} 
		              alt={props.alt} 
		              onClick={handleClick} />;
		});
		```
- note that the useMemo wrapper is still needed to memoize the child component props and prevent re-renders of the child if the props haven't changed.

#### This approach works!

[Back to top](#higher-or-lower-project)


  




