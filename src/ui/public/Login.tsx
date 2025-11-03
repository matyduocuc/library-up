import { useState } from 'react';
import { userService } from '../../services/user.service';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const user = await userService.login(email.trim(), password);
      navigate('/');
    } catch (e: any) {
      setErr(e.message ?? 'Error al iniciar sesión');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <h3 className="mb-3">Iniciar sesión</h3>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={onSubmit} className="vstack gap-3">
        <div>
          <label className="form-label">Email</label>
          <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="form-label">Contraseña</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          <div className="form-text">Demo: 123456</div>
        </div>
        <button className="btn btn-primary w-100" type="submit">Entrar</button>
      </form>
    </div>
  );
}

/*
Explicación:
- Valida email + contraseña y guarda la sesión mediante userService.
- Contraseña demo para usuarios seed: 123456.
*/


