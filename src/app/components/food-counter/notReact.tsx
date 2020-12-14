import * as React from "react";
import {animated, config, useSpring, useTransition} from 'react-spring'

interface Counter {
  count: number;
}

// Heavy influence from: https://github.com/pmndrs/react-spring.io/blob/master/src/pages/use-transition.js
export const Counter: React.FC<Counter> = ({ count }: Counter) => {
  const [items, set] = React.useState([
    { key: 1 },
    { key: 2 },
    { key: 3 },
    { key: 4 },
  ]);
  const transitions = useTransition(items, (item) => item.key, {
    from: { transform: "translate3d(0,-40px,0)" },
    enter: { transform: "translate3d(0,0px,0)" },
    leave: { transform: "translate3d(0,-40px,0)" },
  });

  // Add consumed food or foods if one
  return (
    <div style={{ padding: "3em" }}>
      <button
        onClick={() => {
          set([{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }, { key: 5 }]);
        }}
      >
        Set
      </button>
      <span>Consumed Foods: </span>
      {/* <span>{count}</span> */}
      {transitions.map(({ item, props, key }) => (
        // <animated.span key={key} style={props}>
        //   {item.key}
        // </animated.span>
        <animated.span key={key} style={props}>
          {item.key}
        </animated.span>
      ))}
      <RewindSpringProvider>
        <RewindSpring style={{}}>
          {(x) => (
            <>
              <animated.span
                style={{
                  opacity: x.interpolate({
                    range: [0.75, 1.0],
                    output: [0, 1],
                  }),
                  transform: x
                    .interpolate({
                      range: [0.75, 1.0],
                      output: [-40, 0],
                      extrapolate: "clamp",
                    })
                    .interpolate((x) => `translate3d(0,${x}px,0)`),
                }}
              >
                1
              </animated.span>
              <animated.span
                style={{
                  opacity: x.interpolate({
                    range: [0.25, 0.5],
                    output: [0, 1],
                  }),
                  transform: x
                    .interpolate({
                      range: [0.25, 0.5],
                      output: [-40, 0],
                      extrapolate: "clamp",
                    })
                    .interpolate((x) => `translate3d(0,${x}px,0)`),
                }}
              >
                2
              </animated.span>
              <animated.span
                style={{
                  opacity: x.interpolate({
                    range: [0.0, 0.25],
                    output: [0, 1],
                  }),
                  transform: x
                    .interpolate({
                      range: [0.0, 0.25],
                      output: [-40, 0],
                      extrapolate: "clamp",
                    })
                    .interpolate((x) => `translate3d(0,${x}px,0)`),
                }}
              >
                3
              </animated.span>
              <animated.span
                style={{
                  opacity: x.interpolate({
                    range: [0.5, 0.75],
                    output: [0, 1],
                  }),
                  transform: x
                    .interpolate({
                      range: [0.5, 0.75],
                      output: [-40, 0],
                      extrapolate: "clamp",
                    })
                    .interpolate((x) => `translate3d(0,${x}px,0)`),
                }}
              >
                4
              </animated.span>
            </>
          )}
        </RewindSpring>
      </RewindSpringProvider>
    </div>
  );
};

export const RewindSpringProvider = function ({ children }) {
  const [flip, set] = React.useState(false);
  const animatedProps = useSpring({
    reset: true,
    reverse: flip,
    from: { x: 0 },
    x: 1,
    delay: 200,
    config: config.molasses,
    onRest: () => set(!flip),
  });

  return (
    <div className="markdown-body">
      <Context.Provider value={animatedProps} children={children} />
    </div>
  );
};

const Context = React.createContext(undefined);

export const RewindSpring = function ({ children, style }) {
  const { x } = React.useContext(Context);
  return (
    <div
      style={{
        color: "rgb(45, 55, 71)",
        ...style,
      }}
    >
      {children(x)}
    </div>
  );
};
