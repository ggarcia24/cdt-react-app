import TestRenderer from "react-test-renderer";
import { MockedProvider } from "@apollo/client/testing";
import { LIST_TODOS, DataList } from "../DataList.component";

const mocks = [
  {
    request: {
      query: LIST_TODOS,
      variables: {},
      //   name: "Buck",
      // },
    },
    result: {
      data: {
        listToDos: {
          id: "adde43e8-f43f-433e-b37d-30cdf58afae2",
          description: "Hello World",
          createdAt: "2021-11-23T23:17:45.120Z",
          updatedAt: "2021-11-23T23:17:45.120Z",
          dueDate: "2022-01-01T00:01:00Z",
          completed: null,
        },
      },
    },
  },
];

describe("DataList.component", () => {
  xit("renders without error", () => {
    const component = TestRenderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DataList />
      </MockedProvider>
    );

    const tree = component.toJSON();
    expect(tree.children).toContain("Loading...");
  });

  it("Shows a list of items", () => {
    const component = TestRenderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DataList />
      </MockedProvider>
    );
  });
});
