// import './App.css';
import { Grid, Link, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect } from 'react';
import CardDeck from './cards';

async function getPokemons() {
  const res = await axios.get(
    `https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 200 + 1)}`
  );
  return res.data;
}

function App() {
  const [card, setCard] = React.useState([]); // cards data lies here
  const [loaded, setLoaded] = React.useState(false); // used for waiting to load all the data from the web
  const [playerStats, setPlayerStats] = React.useState([0, 0]); // stores current players scores (intially both have 0,0 score)
  const [unfade, doUnfade] = React.useState([[], []]); // stores the revealed cards, initially all cards data are hidden behind the card back
  const [revealedCount, setRevCount] = React.useState(0); // stores the current number of revealed card counts
  const [gameOver, go] = React.useState(false); // check if the game is over, if over the results will be shown
  const [pressed] = React.useState(() => new Map()); // Stores the pressed/selected ability of a card by the user.

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 6000);
  });

  while (card.length < 8) {
    // storing the card data in card variable declared above.
    getPokemons()
      .then((pokemon) => {
        setCard([
          ...card,
          {
            url: pokemon.sprites.other.dream_world.front_default,
            name: pokemon.name,
            weight: pokemon.weight,
            speed: pokemon.stats[5].base_stat,
            attack: pokemon.stats[3].base_stat,
            hp: pokemon.stats[0].base_stat
          }
        ]);
      })
      .catch((e) => {
        console.log('error during fetching ' + e);
      });
    return null;
  }

  if (!loaded) {
    return (
      <Typography
        variant="h3"
        align="center"
        style={{ marginTop: '40vh', color: 'green' }}
      >
        Shuffling from the deck of 150 cards
      </Typography>
    );
  }

  const c1 = card.slice(0, 4);
  const c2 = card.slice(4, 8);

  return (
    <Grid container>
      {gameOver ? (
        <Typography
          align="center"
          variant="h2"
          style={{
            color: 'white',
            display: 'block',
            width: '100vw',
            height: '100vh',
            backgroundColor: '#4BB543',
            position: 'absolute'
          }}
        >
          {playerStats[0] === playerStats[1]
            ? 'Its a Tie Guys'
            : playerStats[0] > playerStats[1]
            ? 'Player 1 Wins'
            : 'Player 2 Wins'}{' '}
          with Score {Math.max(playerStats[0], playerStats[1])}
          <Link
            href="/"
            align="right"
            style={{
              backgroundColor: 'yellow',
              padding: '8px 14px',
              borderRadius: '4px',
              border: '1px solid #000',
              fontSize: '20px',
              marginLeft: '40px'
            }}
          >
            Play More
          </Link>
        </Typography>
      ) : (
        <></>
      )}
      <Grid id="deck" item xs={6}>
        <Typography
          align="center"
          variant="h2"
          style={{ color: 'yellow', backgroundColor: 'red' }}
        >
          P1: {playerStats[0]}
        </Typography>
        <CardDeck
          pid={0}
          cards={c1}
          oponentCard={c2}
          playerStats={playerStats}
          setPlayerStats={setPlayerStats}
          unfade={unfade}
          doUnfade={doUnfade}
          revealedCount={revealedCount}
          setRevCount={setRevCount}
          setGameOver={go}
          pressed={pressed}
        />
      </Grid>
      <Grid id="deck" item xs={6}>
        <Typography
          align="center"
          variant="h2"
          style={{ color: 'red', backgroundColor: 'yellow' }}
        >
          P2: {playerStats[1]}
        </Typography>
        <CardDeck
          pid={1}
          cards={c2}
          oponentCard={c1}
          playerStats={playerStats}
          setPlayerStats={setPlayerStats}
          unfade={unfade}
          doUnfade={doUnfade}
          revealedCount={revealedCount}
          setRevCount={setRevCount}
          setGameOver={go}
          pressed={pressed}
        />
      </Grid>
    </Grid>
  );
}

export default App;
