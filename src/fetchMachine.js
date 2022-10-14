import { Machine, assign } from "xstate";

const fetchMachine = Machine({
  id: "fetch",
  initial: "inactive",
  context: {
    name: ""
  },
  states: {
    inactive: {
      on: {
        OPEN: {
          target: "active"
        }
      }
    },
    active: {
      on: {
        CHANGE: {
          actions: assign({ name: (_, { value }) => value })
        },
        SUBMIT: {
          target: "loading"
        },
        CLOSE: {
          target: "inactive"
        }
      }
    },
    loading: {
      invoke: {
        src: "fetchResource",
        onDone: "success",
        onError: "failure"
      }
    },
    success: {
      on: {
        CLOSE: {
          target: "inactive"
        },
        CHANGE_NAME: {
          target: "active"
        }
      }
    },
    failure: {
      on: {
        CLOSE: {
          target: "inactive"
        }
      }
    }
  }
});

export default fetchMachine;
