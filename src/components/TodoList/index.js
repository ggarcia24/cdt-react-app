import React from 'react';
import { List, Checkbox, Input, Button, Popconfirm, message } from 'antd';
import { gql, useMutation, useQuery } from '@apollo/client';

/** App theme */

/** GraphQL Queries */
const UPDATE_TODO = gql`
  mutation UpdateToDo($input: ToDoUpdateInput) {
    updateTodo(input: $input) {
      id
      createdAt
      description
      updatedAt
      dueDate
      completed
    }
  }
`;
const CREATE_TODO = gql`
  mutation createTodo($input: ToDoCreateInput!) {
    createTodo(input: $input) {
      id
      createdAt
      updatedAt
      completed
      description
      dueDate
    }
  }
`;
const DELETE_TODO = gql`
  mutation DeleteToDo($id: ID!) {
    deleteTodo(id: $id) {
      id
      createdAt
      description
      updatedAt
      dueDate
      completed
    }
  }
`;
export const LIST_TODOS = gql`
  query ListTodos {
    listToDos {
      id
      description
      completed
    }
  }
`;

export const TodoList = props => {
  const { loading, error, data } = useQuery(LIST_TODOS, {
    variables: { foo: 'bar' },
  });
  const [description, updateDescription] = React.useState('');
  const [updateToDoMutation] = useMutation(UPDATE_TODO);
  const [createToDoMutation] = useMutation(CREATE_TODO);
  const [deleteToDoMutation] = useMutation(DELETE_TODO);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  function handleCheck(event, item) {
    event.preventDefault();
    const completed =
      typeof item.completed === 'boolean' ? !item.completed : true;

    updateToDoMutation({
      variables: { input: { completed, id: item.id } },
      refetchQueries: [
        {
          query: LIST_TODOS,
        },
      ],
    })
      .then(res => message.success('Item updated successfully'))
      .catch(err => {
        message.error('Error occurred while updating item');
        console.log(err);
      });
  }

  function handleSubmit(event, item) {
    event.preventDefault();
    createToDoMutation({
      variables: { input: { description, dueDate: '2022-01-02T00:01:00Z' } },
      refetchQueries: [
        {
          query: LIST_TODOS,
        },
      ],
    })
      .then(res => message.success('Item created successfully'))
      .catch(err => {
        message.error('Error occurred while creating item');
        console.log(err);
      });
  }

  function handleKeyPress(event) {
    if (event.keyCode === 13) {
      // user pressed enter
      createToDoMutation({
        variables: { input: { description, dueDate: '2022-01-02T00:01:00Z' } },
        refetchQueries: [
          {
            query: LIST_TODOS,
          },
        ],
      })
        .then(res => {
          message.success('Item created successfully');
        })
        .catch(err => {
          message.error('Error occurred while creating item');
          console.log(err);
        });
    }
  }

  function handleDelete(event, item) {
    deleteToDoMutation({
      variables: { id: item.id },
      refetchQueries: [
        {
          query: LIST_TODOS,
        },
      ],
    })
      .then(res => {
        message.success('Deleted successfully');
      })
      .catch(err => {
        message.error('Error occurred while deleting item');
        console.log(err);
      });
  }

  return (
    <>
      <List
        header={
          <div style={{ display: 'flex' }}>
            <Input
              placeholder="Enter todo name"
              value={description}
              onChange={event => updateDescription(event.target.value)}
              style={{ marginRight: '10px' }}
              onKeyDown={handleKeyPress}
            />
            <Button name="add" onClick={handleSubmit}>
              add
            </Button>
          </div>
        }
        bordered
        dataSource={data.listToDos}
        renderItem={item => (
          <List.Item>
            <Checkbox
              checked={item.completed}
              onChange={event => handleCheck(event, item)}
            >
              {item.description}
            </Checkbox>
            <Popconfirm
              title="Are you sure to delete this item?"
              onConfirm={event => handleDelete(event, item)}
              okText="Yes"
              cancelText="No"
            >
              <a href="#">Delete</a>
            </Popconfirm>
          </List.Item>
        )}
      />
    </>
  );
};

export default TodoList;
