import React from "react";
import { createMachine } from "xstate";
import { render, cleanup } from "@testing-library/react";
import user from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { createModel } from "@xstate/test";
import Fetch from "./Fetch";

const mockMachine = createMachine({
  id: "fetchTest",
  initial: "inactive",
  states: {
    inactive: {
      on: {
        OPEN: "active"
      },
      meta: {
        test: ({ getByText }) => {
          expect(getByText(/open/i)).toBeInTheDocument();
        }
      }
    },
    active: {
      on: {
        SUBMIT: "success",
        CLOSE: "inactive"
      },
      meta: {
        test: ({ getByText }) => {
          expect(getByText(/submit/i)).toBeInTheDocument();
          expect(getByText(/close/i)).toBeInTheDocument();
        }
      }
    },
    success: {
      on: {
        "": "inactive"
      }
    }
  }
});

const fetchModel = createModel(mockMachine).withEvents({
  OPEN: ({ getByText }) => user.click(getByText(/open/i)),
  SUBMIT: ({ getByText }) => user.click(getByText(/submit/i))
});

describe("fetch positive", () => {
  const testPlans = fetchModel.getSimplePathPlans();

  const mockResource = jest.fn(() =>
    setTimeout(() => {
      return Promise.resolve();
    })
  );

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach((path) => {
        it(path.description, async () => {
          const rendered = render(<Fetch resource={mockResource} />);
          await path.test(rendered);
        });
      });
    });
  });
});
