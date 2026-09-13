import { useEffect, useState } from 'react';

// ==========================================
// ICONOS VECTORIALES (REEMPLAZO DE EMOJIS)
// ==========================================
const Icons = {
  Edit: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>,
  Delete: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>,
  Globe: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
  Trophy: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99-2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" /></svg>,
  Shield: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
  Handshake: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" /></svg>,
  Radar: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg>,
  Soccer: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5l-3 2.5v5l3 2.5 3-2.5v-5l-3-2.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5V3m-3 4.5l-4-3m10 3l4-3m-10 8l-4 3m10-3l4 3M12 17.5V21" /></svg>,
};

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('ecosistema');

  const [partidos, setPartidos] = useState([]);
  const [confederaciones, setConfederaciones] = useState([]);
  const [competiciones, setCompeticiones] = useState([]);
  const [equipos, setEquipos] = useState([]);

  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });

  // Estados para CRUD
  const [editConfId, setEditConfId] = useState(null);
  const [formConf, setFormConf] = useState({ nombre: '', logo: '' });

  const [editCompId, setEditCompId] = useState(null);
  const [formComp, setFormComp] = useState({ nombre: '', logo: '', tipo: 'liga_nacional', pais: '', confederacion_id: '' });

  const [editEqId, setEditEqId] = useState(null);
  const [formEquipo, setFormEquipo] = useState({ nombre: '', logo: '', tipo: 'club', pais: '', confederacion_id: '' });

  const [formMatricula, setFormMatricula] = useState({ equipo_id: '', competicion_id: '' });
  const [formPartido, setFormPartido] = useState({ competicion_id: '', equipo_local_id: '', equipo_visitante_id: '', marcador_local: 0, marcador_visitante: 0, estado: 'programado' });

  const [filtroPais, setFiltroPais] = useState('');
  const [mensajeApi, setMensajeApi] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- FETCHERS ---
  const fetchPartidos = () => {
    fetch('http://localhost:8000/partidos/', { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => { setPartidos(data); setIsLoggedIn(true); })
      .catch(() => setIsLoggedIn(false));
  };

  const fetchCatalogs = () => {
    Promise.all([
      fetch('http://localhost:8000/confederaciones/', { credentials: 'include' }).then(r => r.json()),
      fetch('http://localhost:8000/competiciones/', { credentials: 'include' }).then(r => r.json()),
      fetch('http://localhost:8000/equipos/', { credentials: 'include' }).then(r => r.json())
    ]).then(([confs, comps, eqs]) => {
      setConfederaciones(confs); setCompeticiones(comps); setEquipos(eqs);
    }).catch(err => console.error("Error cargando catálogos", err));
  };

  useEffect(() => { if (isLoggedIn) fetchCatalogs(); }, [isLoggedIn]);
  useEffect(() => { fetchPartidos(); }, []);

  // --- HANDLERS (AUTH) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(loginForm)
      });
      if (res.ok) { setIsLoggedIn(true); fetchPartidos(); fetchCatalogs(); }
      else setMensajeApi({ tipo: 'error', texto: 'Credenciales denegadas.' });
    } catch (err) { setMensajeApi({ tipo: 'error', texto: 'Fallo de conexión.' }); }
  };

  const handleLogout = async () => {
    try { await fetch('http://localhost:8000/logout', { method: 'POST', credentials: 'include' }); } catch (e) {}
    setIsLoggedIn(false); setPartidos([]);
  };

  const notify = (tipo, texto) => {
    setMensajeApi({ tipo, texto });
    setTimeout(() => setMensajeApi(null), 3500);
  };

  // --- CRUD CONFEDERACIONES ---
  const handleSubmitConf = async (e) => {
    e.preventDefault(); setLoading(true);
    const method = editConfId ? 'PUT' : 'POST';
    const url = editConfId ? `http://localhost:8000/confederaciones/${editConfId}` : 'http://localhost:8000/confederaciones/';
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(formConf) });
      if (res.ok) { notify('success', 'Confederación Guardada'); setFormConf({ nombre: '', logo: '' }); setEditConfId(null); fetchCatalogs(); }
      else notify('error', 'Error en operación');
    } catch (err) { notify('error', 'Fallo de red'); }
    setLoading(false);
  };
  const handleEditConf = (c) => { setFormConf({ nombre: c.nombre, logo: c.logo }); setEditConfId(c.id); setFiltroPais(''); };
  const handleEliminarConf = async (id) => {
    if (!confirm('¿Eliminar? Ligas y Equipos quedarán huérfanos pero intactos.')) return;
    await fetch(`http://localhost:8000/confederaciones/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchCatalogs();
  };

  // --- CRUD COMPETICIONES ---
  const handleSubmitComp = async (e) => {
    e.preventDefault(); setLoading(true);
    const payload = { ...formComp, confederacion_id: parseInt(formComp.confederacion_id) || null };
    const method = editCompId ? 'PUT' : 'POST';
    const url = editCompId ? `http://localhost:8000/competiciones/${editCompId}` : 'http://localhost:8000/competiciones/';
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload) });
      if (res.ok) { notify('success', 'Competición Guardada'); setFormComp({ nombre: '', logo: '', tipo: 'liga_nacional', pais: '', confederacion_id: '' }); setEditCompId(null); fetchCatalogs(); }
      else { const d = await res.json(); notify('error', d.detail || 'Error al guardar'); }
    } catch (err) { notify('error', 'Fallo de red'); }
    setLoading(false);
  };
  const handleEditComp = (c) => { setFormComp({ nombre: c.nombre, logo: c.logo, tipo: c.tipo, pais: c.pais, confederacion_id: c.confederacion_id || '' }); setEditCompId(c.id); };
  const handleEliminarComp = async (id) => {
    if (!confirm('¿Eliminar Liga? Partidos asociados quedarán sin torneo.')) return;
    await fetch(`http://localhost:8000/competiciones/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchCatalogs(); fetchPartidos();
  };

  // --- CRUD EQUIPOS ---
  const handleSubmitEquipo = async (e) => {
    e.preventDefault(); setLoading(true);
    const payload = { ...formEquipo, confederacion_id: parseInt(formEquipo.confederacion_id) || null };
    const method = editEqId ? 'PUT' : 'POST';
    const url = editEqId ? `http://localhost:8000/equipos/${editEqId}` : 'http://localhost:8000/equipos/';
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload) });
      if (res.ok) { notify('success', 'Escuadra Guardada'); setFormEquipo({ nombre: '', logo: '', tipo: 'club', pais: '', confederacion_id: '' }); setEditEqId(null); fetchCatalogs(); }
      else { const d = await res.json(); notify('error', d.detail || 'Error al guardar'); }
    } catch (err) { notify('error', 'Fallo de red'); }
    setLoading(false);
  };
  const handleEditEq = (eq) => { setFormEquipo({ nombre: eq.nombre, logo: eq.logo, tipo: eq.tipo, pais: eq.pais, confederacion_id: eq.confederacion_id || '' }); setEditEqId(eq.id); };
  const handleEliminarEq = async (id) => {
    if (!confirm('¿Eliminar Escuadra? Sus partidos en la arena quedarán incompletos.')) return;
    await fetch(`http://localhost:8000/equipos/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchCatalogs(); fetchPartidos();
  };

  // --- MATRÍCULAS ---
  const handleMatricular = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/equipos/${formMatricula.equipo_id}/matricular/${formMatricula.competicion_id}`, { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.ok) { notify('success', data.mensaje); fetchCatalogs(); setFormMatricula({ equipo_id: '', competicion_id: '' }); }
      else notify('error', data.detail || data.mensaje || 'Incompatibilidad detectada');
    } catch (err) { notify('error', 'Fallo de red al afiliar'); }
    setLoading(false);
  };

  // --- PARTIDOS ---
  const handleSubmitPartido = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = {
        competicion_id: parseInt(formPartido.competicion_id),
        equipo_local_id: parseInt(formPartido.equipo_local_id),
        equipo_visitante_id: parseInt(formPartido.equipo_visitante_id),
        marcador_local: parseInt(formPartido.marcador_local),
        marcador_visitante: parseInt(formPartido.marcador_visitante),
        estado: formPartido.estado
      };
      const res = await fetch('http://localhost:8000/partidos/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload) });
      if (res.ok) { notify('success', 'Encuentro sincronizado'); fetchPartidos(); setFormPartido({ competicion_id: '', equipo_local_id: '', equipo_visitante_id: '', marcador_local: 0, marcador_visitante: 0, estado: 'programado' }); }
      else { const d = await res.json(); notify('error', d.detail || 'Verifique los equipos'); }
    } catch (err) { notify('error', 'Fallo al registrar partido'); }
    setLoading(false);
  };
  const handleEliminarPartido = async (id) => {
    if (!confirm(`¿Eliminar encuentro #${id}?`)) return;
    const res = await fetch(`http://localhost:8000/partidos/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) fetchPartidos();
  };

  // --- LOGICA ASOCIACIÓN DE HUÉRFANOS ---
  const asociarHuerfano = async (tipo, idItem) => {
    if(!editConfId) return;
    const url = `http://localhost:8000/${tipo}/${idItem}`;
    const item = tipo === 'competiciones' ? competiciones.find(c=>c.id===idItem) : equipos.find(e=>e.id===idItem);
    await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({...item, confederacion_id: editConfId}) });
    fetchCatalogs();
  };

  const compsHuerfanasFiltradas = competiciones.filter(c => !c.confederacion_id && c.pais.toLowerCase().includes(filtroPais.toLowerCase()));
  const eqsHuerfanosFiltrados = equipos.filter(e => !e.confederacion_id && e.pais.toLowerCase().includes(filtroPais.toLowerCase()));

  // FILTRO DINÁMICO PARA PARTIDOS (La Arena)
  const equiposDisponiblesParaPartido = formPartido.competicion_id ? equipos.filter(eq => eq.competiciones.some(c => c.id === parseInt(formPartido.competicion_id))) : [];

  // FILTRO INTELIGENTE PARA MATRÍCULAS (La Aduana Geográfica y Genética)
  const equiposDisponiblesParaMatricula = formMatricula.competicion_id
    ? equipos.filter(eq => {
        const comp = competiciones.find(c => c.id === parseInt(formMatricula.competicion_id));
        if (!comp) return false;

        // 1. Naturaleza (Selección vs Club)
        if (comp.tipo === 'internacional_selecciones' && eq.tipo !== 'seleccion') return false;
        if (comp.tipo !== 'internacional_selecciones' && eq.tipo === 'seleccion') return false;

        // 2. Geografía Local (Ligas Nacionales)
        if (['liga_nacional', 'copa_nacional'].includes(comp.tipo) && eq.pais !== comp.pais) return false;

        // 3. Confederación Continental
        if (comp.confederacion_id && eq.confederacion_id && eq.confederacion_id !== comp.confederacion_id) return false;

        return true;
      })
    : [];

  // ==========================================
  // UI THEME: MATERIAL BEIGE (SAND & STONE)
  // ==========================================
  const theme = {
    bg: 'bg-[#F5F3EB]',
    text: 'text-[#3E362E]',
    textMuted: 'text-[#8C827A]',
    cardBg: 'bg-[#FFFFFF]',
    cardBorder: 'border-[#E5E0D8]',
    cardShadow: 'shadow-[0_4px_20px_rgba(140,122,104,0.06)]',
    cardHover: 'hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(140,122,104,0.12)] transition-all duration-300 ease-in-out',
    inputBg: 'bg-[#FAF8F5]',
    inputBorder: 'border-[#DED9D1] focus:border-[#8C7A6B] focus:ring-2 focus:ring-[#8C7A6B]/20',
    innerCardBg: 'bg-[#FCFAf8]',
    innerCardHover: 'hover:bg-[#FFFFFF] hover:border-[#D6CEC3]',
    badgeBg: 'bg-[#F0EBE1] border-[#E2D8C9]',
    badgeText: 'text-[#6B5A4D]',
    primaryBtn: 'bg-[#8C7A6B] text-white hover:bg-[#786658] active:scale-95 shadow-sm hover:shadow-md transition-all duration-300',
  };

  // --- BOTONES DE ACCIÓN ANIMADOS (REEMPLAZAN EMOJIS) ---
  const ActionButton = ({ onClick, type }) => {
    const isEdit = type === 'edit';
    return (
      <button
        type="button"
        onClick={onClick}
        className={`p-2 rounded-xl border transition-all duration-200 active:scale-90 ${
          isEdit 
            ? 'bg-[#F5F3EB] border-transparent text-[#8C827A] hover:bg-[#EBE5DC] hover:text-[#3E362E]' 
            : 'bg-[#FAF5F5] border-transparent text-[#B57C7C] hover:bg-[#F2E1E1] hover:text-[#8C3A3A]'
        }`}
        title={isEdit ? "Editar" : "Eliminar"}
      >
        <div className="w-4 h-4">
          {isEdit ? <Icons.Edit /> : <Icons.Delete />}
        </div>
      </button>
    );
  };

  const FallbackImage = ({ src, alt, className }) => <img src={src || `https://ui-avatars.com/api/?name=${alt}&background=F5F3EB&color=8C7A6B`} alt={alt} className={className} onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${alt}&background=F5F3EB&color=8C7A6B` }} />;

  // 🔒 VISTA: LOGIN
  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} flex items-center justify-center p-6 font-sans relative overflow-hidden`}>
        <div className={`w-full max-w-md p-8 rounded-[2rem] ${theme.cardBg} border ${theme.cardBorder} ${theme.cardShadow} relative z-10 animate-fade-in`}>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black tracking-tight mb-2 text-[#3E362E]">VÉRTICE</h1>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted}`}>Platform Security</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${theme.textMuted}`}>ID Operador</label>
              <input type="text" value={loginForm.username} onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} className={`w-full mt-1.5 px-4 py-3.5 rounded-2xl ${theme.inputBg} border ${theme.inputBorder} text-sm font-medium focus:outline-none transition-all`} required />
            </div>
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${theme.textMuted}`}>Código Acceso</label>
              <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} className={`w-full mt-1.5 px-4 py-3.5 rounded-2xl ${theme.inputBg} border ${theme.inputBorder} text-sm font-medium focus:outline-none transition-all`} required />
            </div>
            {mensajeApi && <div className="p-3 rounded-xl bg-[#F5E6E6] border border-[#EACCCC] text-[#A65C5C] text-xs font-medium text-center">{mensajeApi.texto}</div>}
            <button type="submit" className={`w-full py-4 rounded-2xl ${theme.primaryBtn} font-bold text-xs uppercase tracking-widest mt-4`}>Iniciar Sesión</button>
          </form>
        </div>
      </div>
    );
  }

  // ⚽ VISTA: DASHBOARD PRINCIPAL
  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} p-4 md:p-8 font-sans`}>

      {/* HEADER & TABS */}
      <header className={`mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b ${theme.cardBorder} relative z-10`}>
        <div className="flex justify-between w-full xl:w-auto items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              VÉRTICE
              <span className={`text-[10px] px-2.5 py-1 rounded-full border font-mono tracking-widest hidden sm:inline-block ${theme.badgeBg} ${theme.badgeText}`}>NEXUS</span>
            </h1>
            <p className={`text-xs font-medium mt-1.5 ${theme.textMuted}`}>Centro de Operaciones Tácticas.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className={`flex p-1.5 rounded-2xl border ${theme.cardBorder} bg-[#EBE5DC]/50 w-full sm:w-auto shadow-inner`}>
            {['ecosistema', 'matriculas', 'arena'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? `${theme.cardBg} ${theme.cardShadow} text-[#3E362E]` : `${theme.textMuted} hover:text-[#3E362E]`}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={`hidden sm:flex px-5 py-3 rounded-full ${theme.cardBg} border ${theme.cardBorder} ${theme.cardShadow} text-xs font-medium items-center gap-3`}>
            <span className="flex h-2.5 w-2.5 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8C7A6B] opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#6B5A4D]"></span></span>
            <div className={`w-px h-4 bg-[#D6CEC3]`}></div>
            <button onClick={handleLogout} className="text-[#A65C5C] hover:text-[#8C3A3A] font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer">Salir</button>
          </div>
        </div>
      </header>

      {/* ALERTAS GLOBALES */}
      {mensajeApi && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-lg ${mensajeApi.tipo === 'success' ? 'bg-[#F0EBE1] border-[#D6CEC3] text-[#6B5A4D]' : 'bg-[#F5E6E6] border-[#EACCCC] text-[#A65C5C]'}`}>
            {mensajeApi.texto}
          </div>
        </div>
      )}

      <div className="w-full">

        {/* ========================================================================= */}
        {/* TAB 1: ECOSISTEMA (Confederaciones, Competiciones, Equipos) */}
        {/* ========================================================================= */}
        {activeTab === 'ecosistema' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">

            {/* CONFEDERACIONES */}
            <div className={`p-6 md:p-8 rounded-[2rem] ${theme.cardBg} border ${theme.cardBorder} ${theme.cardShadow} flex flex-col h-[720px]`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-xl ${theme.badgeBg} text-[#8C7A6B]`}><Icons.Globe /></div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#3E362E]">Confederaciones</h3>
              </div>
              <form onSubmit={handleSubmitConf} className={`mb-6 p-5 rounded-2xl ${theme.innerCardBg} border ${theme.cardBorder} space-y-4`}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[10px] uppercase font-bold text-[#8C7A6B]`}>{editConfId ? 'Editando Registro...' : 'Crear Nueva'}</span>
                  {editConfId && <button type="button" onClick={() => {setEditConfId(null); setFormConf({nombre:'', logo:''})}} className="text-[9px] font-bold uppercase text-[#A65C5C] hover:text-[#8C3A3A] transition-colors">Cancelar</button>}
                </div>
                <input type="text" placeholder="Nombre" value={formConf.nombre} onChange={e => setFormConf({...formConf, nombre: e.target.value})} className={`w-full px-4 py-3 rounded-xl ${theme.inputBg} border ${theme.inputBorder} text-xs`} required />
                <input type="url" placeholder="URL Logo" value={formConf.logo} onChange={e => setFormConf({...formConf, logo: e.target.value})} className={`w-full px-4 py-3 rounded-xl ${theme.inputBg} border ${theme.inputBorder} text-xs`} required />
                <button type="submit" className={`w-full py-3 rounded-xl ${theme.primaryBtn} font-bold text-[10px] uppercase tracking-widest`}>Guardar Datos</button>
              </form>

              {/* ASOCIADOR DE HUÉRFANOS */}
              {editConfId && (
                <div className={`mb-4 p-4 rounded-xl border border-dashed border-[#D6CEC3] bg-[#FAF8F5]`}>
                  <p className={`text-[9px] font-bold uppercase mb-3 text-[#8C7A6B]`}>Vincular Entidades Huérfanas</p>
                  <input type="text" placeholder="🔍 Filtrar por País..." value={filtroPais} onChange={e=>setFiltroPais(e.target.value)} className={`w-full px-3 py-2 mb-3 rounded-lg ${theme.inputBg} border ${theme.cardBorder} text-xs focus:outline-none`} />

                  <div className="max-h-24 overflow-y-auto custom-scrollbar mb-2 space-y-1.5">
                    {compsHuerfanasFiltradas.length === 0 && <p className={`text-[9px] ${theme.textMuted}`}>No hay ligas huérfanas aquí.</p>}
                    {compsHuerfanasFiltradas.map(c => (
                      <div key={c.id} className={`flex justify-between items-center p-2 rounded-lg text-[10px] bg-white border ${theme.cardBorder} ${theme.cardHover}`}>
                        <span className="truncate font-medium">{c.nombre} <span className={theme.textMuted}>({c.pais})</span></span>
                        <button onClick={()=>asociarHuerfano('competiciones', c.id)} className="text-[#8C7A6B] font-bold px-2 py-1 bg-[#F0EBE1] hover:bg-[#E2D8C9] rounded-md transition-colors">Vincular</button>
                      </div>
                    ))}
                  </div>
                  <div className="max-h-24 overflow-y-auto custom-scrollbar space-y-1.5">
                    {eqsHuerfanosFiltrados.length === 0 && <p className={`text-[9px] ${theme.textMuted}`}>No hay equipos huérfanos aquí.</p>}
                    {eqsHuerfanosFiltrados.map(eq => (
                      <div key={eq.id} className={`flex justify-between items-center p-2 rounded-lg text-[10px] bg-white border ${theme.cardBorder} ${theme.cardHover}`}>
                        <span className="truncate font-medium">{eq.nombre} <span className={theme.textMuted}>({eq.pais})</span></span>
                        <button onClick={()=>asociarHuerfano('equipos', eq.id)} className="text-[#8C7A6B] font-bold px-2 py-1 bg-[#F0EBE1] hover:bg-[#E2D8C9] rounded-md transition-colors">Vincular</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="overflow-y-auto custom-scrollbar flex-1 space-y-3 pr-2">
                {confederaciones.map(c => (
                  <div key={c.id} className={`flex items-center justify-between p-4 rounded-2xl border ${theme.cardBorder} ${theme.innerCardBg} ${theme.cardHover}`}>
                    <div className="flex items-center gap-4">
                      <FallbackImage src={c.logo} alt={c.nombre} className="w-10 h-10 rounded-full bg-white object-contain p-1 border shadow-sm" />
                      <p className="text-xs font-bold uppercase">{c.nombre}</p>
                    </div>
                    <div className="flex gap-2">
                      <ActionButton type="edit" onClick={() => handleEditConf(c)} />
                      <ActionButton type="delete" onClick={() => handleEliminarConf(c.id)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COMPETICIONES BLINDADAS */}
            <div className={`p-6 md:p-8 rounded-[2rem] ${theme.cardBg} border ${theme.cardBorder} ${theme.cardShadow} flex flex-col h-[720px]`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-xl ${theme.badgeBg} text-[#8C7A6B]`}><Icons.Trophy /></div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#3E362E]">Ligas y Copas</h3>
              </div>
              <form onSubmit={handleSubmitComp} className={`mb-6 p-5 rounded-2xl ${theme.innerCardBg} border ${theme.cardBorder} space-y-4`}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[10px] uppercase font-bold text-[#8C7A6B]`}>{editCompId ? 'Editando Registro...' : 'Crear Nueva'}</span>
                  {editCompId && <button type="button" onClick={() => {setEditCompId(null); setFormComp({nombre:'', logo:'', tipo:'liga_nacional', pais:'', confederacion_id:''})}} className="text-[9px] font-bold uppercase text-[#A65C5C] hover:text-[#8C3A3A] transition-colors">Cancelar</button>}
                </div>
                <input type="text" placeholder="Nombre (ej. Serie A)" value={formComp.nombre} onChange={e => setFormComp({...formComp, nombre: e.target.value})} className={`w-full px-4 py-3 rounded-xl ${theme.inputBg} border ${theme.inputBorder} text-xs`} required />
                <div className="grid grid-cols-2 gap-3">
                  <select value={formComp.tipo} onChange={e => setFormComp({...formComp, tipo: e.target.value})} className={`px-3 py-3 rounded-xl ${theme.inputBg} border ${theme.inputBorder} text-[10px]`}>
                    <option value="liga_nacional">Liga Nacional</option><option value="copa_nacional">Copa Nac.</option><option value="internacional_clubes">Int. Clubes</option><option value="internacional_selecciones">Int. Selecciones</option>
                  </select>
                  {/* BLINDAJE VISUAL: Solo pide país si es torneo local */}
                  {['liga_nacional', 'copa_nacional'].includes(formComp.tipo) ? (
                    <input type="text" placeholder="País (Obligatorio)" value={formComp.pais} onChange={e => setFormComp({...formComp, pais: e.target.value})} className={`px-4 py-3 rounded-xl ${theme.inputBg} border ${theme.inputBorder} text-xs`} required />
                  ) : (
                    <input type="text" value="Internacional" disabled className={`px-4 py-3 rounded-xl bg-[#EBE5DC]/50 border ${theme.inputBorder} text-xs text-[#8C7A6B] font-bold cursor-not-allowed`} />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="url" placeholder="URL Logo" value={formComp.logo} onChange={e => setFormComp({...formComp, logo: e.target.value})} className={`px-4 py-3 rounded-xl ${theme.inputBg} border ${theme.inputBorder} text-xs`} required />
                  <select value={formComp.confederacion_id} onChange={e => setFormComp({...formComp, confederacion_id: e.target.value})} className={`px-3 py-3 rounded-xl ${theme.inputBg} border ${theme.inputBorder} text-[10px]`}>
                    <option value="">(Sin Confed.)</option>
                    {confederaciones.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                <button type="submit" className={`w-full py-3 rounded-xl ${theme.primaryBtn} font-bold text-[10px] uppercase tracking-widest`}>Guardar Datos</button>
              </form>
              <div className="overflow-y-auto custom-scrollbar flex-1 space-y-3 pr-2">
                {competiciones.map(c => (
                  <div key={c.id} className={`flex items-center justify-between p-4 rounded-2xl border ${theme.cardBorder} ${theme.innerCardBg} ${theme.cardHover}`}>
                    <div className="flex items-center gap-4">
                      <FallbackImage src={c.logo} alt={c.nombre} className="w-10 h-10 object-contain drop-shadow-sm" />
                      <div>
                        <p className="text-[11px] font-bold uppercase truncate max-w-[110px]">{c.nombre}</p>
                        <p className={`text-[9px] uppercase tracking-widest ${theme.textMuted} mt-0.5`}>{c.pais} {!c.confederacion_id && <span className="text-[#8C7A6B] font-bold ml-1">Huérfana</span>}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <ActionButton type="edit" onClick={() => handleEditComp(c)} />
                      <ActionButton type="delete" onClick={() => handleEliminarComp(c.id)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EQUIPOS BLINDADOS */}
            <div className={`p-6 md:p-8 rounded-[2rem] ${theme.cardBg} border ${theme.cardBorder} ${theme.cardShadow} flex flex-col h-[720px]`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-xl ${theme.badgeBg} text-[#8C7A6B]`}><Icons.Shield /></div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#3E362E]">Escuadras</h3>
              </div>
              <form onSubmit={handleSubmitEquipo} className={`mb-6 p-5 rounded-2xl ${theme.innerCardBg} border ${theme.cardBorder} space-y-4`}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[10px] uppercase font-bold text-[#8C7A6B]`}>{editEqId ? 'Editando Registro...' : 'Crear Nueva'}</span>
                  {editEqId && <button type="button" onClick={() => {setEditEqId(null); setFormEquipo({nombre:'', logo:'', tipo:'club', pais:'', confederacion_id:''})}} className="text-[9px] font-bold uppercase text-[#A65C5C] hover:text-[#8C3A3A] transition-colors">Cancelar</button>}
                </div>
                <input type="text" placeholder="Nombre (ej. Juventus / Colombia)" value={formEquipo.nombre} onChange={e => setFormEquipo({...formEquipo, nombre: e.target.value})} className={`w-full px-4 py-3 rounded-xl ${theme.inputBg} border ${theme.inputBorder} text-xs`} required />
                <div className="grid grid-cols-2 gap-3">
                  <select value={formEquipo.tipo} onChange={e => setFormEquipo({...formEquipo, tipo: e.target.value})} className={`px-3 py-3 rounded-xl ${theme.inputBg} border ${theme.inputBorder} text-[10px]`}>
                    <option value="club">Club</option><option value="seleccion">Selección</option>
                  </select>
                  {/* BLINDAJE VISUAL: Si es selección, no pide país porque asume el nombre */}
                  {formEquipo.tipo === 'club' ? (
                    <input type="text" placeholder="País" value={formEquipo.pais} onChange={e => setFormEquipo({...formEquipo, pais: e.target.value})} className={`px-4 py-3 rounded-xl ${theme.inputBg} border ${theme.inputBorder} text-xs`} required />
                  ) : (
                    <div className={`px-4 py-3 rounded-xl bg-[#EBE5DC]/50 border ${theme.inputBorder} text-xs text-[#8C7A6B] italic`}>Asume el nombre</div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="url" placeholder="URL Escudo" value={formEquipo.logo} onChange={e => setFormEquipo({...formEquipo, logo: e.target.value})} className={`px-4 py-3 rounded-xl ${theme.inputBg} border ${theme.inputBorder} text-xs`} required />
                  <select value={formEquipo.confederacion_id} onChange={e => setFormEquipo({...formEquipo, confederacion_id: e.target.value})} className={`px-3 py-3 rounded-xl ${theme.inputBg} border ${theme.inputBorder} text-[10px]`}>
                    <option value="">(Sin Confed.)</option>
                    {confederaciones.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                <button type="submit" className={`w-full py-3 rounded-xl ${theme.primaryBtn} font-bold text-[10px] uppercase tracking-widest`}>Guardar Datos</button>
              </form>
              <div className="overflow-y-auto custom-scrollbar flex-1 space-y-3 pr-2">
                {equipos.map(e => (
                  <div key={e.id} className={`flex items-center justify-between p-4 rounded-2xl border ${theme.cardBorder} ${theme.innerCardBg} ${theme.cardHover}`}>
                    <div className="flex items-center gap-4">
                      <FallbackImage src={e.logo} alt={e.nombre} className="w-10 h-10 object-contain drop-shadow-sm" />
                      <div>
                        <p className="text-[11px] font-bold uppercase truncate max-w-[110px]">{e.nombre}</p>
                        <p className={`text-[9px] uppercase tracking-widest ${theme.textMuted} mt-0.5`}>{e.pais} {!e.confederacion_id && <span className="text-[#8C7A6B] font-bold ml-1">Huérfana</span>}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <ActionButton type="edit" onClick={() => handleEditEq(e)} />
                      <ActionButton type="delete" onClick={() => handleEliminarEq(e.id)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MATRÍCULAS (LA ADUANA) */}
        {/* ========================================================================= */}
        {activeTab === 'matriculas' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in">
            <div className={`p-8 md:p-12 rounded-[2rem] ${theme.cardBg} border ${theme.cardBorder} ${theme.cardShadow}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${theme.badgeBg} text-[#8C7A6B]`}><Icons.Handshake /></div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[#3E362E]">Aduana de Afiliaciones</h3>
              </div>
              <p className={`text-xs mb-10 leading-relaxed ${theme.textMuted}`}>Selecciona primero el Torneo Base. El sistema filtrará automáticamente las escuadras disponibles respetando las fronteras geográficas y genéticas.</p>

              <form onSubmit={handleMatricular} className="space-y-6">
                <div>
                  <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 block mb-2 ${theme.textMuted}`}>1. Seleccionar Torneo Base</label>
                  <select value={formMatricula.competicion_id} onChange={(e) => setFormMatricula({...formMatricula, competicion_id: e.target.value, equipo_id: ''})} className={`w-full px-5 py-4 rounded-2xl ${theme.inputBg} border ${theme.inputBorder} text-sm font-bold focus:outline-none`} required>
                    <option value="">Seleccione Liga / Copa...</option>
                    {competiciones.map(comp => <option key={comp.id} value={comp.id}>{comp.nombre} ({comp.pais})</option>)}
                  </select>
                </div>
                <div>
                  <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 block mb-2 ${theme.textMuted}`}>2. Seleccionar Escuadra Compatible</label>
                  {/* BLINDAJE VISUAL: Muestra solo los equipos que pasaron el filtro de la Aduana */}
                  <select value={formMatricula.equipo_id} onChange={(e) => setFormMatricula({...formMatricula, equipo_id: e.target.value})} disabled={!formMatricula.competicion_id} className={`w-full px-5 py-4 rounded-2xl ${theme.inputBg} border ${theme.inputBorder} text-sm font-bold focus:outline-none disabled:opacity-50`} required>
                    <option value="">{formMatricula.competicion_id ? 'Escuadras disponibles...' : 'Elija torneo primero...'}</option>
                    {equiposDisponiblesParaMatricula.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre} ({eq.pais})</option>)}
                  </select>
                </div>
                <button type="submit" disabled={loading || !formMatricula.equipo_id} className={`w-full py-4.5 rounded-2xl ${theme.primaryBtn} font-black text-xs uppercase tracking-widest mt-8 disabled:opacity-50`}>
                  {loading ? 'Procesando...' : 'Firmar Afiliación Oficial'}
                </button>
              </form>
            </div>

            <div className={`p-6 md:p-10 rounded-[2rem] ${theme.cardBg} border ${theme.cardBorder} ${theme.cardShadow} h-[650px] flex flex-col`}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-8 text-[#3E362E] border-b border-[#E5E0D8] pb-4">Registro de Afiliaciones Actuales</h3>
              <div className="overflow-y-auto custom-scrollbar flex-1 space-y-4 pr-2">
                {equipos.map(eq => (
                  <div key={eq.id} className={`p-5 rounded-2xl ${theme.innerCardBg} border ${theme.cardBorder} hover:border-[#D6CEC3] transition-colors`}>
                    <div className="flex items-center gap-4 mb-4">
                      <FallbackImage src={eq.logo} alt={eq.nombre} className="w-12 h-12 object-contain drop-shadow-sm" />
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-wider">{eq.nombre}</h4>
                        <span className={`text-[9px] uppercase tracking-widest mt-1 inline-block ${theme.textMuted}`}>{eq.tipo} • {eq.pais}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {eq.competiciones.length > 0 ? (
                        eq.competiciones.map(c => (
                          <span key={c.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-bold uppercase tracking-widest ${theme.badgeBg} ${theme.badgeText}`}>
                            <FallbackImage src={c.logo} alt={c.nombre} className="w-3.5 h-3.5 object-contain" /> {c.nombre}
                          </span>
                        ))
                      ) : (
                        <span className={`text-[10px] font-medium italic ${theme.textMuted} px-1`}>Agente libre.</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ARENA (TELEMETRÍA DE PARTIDOS) */}
        {/* ========================================================================= */}
        {activeTab === 'arena' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in">
            <div className={`xl:col-span-1 p-6 md:p-8 rounded-[2rem] ${theme.cardBg} border ${theme.cardBorder} ${theme.cardShadow} flex flex-col`}>
              <div className="flex items-center gap-2 mb-8 border-b border-[#E5E0D8] pb-4">
                <div className={`p-2 rounded-xl ${theme.badgeBg} text-[#8C7A6B]`}><Icons.Soccer /></div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#3E362E]">Telemetría</h3>
              </div>
              <form onSubmit={handleSubmitPartido} className="space-y-5">
                <div>
                  <label className={`text-[9px] font-bold uppercase tracking-widest pl-1 block mb-1.5 ${theme.textMuted}`}>Competición</label>
                  <select value={formPartido.competicion_id} onChange={(e) => setFormPartido({...formPartido, competicion_id: e.target.value, equipo_local_id: '', equipo_visitante_id: ''})} className={`w-full px-4 py-3.5 rounded-2xl ${theme.inputBg} border ${theme.inputBorder} text-xs font-bold focus:outline-none transition-all`} required>
                    <option value="">Seleccione Torneo...</option>
                    {competiciones.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                {formPartido.competicion_id && (
                  <div className="grid grid-cols-2 gap-4 animate-fade-in">
                    <div>
                      <label className={`text-[9px] font-bold uppercase tracking-widest pl-1 block mb-1.5 ${theme.textMuted}`}>Local</label>
                      <select value={formPartido.equipo_local_id} onChange={(e) => setFormPartido({...formPartido, equipo_local_id: e.target.value})} className={`w-full px-3 py-3.5 rounded-2xl ${theme.inputBg} border ${theme.inputBorder} text-xs font-bold focus:outline-none`} required>
                        <option value="">Local...</option>
                        {equiposDisponiblesParaPartido.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={`text-[9px] font-bold uppercase tracking-widest pl-1 block mb-1.5 ${theme.textMuted}`}>Visita</label>
                      <select value={formPartido.equipo_visitante_id} onChange={(e) => setFormPartido({...formPartido, equipo_visitante_id: e.target.value})} className={`w-full px-3 py-3.5 rounded-2xl ${theme.inputBg} border ${theme.inputBorder} text-xs font-bold focus:outline-none`} required>
                        <option value="">Visita...</option>
                        {equiposDisponiblesParaPartido.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                      </select>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={`text-[9px] font-bold uppercase tracking-widest text-center block mb-1.5 ${theme.textMuted}`}>Gol L.</label>
                    <input type="number" min="0" value={formPartido.marcador_local} onChange={(e) => setFormPartido({...formPartido, marcador_local: e.target.value})} className={`w-full px-2 py-3.5 rounded-xl ${theme.inputBg} border ${theme.inputBorder} text-sm font-bold text-center focus:outline-none`} required />
                  </div>
                  <div>
                    <label className={`text-[9px] font-bold uppercase tracking-widest text-center block mb-1.5 ${theme.textMuted}`}>Gol V.</label>
                    <input type="number" min="0" value={formPartido.marcador_visitante} onChange={(e) => setFormPartido({...formPartido, marcador_visitante: e.target.value})} className={`w-full px-2 py-3.5 rounded-xl ${theme.inputBg} border ${theme.inputBorder} text-sm font-bold text-center focus:outline-none`} required />
                  </div>
                  <div>
                    <label className={`text-[9px] font-bold uppercase tracking-widest text-center block mb-1.5 ${theme.textMuted}`}>Fase</label>
                    <select value={formPartido.estado} onChange={(e) => setFormPartido({...formPartido, estado: e.target.value})} className={`w-full px-1 py-3.5 rounded-xl ${theme.inputBg} border ${theme.inputBorder} text-[10px] font-bold text-center focus:outline-none`} required>
                      <option value="programado">Previo</option>
                      <option value="en vivo">Vivo</option>
                      <option value="finalizado">Final</option>
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={loading} className={`w-full py-4 rounded-2xl ${theme.primaryBtn} font-bold text-[10px] uppercase tracking-widest mt-4 disabled:opacity-50`}>
                  {loading ? 'Transmitiendo...' : 'Registrar Encuentro'}
                </button>
              </form>
            </div>

            <div className={`xl:col-span-2 p-6 md:p-8 rounded-[2rem] ${theme.cardBg} border ${theme.cardBorder} ${theme.cardShadow} flex flex-col h-[700px]`}>
              <div className="flex justify-between items-center mb-8 border-b border-[#E5E0D8] pb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${theme.badgeBg} text-[#8C7A6B]`}><Icons.Radar /></div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#3E362E]">Radar de Encuentros</h3>
                </div>
                <button onClick={fetchPartidos} className={`text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl border ${theme.badgeBg} ${theme.badgeText} hover:bg-[#E2D8C9] transition-colors`}>Actualizar</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 overflow-y-auto custom-scrollbar pr-2 pb-4">
                {partidos.map((partido) => (
                  <div key={partido.id} className={`p-5 rounded-3xl ${theme.innerCardBg} border ${theme.cardBorder} ${theme.cardHover} flex flex-col justify-between group`}>
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2.5">
                          {partido.competicion?.logo && <FallbackImage src={partido.competicion.logo} alt={partido.competicion.nombre} className="w-6 h-6 rounded-full object-cover bg-white p-0.5 border shadow-sm" />}
                          <span className={`text-[9px] font-bold tracking-widest text-[#8C7A6B] uppercase truncate max-w-[120px]`}>{partido.competicion?.nombre || 'Amistoso'}</span>
                        </div>
                        <span className={`uppercase px-2.5 py-1 rounded-md text-[8px] font-bold tracking-wider ${partido.estado === 'en vivo' ? 'bg-[#FCE8E8] text-[#A65C5C] border border-[#EACCCC] animate-pulse' : 'bg-[#E5E0D8] text-[#6B5A4D]'}`}>
                          {partido.estado}
                        </span>
                      </div>

                      <div className="flex justify-between items-center font-black text-sm my-6">
                        <div className="flex flex-col items-center w-[30%] gap-3">
                          <FallbackImage src={partido.equipo_local?.logo} alt={partido.equipo_local?.nombre} className="w-12 h-12 object-contain drop-shadow-sm" />
                          <span className="truncate w-full text-center text-[10px] uppercase tracking-wider text-[#3E362E]">{partido.equipo_local?.nombre || '???'}</span>
                        </div>
                        <div className={`px-5 py-3 rounded-2xl border text-xl font-mono shadow-sm flex-shrink-0 bg-white border-[#D6CEC3] text-[#3E362E]`}>
                          {partido.marcador_local} - {partido.marcador_visitante}
                        </div>
                        <div className="flex flex-col items-center w-[30%] gap-3">
                          <FallbackImage src={partido.equipo_visitante?.logo} alt={partido.equipo_visitante?.nombre} className="w-12 h-12 object-contain drop-shadow-sm" />
                          <span className="truncate w-full text-center text-[10px] uppercase tracking-wider text-[#3E362E]">{partido.equipo_visitante?.nombre || '???'}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`mt-3 pt-4 border-t border-[#E5E0D8] flex justify-between items-center`}>
                      <span className={`text-[9px] font-mono tracking-widest ${theme.textMuted}`}>ID_{partido.id}</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <ActionButton type="delete" onClick={() => handleEliminarPartido(partido.id)} />
                      </div>
                    </div>
                  </div>
                ))}
                {partidos.length === 0 && (
                  <div className={`col-span-full py-20 text-center rounded-[2rem] border border-dashed border-[#D6CEC3] bg-[#FAF8F5]`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted}`}>El radar está despejado.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}