import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom'

export default function root_init(node) {
  let t = window.tasks;
  ReactDOM.render(<Root tasks={t}/>, node);
}

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login_form: {name: "", password: ""},
      session: null,
      tasks: props.tasks,
      users: [],
      editingTaskId: -1
    }
  }

  register() {
    $.ajax("/api/v1/register", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(this.state.login_form),
      success: (resp) => {
        let new_state = _.assign({}, this.state, {session: resp.data});
        this.setState(new_state);
      }
    });
  }

  login() {
    $.ajax("/api/v1/auth", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(this.state.login_form),
      success: (resp) => {
        let new_state = _.assign({}, this.state, {session: resp.data});
        this.setState(new_state);
      }
    });
  }

  logout() {
    let new_state = _.assign({}, this.state, {session: null});
    this.setState(new_state);
  }

  changePW() {
    $("#pw-change-message").text("");
    var enp = $("#enp").val();
    var cnp = $("#cnp").val();
    if (enp == cnp) {
      let changePWdata = {
        id: this.state.session.user_id,
        user: {
          new_pass: enp
        }
      };
      $.ajax("/api/v1/edituser", {
        method: "post",
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(changePWdata),
        success: (resp) => {
          let new_state = _.assign({}, this.state, {session: resp.data});
          this.setState(new_state);
          $("#pw-change-message").text("Successfully changed password");
        }
      });
    }
  }

  createTask() {
    $("new-task-message").text("");
    var createTaskData = {
      task: {
        title: $("#t").val(),
        description: $("#d").val(),
        minutes_worked_on: Number($("#m").val()),
        completed: ($("#c").val() == "on"),
        user_id: Number($("#b").val())
      },
      user: this.state.session.user_id
    }
    $.ajax("/api/v1/createtask", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(createTaskData),
      success: (resp) => {
        $("#new-task-message").text("Successfully created task");
      }
    });
  }

  setEditingTaskId(id) {
    let new_state = _.assign({}, this.state, {editingTaskId: id});
    this.setState(new_state);
  }

  editTask() {
    $("edit-task-message").text("");
    var editTaskData = {
      id: this.state.editingTaskId,
      task: {
        title: $("#et").val(),
        description: $("#ed").val(),
        minutes_worked_on: Number($("#em").val()),
        completed: ($("#ec").val() == "on"),
        user_id: Number($("#eb").val())
      },
      user: this.state.session.user_id
    }
    $.ajax("/api/v1/edittask", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(editTaskData),
      success: (resp) => {
        $("#edit-task-message").text("Successfully edited task");
      }
    });
  }

  update_login_form(data) {
    let new_form = _.assign({}, this.state.login_form, data);
    let new_state = _.assign({}, this.state, {login_form: new_form});
    this.setState(new_state);
  }

  fetch_users() {
    $.ajax("/api/v1/users", {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: "",
      success: (resp) => {
        let new_state = _.assign({}, this.state, { users: resp.data });
        this.setState(new_state);
      },
    });
  }

  fetch_tasks() {
    $.ajax("/api/v1/tasks", {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: "",
      success: (resp) => {
        let new_state = _.assign({}, this.state, { tasks: resp.data });
        this.setState(new_state);
      },
    });
  }

  render() {
    return (<div>
      <Router>
        <div>
          <Header session={this.state.session} root={this} />
          <Route path="/tasks" exact={true} render={ () =>
            <TaskList tasks={this.state.tasks} session={this.state.session} root={this} />
          } />
          <Route path="/users" exact={true} render={ () =>
            <UserList users={this.state.users} />
          } />
          <Route path="/edituser" exact={true} render={ () =>
            <EditPWForm session={this.state.session} root={this} />
          } />
          <Route path="/newtask" exact={true} render={ () =>
            <NewTaskForm root={this} />
          } />
          <Route path="/edittask" exact={true} render={ () =>
            <EditTaskForm root={this} />
          } />
        </div>
      </Router>
    </div>);
  }
}

