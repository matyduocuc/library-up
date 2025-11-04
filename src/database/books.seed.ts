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
    title: 'You Don\'t Know JS',
    author: 'Kyle Simpson',
    category: 'Programación',
    status: 'disponible',
    coverUrl: 'https://picsum.photos/seed/ydkjs/600/900',
    bannerUrl: 'https://picsum.photos/seed/ydkjs-banner/1200/300',
    description: 'Conceptos profundos de JavaScript explicados con claridad.'
  },
  {
    id: 'b5',
    title: 'Refactoring',
    author: 'Martin Fowler',
    category: 'Programación',
    status: 'disponible',
    coverUrl: 'https://picsum.photos/seed/refactoring/600/900',
    bannerUrl: 'https://picsum.photos/seed/refactoring-banner/1200/300',
    description: 'Técnicas para mejorar diseño de código sin cambiar su conducta.'
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
  },
  // Catálogo de MANGAS (top 10)
  { id:'m1', title:'One Piece', author:'Eiichiro Oda', category:'Manga', status:'disponible', coverUrl:'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781421501680/one-piece-vol-1-9781421501680_hr.jpg', bannerUrl:'https://picsum.photos/seed/one-piece-banner/1200/300', description:'Aventura pirata en busca del tesoro definitivo.' },
  { id:'m2', title:'Naruto', author:'Masashi Kishimoto', category:'Manga', status:'disponible', coverUrl:'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781421510897/naruto-vol-1-9781421510897_hr.jpg', bannerUrl:'https://picsum.photos/seed/naruto-banner/1200/300', description:'Un joven ninja que sueña con convertirse en Hokage.' },
  { id:'m3', title:'Demon Slayer', author:'Koyoharu Gotouge', category:'Manga', status:'disponible', coverUrl:'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781974700523/demon-slayer-kimetsu-no-yaiba-vol-1-9781974700523_hr.jpg', bannerUrl:'https://picsum.photos/seed/demon-slayer-banner/1200/300', description:'Tanjiro lucha contra demonios para salvar a su hermana.' },
  { id:'m4', title:'Attack on Titan', author:'Hajime Isayama', category:'Manga', status:'disponible', coverUrl:'https://images.penguinrandomhouse.com/cover/9781612620244', bannerUrl:'https://picsum.photos/seed/attack-on-titan-banner/1200/300', description:'Humanidad vs titanes en un mundo amurallado.' },
  { id:'m5', title:'Jujutsu Kaisen', author:'Gege Akutami', category:'Manga', status:'disponible', coverUrl:'https://picsum.photos/seed/jujutsu-kaisen/600/900', bannerUrl:'https://picsum.photos/seed/jujutsu-kaisen-banner/1200/300', description:'Hechiceros combaten maldiciones en el Japón actual.' },
  { id:'m6', title:'My Hero Academia', author:'Kohei Horikoshi', category:'Manga', status:'disponible', coverUrl:'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781421582696/my-hero-academia-vol-1-9781421582696_hr.jpg', bannerUrl:'https://picsum.photos/seed/my-hero-academia-banner/1200/300', description:'Estudiantes de héroe entrenan para salvar el mundo.' },
  { id:'m7', title:'Bleach', author:'Tite Kubo', category:'Manga', status:'disponible', coverUrl:'https://picsum.photos/seed/bleach/600/900', bannerUrl:'https://picsum.photos/seed/bleach-banner/1200/300', description:'Shinigamis, hollows y batallas espirituales.' },
  { id:'m8', title:'Tokyo Ghoul', author:'Sui Ishida', category:'Manga', status:'disponible', coverUrl:'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781421580364/tokyo-ghoul-vol-1-9781421580364_hr.jpg', bannerUrl:'https://picsum.photos/seed/tokyo-ghoul-banner/1200/300', description:'Identidad, horror y supervivencia en Tokio.' },
  { id:'m9', title:'Chainsaw Man', author:'Tatsuki Fujimoto', category:'Manga', status:'disponible', coverUrl:'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781974709939/chainsaw-man-vol-1-9781974709939_hr.jpg', bannerUrl:'https://picsum.photos/seed/chainsaw-man-banner/1200/300', description:'Acción y sátira en un mundo de demonios.' },
  { id:'m10', title:'Dragon Ball', author:'Akira Toriyama', category:'Manga', status:'disponible', coverUrl:'https://picsum.photos/seed/dragon-ball/600/900', bannerUrl:'https://picsum.photos/seed/dragon-ball-banner/1200/300', description:'Goku y amigos en peleas legendarias.' }
];

