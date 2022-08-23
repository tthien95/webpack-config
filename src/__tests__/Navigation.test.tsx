import { cleanup, render, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../components/Navigation/Navigation';

describe('Navigation', () => {
  afterAll(cleanup);

  it('should match snapshot', () => {
    const { container } = render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
    expect(within(container).getByRole('banner')).toMatchSnapshot();
  });
});
