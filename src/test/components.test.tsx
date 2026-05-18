import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../components/ui/SearchBar';
import { ErrorState, EmptyState } from '../components/ui/ErrorState';
import { Pagination } from '../components/ui/Pagination';

describe('SearchBar', () => {
  it('renders with placeholder', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('calls onChange when typed', () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Monet' } });
    expect(onChange).toHaveBeenCalledWith('Monet');
  });

  it('shows clear button when value exists', () => {
    render(<SearchBar value="Monet" onChange={() => {}} />);
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('does not show clear button when empty', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });
});

describe('ErrorState', () => {
  it('renders default message', () => {
    render(<ErrorState />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders retry button when callback provided', () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    const btn = screen.getByText('Try Again');
    fireEvent.click(btn);
    expect(onRetry).toHaveBeenCalledOnce();
  });
});

describe('EmptyState', () => {
  it('renders with query text', () => {
    render(<EmptyState query="Picasso" />);
    expect(screen.getByText(/No results for "Picasso"/i)).toBeInTheDocument();
  });

  it('renders clear button when callback provided', () => {
    const onClear = vi.fn();
    render(<EmptyState onClear={onClear} />);
    fireEvent.click(screen.getByText('Clear filters'));
    expect(onClear).toHaveBeenCalledOnce();
  });
});

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    totalItems: 200,
    limit: 20,
    onPageChange: vi.fn(),
    onLimitChange: vi.fn(),
  };

  it('renders page numbers', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('disables prev on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    expect(screen.getByTitle('First page')).toBeDisabled();
    expect(screen.getByTitle('Previous page')).toBeDisabled();
  });

  it('calls onPageChange when page clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} currentPage={3} />);
    fireEvent.click(screen.getByTitle('Next page'));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });
});
