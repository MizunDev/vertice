import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Validaremos sesión dinámicamente
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });
  const [loginError, setLoginError] = useState('');

  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nuevoPartido, setNuevoPartido] = useState({
    competicion: 'Liga BetPlay',
    equipo_local: '',
    equipo_visitante: '',
    marcador_local: 0,
    marcador_visitante: 0,
    estado: 'en vivo'
  });
  const [mensajeApi, setMensajeApi] = useState(null);

  const fetchPartidos = () => {
    fetch('http://localhost:8000/partidos/', {
      credentials: 'include' // <--- CRUCIAL: Envía la cookie HTTP-only automáticamente
    })
      .then((res) => {
        if (!res.ok) throw new Error('No autorizado');
        return res.json();
      })
      .then((data) => {
        setPartidos(data);
        setIsLoggedIn(true); // Si responde bien, confirmamos que estamos logueados
      })
      .catch((err) => {
        setIsLoggedIn(false);
      });
  };

  useEffect(() => {
    fetchPartidos();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // <--- Recibe y guarda la cookie HTTP-only del servidor
        body: JSON.stringify(loginForm)
      });

      if (response.ok) {
        setIsLoggedIn(true);
        fetchPartidos();
      } else {
        setLoginError('Usuario o contraseña inválidos.');
      }
    } catch (err) {
      setLoginError('Error de red al conectar con el backend.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      console.error(e);
    }
    setIsLoggedIn(false);
    setPartidos([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensajeApi(null);

    try {
      const response = await fetch('http://localhost:8000/partidos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // <--- Envía la cookie de sesión
        body: JSON.stringify({
          ...nuevoPartido,
          marcador_local: Number(nuevoPartido.marcador_local),
          marcador_visitante: Number(nuevoPartido.marcador_visitante)
        })
      });

      if (response.ok) {
        setMensajeApi({ tipo: 'success', texto: '¡Partido registrado con éxito!' });
        setNuevoPartido({ competicion: 'Liga BetPlay', equipo_local: '', equipo_visitante: '', marcador_local: 0, marcador_visitante: 0, estado: 'en vivo' });
        fetchPartidos();
      } else {
        setMensajeApi({ tipo: 'error', texto: 'Error al registrar: Sesión expirada.' });
        setIsLoggedIn(false);
      }
    } catch (err) {
      setMensajeApi({ tipo: 'error', texto: 'Fallo de red.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm(`¿Eliminar partido #${id}?`)) return;

    try {
      const response = await fetch(`http://localhost:8000/partidos/${id}`, {
        method: 'DELETE',
        credentials: 'include' // <--- Envía la cookie de sesión
      });

      if (response.ok) {
        fetchPartidos();
      } else {
        alert('No autorizado o sesión expirada.');
        setIsLoggedIn(false);
      }
    } catch (err) {
      alert('Fallo de red.');
    }
  };

  // 🔒 PANTALLA DE LOGIN (Si no hay sesión activa)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#02150b] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        
        <div className="w-full max-w-md p-8 rounded-[2rem] bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-wider bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              VÉRTICE
            </h1>
            <p className="text-xs text-slate-400 mt-2">Acceso seguro mediante Cookies HTTP-only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-medium">Usuario</label>
              <input 
                type="text" 
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full mt-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium">Contraseña (Prueba: vertice2026)</label>
              <input 
                type="password" 
                value={loginForm.password}
                placeholder="••••••••••••"
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full mt-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs text-center">
                {loginError}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:opacity-95 transition cursor-pointer mt-2"
            >
              Iniciar Sesión Seguro
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ⚽ DASHBOARD PRINCIPAL
  return (
    <div className="min-h-screen text-slate-100 p-6 md:p-10 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <header className="mb-10 relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-wider bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            VÉRTICE <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono align-middle">STADIUM HUB</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Seguridad avanzada con Cookies HTTP-only activas.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-xs text-slate-300 flex items-center gap-3 shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Sesión: <strong className="text-emerald-400">Protegida</strong></span>
            <button 
              onClick={handleLogout}
              className="ml-2 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase transition cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Bento Grid Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* Panel de Inserción (POST) */}
        <div className="md:col-span-1 p-7 rounded-[2rem] bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                ⚽ Registrar Partido
              </h3>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">POST /partidos/</span>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-medium">Competición</label>
                <input 
                  type="text" 
                  value={nuevoPartido.competicion}
                  onChange={(e) => setNuevoPartido({...nuevoPartido, competicion: e.target.value})}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 font-medium">Local</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Tolima"
                    value={nuevoPartido.equipo_local}
                    onChange={(e) => setNuevoPartido({...nuevoPartido, equipo_local: e.target.value})}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium">Visitante</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Millonarios"
                    value={nuevoPartido.equipo_visitante}
                    onChange={(e) => setNuevoPartido({...nuevoPartido, equipo_visitante: e.target.value})}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-slate-400 font-medium">Goles L.</label>
                  <input 
                    type="number" 
                    value={nuevoPartido.marcador_local}
                    onChange={(e) => setNuevoPartido({...nuevoPartido, marcador_local: e.target.value})}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium">Goles V.</label>
                  <input 
                    type="number" 
                    value={nuevoPartido.marcador_visitante}
                    onChange={(e) => setNuevoPartido({...nuevoPartido, marcador_visitante: e.target.value})}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium">Estado</label>
                  <select 
                    value={nuevoPartido.estado}
                    onChange={(e) => setNuevoPartido({...nuevoPartido, estado: e.target.value})}
                    className="w-full mt-1 px-2 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="programado">Programado</option>
                    <option value="en vivo">En Vivo</option>
                    <option value="finalizado">Finalizado</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:opacity-95 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Transmitiendo...' : 'Enviar a la Base de Datos'}
              </button>
            </form>

            {mensajeApi && (
              <div className={`mt-3 p-3 rounded-xl text-xs border ${mensajeApi.tipo === 'success' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-red-950/40 border-red-500/30 text-red-300'}`}>
                {mensajeApi.texto}
              </div>
            )}
          </div>
        </div>

        {/* Visualizador y Gestor de Partidos */}
        <div className="md:col-span-2 p-7 rounded-[2rem] bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold tracking-tight text-white">Encuentros Registrados</h3>
              <button onClick={fetchPartidos} className="text-xs text-emerald-400 hover:underline cursor-pointer">🔄 Actualizar</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
              {partidos.map((partido) => (
                <div key={partido.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-emerald-500/40 transition duration-300 backdrop-blur-xl group relative flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                      <span className="text-emerald-400 font-semibold uppercase">{partido.competicion}</span>
                      <span className="uppercase px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-slate-300">{partido.estado}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-sm my-2">
                      <span className="text-slate-200 truncate max-w-[90px]">{partido.equipo_local}</span>
                      <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-mono">
                        {partido.marcador_local} - {partido.marcador_visitante}
                      </div>
                      <span className="text-slate-200 truncate max-w-[90px] text-right">{partido.equipo_visitante}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-mono">ID: {partido.id}</span>
                    <button 
                      onClick={() => handleEliminar(partido.id)}
                      className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase transition cursor-pointer"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
              {partidos.length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <p className="text-sm text-slate-400">No hay partidos registrados todavía o la sesión requiere actualización.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}