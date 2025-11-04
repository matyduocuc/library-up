/**
 * Componente de diagnóstico temporal (solo DEV)
 * 
 * Muestra los usuarios almacenados en localStorage y verifica si el hash
 * coincide con el hash esperado. Útil para depurar problemas de login.
 */
import { useEffect, useState } from 'react';
import { sha256Hex } from '../../services/crypto.util';
import { userService } from '../../services/user.service';

interface DebugUserData {
  email: string;
  storedHash: string;
  expectedHash: string;
  matches: boolean;
  expectedPassword: string;
}

export function DebugUsers() {
  const [data, setData] = useState<DebugUserData[]>([]);
  const [adminHash, setAdminHash] = useState<string>('');
  const [userHash, setUserHash] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        // Calcular hashes esperados
        const adminExpected = await sha256Hex('matyxd2006');
        const userExpected = await sha256Hex('123456');
        setAdminHash(adminExpected);
        setUserHash(userExpected);
        
        // Obtener usuarios almacenados
        const users = userService.getAll();
        
        // Mapear y verificar coincidencias
        const mapped: DebugUserData[] = users.map((u) => {
          const isAdmin = u.email.toLowerCase() === 'admin@libra.dev';
          const expected = isAdmin ? adminExpected : userExpected;
          const expectedPwd = isAdmin ? 'matyxd2006' : '123456';
          
          return {
            email: u.email,
            storedHash: u.passwordHash || '',
            expectedHash: expected,
            matches: u.passwordHash === expected,
            expectedPassword: expectedPwd
          };
        });
        
        setData(mapped);
      } catch (err) {
        console.error('Error en DebugUsers:', err);
      }
    })();
  }, []);

  // Solo mostrar en desarrollo
  if (!import.meta.env.DEV) return null;

  return (
    <div className="alert alert-info mt-4">
      <h5>
        <i className="bi bi-bug me-2"></i>
        Debug Users (DEV only)
      </h5>
      <div className="mb-3">
        <strong>Hashes esperados:</strong>
        <br />
        <small>
          <code style={{ wordBreak: 'break-all', fontSize: '0.75em' }}>
            sha256('matyxd2006') = {adminHash || 'Calculando...'}
          </code>
        </small>
        <br />
        <small>
          <code style={{ wordBreak: 'break-all', fontSize: '0.75em' }}>
            sha256('123456') = {userHash || 'Calculando...'}
          </code>
        </small>
      </div>
      <hr />
      {data.length === 0 ? (
        <div className="text-muted">No hay usuarios almacenados</div>
      ) : (
        data.map((r, i) => (
          <div key={i} className="mb-2">
            <strong>{r.email}</strong>
            <br />
            <small>
              Password esperada: <code>{r.expectedPassword}</code>
            </small>
            <br />
            <small>
              Hash almacenado: <code style={{ wordBreak: 'break-all', fontSize: '0.7em' }}>
                {r.storedHash?.slice(0, 20)}...
              </code>
            </small>
            <br />
            <span className={`badge ${r.matches ? 'bg-success' : 'bg-danger'} mt-1`}>
              {r.matches ? '✓ Coincide' : '✗ No coincide'}
            </span>
          </div>
        ))
      )}
      <div className="mt-3 small text-muted">
        <i className="bi bi-info-circle me-1"></i>
        Este componente solo es visible en modo desarrollo. Úsalo para verificar que los hashes
        de contraseña coinciden correctamente.
      </div>
    </div>
  );
}

