import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Favorites from '../pages/Favorites';

describe('Favorites Page', () => {
  test('shows loading indicator', () => {
    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
