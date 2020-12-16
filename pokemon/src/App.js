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
      <Grid id="deck" item xs={6} >
        <Typography variant="h2" style={{ color: 'yellow' }}>{playerStats[0]}</Typography>
        <CardDeck pid={0} cards={c1} oponentCard={c2} playerStats={playerStats} setPlayerStats={setPlayerStats} />
      </Grid>
      <Grid id="deck" item xs={6}>
        <Typography variant="h2" style={{ color: 'red' }}>{playerStats[1]}</Typography>
        <CardDeck pid={1} cards={c2} oponentCard={c1} playerStats={playerStats} setPlayerStats={setPlayerStats} />
      </Grid>
    </Grid>
  );
}

export default App;
