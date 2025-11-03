import type { Book } from '../domain/book';
import type { User } from '../domain/user';
import type { Loan } from '../domain/loan';
import { storageService } from './storage.service';

const BOOKS: Book[] = [
  { id:'b1', title:'Clean Code', author:'Robert C. Martin', category:'Programación', status:'disponible' },
  { id:'b2', title:'Design Patterns', author:'GoF', category:'Programación', status:'prestado' },
  { id:'b3', title:'Redes de Computadores', author:'Tanenbaum', category:'Redes', status:'disponible' },
  { id:'b4', title:'Refactoring', author:'Martin Fowler', category:'Programación', status:'disponible' },
  { id:'b5', title:'Introducción a Bases de Datos', author:'Elmasri & Navathe', category:'Base de Datos', status:'disponible' },
  { id:'b6', title:'Estructuras de Datos', author:'Weiss', category:'Programación', status:'mantenimiento' },
  { id:'b7', title:'Sistemas Operativos Modernos', author:'Tanenbaum', category:'Sistemas', status:'disponible' },
  { id:'b8', title:'Computer Networks', author:'Kurose & Ross', category:'Redes', status:'disponible' },
  { id:'b9', title:'Patrones de Arquitectura', author:'Buschmann', category:'Arquitectura', status:'disponible' }
];

const USERS: User[] = [
  { id:'u1', name:'Admin', email:'admin@libra.dev', role:'Admin' },
  { id:'u2', name:'Maty', email:'maty@libra.dev', role:'User' },
  { id:'u3', name:'Cami', email:'cami@libra.dev', role:'User' }
];

const LOANS: Loan[] = [
  { id:'l1', userId:'u2', bookId:'b2', loanDate:'2025-10-01T00:00:00.000Z', dueDate:'2025-10-15T00:00:00.000Z', status:'aprobado' },
  { id:'l2', userId:'u3', bookId:'b3', loanDate:'2025-10-10T00:00:00.000Z', dueDate:'2025-10-24T00:00:00.000Z', status:'pendiente' }
];

export const seedService = {
  seedAll(): void {
    const hasBooks = storageService.read<Book[]>(storageService.keys.books, []).length > 0;
    const hasUsers = storageService.read<User[]>(storageService.keys.users, []).length > 0;
    const hasLoans = storageService.read<Loan[]>(storageService.keys.loans, []).length > 0;

    if (!hasBooks) storageService.write(storageService.keys.books, BOOKS);
    if (!hasUsers) storageService.write(storageService.keys.users, USERS);
    if (!hasLoans) storageService.write(storageService.keys.loans, LOANS);
  }
};


