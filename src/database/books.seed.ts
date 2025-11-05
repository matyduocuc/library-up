/**
 * Seeds de libros precargados
 * 
 * Reubicado desde seed.service.ts para mejor organización.
 * NO cambiar estructura, solo exportarlos desde aquí.
 */
import type { Book } from '../domain/book';

export const booksSeed: Book[] = [
  {
    id: 'b1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Programación',
    status: 'disponible',
    coverUrl: '', // Imagen local: /img/books/clean-code.jpg
    description: 'Principios y buenas prácticas para escribir código claro y mantenible.'
  },
  {
    id: 'b2',
    title: 'Design Patterns',
    author: 'GoF',
    category: 'Programación',
    status: 'prestado',
    coverUrl: '', // Imagen local: /img/books/design-patterns.jpg
    description: 'Catálogo de patrones clásicos orientados a objetos.'
  },
  {
    id: 'b3',
    title: 'Fundamentos de Bases de Datos',
    author: 'Elmasri & Navathe',
    category: 'Base de Datos',
    status: 'disponible',
    coverUrl: '', // Imagen local: /img/books/fundamentos-de-bases-de-datos.jpg
    description: 'Modelado, diseño e implementación de bases de datos relacionales.'
  },
  {
    id: 'b4',
    title: 'You Don\'t Know JS',
    author: 'Kyle Simpson',
    category: 'Programación',
    status: 'disponible',
    coverUrl: '', // Imagen local: /img/books/you-dont-know-js.jpg
    description: 'Conceptos profundos de JavaScript explicados con claridad.'
  },
  {
    id: 'b5',
    title: 'Refactoring',
    author: 'Martin Fowler',
    category: 'Programación',
    status: 'disponible',
    coverUrl: '', // Imagen local: /img/books/refactoring.jpg
    description: 'Técnicas para mejorar diseño de código sin cambiar su conducta.'
  },
  {
    id: 'b6',
    title: 'Sistemas Operativos Modernos',
    author: 'Tanenbaum',
    category: 'Sistemas',
    status: 'disponible',
    coverUrl: '', // Imagen local: /img/books/sistemas-operativos-modernos.jpg
    description: 'Conceptos y diseño de sistemas operativos.'
  },
  {
    id: 'b7',
    title: 'Computer Networks',
    author: 'Kurose & Ross',
    category: 'Redes',
    status: 'disponible',
    coverUrl: '', // Imagen local: /img/books/computer-networks.jpg
    description: 'Fundamentos de redes de computadoras.'
  },
  {
    id: 'b8',
    title: 'Patrones de Arquitectura',
    author: 'Buschmann',
    category: 'Arquitectura',
    status: 'disponible',
    coverUrl: '', // Imagen local: /img/books/patrones-de-arquitectura.jpg
    description: 'Patrones para arquitectura de software.'
  }
];


