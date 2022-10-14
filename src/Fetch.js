import React from "react";
import { useMachine } from "@xstate/react";
import fetchMachine from "./fetchMachine";

const Fetch = ({ resource }) => {
  const [state, send] = useMachine(fetchMachine, {
    services: {
      fetchResource: resource
    }
  });

  const { name } = state.context;

  React.useEffect(() => {
    console.log(state.value);
  }, [state.value]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    send("CHANGE", { name, value });
  };

  return state.matches("inactive") ? (
    <button onClick={() => send("OPEN")}>Open</button>
  ) : state.matches("active") ? (
    <form>
      <label htmlFor="name">
        Name:
        <input name="name" type="text" onChange={handleOnChange} value={name} />
      </label>
      <button type="submit" value="Submit" onClick={() => send("SUBMIT")}>
        Submit
      </button>
      <button type="button" value="Close" onClick={() => send("CLOSE")}>
        Close
      </button>
    </form>
  ) : state.matches("loading") ? (
    <div>Loading...</div>
  ) : state.matches("failure") ? (
    <>
      <div data-testid="error">Uh oh something went wrong!</div>
      <button type="button" value="Reset" onClick={() => send("CLOSE")} />
    </>
  ) : state.matches("success") ? (
    <>
      <div data-testid="success">Success! {name}</div>
      <button type="button" value="Close" onClick={() => send("CLOSE")}>
        Close
      </button>
      <button
        type="button"
        value="ChangeName"
        onClick={() => send("CHANGE_NAME")}
      >
        Change Name
      </button>
    </>
  ) : null;
};

export default Fetch;
