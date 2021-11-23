import { pactWith } from "jest-pact";
import HeroService from "../hero.service";
import { Matchers } from "@pact-foundation/pact";
import Hero from "../hero";

import pactConfig from "../../test/contract/pact.config";

const contentTypeJsonMatcher = Matchers.term({
  matcher: "application\\/json; *charset=utf-8",
  generate: "application/json; charset=utf-8",
});
pactWith(
  {
    ...pactConfig,
    provider: "HeroProvider",
  },
  (provider) => {
    describe("HeroService REST API", () => {
      const heroService = new HeroService("http://localhost", pactConfig.port);

      describe("createHero()", () => {
        afterEach(() => provider.verify());

        it("provider maintains contract", async () => {
          await provider.addInteraction({
            state: "provider allows hero creation",
            uponReceiving: "a POST request to create a hero",
            withRequest: {
              method: "POST",
              path: "/heroes",
              headers: {
                Accept: "application/json",
                "Content-Type": contentTypeJsonMatcher,
              },
              body: new Hero("Superman", "flying", "DC"),
            },
            willRespondWith: {
              status: 201,
              headers: {
                "Content-Type": contentTypeJsonMatcher,
              },
              body: Matchers.somethingLike(
                new Hero("Superman", "flying", "DC", 42)
              ),
            },
          });
          const res = await heroService.createHero(
            new Hero("Superman", "flying", "DC")
          );
          // console.log(res);
          expect(res.data.id).toEqual(42);
        });
      });
    });
  }
);
