import { GraphQLInteraction, Matchers } from "@pact-foundation/pact";
import ExchangeRatesService from "../exchangeRates.service";
import { pactWith } from "jest-pact";

import pactConfig from "../../tests/contract/pact.config";

pactWith(
  {
    ...pactConfig,
    provider: "ExchangeRatesService",
  },
  (provider) => {
    describe("ExchangeRates GraphQL API", () => {
      const gqlService = new ExchangeRatesService(
        "http://localhost",
        pactConfig.port
      );

      describe("getRates()", () => {
        afterEach(() => provider.verify());

        it("do something", async () => {
          const graphqlInteraction = new GraphQLInteraction()
            .given("ExchangeRates are present")
            .uponReceiving("a query to fetch exchange rates")
            .withQuery(
              `query GetExchangeRates {
              rates(currency: "USD") {
                currency
                rate
                __typename
              }
            }`
            )
            .withOperation("GetExchangeRates")
            .withRequest({
              path: "/",
              method: "POST",
            })
            .withVariables({
              foo: "bar",
            })
            .willRespondWith({
              status: 200,
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
              body: {
                data: {
                  rates: Matchers.eachLike({
                    currency: "ARS",
                    rate: "100.3054",
                  }),
                },
              },
            });
          await provider.addInteraction(graphqlInteraction);

          const res = await gqlService.getRates();
          expect(res.data.rates).toEqual([
            {
              currency: "ARS",
              rate: "100.3054",
            },
          ]);
        });
      });
    });
  }
);
