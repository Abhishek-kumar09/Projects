import { Button, Container, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { animated, interpolate, useSprings } from 'react-spring';
import { useGesture } from 'react-use-gesture';
// import './styles.css'

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100
});
const from = (i) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) =>
  `perspective(1500px) rotateX(30deg) rotateY(${
    r / 10
  }deg) rotateZ(${r}deg) scale(${s})`;

export default function Deck({
  pid,
  cards,
  oponentCard,
  playerStats,
  setPlayerStats,
  unfade,
  doUnfade,
  revealedCount,
  setRevCount,
  setGameOver,
  pressed
}) {
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out

  const [props, set] = useSprings(cards.length, (i) => ({
    ...to(i),
    from: from(i)
  })); // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useGesture(
    ({
      args: [index],
      down,
      delta: [xDelta],
      distance,
      direction: [xDir],
      velocity
    }) => {
      const trigger = velocity > 0.2 && index >= cards.length - revealedCount; // If you flick hard enough it should trigger the card to fly out
      const dir = xDir < 0 ? -1 : 1; // Direction should either point left or right
      if (!down && trigger) gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      set((i) => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index);
        const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0); // How much the card tilts, flicking it harder makes it rotate faster
        const scale = down ? 1.05 : 1; // Active cards lift up a bit
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 }
        };
      });
      if (!down && gone.size === cards.length)
        setTimeout(() => {
          setGameOver(true);
          set((i) => to(i));
          gone.clear();
        }, 600);
    }
  );

  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return props.map(({ x, y, rot, scale }, i) => (
    <animated.div
      key={i}
      style={{
        transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`)
      }}
    >
      {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
      <animated.div
        {...bind(i)}
        style={{
          backgroundColor: 'white',
          transform: interpolate([rot, scale], trans),
          padding: '10px'
        }}
      >
        {!unfade[pid].includes(i) ? (
          <Container
            style={{
              backgroundImage: `url('https://cdn.bulbagarden.net/upload/1/17/Cardback.jpg')`,
              height: '100%',
              width: '100%',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPositionX: 'center'
            }}
            onClick={() => {
              pid === 0
                ? doUnfade([[...unfade[0], i], [...unfade[1]]])
                : doUnfade([[...unfade[0]], [...unfade[1], i]]);
            }}
          />
        ) : (
          <Container
            style={{
              backgroundColor: 'rgba(255, 255, 0, 0.4)',
              backgroundImage: `url(${cards[i].url})`,
              backgroundSize: 'contain',
              backgroundPositionY: 'top',
              backgroundRepeat: 'no-repeat',
              height: '100%'
            }}
          >
            <div style={{ paddingTop: '350px' }}>
              <Typography
                variant="h3"
                noWrap
                align="center"
                style={{ fontWeight: 700, fontSize: '2.5rem' }}
                playerStats={playerStats}
              >
                {cards[i].name[0].toUpperCase() + cards[i].name.substring(1)}
              </Typography>

              {['attack', 'speed', 'hp', 'weight'].map((ability) => {
                return (
                  <CustomButton
                    pid={pid}
                    data={`${ability}: ${cards[i][ability]}`}
                    index={i}
                    oponentCard={oponentCard}
                    playerStats={playerStats}
                    setPlayerStats={setPlayerStats}
                    unfade={unfade}
                    doUnfade={doUnfade}
                    revealedCount={revealedCount}
                    setRevCount={setRevCount}
                    pressed={pressed}
                  />
                );
              })}
            </div>
          </Container>
        )}
      </animated.div>
    </animated.div>
  ));
}

function CustomButton({
  pid,
  data,
  index,
  oponentCard,
  playerStats,
  setPlayerStats,
  unfade,
  doUnfade,
  revealedCount,
  setRevCount,
  pressed
}) {
  const id = data.split(':')[0].toLowerCase();
  const [clicked, setClick] = useState('black');

  if (pressed.has(index) && id === pressed.get(index) && clicked === 'black') {
    setClick('blue');
  }

  return (
    <Button
      active
      id={id}
      onClick={(event) => {
        pid === 1
          ? doUnfade([[...unfade[0], index], [...unfade[1]]])
          : doUnfade([[...unfade[0]], [...unfade[1], index]]);

        if (!pressed.has(index)) {
          if (parseInt(data.split(' ')[1]) === oponentCard[index][id]) {
            setPlayerStats([playerStats[0] + 1, playerStats[1] + 1]);
          } else if (pid === 0) {
            if (parseInt(data.split(' ')[1]) > oponentCard[index][id]) {
              console.log('Player 1 wins');
              setPlayerStats([playerStats[0] + 1, playerStats[1]]);
            } else {
              console.log('Player 2 wins');
              setPlayerStats([playerStats[0], playerStats[1] + 1]);
            }
          } else {
            if (parseInt(data.split(' ')[1]) > oponentCard[index][id]) {
              console.log('Player 1 wins');
              setPlayerStats([playerStats[0], playerStats[1] + 1]);
            } else {
              console.log('Player 2 wins');
              setPlayerStats([playerStats[0] + 1, playerStats[1]]);
            }
          }
          setClick('blue');
          pressed.set(index, id);
        }
        console.log(playerStats);

        setRevCount(revealedCount + 1);
      }}
      style={{
        display: 'block',
        width: '100%',
        height: '30px',
        padding: '8px',
        color: `${clicked}`,
        backgroundColor: 'rgba(255, 255, 255, 0.4)'
      }}
    >
      <Typography variant="h5">{data}</Typography>
    </Button>
  );
}
