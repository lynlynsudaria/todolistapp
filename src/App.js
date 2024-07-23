import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';
import { withAuthenticator, Heading } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { createTodo, deleteTodo, updateTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';


import Navbar from './Navbar'; // Import the Navbar component

Amplify.configure(amplifyconfig);

const client = generateClient();

const HomePage = () => (
  <div>
    <Heading level={2}>Home Page</Heading>
  </div>
);

const TaskManager = ({ signOut, user }) => {
  const initialState = { id: '', name: '', description: '' };
  const [formState, setFormState] = React.useState(initialState);
  const [todos, setTodos] = React.useState([]);
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const todoData = await client.graphql({
        query: listTodos
      });
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      console.log('error fetching todos');
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      if (isEditing) {
        await updateExistingTodo();
      } else {
        await createNewTodo();
      }
    } catch (err) {
      console.log('error creating/updating todo:', err);
    }
  }

  async function createNewTodo() {
    const todo = { ...formState };
    setTodos([...todos, todo]);
    setFormState(initialState);
    await client.graphql({
      query: createTodo,
      variables: {
        input: todo
      }
    });
  }

  async function updateExistingTodo() {
    const todo = { ...formState };
    await client.graphql({
      query: updateTodo,
      variables: {
        input: { id: todo.id, name: todo.name, description: todo.description }
      }
    });
    const updatedTodos = todos.map(t => (t.id === todo.id ? todo : t));
    setTodos(updatedTodos);
    setFormState(initialState);
    setIsEditing(false);
  }

  async function editTodo(todo) {
    setFormState(todo);
    setIsEditing(true);
  }

  async function removeTodo(id) {
    try {
      await client.graphql({
        query: deleteTodo,
        variables: { input: { id } }
      });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.log('error deleting todo:', err);
    }
  }

  return (
    <div style={styles.container}>
      <Heading level={2}>Task Manager</Heading>
      <input
        onChange={(event) => setInput('name', event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <input
        onChange={(event) => setInput('description', event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <button style={styles.addButton} onClick={addTodo}>
        {isEditing ? 'Update Todo' : 'Create Todo'}
      </button>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th>Task</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo, index) => (
            <tr key={todo.id ? todo.id : index} style={styles.tableRow}>
              <td>{todo.name} - {todo.description}</td>
              <td>
                <FontAwesomeIcon
                  icon={faEdit}
                  onClick={() => editTodo(todo)}
                  style={{ ...styles.icon, ...styles.editIcon }}
                />
              </td>
              <td>
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => removeTodo(todo.id)}
                  style={{ ...styles.icon, ...styles.deleteIcon }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const App = ({ signOut, user }) => {
  return (
    <Router>
      <div>
        <Navbar user={user} signOut={signOut} />
        <div style={styles.mainContent}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/task-manager" element={<TaskManager signOut={signOut} user={user} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const styles = {
  container: {
    width: 600,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff',
    borderRadius: 10
  },
  input: {
    border: '1px solid #ccc',
    backgroundColor: '#f0f8ff',
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
    borderRadius: 5
  },
  addButton: {
    backgroundColor: 'green',
    color: 'white',
    outline: 'none',
    fontSize: 18,
    padding: '12px 0px',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    marginBottom: 10
  },
  table: {
    width: '100%',
    marginTop: 20,
    borderCollapse: 'collapse'
  },
  tableHeader: {
    backgroundColor: 'blue',
    color: 'white'
  },
  tableRow: {
    backgroundColor: '#f9f9f9',
    borderBottom: '1px solid #ddd'
  },
  icon: {
    cursor: 'pointer',
    fontSize: 20
  },
  editIcon: {
    color: 'orange'
  },
  deleteIcon: {
    color: 'red'
  },
  mainContent: {
    padding: '20px'
  }
};

export default withAuthenticator(App);
