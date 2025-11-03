import type { Book } from '../domain/book';
import type { User } from '../domain/user';
import type { Loan } from '../domain/loan';
import { storageService } from './storage.service';
import { sha256 } from './hash.util';

const BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Programación',
    status: 'disponible',
    coverUrl: 'https://picsum.photos/seed/clean-code/600/900',
    bannerUrl: 'https://picsum.photos/seed/clean-code-banner/1200/300',
    description: 'Principios y buenas prácticas para escribir código claro y mantenible.'
  },
  {
    id: 'b2',
    title: 'Design Patterns',
    author: 'GoF',
    category: 'Programación',
    status: 'prestado',
    coverUrl: 'https://picsum.photos/seed/design-patterns/600/900',
    bannerUrl: 'https://picsum.photos/seed/design-patterns-banner/1200/300',
    description: 'Catálogo de patrones clásicos orientados a objetos.'
  },
  {
    id: 'b3',
    title: 'Fundamentos de Bases de Datos',
    author: 'Elmasri & Navathe',
    category: 'Base de Datos',
    status: 'disponible',
    coverUrl: 'https://picsum.photos/seed/db-fundamentals/600/900',
    bannerUrl: 'https://picsum.photos/seed/db-fundamentals-banner/1200/300',
    description: 'Modelado, diseño e implementación de bases de datos relacionales.'
  },
  {
    id: 'b4',
    title: 'Refactoring',
    author: 'Martin Fowler',
    category: 'Programación',
    status: 'disponible',
    coverUrl: 'https://picsum.photos/seed/refactoring/600/900',
    bannerUrl: 'https://picsum.photos/seed/refactoring-banner/1200/300',
    description: 'Técnicas para mejorar el diseño interno del software.'
  },
  {
    id: 'b5',
    title: 'Estructuras de Datos',
    author: 'Weiss',
    category: 'Programación',
    status: 'mantenimiento',
    coverUrl: 'https://picsum.photos/seed/data-structures/600/900',
    bannerUrl: 'https://picsum.photos/seed/data-structures-banner/1200/300',
    description: 'Implementación y análisis de estructuras de datos.'
  },
  {
    id: 'b6',
    title: 'Sistemas Operativos Modernos',
    author: 'Tanenbaum',
    category: 'Sistemas',
    status: 'disponible',
    coverUrl: 'https://picsum.photos/seed/modern-os/600/900',
    bannerUrl: 'https://picsum.photos/seed/modern-os-banner/1200/300',
    description: 'Conceptos y diseño de sistemas operativos.'
  },
  {
    id: 'b7',
    title: 'Computer Networks',
    author: 'Kurose & Ross',
    category: 'Redes',
    status: 'disponible',
    coverUrl: 'https://picsum.photos/seed/computer-networks/600/900',
    bannerUrl: 'https://picsum.photos/seed/computer-networks-banner/1200/300',
    description: 'Fundamentos de redes de computadoras.'
  },
  {
    id: 'b8',
    title: 'Patrones de Arquitectura',
    author: 'Buschmann',
    category: 'Arquitectura',
    status: 'disponible',
    coverUrl: 'https://picsum.photos/seed/architecture-patterns/600/900',
    bannerUrl: 'https://picsum.photos/seed/architecture-patterns-banner/1200/300',
    description: 'Patrones para arquitectura de software.'
  }
];

