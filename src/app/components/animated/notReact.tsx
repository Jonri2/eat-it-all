import * as React from "react";
import { animated, useSpring } from "react-spring";

const STYLE_HEIGHT = 50; // Sorry, EM doesn't work
const STYLE_HEIGHT_STR = `${STYLE_HEIGHT}px`;

/* A component that animates children vertically after 30ms of being rendered.
Note: inline styles are used bc scss doesn't work well when using React
in this way.
  References:
  - https://codesandbox.io/embed/zn2q57vn13
  - https://stackoverflow.com/questions/56928771/reactjs-react-countup-visible-only-once-in-visibility-sensor
  */
export const AnimateShowAndHide: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const springProps = useSpring({
    config: { friction: 200, mass: 5, tension: 2000 },
    from: { height: 0, opacity: 0, x: 20 },
    height: isVisible ? STYLE_HEIGHT : 0,
    opacity: isVisible ? 1 : 0,
    x: isVisible ? 0 : 20,
  });

  React.useEffect(() => {
    setTimeout(() => setIsVisible(true), 30);
  }, []);

  const { height } = springProps;

  return (
    <div
      style={{ position: "relative", height: STYLE_HEIGHT_STR, marginBottom: "1.5em" }}
    >
      <animated.div
        style={{
          position: "relative",
          height: STYLE_HEIGHT_STR,
          lineHeight: STYLE_HEIGHT_STR,
          color: "black",
          fontSize: STYLE_HEIGHT_STR,
          fontWeight: "bolder",
          letterSpacing: "-2px",
          willChange: "transform, opacity",
          overflow: "hidden",
          ...springProps,
        }}
      >
        <animated.div
          style={{ height, overflow: "hidden", paddingRight: "2em", }}
        >
          {children}
        </animated.div>
      </animated.div>
    </div>
  );
};
