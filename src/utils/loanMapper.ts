/**
 * Funciones simples para convertir préstamos del backend al formato del frontend
 * 
 * El backend usa nombres en español (PrestamoDTO)
 * El frontend usa nombres en inglés (LegacyLoan)
 */
import type { PrestamoDTO } from '../api/loansApi';
import type { LegacyLoan } from '../domain/loan';

/**
 * Convierte un préstamo del backend a formato del frontend
 * Cambia nombres: usuarioId -> userId, ejemplarId -> bookId, etc.
 */
export function mapPrestamoDTOToLegacyLoan(dto: PrestamoDTO): LegacyLoan {
  // Convertir estado del backend al estado del frontend
  let estado: LegacyLoan['status'] = 'pendiente';
  if (dto.estado) {
    const estadoLower = dto.estado.toLowerCase();
    if (estadoLower === 'activo' || estadoLower === 'vigente') {
      estado = 'aprobado';
    } else if (estadoLower === 'devuelto' || estadoLower === 'finalizado') {
      estado = 'devuelto';
    } else if (estadoLower === 'cancelado' || estadoLower === 'rechazado') {
      estado = 'rechazado';
    }
  }

  // Retornar préstamo en formato del frontend
  return {
    id: dto.id.toString(),
    userId: dto.usuarioId.toString(),
    bookId: dto.ejemplarId.toString(), // ejemplarId = bookId
    loanDate: dto.fechaPrestamo || new Date().toISOString(),
    dueDate: dto.fechaVencimiento || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    returnDate: dto.fechaDevolucion || undefined,
    status: estado,
  };
}

/**
 * Convierte un array de préstamos del backend al formato del frontend
 */
export function mapPrestamoDTOArrayToLegacyLoans(dtos: PrestamoDTO[]): LegacyLoan[] {
  return dtos.map(mapPrestamoDTOToLegacyLoan);
}

