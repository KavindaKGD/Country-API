import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CountryDetail from '../pages/CountryDetail';

describe('Country Detail Page', () => {
  test('renders loading indicator', () => {
    render(
      <BrowserRouter>
        <CountryDetail />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
