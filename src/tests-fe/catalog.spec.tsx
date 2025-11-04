import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Catalog } from '../ui/public/Catalog';
import { seedService } from '../services/seed.service';

describe('Catalog', () => {
  beforeEach(() => {
    localStorage.clear();
    seedService.seedAll();
  });

  it('renderiza cards con datos del seed', async () => {
    render(<Catalog />);
    const cards = await screen.findAllByRole('heading', { level: 5 });
    expect(cards.length).toBeGreaterThanOrEqual(8);
  });
});


