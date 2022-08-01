import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GraphQLInteraction, Matchers } from '@pact-foundation/pact';
import { pactWith } from 'jest-pact';
import { InMemoryCache, ApolloClient, ApolloProvider } from '@apollo/client';
import pactConfig from '../../../test/contract/pact.config';
import TodoList from '.';

pactWith(
  {
    ...pactConfig,
    provider: 'cdt-backend',
  },
  provider => {
    describe('TodoListComponent', () => {
      let client = new ApolloClient({
        uri: `http://${pactConfig.host}:${pactConfig.port}/graphql`,
        cache: new InMemoryCache(),
      });

      beforeAll(() => {
        jest.useFakeTimers();
      });

      afterAll(() => {
        jest.useRealTimers();
      });

      beforeEach(async () => {
        const graphqlInteraction = new GraphQLInteraction()
          .given('some ToDos exist on the database')
          .uponReceiving('a query to list the ToDos')
          .withQuery(
            `query ListTodos {
            listToDos {
              id
              description
              completed
              __typename
            }
          }`
          )
          .withOperation('ListTodos')
          .withRequest({
            path: '/graphql',
            method: 'POST',
          })
          // .withVariables({
          //   foo: "bar",
          // })
          .willRespondWith({
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            },
            body: {
              data: {
                listToDos: Matchers.eachLike({
                  id: Matchers.uuid(),
                  description: Matchers.string(),
                  completed: Matchers.boolean(),
                }),
              },
            },
          });
        await provider.addInteraction(graphqlInteraction);
      });

      afterEach(() => provider.verify());

      it('listToDos', async () => {
        const { findByText } = render(
          <ApolloProvider client={client}>
            <TodoList />
          </ApolloProvider>
        );

        findByText(/Loading/i);

        // advance the timers by a second to kick off the first request
        act(() => jest.advanceTimersByTime(1000));
      });
    });
  }
);
