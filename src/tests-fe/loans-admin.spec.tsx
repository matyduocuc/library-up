import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoansAdmin } from '../ui/admin/LoansAdmin';
import { seedService } from '../services/seed.service';
import { loanService } from '../services/loan.service';

describe('LoansAdmin', () => {
  beforeEach(() => {
    localStorage.clear();
    seedService.seedAll();
  });

  it('cambia estado tras aprobar', async () => {
    render(<LoansAdmin />);
    const approveBtn = await screen.findByRole('button', { name: /aprobar/i });
    await userEvent.click(approveBtn);
    const loans = loanService.getAll();
    expect(loans.some(l => l.status === 'aprobado')).toBe(true);
  });
});


