/* eslint-disable no-undef */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import Login from './Login';
import App from '../../App';

test('Test LOGIN functionality', () => {
  render(
    <Provider store={store}>
      <App><Login /></App>
    </Provider>,
  );
  const button = screen.getByTestId('login-button');
  fireEvent.click(button);
  expect(button).toBeDisabled();
});
