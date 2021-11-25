import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import App from "../App";

test("renders learn react link", () => {
  render(
    <MockedProvider>
      <App />
    </MockedProvider>
  );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
