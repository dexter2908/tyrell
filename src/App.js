import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Grid, Typography } from '@mui/material';

const App = () => {
  const TOTAL_CARDS = 52;
  const [totalPlayers, setTotalPlayers] = useState('');
  const [cards, setCards] = useState([]);
  const [players, setPlayers] = useState([]);
  const [noCardplayers, setNoCardPlayers] = useState([]);
  const [error, setError] = useState('');
  const instance = axios.create({
    baseURL: `http://localhost/`
  });

  const totalPlayersInputHandler = (event) => {
    if(!isOnlyNumbers(event.target.value) && event.target.value !== '') {
      setError('Input value does not exist or value is invalid');
      return;
    }

    setTotalPlayers(event.target.value);
  }

  const dealCards = () => {
    let dealCycle = Math.ceil(TOTAL_CARDS / totalPlayers);
    let players = new Array();
    let cardCount = 0;

    if(parseInt(totalPlayers, 10) === 0) {
      setError('Total players cannot be 0');
      return;
    }
    
    if(cards.length === 0) {
      setError('Cards have been dealt. Please shuffle the cards again');
      return;
    }

    dealCycle = dealCycle <= 0 ? 1 : dealCycle;

    for(let dealCount = 1; dealCount <= dealCycle; dealCount++) {
      for(let playerCount = 0; playerCount < totalPlayers; playerCount++) {
        
        players[playerCount] = players[playerCount] === undefined || players[playerCount] === null ? '' : players[playerCount];
        players[playerCount] = players[playerCount] + cards[cardCount] + ',';
        cardCount++;

        if(cardCount >= TOTAL_CARDS) {
          setPlayers(players);
          setCards([]);
          return;
        }
      }
    }
  }

  function isOnlyNumbers(str) {
    return /^\d+$/.test(str);
  }

  const shuffleCards = async () => {
    try {
      const response = await instance.get("api.php", null);
      setPlayers([]);
      setCards(response.data.cards);
    }
    catch(e) {
      setError('Irregularity occurred');
    }
  }

  const getNoCardPlayers = () => {
    let noCardplayersGrid = new Array();
    let remainingPlayers = totalPlayers - players.length;

    for(let p = 1; p <= remainingPlayers; p++) {
      noCardplayersGrid.push(`Player ${p + players.length}: No card(s) dealt`);
    }
    setNoCardPlayers(noCardplayersGrid);
  }

  useEffect(() => {
    setError('');
    getNoCardPlayers();
  }, [players]);

  return (
    <Grid item xs={12}>
      <Grid>
        &nbsp;
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={1}>
          Total Players:
        </Grid>
        <Grid item xs={1}>
          <TextField inputProps={{ maxLength: 30 }} focused onChange={(event) => totalPlayersInputHandler(event)} 
            value={totalPlayers}
            size='small' />
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" onClick={() => shuffleCards()}>Shuffle</Button>&nbsp;
          <Button variant="contained" disabled={totalPlayers === '' || parseInt(totalPlayers, 10) === 0} onClick={() => dealCards()}>Deal</Button>&nbsp;
        </Grid>
        <Grid item xs={8}>
          &nbsp;
        </Grid>

        <Grid item xs={12}>
          <Typography style={{color: "red"}}>{error}</Typography>
        </Grid>

        {
          players.map((p, index) =>
            <Grid id={`${p}.${index}`} item xs={12}>
              {`Player ${index + 1}: ${p.substring(0, p.length - 1)}`}
            </Grid>
          )
        }

        {
          players.length > 0 && noCardplayers.map((p, index) =>
            <Grid id={`${p}.${index}`} item xs={12}>
              {`${p}`}
            </Grid>
          )
        }
      </Grid>
    </Grid>
  );
}

export default App;
