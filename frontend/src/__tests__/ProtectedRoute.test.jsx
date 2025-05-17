import { render, screen } from '@testing-library/react';
import ProtectedRoute from '../components/ProtectedRoute';
import { MemoryRouter } from 'react-router-dom';

describe('ProtectedRoute', () => {
  test('redirects to login if no token found', () => {
    localStorage.removeItem('token'); // clear token

    render(
      <MemoryRouter initialEntries={['/home']}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
  });
});
