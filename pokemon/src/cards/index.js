import { render } from 'react-dom'
import React, { useState } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { Button, Container, Typography } from '@material-ui/core'
// import './styles.css'



// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = i => ({ x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 })
const from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

export default function Deck({ pid, cards, oponentCard, playerStats, setPlayerStats }) {
  const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out

  const [props, set] = useSprings(cards.length, i => ({ ...to(i), from: from(i) })) // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useGesture(({ args: [index], down, delta: [xDelta], distance, direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2 // If you flick hard enough it should trigger the card to fly out
    const dir = xDir < 0 ? -1 : 1 // Direction should either point left or right
    if (!down && trigger) gone.add(index) // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
    set(i => {
      if (index !== i) return // We're only interested in changing spring-data for the current spring
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
      const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0) // How much the card tilts, flicking it harder makes it rotate faster
      const scale = down ? 1.1 : 1 // Active cards lift up a bit
      return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } }
    })
    if (!down && gone.size === cards.length) setTimeout(() => gone.clear() || set(i => to(i)), 600)
  })
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return props.map(({ x, y, rot, scale }, i) => (
    <animated.div key={i} style={{ transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}>
      {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
      <animated.div {...bind(i)} style={{
        backgroundColor: 'lightblue',
        transform: interpolate([rot, scale], trans),
        backgroundImage: `url(${cards[i].url})`,
        backgroundSize: 'contain',
        backgroundPositionY: 'top',
      }} >
        <Container style={{ marginTop: '340px', backgroundColor: 'rgba(255, 255, 0, 0.4)', paddingBottom: '20px' }}>
          <Typography variant="h3" align="center" style={{ fontWeight: 700 }} playerStats={playerStats}>{cards[i].name}</Typography>
          <CustomButton pid={pid} data={`Attack: ${cards[i].attack}`} index={i} oponentCard={oponentCard} playerStats={playerStats} setPlayerStats={setPlayerStats} />
          <CustomButton pid={pid} data={`Speed: ${cards[i].speed}`} index={i} oponentCard={oponentCard} playerStats={playerStats} setPlayerStats={setPlayerStats} />
          <CustomButton pid={pid} data={`Hp: ${cards[i].hp}`} index={i} oponentCard={oponentCard} playerStats={playerStats} setPlayerStats={setPlayerStats} />
          <CustomButton pid={pid} data={`Weight: ${cards[i].weight}`} index={i} oponentCard={oponentCard} playerStats={playerStats} setPlayerStats={setPlayerStats} />
        </Container>
      </animated.div>
    </animated.div>
  ))
}

function CustomButton({ pid, data, index, oponentCard, playerStats, setPlayerStats }) {
  const id = data.split(":")[0].toLowerCase();

  return <Button
    id={id}
    onClick={(event) => {
      console.log(index);
      console.log(event);
      console.log(id);
      console.log(oponentCard);
      console.log(data.split(" ")[1]);
      console.log(oponentCard[index][id]);
      console.log(pid);
      console.log(typeof (pid));
      if (pid === 0) {
        if (parseInt(data.split(" ")[1]) > oponentCard[index][id]) {
          console.log("Player 1 wins")
          setPlayerStats([playerStats[0] + 1, playerStats[1]]);
        } else {
          console.log("Player 2 wins")
          setPlayerStats([playerStats[0], playerStats[1] + 1]);
        }
      } else {
        if (parseInt(data.split(" ")[1]) > oponentCard[index][id]) {
          console.log("Player 1 wins")
          setPlayerStats([playerStats[0], playerStats[1] + 1]);
        } else {
          console.log("Player 2 wins")
          setPlayerStats([playerStats[0] + 1, playerStats[1]]);
        }
      }
      console.log(playerStats);
    }}
    style={{ display: 'block', width: '100%', height: '30px' }} >
    <Typography variant="h5">{data}</Typography>
  </Button>
}

// render(<Deck />, document.getElementById('root'))
