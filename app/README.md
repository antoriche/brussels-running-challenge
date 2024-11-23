# Jetpack react app boiler plate

This project was bootstrapped from create-react-app and provides the libraries we use the most often for our front end apps: react, redux, axios, antd.

Also provides eslint + flow configurations.

Actions, reducers are setted up.

# Authentication

It uses cognito.
You shoud use a .env
The following environment variables can be passed to a .env:

1. `REACT_APP_SKIP_AUTH`: put "SKIP" and you will automatically skip cognito auth
2. `REACT_APP_COGNITO_IDENTITY_POOL_ID`: self explanatory
3. `REACT_APP_COGNITO_REGION`: self explanatory
4. `REACT_APP_COGNITO_USER_POOL_ID`: self explanatory
5. `REACT_APP_COGNITO_APP_CLIENT_ID`: self explanatory

## Guidelines - coding style for app at jetpack

## General considerations

### Clean coding

We try to stick to the [Clean code](https://www.amazon.com.be/-/en/Martin-Robert/dp/0132350882) principle.
A javascript implementation of this set of recommendations can be found on [this link](https://github.com/ryanmcdermott/clean-code-javascript).

### Naming conventions

1. Use camelCase for variable and function names.
2. Booleans starts with `'is'`. `<Modal visible={open} />` is replaced by `<Modal visible={isOpen} />`
3. Use PascalCase for component names.
4. Prefix hooks with "use" (e.g., `useHookName`).
5. File names should be the component or the hook name. Otherwise use kebab-case.

If the business is in a language other than English, it could be interesting to name the variable according to its business value.

For example:
"Feeder" is the English name for "Départ" in the Sirius app. But we use "depart", "departId" because it's business-oriented. Please avoid false translations such as "departure" for this particular example.

Please maintain consistency when naming variables. It's better to have a "bad" variable name than to name the same thing in two different ways.

For example: if "departure" is used everywhere in the app, please continue using the same naming. You can start the process of renaming all the feeder-related variables to "feeder", but it needs to be done consistently throughout the entire codebase, including the database.

### Data manipulation and functional programming

Functional programming is great.
We enforce the use of `lodash` as a library to perform data manipulations.
Still, chaining a lot of `map`, `reduce` and `filter` together can make the code more difficult to read and understand.
In such a case, it's not a bad idea to define `mapper`, `reducer` and `filter` functions separately and to apply them to the object.
Example:

```jsx
const fighers = [
  {
    name: "Pikachu",
    player: "Antonin",
    wins: 3,
    losses: 2,
  },
  {
    name: "Pikachu",
    player: "Antoine",
    wins: 1,
    losses: 12,
  },
  {
    name: "Ike",
    player: "Antonin",
    wins: 12,
    losses: 1,
  },
  {
    name: "Falcon",
    player: "Ludéric",
    wins: 2,
    losses: 2,
  },
  {
    name: "Falcon",
    player: "Antoine",
    wins: 0,
    losses: 2,
  },
  {
    name: "Young Link",
    player: "Antoine",
    wins: 2,
    losses: 2,
  },
];

const agg = Object.entries(
  fighers
    .map((fighter) => {
      const diff = fighter.wins - fighter.losses;
      fighter.diff = diff;
      return fighter;
    })
    .filter((fighter) => fighter.diff > 0)
    .reduce((agg, elem) => {
      if (agg[elem.player]) {
        agg[elem.player].push(elem);
      } else {
        agg[elem.player] = [elem];
      }
      return agg;
    }, {}),
).map((player, i, playerFighters) => {
  const bestFighter = playerFighters.sort((a, b) => a.diff - b.diff)[0];
  return {
    player,
    ...bestFighter,
  };
});
```

can be made more readable

```jsx
const fighers = [
  {
    name: "Pikachu",
    player: "Antonin",
    wins: 3,
    losses: 2,
  },
  {
    name: "Pikachu",
    player: "Antoine",
    wins: 1,
    losses: 12,
  },
  {
    name: "Ike",
    player: "Antonin",
    wins: 12,
    losses: 1,
  },
  {
    name: "Falcon",
    player: "Ludéric",
    wins: 2,
    losses: 2,
  },
  {
    name: "Falcon",
    player: "Antoine",
    wins: 0,
    losses: 2,
  },
  {
    name: "Young Link",
    player: "Antoine",
    wins: 2,
    losses: 2,
  },
];

function getFighterNetResult(fighter) {
  return fighter.wins - fighter.losses;
}

function mapFighterToNetResult(fighter) {
  const netResult = getFighterNetResult(fighter);
  return {
    ...fighter,
    diff: netResult,
  };
}

function hasPositiveNetResult(fighter) {
  return fighter.diff > 0;
}

function aggregateResultByPlayer(resultsByPlayer, fighter) {
  if (resultsByPlayer[elem.player]) {
    resultsByPlayer[elem.player].push(elem);
  } else {
    resultsByPlayer[elem.player] = [elem];
  }
  return resultsByPlayer;
}

function mapToBestFighter(fighters) {
  const bestFighter = playerFighters.sort((a, b) => a.diff - b.diff)[0];
  return bestFighter;
}

const agg = Object.entries(fighers.map(mapFighterToNetResult).filter(hasPositiveNetResult).reduce(aggregateResultByPlayer, {})).map(
  (player, i, playerFighters) => playerFighters.map(mapToBestFighter),
);
```

## Components

### Some rules

1. 1 file = 1 component; 1 component = 1 file;
2. `useState` combined with `useEffect` can oftentimes be replaced by a simple `useMemo`
3. we use the format `const [value, setValue] = useState(initialValue)`.
4. If using typescript, the types for the inputs of the components are defined using an `type` with the following naming convention `<ComponentName>Props`. We avoid using in component definition.

### Component structure

A typical component structure follows this pattern:

```jsx
import React from 'react';

function ComponentName ({...props}) {
  // Component logic here

  return (
    // JSX markup here
  );
};

export default ComponentName;
```

## react-query hooks

1. One file per type of object.
   e.g: a hook file called `useFighters.js` exports one `useFighters` hook. This hooks can embed both the `useQuery` and various `useMutation` hooks (create, update, delete, ...) by exporting outputs of the mutation in the return of the hooks.
2. query keys follow as best as possible the RESTful endpoint definitions.
   e.g: fetching a list of `simulations` from the `/simulations` endpoint using a `GET`request, the resulting objects are stored within the `['simulations']` query key.

<!-- TODO -->
<!-- use queries

imports

unused variable

console log

depedencies in usememo/useeffect etc -->
