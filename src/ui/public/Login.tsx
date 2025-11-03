import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/user.service';

export function Login() {
  const [email, setEmail] = useState('admin@libra.dev');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = userService.login(email);
    if (!user) {
      setError('No existe un usuario con ese email');
      return;
    }
    if (user.role === 'Admin') navigate('/admin'); else navigate('/');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title mb-3">Iniciar sesión</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <button className="btn btn-primary" type="submit">Entrar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


