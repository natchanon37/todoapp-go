import React, { Component } from "react";
import axios from "axios";
import { Card, Header, Form, Input, Icon, Button } from "semantic-ui-react";

let endpoint = "http://localhost:8080";

class ToDoList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: "",
      items: [],
    };
  }

  componentDidMount() {
    this.getTask();
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  onSubmit = () => {
    let { task } = this.state;
    // console.log("pRINTING task", this.state.task);
    if (task) {
      axios
        .post(
          endpoint + "/api/task",
          {
            task,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((res) => {
          this.getTask();
          this.setState({
            task: "",
          });
          console.log(res);
        });
    }
  };

  getTask = () => {
    axios.get(endpoint + "/api/task").then((res) => {
      if (res.data) {
        this.setState({
          items: res.data.map((item) => {
            let color = "yellow";
            let style = {
              wordWrap: "break-word",
              color: "white",
            };

            if (item.status) {
              color = "green";
              style["textDecorationLine"] = "line-through";
            }

            return (
              <Card key={item._id} color={color} fluid>
                <Card.Content>
                  <Card.Header textAlign="left">
                    <div style={style}>{item.task}</div>
                  </Card.Header>

                  <Card.Meta textAlign="right">
                    <Button
                      size="large"
                      className="green"
                      onClick={() => this.updateTask(item._id)}
                    >
                      Done
                    </Button>
                    <Button
                      size="large"
                      color="yellow"
                      onClick={() => this.undoTask(item._id)}
                    >
                      Undo
                    </Button>
                    <Button
                      size="large"
                      color="red"
                      onClick={() => this.deleteTask(item._id)}
                    >
                      Delete
                    </Button>
                  </Card.Meta>
                </Card.Content>
              </Card>
            );
          }),
        });
      } else {
        this.setState({
          items: [],
        });
      }
    });
  };

  updateTask = (id) => {
    axios
      .put(endpoint + "/api/task/" + id, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        console.log(res);
        this.getTask();
      });
  };

  undoTask = (id) => {
    axios
      .put(endpoint + "/api/undoTask/" + id, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        console.log(res);
        this.getTask();
      });
  };

  deleteTask = (id) => {
    axios
      .delete(endpoint + "/api/deleteTask/" + id, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        console.log(res);
        this.getTask();
      });
  };

  render() {
    return (
      <div className="flex flex-col justify-center p-4 w-full ">
        <div className="flex justify-center m-4 text-5xl font-extrabold text-transparent  bg-clip-text bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
          TO DO LIST
        </div>
        <Form
          className="space-y-4"
          onSubmit={this.onSubmit}
          style={{
            margin: "auto",
            padding: "10px",
            width: "60%",
          }}
        >
          <Input
            type="text"
            name="task"
            onChange={this.onChange}
            value={this.state.task}
            fluid
            placeholder="Create Task"
          />
          <Button
            style={{
              backgroundColor: "#368cdb",
              borderRadius: "10px",
              color: "white",
            }}
          >
            Create Task
          </Button>
        </Form>

        <div className="font-bold mt-4">{this.state.items}</div>
      </div>
    );
  }
}

export default ToDoList;
