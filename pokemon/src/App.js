// import './App.css';
import SidePanel from './components/sides'
import { CircularProgress, Grid, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import CardDeck from './cards'
import axios from 'axios'

async function getPokemons() {
  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 200 + 1)}`);
  return res.data;
}

var a = 6;

function App() {
  const [card, setCard] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);
  const [playerStats, setPlayerStats] = React.useState([0, 0]);
  const [unfade, doUnfade] = React.useState([[], []]);
  const [revealedCount, setRevCount] = React.useState(0);
  const [gameOver, go] = React.useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true)
    }, 6000)
  })


  while (card.length < 8) {
    getPokemons().then((pokemon) => {
      setCard([
        ...card,
        {
          'url': pokemon.sprites.other.dream_world.front_default,
          'name': pokemon.name,
          'weight': pokemon.weight,
          'speed': pokemon.stats[5].base_stat,
          'attack': pokemon.stats[3].base_stat,
          'hp': pokemon.stats[0].base_stat,
        }])
    }).catch((e) => {
      console.log("error during fetching " + e);
    })
    return null;
  }

  if (!loaded) {
    return <Typography variant="h3" align="center" style={{ marginTop: '40vh', color: 'green' }}>Shuffling from the deck of 150 cards</Typography>
  }

  const c1 = card.slice(0, 4);
  const c2 = card.slice(4, 8);

  return (    
    <Grid container>
      {gameOver ? <Typography align="center" variant="h2" style={{display: "block", width: '100vw', height: '100vh',  backgroundColor: '#4BB543', position: 'absolute' }}>
        {playerStats[0] > playerStats[1] ? "Player 1" : "Player 2"} Wins with score {Math.max(playerStats[0], playerStats[1])}
      </Typography>: <></>}
      <Grid id="deck" item xs={6} >
        <Typography align="center" variant="h2" style={{ color: 'yellow', backgroundColor: 'red' }}>P1: {playerStats[0]}</Typography>
        <CardDeck pid={0} cards={c1} oponentCard={c2} playerStats={playerStats} setPlayerStats={setPlayerStats} unfade={unfade} doUnfade={doUnfade} revealedCount={revealedCount} setRevCount={setRevCount} setGameOver={go} />
      </Grid>
      <Grid id="deck" item xs={6}>
        <Typography align="center" variant="h2" style={{ color: 'red', backgroundColor: 'yellow' }}>P2: {playerStats[1]}</Typography>
        <CardDeck pid={1} cards={c2} oponentCard={c1} playerStats={playerStats} setPlayerStats={setPlayerStats}  unfade={unfade} doUnfade={doUnfade} revealedCount={revealedCount} setRevCount={setRevCount}  setGameOver={go} />
      </Grid>
    </Grid>
  );
}

export default App;
