import './App.css';
import SidePanel from './components/sides'
import { Grid, Typography } from '@material-ui/core';
import React from 'react';

function App() {
  return (
    <div className="App" style={{backgroundColor: 'black'}}>  
    <Typography variant="h2" align="center" color="secondary">
      P O K E M O N
      </Typography>  
    <Grid container>
      <Grid item sm={6} style={{backgroundColor: 'yellow'}}>
      <SidePanel  />
      </Grid>
      <Grid item sm={6} style={{backgroundColor: 'blue', color: 'white'}}>
        <SidePanel />
      </Grid>
    </Grid>
      
    </div>
  );
}

export default App;
