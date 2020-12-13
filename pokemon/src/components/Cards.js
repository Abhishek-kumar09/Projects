import { Grid, makeStyles, Typography } from '@material-ui/core';
import axios from 'axios';
import clsx from 'clsx';
import React from 'react';
 
const useStyles = makeStyles(theme => ({
  card: {
    opacity: '0'
  },
  c: {
    opacity: 1
  }
}))

export default function Card({ ...rest }) {
  const classes = useStyles();

  const [pokedata, setPokedata] = React.useState(null);
  const [activated, setActivated] = React.useState("");

  if (pokedata == null) {
    const randomPokeId = Math.floor(Math.random()*150 + 1);

    axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokeId}`) // Getting the whole json data for a pokemon
      .then(res => {
        setPokedata(res.data);
      }).catch(e => {
        console.log("error: " + e);
      })
  }

  if (pokedata == null) {
    return null;
  }

  return (<div style={{height: '300px', marginTop: '20px'}} onClick={()=> {setActivated(classes.c)}} >
    <Grid container alignItems="center" spacing={5} {...rest} >
      <Grid item sm={6} className={clsx(classes.card, activated)}>
        <img src={pokedata.sprites.other.dream_world.front_default} alt="My logo" style={{height: '270px'}} />
      </Grid>
      <Grid item sm={6} style={{textAlign: 'left'}}>
        <Typography variant="h2">{pokedata.name[0].toUpperCase()}{pokedata.name.substring(1)}</Typography>
        <Typography variant="h6" className={clsx(classes.card, activated)}>Attack: {pokedata.stats[3].base_stat}</Typography>
        <Typography variant="h6" className={clsx(classes.card, activated)}>Hp: {pokedata.stats[0].base_stat}</Typography>
        <Typography variant="h6" className={clsx(classes.card, activated)}>Speed: {pokedata.stats[5].base_stat}</Typography>
        <Typography variant="h6" className={clsx(classes.card, activated)}>Weight: {pokedata.weight}</Typography>
        <Typography variant="h6" className={clsx(classes.card, activated)}>Type: {pokedata.types[0].type.name}</Typography>

      </Grid>
    </Grid>

  </div>)
}