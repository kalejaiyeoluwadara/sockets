import React, { useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
import { usePerfectCursor } from "../components/Cursor";

// Component to render individual cursors
const Cursor = ({ point }) => {
  const addPoint = usePerfectCursor(() => {}, point);

  useEffect(() => {
    if (point) addPoint(point);
  }, [point, addPoint]);

  return (
    <div style={{ position: "absolute", left: point[0], top: point[1] }}>
      🎯
    </div>
  );
};

const renderCursors = (users) => {
  return Object.keys(users).map((uuid) => {
    const user = users[uuid];
    if (!user.state || user.state.x == null || user.state.y == null)
      return null;
    return <Cursor key={uuid} point={[user.state.x, user.state.y]} />;
  });
};

const renderUserList = (users) => {
  return Object.keys(users).map((uuid) => {
    const user = users[uuid];
    return (
      <li key={uuid}>
        {user.username} - X: {user.state.x || 0}, Y: {user.state.y || 0}
      </li>
    );
  });
};

function Home({ username }) {
  const WS_URL = "ws://127.0.0.1:8000";
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: { username },
  });
  const THROTTLE = 50;

  const sendMessageThrottled = useRef(
    throttle((message) => sendJsonMessage(message), THROTTLE)
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      sendMessageThrottled.current({ x: e.clientX, y: e.clientY });
    };
    sendJsonMessage({ x: 0, y: 0 });
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [sendMessageThrottled, sendJsonMessage]);

  const users = lastJsonMessage || {};

  return (
    <main>
      <h1>Hello, {username}</h1>
      <ol>{renderUserList(users)}</ol>
      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        {renderCursors(users)}
      </div>
    </main>
  );
}

export default Home;
