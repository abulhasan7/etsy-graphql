/* eslint-disable no-undef */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import Register from './Register';

test('Test register functionality', () => {
  render(
    <Provider store={store}>
      <Register />
    </Provider>,
  );
  const button = screen.getByTestId('register-button');
  fireEvent.click(button);
  expect(button).toBeDisabled();
});