// Catálogo de MANGAS (top 10)
const MANGAS: Book[] = [
  { id:'m1', title:'One Piece', author:'Eiichiro Oda', category:'Manga', status:'disponible', coverUrl:'https://picsum.photos/seed/one-piece/600/900', bannerUrl:'https://picsum.photos/seed/one-piece-banner/1200/300', description:'Aventura pirata en busca del tesoro definitivo.' },
  { id:'m2', title:'Naruto', author:'Masashi Kishimoto', category:'Manga', status:'disponible', coverUrl:'https://picsum.photos/seed/naruto/600/900', bannerUrl:'https://picsum.photos/seed/naruto-banner/1200/300', description:'Un joven ninja que sueña con convertirse en Hokage.' },
  { id:'m3', title:'Demon Slayer', author:'Koyoharu Gotouge', category:'Manga', status:'disponible', coverUrl:'https://picsum.photos/seed/demon-slayer/600/900', bannerUrl:'https://picsum.photos/seed/demon-slayer-banner/1200/300', description:'Tanjiro lucha contra demonios para salvar a su hermana.' },
  { id:'m4', title:'Attack on Titan', author:'Hajime Isayama', category:'Manga', status:'disponible', coverUrl:'https://picsum.photos/seed/attack-on-titan/600/900', bannerUrl:'https://picsum.photos/seed/attack-on-titan-banner/1200/300', description:'Humanidad vs titanes en un mundo amurallado.' },
  { id:'m5', title:'Jujutsu Kaisen', author:'Gege Akutami', category:'Manga', status:'disponible', coverUrl:'https://picsum.photos/seed/jujutsu-kaisen/600/900', bannerUrl:'https://picsum.photos/seed/jujutsu-kaisen-banner/1200/300', description:'Hechiceros combaten maldiciones en el Japón actual.' },
  { id:'m6', title:'My Hero Academia', author:'Kohei Horikoshi', category:'Manga', status:'disponible', coverUrl:'https://picsum.photos/seed/my-hero-academia/600/900', bannerUrl:'https://picsum.photos/seed/my-hero-academia-banner/1200/300', description:'Estudiantes de héroe entrenan para salvar el mundo.' },
  { id:'m7', title:'Bleach', author:'Tite Kubo', category:'Manga', status:'disponible', coverUrl:'https://picsum.photos/seed/bleach/600/900', bannerUrl:'https://picsum.photos/seed/bleach-banner/1200/300', description:'Shinigamis, hollows y batallas espirituales.' },
  { id:'m8', title:'Tokyo Ghoul', author:'Sui Ishida', category:'Manga', status:'disponible', coverUrl:'https://picsum.photos/seed/tokyo-ghoul/600/900', bannerUrl:'https://picsum.photos/seed/tokyo-ghoul-banner/1200/300', description:'Identidad, horror y supervivencia en Tokio.' },
  { id:'m9', title:'Chainsaw Man', author:'Tatsuki Fujimoto', category:'Manga', status:'disponible', coverUrl:'https://picsum.photos/seed/chainsaw-man/600/900', bannerUrl:'https://picsum.photos/seed/chainsaw-man-banner/1200/300', description:'Acción y sátira en un mundo de demonios.' },
  { id:'m10', title:'Dragon Ball', author:'Akira Toriyama', category:'Manga', status:'disponible', coverUrl:'https://picsum.photos/seed/dragon-ball/600/900', bannerUrl:'https://picsum.photos/seed/dragon-ball-banner/1200/300', description:'Goku y amigos en peleas legendarias.' }
];

const LOANS: Loan[] = [
  { id:'l1', userId:'u2', bookId:'b2', loanDate:'2025-10-01', dueDate:'2025-10-15', status:'aprobado' },
  { id:'l2', userId:'u3', bookId:'b3', loanDate:'2025-10-10', dueDate:'2025-10-24', status:'pendiente' }
];

export const seedService = {
  async seedAll(): Promise<void> {
    const existingBooks = storageService.read<Book[]>(storageService.keys.books, []);
    if (!existingBooks || existingBooks.length === 0) {
      storageService.write(storageService.keys.books, [...BOOKS, ...MANGAS]);
    }

    const existingUsers = storageService.read<User[]>(storageService.keys.users, []);
    if (!existingUsers || existingUsers.length === 0) {
      // Usuarios demo con contraseña "123456" (hash)
      const pwd = await sha256('123456');
      const DEMO_USERS: User[] = [
        { id:'u1', name:'Admin', email:'admin@libra.dev', role:'Admin', passwordHash: pwd },
        { id:'u2', name:'Maty',  email:'maty@libra.dev',  role:'User',  passwordHash: pwd },
        { id:'u3', name:'Cami',  email:'cami@libra.dev',  role:'User',  passwordHash: pwd }
      ];
      storageService.write(storageService.keys.users, DEMO_USERS);
    }

    const existingLoans = storageService.read<Loan[]>(storageService.keys.loans, []);
    if (!existingLoans || existingLoans.length === 0) {
      storageService.write(storageService.keys.loans, LOANS);
    }
  }
};

/*
Explicación:
- Se precargan usuarios con hash de "123456" para demo.
- Se reinyectan libros técnicos + 10 mangas con imágenes y descripciones.
- El seed solo se aplica si no hay datos previos.
*/


