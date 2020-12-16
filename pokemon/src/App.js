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
  const [loaded, setLoaded] = React.useState(false)

  useEffect(()=>{
    setTimeout(() => {
      setLoaded(true)
    }, 2000)
  })


  while(card.length < 8) {
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
      console.log("error during fetching "+ e);
    })    
    return  null;
  }  

  if (!loaded) {
    return <Typography variant="h2" align="center" style={{marginTop: '40vh', color: 'white'}}> Data is dowloading </Typography>
  }

  const c1 = card.slice(0, 4);  
  const c2 = card.slice(4, 8);

  return (
    <Grid container>
      <Grid id="deck" item xs={6}>
        <CardDeck cards={c1} />
      </Grid>
      <Grid id="deck" item xs={6}>
        <CardDeck cards={c2} />
      </Grid>
    </Grid>
  );
}

export default App;
