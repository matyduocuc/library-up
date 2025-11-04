import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { LoansAdmin } from '../ui/admin/LoansAdmin';
import { seedService } from '../services/seed.service';
import { loanService } from '../services/loan.service';
import type { LegacyLoan } from '../domain/loan';

describe('LoansAdmin', () => {
  beforeEach(() => {
    localStorage.clear();
    seedService.seedAll();
  });

  it('cambia estado tras aprobar', async () => {
    // Crear un préstamo pendiente primero
    const mockLoan: LegacyLoan = {
      id: 'loan1',
      userId: 'u1',
      bookId: 'b1',
      loanDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      status: 'pendiente'
    };
    loanService.saveAll([mockLoan]);

    render(<LoansAdmin />);
    const approveBtn = await screen.findByRole('button', { name: /aprobar/i });
    await userEvent.click(approveBtn);
    
    const loans = loanService.getAll();
    expect(loans.some(l => l.status === 'aprobado')).toBe(true);
  });
});


