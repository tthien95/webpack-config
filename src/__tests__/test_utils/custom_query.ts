import { render, queries, RenderOptions } from '@testing-library/react';
import tableQueries from 'testing-library-table-queries';

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) => render(ui, { queries: { ...queries, ...tableQueries }, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
