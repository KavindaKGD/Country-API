import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';

describe('Login Page', () => {
  test('renders login form inputs and button', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Get inputs specifically
    const emailInput = screen.getByLabelText('Email Address', { selector: 'input' });
    const passwordInput = screen.getByLabelText('Password', { selector: 'input' });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
