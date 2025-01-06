import { render, screen } from '@testing-library/demobuilder';
import DemoBuilder from './DemoBuilder';

test('renders learn demobuilder link', () => {
  render(<DemoBuilder />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