function Header(props) {
  let {root, session} = props;
  let session_info;
  if (session == null) {
    session_info = (<div className="form-inline my-2">
      <input type="text" placeholder="username"
        onChange={(ev) => root.update_login_form({name: ev.target.value})} />
      <input type="password" placeholder="password"
        onChange={(ev) => root.update_login_form({password: ev.target.value})} />
      <button className="btn btn-secondary" onClick={() => root.login()}>Login</button>
      <button className="btn btn-secondary" onClick={() => root.register()}>Register</button>
    </div>);
  } else {
    session_info = (<div className="my-2">
      <p className="text-success">Logged in as: {root.state.login_form.name}</p>
      <p className="text-success">My ID: {session.user_id}</p>
      <button className="btn btn-secondary" onClick={() => root.logout()}>Logout</button>
      <p><Link to={"/edituser"}>Change Password</Link></p>
    </div>);
  }
  return (<div className="row my-2 bg-dark">
    <div className="col-3">
      <h1><Link to={"/"}>Task Tracker</Link></h1>
    </div>
    <div className="col-2">
      <p><Link to={"/users"} onClick={root.fetch_users.bind(root)}>User Directory</Link></p>
    </div>
    <div className="col-2">
      <p><Link to={"/tasks"} onClick={root.fetch_tasks.bind(root)}>My Tasks</Link></p>
    </div>
    <div className="col-3">
      {session_info}
    </div>
  </div>);
}

function EditTaskForm(props) {
  return (<div>
    <p><strong>Edit Task:</strong></p>
    <p>Title: <input type="text" id="et"/></p>
    <p>Description: <input type="text"  id="ed"/></p>
    <p>Minutes worked on: <input type="number" step="15" id="em"/></p>
    <p>Completed: <input type="checkbox" id="ec"/></p>
    <p>Belongs to: <input type="number" placeholder="Enter a user ID" id="eb"/></p>
    <button className="btn btn-secondary" onClick={() => props.root.editTask()}>Submit</button>
    <p id="edit-task-message"></p>
  </div>);
}

function NewTaskForm(props) {
  return (<div>
    <p><strong>New Task:</strong></p>
    <p>Title: <input type="text" id="t"/></p>
    <p>Description: <input type="text"  id="d"/></p>
    <p>Minutes worked on: <input type="number" step="15" id="m"/></p>
    <p>Completed: <input type="checkbox" id="c"/></p>
    <p>Belongs to: <input type="number" placeholder="Enter a user ID" id="b"/></p>
    <button className="btn btn-secondary" onClick={() => props.root.createTask()}>Submit</button>
    <p id="new-task-message"></p>
  </div>);
}

function EditPWForm(props) {
  return (<div>
    <p><input type="password" placeholder="Enter new password" id="enp"/></p>
    <p><input type="password" placeholder="Confirm new password" id="cnp"/></p>
    <button className="btn btn-secondary" onClick={() => props.root.changePW()}>Submit</button>
    <p id="pw-change-message"></p>
  </div>);
}

function UserList(props) {
  let rows = _.map(props.users, (uu) => <User key={uu.id} user={uu} />);
  return (<div className="row">
    <div className="col-12">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Username</th>
            <th>Id</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  </div>);
}

function User(props) {
  let {user} = props;
  return (<tr>
    <td>{user.name}</td>
    <td>{user.id}</td>
  </tr>);
}

function TaskList(props) {
  if (props.session != null) {
    let rows = _.map(_.filter(props.tasks, (t) => t.user_id == props.session.user_id), (tt) => <Task key={tt.id} task={tt} root={props.root} />);
    return (<div>
      <div className="row">
        <div className="col-12">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Minutes worked on</th>
                <th>Completed?</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      </div>
      <Link to={"/newtask"}>New Task</Link>
    </div>);
  } else {
    return (<p>You must be logged in to view Tasks</p>);
  }
}

function Task(props) {
  let {task} = props;
  let isCompleted;
  if (task.completed) {
    isCompleted = "Yes";
  } else {
    isCompleted = "No";
  }
  return (<tr>
    <td>{task.title}</td>
    <td>{task.description}</td>
    <td>{task.minutes_worked_on}</td>
    <td>{isCompleted}</td>
    <td><Link to={"/edittask"} onClick={() => props.root.setEditingTaskId(task.id)}>Edit</Link></td>
  </tr>);
}
