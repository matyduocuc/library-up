/**
 * Componente de verificación DEV para portadas de libros
 * 
 * Solo visible en modo desarrollo. Valida que las portadas carguen correctamente.
 * Úsalo temporalmente en AdminDashboard o Catalog para verificar URLs.
 */
import { useEffect, useState } from 'react';
import type { Book } from '../../domain/book';

interface CoverDevCheckProps {
  books: Book[];
}

export function CoverDevCheck({ books }: CoverDevCheckProps) {
  const [bad, setBad] = useState<string[]>([]);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancel = false;
    setChecking(true);
    
    (async () => {
      const fails: string[] = [];
      
      for (const b of books) {
        if (cancel) break;
        
        await new Promise<void>((res) => {
          const img = new Image();
          img.onload = () => res();
          img.onerror = () => {
            fails.push(b.title);
            res();
          };
          img.src = b.coverUrl || '';
        });
      }
      
      if (!cancel) {
        setBad(fails);
        setChecking(false);
      }
    })();
    
    return () => {
      cancel = true;
    };
  }, [books]);

  if (!import.meta.env.DEV) return null;
  
  return (
    <div className="alert alert-info">
      <strong>Cover check:</strong>{' '}
      {checking ? (
        ' Verificando...'
      ) : bad.length === 0 ? (
        <span className="text-success"> Todas las portadas cargan correctamente</span>
      ) : (
        <span className="text-danger"> Portadas rotas: {bad.join(', ')}</span>
      )}
    </div>
  );
}





