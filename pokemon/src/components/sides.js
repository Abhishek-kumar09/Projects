import React from 'react';

import { makeStyles } from '@material-ui/core'
import Cards from './Cards'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    textAlign: 'center'
  },
  card: {
    height: '300px',
    width: '90%',
    backgroundColor: 'white',
    margin: '10px'
  }
}));

function SidePanel() {
  const classes = useStyles();

  return (<div className={classes.root}>
    <Cards />
    <Cards />
    <Cards />
  </div>);
}

export default SidePanel;