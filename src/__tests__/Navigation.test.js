import { cleanup, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../components/Navigation/Navigation';

describe('Navigation', () => {
  afterAll(cleanup);

  it('should match snapshot', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
    expect(asFragment(<Navigation />)).toMatchSnapshot();
  });
});
