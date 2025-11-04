import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { userService } from '../../services/user.service';
import { validatePassword } from '../../services/password.validator';

export function Register() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validar campos requeridos
    if (!name.trim()) newErrors.name = 'El nombre es requerido.';
    if (!email.trim()) newErrors.email = 'El email es requerido.';
    if (!password) newErrors.password = 'La contraseña es requerida.';
    if (!confirmPassword) newErrors.confirmPassword = 'Debes confirmar la contraseña.';

    // Validar contraseña
    if (password) {
      const pwdError = validatePassword(password);
      if (pwdError) {
        newErrors.password = pwdError;
      }
    }

    // Validar confirmación
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Usar DTO: el servicio genera passwordHash automáticamente
      await userService.register({
        name: name.trim(),
        email: email.trim(),
        password: password,
        role: 'User'
      });
      // Auto-login después del registro
      await login(email.trim(), password);
      navigate('/');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al crear la cuenta.';
      setErrors({ submit: message });
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 500 }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-4">Crear cuenta</h3>
          {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
          <form onSubmit={handleSubmit} className="vstack gap-3">
            <div>
              <label className="form-label">Nombre completo</label>
              <input
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: '' }); }}
                required
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div>
              <label className="form-label">Contraseña</label>
              <input
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); }}
                required
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              <div className="form-text">
                Mínimo 8 caracteres, máximo 64. Debe incluir: 1 mayúscula, 1 minúscula y 1 dígito.
              </div>
            </div>
            <div>
              <label className="form-label">Confirmar contraseña</label>
              <input
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors({ ...errors, confirmPassword: '' }); }}
                required
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>
            <button className="btn btn-primary w-100" type="submit">
              <i className="bi bi-person-plus me-1" />
              Crear cuenta
            </button>
          </form>
          <div className="mt-3 text-center">
            <small className="text-muted">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
Explicación:
- Usa userService.register() con DTO: el servicio genera passwordHash automáticamente.
- Valida en el frontend para mejor UX (feedback inmediato sin esperar al servidor).
- El servicio maneja el hash SHA-256 internamente (UI nunca toca passwordHash).
- Auto-login después del registro para mejor experiencia de usuario.
- El mismo contrato sirve si mañana hay backend: solo cambia la llamada a la API.
*/


