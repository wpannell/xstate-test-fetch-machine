import React from "react";
import Fetch from "./Fetch";

export default function App() {
  const resource = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // resolve();
        reject();
      }, 2000);
    });
  };

  return <Fetch resource={resource} />;
}
