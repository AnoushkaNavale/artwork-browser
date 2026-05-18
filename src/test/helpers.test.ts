import { describe, it, expect } from 'vitest';
import { truncate, stripHtml, getDecade, groupBy, cn } from '../utils/helpers';

describe('truncate', () => {
  it('returns empty string for null', () => {
    expect(truncate(null, 10)).toBe('');
  });
  it('returns unchanged if shorter than limit', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });
  it('truncates with ellipsis', () => {
    const result = truncate('hello world long title', 10);
    expect(result.endsWith('…')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(11);
  });
});

describe('stripHtml', () => {
  it('returns empty for null', () => {
    expect(stripHtml(null)).toBe('');
  });
  it('removes html tags', () => {
    expect(stripHtml('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
  });
  it('collapses whitespace', () => {
    expect(stripHtml('<p>  A   B  </p>')).toBe('A B');
  });
});

describe('getDecade', () => {
  it('returns Unknown for null', () => {
    expect(getDecade(null)).toBe('Unknown');
  });
  it('returns correct decade', () => {
    expect(getDecade(1895)).toBe('1890s');
    expect(getDecade(1900)).toBe('1900s');
    expect(getDecade(2023)).toBe('2020s');
  });
});

describe('groupBy', () => {
  it('groups items by key', () => {
    const items = [
      { dept: 'A', name: 'x' },
      { dept: 'B', name: 'y' },
      { dept: 'A', name: 'z' },
    ];
    const result = groupBy(items, i => i.dept);
    expect(result['A']).toHaveLength(2);
    expect(result['B']).toHaveLength(1);
  });
});

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });
  it('filters falsy values', () => {
    expect(cn('a', null, undefined, false, 'b')).toBe('a b');
  });
});
