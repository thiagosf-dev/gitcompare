// libraries
import React, { Component } from 'react';
import moment from 'moment';

// styles
import { Container, Form } from './style';

// images
import logo from '../../assets/logo.png';

// components
import CompareList from '../../components/CompareList';

// services
import api from '../../services/api';

export default class Main extends Component {
  state = {
    repositoryInput: '',
    repositories: [],
    repositoryError: false,
    loading: false,
  };

  _handleAddRepository = async (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    try {
      const { data: repository } = await api.get(`/repos/${this.state.repositoryInput}`);

      repository.lastCommit = moment(repository.pushed_at).fromNow();

      this.setState({
        repositoryInput: '',
        repositories: [...this.state.repositories, repository],
        repositoryError: false,
      });
    } catch (error) {
      console.log(error);
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  _renderButtonSpinner = _ => <i className="fa fa-spinner fa-pulse" />;

  render() {
    return (
      <Container>
        <img src={logo} alt="GitHub Compare" />

        <Form
          withError={this.state.repositoryError}
          onSubmit={event => this._handleAddRepository(event)}
        >
          <input
            type="text"
            placeholder="usuário/repositório"
            value={this.state.repositoryInput}
            onChange={event => this.setState({ repositoryInput: event.target.value })}
            disabled={this.state.loading}
          />

          <button type="submit">{this.state.loading ? this._renderButtonSpinner() : 'OK'}</button>
        </Form>

        <label>
          <small>
            Ex.:{' '}
            <i>
              <b>vuejs/vue</b>
            </i>
          </small>
        </label>

        <CompareList repositories={this.state.repositories} />
      </Container>
    );
  }
}
