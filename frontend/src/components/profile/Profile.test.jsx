/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import Profile from './Profile';
import App from '../../App';

test('Test Profile functionality', () => {
  render(
    <Provider store={store}>
      <App><Profile /></App>
    </Provider>,
  );
  const button = screen.queryByTestId('profileform-submit');
  expect(button).toBeNull();
});
