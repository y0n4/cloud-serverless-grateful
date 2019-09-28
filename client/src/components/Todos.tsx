import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createTodo, deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Todo[]
  copyTodos: Todo[]
  newTodoName: string
  loadingTodos: boolean
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    copyTodos: [],
    newTodoName: '',
    loadingTodos: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  updateNameInput = (event: React.ChangeEvent<HTMLInputElement>, pos: number) => {
    let newCopy = JSON.parse(JSON.stringify(this.state.copyTodos));
    newCopy[pos].name = event.target.value;
    this.setState({ copyTodos: newCopy });
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        name: this.state.newTodoName,
        dueDate
      })
      this.setState({
        todos: [...this.state.todos, newTodo],
        copyTodos: [...this.state.todos, newTodo],
        newTodoName: '',
      })
    } catch {
      alert('Todo creation failed')
    }
  }

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter(todo => todo.todoId != todoId),
        copyTodos: this.state.copyTodos.filter(todo => todo.todoId !== todoId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onTodoCheck = async (pos: number, status: any) => {
    const todo = this.state.todos[pos]
    if (status) {
      try {
        const newTodo = this.state.copyTodos[pos]
        await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
          name: newTodo.name,
          dueDate: todo.dueDate,
          done: !todo.done
        })
        this.setState({
          todos: update(this.state.todos, {
            [pos]: { done: { $set: !todo.done }, name: { $set: newTodo.name } }
          })
        })
      } catch {
        alert('Todo update failed')
      }
    } else {
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      })
    }
  }

  async componentDidMount() {
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        copyTodos: todos,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">🌸 What are you grateful today? Journal it! 🌸</Header>
        <br />
        {this.renderCreateTodoInput()}

        {this.renderTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'pink',
              labelPosition: 'left',
              icon: 'add',
              content: 'Thank you!',
              onClick: this.onTodoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="I am grateful for being forunate enough to have clean water"
            value={this.state.newTodoName}
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.todos.map((todo, pos) => {
          return (
            <Grid.Row key={todo.todoId}>
              <Grid.Column width={1} verticalAlign="middle">
                {todo.done ? (
                  <Button
                    icon
                    color="green"
                    onClick={() => this.onTodoCheck(pos, 'save')}
                  >
                    <Icon name="save" />
                  </Button>
                ) : (
                  <Button
                    icon
                    color="orange"
                    onClick={() => this.onTodoCheck(pos, false)}
                  >
                    <Icon name="pencil" />
                  </Button>
                )}
                {/* <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={todo.done}
                /> */}
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {todo.done ? (
                  <Input
                    fluid
                    actionPosition="left"
                    placeholder={this.state}
                    value={this.state.copyTodos[pos].name}
                    onChange={(e) => this.updateNameInput(e, pos)}
                  />
                ) : todo.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {todo.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.todoId)}
                >
                  <Icon name="upload" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.todoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {todo.attachmentUrl && (
                <Image src={todo.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
