import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header';

describe('Header Component', () => {
  test('renders title and buttons', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // Check for title
    expect(screen.getByText(/country explorer/i)).toBeInTheDocument();

    // Check that both "Go to home page" buttons are rendered
    const homeButtons = screen.getAllByRole('button', { name: /go to home page/i });
    expect(homeButtons).toHaveLength(2); // title and navbar

    // Check for "Favorites" button
    expect(screen.getByRole('button', { name: /view favorites/i })).toBeInTheDocument();
  });
});
