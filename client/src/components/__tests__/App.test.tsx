import { render, screen } from '@testing-library/react';
import App from '../../App';
import { DebugContext } from '../../contexts/DebugContext';

// Mock the DebugContext to provide a default value
const mockDebugContext = {
  isDebugMode: false,
  toggleDebugMode: () => {},
};

describe('App', () => {
  it('renders the landing page by default', () => {
    render(
      <DebugContext.Provider value={mockDebugContext}>
        <App />
      </DebugContext.Provider>
    );
    expect(screen.getByText('Sistema de Citas Clínicas')).toBeInTheDocument();
  });
});
