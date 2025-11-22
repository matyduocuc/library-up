/**
 * Funciones de mapeo entre PrestamoDTO (backend) y LegacyLoan (frontend)
 * 
 * Convierte entre los DTOs del backend Spring Boot y los tipos del dominio frontend
 */
import type { PrestamoDTO } from '../api/loansApi';
import type { LegacyLoan } from '../domain/loan';

/**
 * Convierte PrestamoDTO (backend) a LegacyLoan (frontend)
 */
export function mapPrestamoDTOToLegacyLoan(dto: PrestamoDTO): LegacyLoan {
  // Mapear estado del backend a estado legacy
  let legacyStatus: LegacyLoan['status'] = 'pendiente';
  if (dto.estado) {
    const estado = dto.estado.toLowerCase();
    if (estado === 'activo' || estado === 'vigente') {
      legacyStatus = 'aprobado';
    } else if (estado === 'devuelto' || estado === 'finalizado') {
      legacyStatus = 'devuelto';
    } else if (estado === 'cancelado' || estado === 'rechazado') {
      legacyStatus = 'rechazado';
    }
  }

  return {
    id: dto.id.toString(),
    userId: dto.usuarioId.toString(),
    bookId: dto.ejemplarId.toString(), // ejemplarId en el backend corresponde a bookId en el frontend
    loanDate: dto.fechaPrestamo || new Date().toISOString(),
    dueDate: dto.fechaVencimiento || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    returnDate: dto.fechaDevolucion || undefined,
    status: legacyStatus,
  };
}

/**
 * Convierte un array de PrestamoDTO a LegacyLoan[]
 */
export function mapPrestamoDTOArrayToLegacyLoans(dtos: PrestamoDTO[]): LegacyLoan[] {
  return dtos.map(mapPrestamoDTOToLegacyLoan);
}

