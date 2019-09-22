import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  componentWillReceiveProps({ data: { newNotification } }) {
    toast(`Produto ${newNotification.descricao} foi incluso!`);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Notificação</h1>
        </header>
        <ToastContainer />
      </div>
    );
  }
}

const subNewNotification = gql`
  subscription {
    newNotification {
      descricao
      estoque
    }
  }
`;

export default graphql(subNewNotification)(App);
