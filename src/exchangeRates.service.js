import ApolloClient, { gql } from "apollo-boost";
import { InMemoryCache } from "@apollo/client";

class ExchangeRatesService {
  constructor(
    baseUrl = "https://48p1r2roz4.sse.codesandbox.io",
    port = undefined
  ) {
    this.baseUrl = baseUrl;
    this.port = port;
    let uri = baseUrl;
    if (port) {
      uri += `:${port}`;
    }
    this.client = new ApolloClient({
      uri,
      cache: new InMemoryCache(),
    });
  }

  async getRates() {
    const res = await this.client.query({
      query: gql`
        query GetExchangeRates {
          rates(currency: "USD") {
            currency
            rate
          }
        }
      `,
      variables: {
        foo: "bar",
      },
    });
    // console.log(res);
    return res;
  }
}

export default ExchangeRatesService;
