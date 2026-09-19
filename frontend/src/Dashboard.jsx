import { useEffect, useState } from "react";
import { apiCollection, apiRequest } from "./api";
import {
  EMPTY_FILTERS,
  COMPETITION_TYPES,
  changeFilters,
  countryOptions,
  filterCatalog,
  normalize,
} from "./catalogFilters";
import { summarizeAdmin } from "./adminSummary";
import {
  Brand,
  Icon,
  Crest,
  EmptyState,
  Modal,
  Field,
  MatchRow,
  SectionArt,
} from "./AdminUI";
import "./admin.css";

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("inicio");

  const [catalogTab, setCatalogTab] = useState("competiciones");
  const [matchFilter, setMatchFilter] = useState("");
  const [onlyFree, setOnlyFree] = useState(false);
  const [enrollmentSearch, setEnrollmentSearch] = useState("");
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [catalogsReady, setCatalogsReady] = useState(false);
  const [matchesReady, setMatchesReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);

  const [partidos, setPartidos] = useState([]);
  const [confederaciones, setConfederaciones] = useState([]);
  const [competiciones, setCompeticiones] = useState([]);
  const [equipos, setEquipos] = useState([]);

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  // Estados para CRUD
  const [editConfId, setEditConfId] = useState(null);
  const [formConf, setFormConf] = useState({ nombre: "", logo: "" });

  const [editCompId, setEditCompId] = useState(null);
  const [formComp, setFormComp] = useState({
    nombre: "",
    logo: "",
    tipo: "liga_nacional",
    pais: "",
    confederacion_id: "",
  });

  const [editEqId, setEditEqId] = useState(null);
  const [formEquipo, setFormEquipo] = useState({
    nombre: "",
    logo: "",
    tipo: "club",
    pais: "",
    confederacion_id: "",
  });

  const [formMatricula, setFormMatricula] = useState({
    equipo_id: "",
    competicion_id: "",
  });
  const [formPartido, setFormPartido] = useState({
    competicion_id: "",
    equipo_local_id: "",
    equipo_visitante_id: "",
    marcador_local: 0,
    marcador_visitante: 0,
    estado: "programado",
  });

  const [filtroPais, setFiltroPais] = useState("");
  const [catalogFilters, setCatalogFilters] = useState({ ...EMPTY_FILTERS });
  const [showConfForm, setShowConfForm] = useState(false);
  const [showCompForm, setShowCompForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const catalog = filterCatalog(competiciones, equipos, catalogFilters);
  const countries = countryOptions(
    competiciones,
    equipos,
    catalogFilters.confederation,
  );
  const updateFilter = (field, value) =>
    setCatalogFilters((current) => changeFilters(current, field, value));
  const clearFilters = () => setCatalogFilters({ ...EMPTY_FILTERS });
  const [mensajeApi, setMensajeApi] = useState(null);
  const [loading, setLoading] = useState(false);

  const notify = (tipo, texto) => {
    setMensajeApi({ tipo, texto });
    setTimeout(() => setMensajeApi(null), 3500);
  };

  const clearSession = () => {
    setIsLoggedIn(false);
    setActiveTab("inicio");
    setCatalogsReady(false);
    setMatchesReady(false);
    setShowConfForm(false);
    setShowCompForm(false);
    setShowTeamForm(false);
    setShowMatchForm(false);
    clearFilters();
    setPartidos([]);
    setConfederaciones([]);
    setCompeticiones([]);
    setEquipos([]);
    setLoginForm((form) => ({ ...form, password: "" }));
  };

  const handleApiError = (error) => {
    if (error.status === 401) clearSession();
    notify(
      "error",
      error.status ? error.message : "No se pudo conectar con el servidor.",
    );
  };

  // Solo se guardan listas válidas; un 401 vuelve al login sin romper la vista.
  const fetchPartidos = async (quiet = false) => {
    try {
      const data = await apiCollection("/partidos/");
      setPartidos(data);
      setIsLoggedIn(true);
      setMatchesReady(true);
      setUpdatedAt(new Date());
    } catch (error) {
      if (quiet && error.status === 401) clearSession();
      else handleApiError(error);
    }
  };

  const fetchCatalogs = async () => {
    try {
      const [confs, comps, eqs] = await Promise.all([
        apiCollection("/confederaciones/"),
        apiCollection("/competiciones/"),
        apiCollection("/equipos/"),
      ]);
      setConfederaciones(confs);
      setCompeticiones(comps);
      setEquipos(eqs);
      setCatalogsReady(true);
      setUpdatedAt(new Date());
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchCatalogs();
  }, [isLoggedIn]);
  useEffect(() => {
    fetchPartidos(true).finally(() => setCheckingSession(false));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensajeApi(null);
    try {
      await apiRequest("/login", { method: "POST", body: loginForm });
      setLoginForm((form) => ({ ...form, password: "" }));
      await fetchPartidos();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest("/logout", { method: "POST" });
      clearSession();
      setMensajeApi(null);
    } catch (error) {
      handleApiError(error);
    }
  };

  // --- CRUD CONFEDERACIONES ---
  const handleSubmitConf = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest(
        editConfId ? `/confederaciones/${editConfId}` : "/confederaciones/",
        {
          method: editConfId ? "PUT" : "POST",
          body: formConf,
        },
      );
      notify("success", "Confederación guardada");
      setFormConf({ nombre: "", logo: "" });
      setEditConfId(null);
      setShowConfForm(false);
      await fetchCatalogs();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleEditConf = (c) => {
    setFormConf({ nombre: c.nombre, logo: c.logo });
    setEditConfId(c.id);
    setShowConfForm(true);
    setFiltroPais("");
  };

  const deleteEntity = async (path) => {
    try {
      await apiRequest(path, { method: "DELETE" });
      await Promise.all([fetchCatalogs(), fetchPartidos()]);
    } catch (error) {
      handleApiError(error);
    }
  };
  const handleEliminarConf = (id) => {
    if (confirm("¿Eliminar? Ligas y equipos quedarán huérfanos pero intactos."))
      return deleteEntity(`/confederaciones/${id}`);
  };

  // --- CRUD COMPETICIONES ---
  const handleSubmitComp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest(
        editCompId ? `/competiciones/${editCompId}` : "/competiciones/",
        {
          method: editCompId ? "PUT" : "POST",
          body: {
            ...formComp,
            confederacion_id: parseInt(formComp.confederacion_id) || null,
          },
        },
      );
      notify("success", "Competición guardada");
      setFormComp({
        nombre: "",
        logo: "",
        tipo: "liga_nacional",
        pais: "",
        confederacion_id: "",
      });
      setEditCompId(null);
      setShowCompForm(false);
      await Promise.all([fetchCatalogs(), fetchPartidos()]);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleEditComp = (c) => {
    setFormComp({
      nombre: c.nombre,
      logo: c.logo,
      tipo: c.tipo,
      pais: c.pais,
      confederacion_id: c.confederacion_id || "",
    });
    setEditCompId(c.id);
    setShowCompForm(true);
  };
  const handleEliminarComp = (id) => {
    if (confirm("¿Eliminar liga? Los partidos asociados quedarán sin torneo."))
      return deleteEntity(`/competiciones/${id}`);
  };

  // --- CRUD EQUIPOS ---
  const handleSubmitEquipo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest(editEqId ? `/equipos/${editEqId}` : "/equipos/", {
        method: editEqId ? "PUT" : "POST",
        body: {
          ...formEquipo,
          confederacion_id: parseInt(formEquipo.confederacion_id) || null,
        },
      });
      notify("success", "Equipo guardado");
      setFormEquipo({
        nombre: "",
        logo: "",
        tipo: "club",
        pais: "",
        confederacion_id: "",
      });
      setEditEqId(null);
      setShowTeamForm(false);
      await Promise.all([fetchCatalogs(), fetchPartidos()]);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleEditEq = (eq) => {
    setFormEquipo({
      nombre: eq.nombre,
      logo: eq.logo,
      tipo: eq.tipo,
      pais: eq.pais,
      confederacion_id: eq.confederacion_id || "",
    });
    setEditEqId(eq.id);
    setShowTeamForm(true);
  };
  const handleEliminarEq = (id) => {
    if (confirm("¿Eliminar escuadra? Sus partidos quedarán incompletos."))
      return deleteEntity(`/equipos/${id}`);
  };

  const handleMatricular = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiRequest(
        `/equipos/${formMatricula.equipo_id}/matricular/${formMatricula.competicion_id}`,
        { method: "POST" },
      );
      notify(data.ok ? "success" : "error", data.mensaje);
      if (data.ok) {
        await fetchCatalogs();
        setFormMatricula({ equipo_id: "", competicion_id: "" });
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPartido = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest("/partidos/", {
        method: "POST",
        body: {
          competicion_id: parseInt(formPartido.competicion_id),
          equipo_local_id: parseInt(formPartido.equipo_local_id),
          equipo_visitante_id: parseInt(formPartido.equipo_visitante_id),
          marcador_local: parseInt(formPartido.marcador_local),
          marcador_visitante: parseInt(formPartido.marcador_visitante),
          estado: formPartido.estado,
        },
      });
      notify("success", "Partido registrado");
      setShowMatchForm(false);
      setFormPartido({
        competicion_id: "",
        equipo_local_id: "",
        equipo_visitante_id: "",
        marcador_local: 0,
        marcador_visitante: 0,
        estado: "programado",
      });
      await fetchPartidos();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleEliminarPartido = (id) => {
    if (confirm(`¿Eliminar encuentro #${id} y sus estadísticas?`))
      return deleteEntity(`/partidos/${id}`);
  };

  const asociarHuerfano = async (tipo, idItem) => {
    if (!editConfId) return;
    const item =
      tipo === "competiciones"
        ? competiciones.find((c) => c.id === idItem)
        : equipos.find((e) => e.id === idItem);
    try {
      await apiRequest(`/${tipo}/${idItem}`, {
        method: "PUT",
        body: { ...item, confederacion_id: editConfId },
      });
      await fetchCatalogs();
    } catch (error) {
      handleApiError(error);
    }
  };

  const compsHuerfanasFiltradas = competiciones.filter(
    (c) =>
      !c.confederacion_id &&
      c.pais.toLowerCase().includes(filtroPais.toLowerCase()),
  );
  const eqsHuerfanosFiltrados = equipos.filter(
    (e) =>
      !e.confederacion_id &&
      e.pais.toLowerCase().includes(filtroPais.toLowerCase()),
  );

  // FILTRO DINÁMICO PARA PARTIDOS (La Arena)
  const equiposDisponiblesParaPartido = formPartido.competicion_id
    ? equipos.filter((eq) =>
        eq.competiciones.some(
          (c) => c.id === parseInt(formPartido.competicion_id),
        ),
      )
    : [];

  // FILTRO INTELIGENTE PARA MATRÍCULAS (La Aduana Geográfica y Genética)
  const equiposDisponiblesParaMatricula = formMatricula.competicion_id
    ? equipos.filter((eq) => {
        const comp = competiciones.find(
          (c) => c.id === parseInt(formMatricula.competicion_id),
        );
        if (!comp) return false;

        // 1. Naturaleza (Selección vs Club)
        if (
          comp.tipo === "internacional_selecciones" &&
          eq.tipo !== "seleccion"
        )
          return false;
        if (
          comp.tipo !== "internacional_selecciones" &&
          eq.tipo === "seleccion"
        )
          return false;

        // 2. Geografía Local (Ligas Nacionales)
        if (
          ["liga_nacional", "copa_nacional"].includes(comp.tipo) &&
          eq.pais !== comp.pais
        )
          return false;

        // 3. Confederación Continental
        if (
          comp.confederacion_id &&
          eq.confederacion_id !== comp.confederacion_id
        )
          return false;

        return !eq.competiciones?.some((c) => c.id === comp.id);
      })
    : [];

  const summary = summarizeAdmin(competiciones, equipos, partidos);
  const ready = catalogsReady && matchesReady;
  const sections = {
    inicio: {
      label: "Inicio",
      eyebrow: "EL FÚTBOL, BIEN ORGANIZADO",
      title: (
        <>
          Todo el juego.
          <br />
          <em>Bajo control.</em>
        </>
      ),
      description:
        "Organiza tu universo futbolístico. Competiciones, equipos y partidos, conectados desde un mismo lugar.",
      action: "Explorar el catálogo",
      icon: "grid",
    },
    ecosistema: {
      label: "Catálogo",
      eyebrow: "LA BASE DE TU UNIVERSO",
      title: (
        <>
          Cada equipo.
          <br />
          <em>En su lugar.</em>
        </>
      ),
      description:
        "Da forma a tu catálogo y encuentra lo que necesitas sin perder de vista el conjunto.",
      action: "Añadir registro",
      icon: "plus",
    },
    matriculas: {
      label: "Matrículas",
      eyebrow: "CONEXIONES QUE HACEN EQUIPO",
      title: (
        <>
          El torneo correcto.
          <br />
          <em>El equipo indicado.</em>
        </>
      ),
      description:
        "Conecta equipos y competiciones. Revisa las matrículas existentes y completa las que faltan.",
      action: "Crear matrícula",
      icon: "link",
    },
    arena: {
      label: "Partidos",
      eyebrow: "DEL CALENDARIO AL MARCADOR",
      title: (
        <>
          Cada encuentro.
          <br />
          <em>Una historia.</em>
        </>
      ),
      description:
        "Registra los partidos de tus competiciones y consulta el estado de cada encuentro.",
      action: "Registrar partido",
      icon: "plus",
    },
  };
  const section = sections[activeTab];
  const closeForms = () => {
    setMensajeApi(null);
    setShowConfForm(false);
    setShowCompForm(false);
    setShowTeamForm(false);
    setShowMatchForm(false);
    setEditConfId(null);
    setEditCompId(null);
    setEditEqId(null);
  };
  const openCreate = (type) => {
    closeForms();
    if (type === "confederaciones") {
      setFormConf({ nombre: "", logo: "" });
      setShowConfForm(true);
    }
    if (type === "competiciones") {
      setFormComp({
        nombre: "",
        logo: "",
        tipo: "liga_nacional",
        pais: "",
        confederacion_id: "",
      });
      setShowCompForm(true);
    }
    if (type === "equipos") {
      setFormEquipo({
        nombre: "",
        logo: "",
        tipo: "club",
        pais: "",
        confederacion_id: "",
      });
      setShowTeamForm(true);
    }
    if (type === "partidos") {
      setFormPartido({
        competicion_id: "",
        equipo_local_id: "",
        equipo_visitante_id: "",
        marcador_local: 0,
        marcador_visitante: 0,
        estado: "programado",
      });
      setShowMatchForm(true);
    }
  };
  const goCatalog = (type) => {
    clearFilters();
    setCatalogTab(type);
    setActiveTab("ecosistema");
  };
  const goEnrollments = (freeOnly = false) => {
    setOnlyFree(freeOnly);
    setEnrollmentSearch("");
    setActiveTab("matriculas");
  };
  const heroAction = () => {
    if (activeTab === "inicio") goCatalog("competiciones");
    else if (activeTab === "ecosistema") openCreate(catalogTab);
    else if (activeTab === "arena") openCreate("partidos");
    else document.getElementById("matricula-competition")?.focus();
  };
  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([fetchPartidos(), fetchCatalogs()]);
    setRefreshing(false);
  };
  const formOpen =
    showConfForm || showCompForm || showTeamForm || showMatchForm;
  const catalogItems =
    catalogTab === "confederaciones"
      ? confederaciones.filter((c) =>
          normalize(c.nombre).includes(normalize(catalogFilters.search)),
        )
      : catalogTab === "competiciones"
        ? catalog.competitions
        : catalog.teams;
  const catalogTotal =
    catalogTab === "confederaciones"
      ? confederaciones.length
      : catalogTab === "competiciones"
        ? competiciones.length
        : equipos.length;
  const enrollmentItems = equipos.filter(
    (eq) =>
      (!onlyFree || !eq.competiciones?.length) &&
      normalize(eq.nombre).includes(normalize(enrollmentSearch)),
  );
  const matchItems = [...partidos]
    .filter((p) =>
      matchFilter === "incompletos"
        ? summary.incomplete.some((item) => item.id === p.id)
        : !matchFilter || p.estado === matchFilter,
    )
    .sort((a, b) => b.id - a.id);
  const toast = mensajeApi && (
    <div
      role={mensajeApi.tipo === "error" ? "alert" : "status"}
      className={`v-toast ${mensajeApi.tipo === "error" ? "v-toast-error" : ""}`}
    >
      <Icon name={mensajeApi.tipo === "error" ? "alert" : "check"} />
      {mensajeApi.texto}
    </div>
  );
  const confOptions = (
    <>
      <option value="">Sin confederación</option>
      {confederaciones.map((c) => (
        <option key={c.id} value={c.id}>
          {c.nombre}
        </option>
      ))}
    </>
  );
  const formFooter = (
    <div className="v-form-footer">
      <button
        type="button"
        className="v-btn v-btn-secondary"
        onClick={closeForms}
      >
        Cancelar
      </button>
      <button type="submit" className="v-btn v-btn-dark" disabled={loading}>
        {loading ? "Guardando…" : "Guardar cambios"}
        <Icon name="check" />
      </button>
    </div>
  );

  if (checkingSession)
    return (
      <div className="v-loading">
        <Brand />
        <span className="v-loading-bar" />
        <p>Preparando tu espacio de trabajo…</p>
      </div>
    );
  if (!isLoggedIn)
    return (
      <div className="v-login">
        <div className="v-login-scene">
          <Brand />
          <div className="v-login-copy">
            <span className="v-eyebrow">EL FÚTBOL EMPIEZA AQUÍ</span>
            <h1>
              Detrás de
              <br />
              cada partido,
              <br />
              <em>estás tú.</em>
            </h1>
            <p>El espacio donde organizas los datos que dan vida a VÉRTICE.</p>
          </div>
          <SectionArt variant="inicio" />
          <span className="v-login-caption">
            CATÁLOGO · MATRÍCULAS · PARTIDOS
          </span>
        </div>
        <main className="v-login-form-area">
          <div className="v-login-box">
            <Brand />
            <span className="v-eyebrow">VÉRTICE ADMIN</span>
            <h2>Bienvenido de nuevo.</h2>
            <p>
              Entra a tu espacio de administración para seguir construyendo el
              juego.
            </p>
            <form onSubmit={handleLogin} className="v-form">
              <Field label="Usuario">
                <input
                  autoComplete="username"
                  value={loginForm.username}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, username: e.target.value })
                  }
                  placeholder="Tu usuario de administrador"
                  required
                />
              </Field>
              <Field label="Contraseña">
                <input
                  type="password"
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  placeholder="Escribe tu contraseña"
                  required
                />
              </Field>
              {mensajeApi && (
                <p role="alert" className="v-login-error">
                  {mensajeApi.texto}
                </p>
              )}
              <button disabled={loading} className="v-btn v-btn-dark">
                {loading ? "Entrando…" : "Entrar al workspace"}
                <Icon name="arrow" />
              </button>
            </form>
            <p className="v-login-foot">
              Acceso reservado a la administración de VÉRTICE.
            </p>
          </div>
        </main>
      </div>
    );

  return (
    <div className="v-app">
      <aside className="v-sidebar">
        <Brand />
        <p className="v-nav-label">ESPACIO DE TRABAJO</p>
        <nav className="v-nav" aria-label="Navegación principal">
          {[
            ["inicio", "home"],
            ["ecosistema", "grid"],
            ["matriculas", "link"],
            ["arena", "pitch"],
          ].map(([tab, icon]) => (
            <button
              key={tab}
              aria-label={sections[tab].label}
              aria-current={activeTab === tab ? "page" : undefined}
              onClick={() => setActiveTab(tab)}
            >
              <Icon name={icon} />
              <span>{sections[tab].label}</span>
            </button>
          ))}
        </nav>
        <div className="v-sidebar-note">
          <Icon name="shield" />
          <strong>El orden también juega.</strong>
          <p>Un buen catálogo es el inicio de una gran experiencia.</p>
        </div>
        <div className="v-user">
          <span className="v-avatar">AD</span>
          <div>
            <strong>Administración</strong>
            <small>VÉRTICE Workspace</small>
          </div>
          <button onClick={handleLogout} aria-label="Cerrar sesión">
            <Icon name="logout" />
          </button>
        </div>
      </aside>
      <main className="v-main">
        <header className="v-topbar">
          <div className="v-breadcrumb">
            Workspace <span>/</span> <strong>{section.label}</strong>
          </div>
          <div className="v-mobile-brand">
            <Brand />
          </div>
          <div className="v-top-actions">
            <span className="v-admin-tag">
              <Icon name="shield" />
              Entorno de administración
            </span>
            <button
              className="v-text-btn"
              disabled={refreshing}
              onClick={refreshData}
              aria-label="Actualizar datos"
            >
              <Icon name="refresh" />
              <span>{refreshing ? "Actualizando…" : "Actualizar"}</span>
            </button>
            <button
              className="v-icon-btn"
              onClick={handleLogout}
              aria-label="Salir de la sesión"
            >
              <Icon name="logout" />
            </button>
          </div>
        </header>
        <div className="v-content">
          <div className="v-page-intro">
            <div>
              <h1>
                {activeTab === "inicio"
                  ? "Tu centro de operaciones"
                  : section.label}
              </h1>
              <p>
                {activeTab === "inicio"
                  ? "Una mirada al estado de tu universo futbolístico."
                  : {
                      ecosistema: "Las entidades que dan forma a VÉRTICE.",
                      matriculas:
                        "Gestiona quién participa en cada competición.",
                      arena: "Todos tus encuentros, organizados.",
                    }[activeTab]}
              </p>
            </div>
            {updatedAt && (
              <span className="v-updated">
                Última consulta ·{" "}
                {updatedAt.toLocaleTimeString("es", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
          <section className="v-hero">
            <div className="v-hero-copy">
              <span className="v-eyebrow">{section.eyebrow}</span>
              <h2>{section.title}</h2>
              <p>{section.description}</p>
              <button className="v-btn v-btn-primary" onClick={heroAction}>
                {section.action}
                <Icon name={section.icon === "grid" ? "arrow" : section.icon} />
              </button>
            </div>
            <SectionArt variant={activeTab} />
          </section>

          {activeTab === "inicio" && (
            <>
              <div className="v-metrics">
                {[
                  {
                    title: "Competiciones",
                    value: competiciones.length,
                    caption: "Ligas y copas en tu catálogo",
                    icon: "trophy",
                    action: () => goCatalog("competiciones"),
                  },
                  {
                    title: "Equipos",
                    value: equipos.length,
                    caption: "Clubes y selecciones",
                    icon: "shield",
                    action: () => goCatalog("equipos"),
                  },
                  {
                    title: "Por jugar",
                    value: summary.scheduled.length,
                    caption: "Partidos con estado programado",
                    icon: "pitch",
                    action: () => {
                      setMatchFilter("programado");
                      setActiveTab("arena");
                    },
                  },
                  {
                    title: "Sin matrícula",
                    value: summary.unregistered.length,
                    caption: "Equipos sin competición",
                    icon: "link",
                    warm: true,
                    action: () => goEnrollments(true),
                  },
                ].map((metric) => (
                  <button
                    key={metric.title}
                    className={`v-metric ${metric.warm ? "v-metric-warm" : ""}`}
                    onClick={metric.action}
                  >
                    <span className="v-metric-top">
                      {metric.title}
                      <span className="v-metric-icon">
                        <Icon name={metric.icon} />
                      </span>
                    </span>
                    <strong>{ready ? metric.value : "—"}</strong>
                    <small>{metric.caption}</small>
                  </button>
                ))}
              </div>
              {!ready ? (
                <div className="v-panel">
                  <EmptyState title="Cargando tu información…">
                    El resumen aparecerá cuando termine la consulta del
                    catálogo.
                  </EmptyState>
                </div>
              ) : (
                <div className="v-overview">
                  <div className="v-panel">
                    <div className="v-panel-head">
                      <div>
                        <h2>Últimos partidos registrados</h2>
                        <p>
                          Los registros más recientes de tu espacio de trabajo.
                        </p>
                      </div>
                      <button
                        className="v-text-btn"
                        onClick={() => {
                          setMatchFilter("");
                          setActiveTab("arena");
                        }}
                      >
                        Ver todos
                        <Icon name="arrow" />
                      </button>
                    </div>
                    {summary.recent.length ? (
                      summary.recent.map((match) => (
                        <MatchRow key={match.id} match={match} />
                      ))
                    ) : (
                      <EmptyState
                        title="Tu próximo partido empieza aquí"
                        icon="pitch"
                        action="Registrar primer partido"
                        onAction={() => {
                          setActiveTab("arena");
                          openCreate("partidos");
                        }}
                      >
                        Cuando registres encuentros, podrás seguir sus estados
                        desde este inicio.
                      </EmptyState>
                    )}
                  </div>
                  <div className="v-stack">
                    <div className="v-panel">
                      <div className="v-panel-head">
                        <div>
                          <h2>Para continuar</h2>
                          <p>Pequeñas tareas que mantienen todo en orden.</p>
                        </div>
                        <Icon name="clock" />
                      </div>
                      {summary.unregistered.length > 0 && (
                        <button
                          className="v-attention"
                          onClick={() => goEnrollments(true)}
                        >
                          <span className="v-attention-icon">
                            <Icon name="link" />
                          </span>
                          <span>
                            <strong>
                              {summary.unregistered.length}{" "}
                              {summary.unregistered.length === 1
                                ? "equipo sin matrícula"
                                : "equipos sin matrícula"}
                            </strong>
                            <small>
                              Revisa en qué competiciones van a participar.
                            </small>
                          </span>
                          <Icon name="arrow" />
                        </button>
                      )}
                      {summary.incomplete.length > 0 && (
                        <button
                          className="v-attention"
                          onClick={() => {
                            setMatchFilter("incompletos");
                            setActiveTab("arena");
                          }}
                        >
                          <span className="v-attention-icon">
                            <Icon name="alert" />
                          </span>
                          <span>
                            <strong>
                              {summary.incomplete.length}{" "}
                              {summary.incomplete.length === 1
                                ? "partido incompleto"
                                : "partidos incompletos"}
                            </strong>
                            <small>
                              Les falta un equipo o una competición.
                            </small>
                          </span>
                          <Icon name="arrow" />
                        </button>
                      )}
                      {!competiciones.length && (
                        <button
                          className="v-attention"
                          onClick={() => {
                            goCatalog("competiciones");
                            openCreate("competiciones");
                          }}
                        >
                          <span className="v-attention-icon">
                            <Icon name="trophy" />
                          </span>
                          <span>
                            <strong>Crea tu primera competición</strong>
                            <small>
                              El punto de partida de tus próximos encuentros.
                            </small>
                          </span>
                          <Icon name="arrow" />
                        </button>
                      )}
                      {!equipos.length && (
                        <button
                          className="v-attention"
                          onClick={() => {
                            goCatalog("equipos");
                            openCreate("equipos");
                          }}
                        >
                          <span className="v-attention-icon">
                            <Icon name="shield" />
                          </span>
                          <span>
                            <strong>Añade los primeros equipos</strong>
                            <small>
                              Construye el catálogo de clubes y selecciones.
                            </small>
                          </span>
                          <Icon name="arrow" />
                        </button>
                      )}
                      {!summary.unregistered.length &&
                        !summary.incomplete.length &&
                        competiciones.length > 0 &&
                        equipos.length > 0 && (
                          <div className="v-pending-clear">
                            <Icon name="check" />
                            Matrículas y referencias de partidos al día.
                          </div>
                        )}
                    </div>
                    <div className="v-panel">
                      <div className="v-panel-head">
                        <div>
                          <h2>Tu mapa de competiciones</h2>
                          <p>Equipos matriculados en cada torneo.</p>
                        </div>
                      </div>
                      {summary.rosters.length ? (
                        summary.rosters.slice(0, 3).map((comp) => (
                          <div key={comp.id} className="v-roster-row">
                            <Crest small src={comp.logo} name={comp.nombre} />
                            <div>
                              <strong>{comp.nombre}</strong>
                              <small>{comp.pais}</small>
                            </div>
                            <span>
                              {comp.teamCount}{" "}
                              {comp.teamCount === 1 ? "equipo" : "equipos"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <EmptyState
                          title="El mapa está por comenzar"
                          icon="globe"
                        >
                          Tus competiciones aparecerán aquí.
                        </EmptyState>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="v-quick-actions">
                <button
                  className="v-quick-action"
                  onClick={() => {
                    goCatalog("equipos");
                    openCreate("equipos");
                  }}
                >
                  <Icon name="shield" />
                  <span>Añadir equipo</span>
                  <Icon name="arrow" />
                </button>
                <button
                  className="v-quick-action"
                  onClick={() => goEnrollments()}
                >
                  <Icon name="link" />
                  <span>Gestionar matrículas</span>
                  <Icon name="arrow" />
                </button>
                <button
                  className="v-quick-action"
                  onClick={() => {
                    setActiveTab("arena");
                    openCreate("partidos");
                  }}
                >
                  <Icon name="pitch" />
                  <span>Registrar partido</span>
                  <Icon name="arrow" />
                </button>
              </div>
            </>
          )}

          {activeTab === "ecosistema" && (
            <section className="v-panel" aria-label="Catálogo del ecosistema">
              <div
                className="v-tabs"
                role="tablist"
                aria-label="Tipo de catálogo"
              >
                {[
                  ["competiciones", "Competiciones", competiciones.length],
                  ["equipos", "Equipos", equipos.length],
                  [
                    "confederaciones",
                    "Confederaciones",
                    confederaciones.length,
                  ],
                ].map(([type, label, total]) => (
                  <button
                    role="tab"
                    id={`tab-${type}`}
                    aria-controls="catalog-panel"
                    aria-selected={catalogTab === type}
                    tabIndex={catalogTab === type ? 0 : -1}
                    key={type}
                    onKeyDown={(e) => {
                      const order = [
                        "competiciones",
                        "equipos",
                        "confederaciones",
                      ];
                      if (
                        !["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                          e.key,
                        )
                      )
                        return;
                      e.preventDefault();
                      const index =
                        e.key === "Home"
                          ? 0
                          : e.key === "End"
                            ? 2
                            : (order.indexOf(type) +
                                (e.key === "ArrowRight" ? 1 : -1) +
                                3) %
                              3;
                      setCatalogTab(order[index]);
                      clearFilters();
                      document.getElementById(`tab-${order[index]}`)?.focus();
                    }}
                    onClick={() => {
                      setCatalogTab(type);
                      clearFilters();
                    }}
                  >
                    {label}
                    <small>{catalogsReady ? total : "—"}</small>
                  </button>
                ))}
              </div>
              <div
                role="tabpanel"
                id="catalog-panel"
                aria-labelledby={`tab-${catalogTab}`}
              >
                <div className="v-filter-bar">
                  <label className="v-field v-search">
                    <span>Buscar por nombre</span>
                    <input
                      type="search"
                      placeholder={`Buscar ${catalogTab}…`}
                      value={catalogFilters.search}
                      onChange={(e) => updateFilter("search", e.target.value)}
                    />
                  </label>
                  {catalogTab !== "confederaciones" && (
                    <>
                      <Field label="Confederación">
                        <select
                          value={catalogFilters.confederation}
                          onChange={(e) =>
                            updateFilter("confederation", e.target.value)
                          }
                        >
                          <option value="">Todas las confederaciones</option>
                          {confederaciones.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nombre}
                            </option>
                          ))}
                          <option value="unassigned">
                            Sin confederación / globales
                          </option>
                        </select>
                      </Field>
                      <Field label="País / ámbito">
                        <select
                          value={catalogFilters.country}
                          onChange={(e) =>
                            updateFilter("country", e.target.value)
                          }
                        >
                          <option value="">Todos los países y ámbitos</option>
                          {countries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </>
                  )}
                  {catalogTab === "competiciones" && (
                    <Field label="Tipo de competición">
                      <select
                        value={catalogFilters.competitionType}
                        onChange={(e) =>
                          updateFilter("competitionType", e.target.value)
                        }
                      >
                        <option value="">Todos los tipos</option>
                        {Object.entries(COMPETITION_TYPES).map(
                          ([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ),
                        )}
                      </select>
                    </Field>
                  )}
                  {catalogTab === "equipos" && (
                    <Field label="Matriculados en">
                      <select
                        value={catalog.selectedCompetition}
                        onChange={(e) =>
                          updateFilter("competition", e.target.value)
                        }
                      >
                        <option value="">Cualquier matrícula</option>
                        {catalog.availableCompetitions.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nombre}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}
                </div>
                <div className="v-catalog-toolbar">
                  <p role="status">
                    {catalogsReady
                      ? `${catalogItems.length} de ${catalogTotal} ${catalogTab}`
                      : "Cargando catálogo…"}
                  </p>
                  {catalogTab === "equipos" && (
                    <div
                      className="v-segments"
                      role="group"
                      aria-label="Tipo de equipo"
                    >
                      {[
                        ["", "Todos"],
                        ["club", "Clubes"],
                        ["seleccion", "Selecciones"],
                      ].map(([value, label]) => (
                        <button
                          key={value}
                          aria-pressed={catalogFilters.teamType === value}
                          onClick={() => updateFilter("teamType", value)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                  <button className="v-text-btn" onClick={clearFilters}>
                    Limpiar filtros
                  </button>
                </div>
                {catalogsReady && catalogItems.length === 0 && (
                  <EmptyState
                    title={
                      catalogTotal
                        ? "No encontramos coincidencias"
                        : "Tu catálogo está por comenzar"
                    }
                    action={
                      catalogTotal
                        ? "Limpiar filtros"
                        : "Añadir primer registro"
                    }
                    onAction={
                      catalogTotal ? clearFilters : () => openCreate(catalogTab)
                    }
                  >
                    {catalogTotal
                      ? "Prueba con otro nombre o ajusta los filtros."
                      : "Crea las entidades que organizarán tu universo futbolístico."}
                  </EmptyState>
                )}
                {catalogItems.map((item) => (
                  <article className="v-catalog-row" key={item.id}>
                    <Crest src={item.logo} name={item.nombre} />
                    <div className="v-entity-name">
                      <strong>{item.nombre}</strong>
                      <span>
                        {catalogTab === "confederaciones"
                          ? `${competiciones.filter((c) => c.confederacion_id === item.id).length} competiciones · ${equipos.filter((eq) => eq.confederacion_id === item.id).length} equipos`
                          : `${catalogTab === "equipos" ? (item.tipo === "seleccion" ? "Selección" : "Club") : COMPETITION_TYPES[item.tipo]} · ${item.pais} · ${confederaciones.find((c) => c.id === item.confederacion_id)?.nombre || "Sin confederación"}`}
                      </span>
                      {catalogTab === "equipos" && (
                        <div className="v-entity-tags">
                          {item.competiciones?.length ? (
                            item.competiciones.map((comp) => (
                              <span key={comp.id}>{comp.nombre}</span>
                            ))
                          ) : (
                            <span>Sin matrícula</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="v-entity-actions">
                      {catalogTab === "competiciones" && (
                        <button
                          className="v-text-btn"
                          onClick={() => {
                            setCatalogFilters((current) => ({
                              ...current,
                              search: "",
                              teamType: "",
                              competition: String(item.id),
                            }));
                            setCatalogTab("equipos");
                          }}
                        >
                          Ver equipos
                          <Icon name="arrow" />
                        </button>
                      )}
                      {catalogTab === "confederaciones" && (
                        <button
                          className="v-text-btn"
                          onClick={() => {
                            setCatalogFilters({
                              ...EMPTY_FILTERS,
                              confederation: String(item.id),
                            });
                            setCatalogTab("competiciones");
                          }}
                        >
                          Explorar
                          <Icon name="arrow" />
                        </button>
                      )}
                      <button
                        className="v-icon-btn"
                        aria-label={`Editar ${item.nombre}`}
                        onClick={() => {
                          closeForms();
                          (catalogTab === "confederaciones"
                            ? handleEditConf
                            : catalogTab === "competiciones"
                              ? handleEditComp
                              : handleEditEq)(item);
                        }}
                      >
                        <Icon name="edit" />
                      </button>
                      <button
                        className="v-icon-btn v-danger"
                        aria-label={`Eliminar ${item.nombre}`}
                        onClick={() =>
                          (catalogTab === "confederaciones"
                            ? handleEliminarConf
                            : catalogTab === "competiciones"
                              ? handleEliminarComp
                              : handleEliminarEq)(item.id)
                        }
                      >
                        <Icon name="trash" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === "matriculas" && (
            <div className="v-work-grid">
              <section className="v-panel">
                <div className="v-panel-head">
                  <div>
                    <h2>Nueva matrícula</h2>
                    <p>Selecciona la competición y después el equipo.</p>
                  </div>
                  <Icon name="link" />
                </div>
                <form className="v-form" onSubmit={handleMatricular}>
                  <Field
                    label={
                      <span className="v-step-title">
                        <span>1</span>Competición
                      </span>
                    }
                  >
                    <select
                      id="matricula-competition"
                      value={formMatricula.competicion_id}
                      onChange={(e) =>
                        setFormMatricula({
                          competicion_id: e.target.value,
                          equipo_id: "",
                        })
                      }
                      required
                    >
                      <option value="">Elige una competición</option>
                      {competiciones.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    label={
                      <span className="v-step-title">
                        <span>2</span>Equipo compatible
                      </span>
                    }
                  >
                    <select
                      disabled={!formMatricula.competicion_id}
                      value={formMatricula.equipo_id}
                      onChange={(e) =>
                        setFormMatricula({
                          ...formMatricula,
                          equipo_id: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Elige un equipo</option>
                      {equiposDisponiblesParaMatricula.map((eq) => (
                        <option key={eq.id} value={eq.id}>
                          {eq.nombre}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <p className="v-notice">
                    Solo aparecen equipos compatibles con el tipo, el país y la
                    confederación del torneo.
                  </p>
                  {formMatricula.competicion_id &&
                    !equiposDisponiblesParaMatricula.length && (
                      <p className="v-info-note">
                        No hay equipos disponibles. Puede que ya estén
                        matriculados o que necesites añadir un equipo compatible
                        al catálogo.
                      </p>
                    )}
                  <button
                    disabled={loading || !formMatricula.equipo_id}
                    className="v-btn v-btn-dark"
                  >
                    {loading ? "Guardando…" : "Confirmar matrícula"}
                    <Icon name="check" />
                  </button>
                </form>
              </section>
              <section className="v-panel">
                <div className="v-panel-head">
                  <div>
                    <h2>Registro de matrículas</h2>
                    <p>{enrollmentItems.length} equipos en esta vista.</p>
                  </div>
                </div>
                <div className="v-filter-bar">
                  <Field label="Buscar equipo">
                    <input
                      type="search"
                      value={enrollmentSearch}
                      onChange={(e) => setEnrollmentSearch(e.target.value)}
                      placeholder="Nombre del equipo…"
                    />
                  </Field>
                  <label className="v-checkbox">
                    <input
                      type="checkbox"
                      checked={onlyFree}
                      onChange={(e) => setOnlyFree(e.target.checked)}
                    />
                    Solo sin matrícula
                  </label>
                </div>
                <div className="v-registration-list">
                  {enrollmentItems.map((eq) => (
                    <article className="v-catalog-row" key={eq.id}>
                      <Crest name={eq.nombre} src={eq.logo} />
                      <div className="v-entity-name">
                        <strong>{eq.nombre}</strong>
                        <span>
                          {eq.tipo === "seleccion" ? "Selección" : "Club"} ·{" "}
                          {eq.pais}
                        </span>
                        <div className="v-entity-tags">
                          {eq.competiciones?.length ? (
                            eq.competiciones.map((c) => (
                              <span key={c.id}>{c.nombre}</span>
                            ))
                          ) : (
                            <span>Sin matrícula</span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                  {!enrollmentItems.length && (
                    <EmptyState title="Sin equipos en esta vista" icon="link">
                      Ajusta la búsqueda o añade equipos desde el catálogo.
                    </EmptyState>
                  )}
                </div>
              </section>
            </div>
          )}

          {activeTab === "arena" && (
            <section aria-label="Registro de partidos">
              <div className="v-match-filters">
                <div
                  className="v-segments"
                  role="group"
                  aria-label="Estado del partido"
                >
                  {[
                    ["", "Todos"],
                    ["programado", "Programados"],
                    ["en vivo", "En vivo"],
                    ["finalizado", "Finalizados"],
                    ...(summary.incomplete.length
                      ? [["incompletos", "Incompletos"]]
                      : []),
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      aria-pressed={matchFilter === value}
                      onClick={() => setMatchFilter(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <span className="v-updated" role="status">
                  {matchItems.length} partidos
                </span>
              </div>
              {matchItems.length ? (
                <div className="v-match-grid">
                  {matchItems.map((match) => (
                    <MatchRow
                      key={match.id}
                      match={match}
                      onDelete={() => handleEliminarPartido(match.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="v-panel">
                  <EmptyState
                    title="No hay partidos en esta vista"
                    icon="pitch"
                    action="Registrar partido"
                    onAction={() => openCreate("partidos")}
                  >
                    Registra un encuentro o selecciona otro estado para
                    consultar tus partidos.
                  </EmptyState>
                </div>
              )}
            </section>
          )}
          <footer className="v-footer">
            <span>VÉRTICE / ADMIN</span>
            <span>El fútbol se explora. Aquí se organiza.</span>
          </footer>
        </div>
      </main>
      {!formOpen && toast}

      {showConfForm && (
        <Modal
          title={editConfId ? "Editar confederación" : "Nueva confederación"}
          subtitle="Organiza las entidades de tu catálogo por confederación."
          onClose={closeForms}
        >
          <form
            className="v-form"
            id="confederation-form"
            onSubmit={handleSubmitConf}
          >
            <Field label="Nombre">
              <input
                value={formConf.nombre}
                onChange={(e) =>
                  setFormConf({ ...formConf, nombre: e.target.value })
                }
                placeholder="Ej. CONMEBOL"
                required
              />
            </Field>
            <Field label="URL del logo">
              <input
                type="url"
                value={formConf.logo}
                onChange={(e) =>
                  setFormConf({ ...formConf, logo: e.target.value })
                }
                placeholder="https://…"
                required
              />
            </Field>
            {formFooter}
          </form>
          {editConfId && (
            <details className="v-associate">
              <summary>Vincular entidades sin confederación</summary>
              <p>
                Revisa cada entidad antes de vincularla. Una competición global
                puede permanecer sin confederación.
              </p>
              <Field label="Filtrar por país">
                <input
                  value={filtroPais}
                  onChange={(e) => setFiltroPais(e.target.value)}
                />
              </Field>
              <div className="v-associate-list">
                {[
                  ...compsHuerfanasFiltradas.map((item) => ({
                    ...item,
                    category: "competiciones",
                  })),
                  ...eqsHuerfanosFiltrados.map((item) => ({
                    ...item,
                    category: "equipos",
                  })),
                ].map((item) => (
                  <div key={`${item.category}-${item.id}`}>
                    <span>
                      {item.nombre} · {item.pais}
                    </span>
                    <button
                      className="v-text-btn"
                      onClick={() => asociarHuerfano(item.category, item.id)}
                    >
                      Vincular
                      <Icon name="link" />
                    </button>
                  </div>
                ))}
              </div>
            </details>
          )}
          {toast}
        </Modal>
      )}
      {showCompForm && (
        <Modal
          title={editCompId ? "Editar competición" : "Nueva competición"}
          subtitle="Define el torneo y qué tipo de equipos puede recibir."
          onClose={closeForms}
        >
          <form
            className="v-form"
            id="competition-form"
            onSubmit={handleSubmitComp}
          >
            <Field label="Nombre">
              <input
                value={formComp.nombre}
                onChange={(e) =>
                  setFormComp({ ...formComp, nombre: e.target.value })
                }
                placeholder="Ej. Liga BetPlay Dimayor"
                required
              />
            </Field>
            <div className="v-form-grid">
              <Field label="Tipo de competición">
                <select
                  value={formComp.tipo}
                  onChange={(e) =>
                    setFormComp({ ...formComp, tipo: e.target.value })
                  }
                >
                  {Object.entries(COMPETITION_TYPES).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="País / ámbito">
                <input
                  value={
                    ["liga_nacional", "copa_nacional"].includes(formComp.tipo)
                      ? formComp.pais
                      : "Internacional"
                  }
                  disabled={
                    !["liga_nacional", "copa_nacional"].includes(formComp.tipo)
                  }
                  onChange={(e) =>
                    setFormComp({ ...formComp, pais: e.target.value })
                  }
                  required
                />
              </Field>
            </div>
            <Field
              label="Confederación"
              hint="Las competiciones globales pueden quedar sin confederación."
            >
              <select
                value={formComp.confederacion_id}
                onChange={(e) =>
                  setFormComp({ ...formComp, confederacion_id: e.target.value })
                }
              >
                {confOptions}
              </select>
            </Field>
            <Field label="URL del logo">
              <input
                type="url"
                value={formComp.logo}
                onChange={(e) =>
                  setFormComp({ ...formComp, logo: e.target.value })
                }
                placeholder="https://…"
                required
              />
            </Field>
            {formFooter}
          </form>
          {toast}
        </Modal>
      )}
      {showTeamForm && (
        <Modal
          title={editEqId ? "Editar equipo" : "Nuevo equipo"}
          subtitle="Añade sus datos básicos. Podrás matricularlo en una competición después."
          onClose={closeForms}
        >
          <form className="v-form" id="team-form" onSubmit={handleSubmitEquipo}>
            <Field label="Nombre">
              <input
                value={formEquipo.nombre}
                onChange={(e) =>
                  setFormEquipo({ ...formEquipo, nombre: e.target.value })
                }
                placeholder="Ej. Deportes Tolima"
                required
              />
            </Field>
            <div className="v-form-grid">
              <Field label="Tipo de equipo">
                <select
                  value={formEquipo.tipo}
                  onChange={(e) =>
                    setFormEquipo({ ...formEquipo, tipo: e.target.value })
                  }
                >
                  <option value="club">Club</option>
                  <option value="seleccion">Selección</option>
                </select>
              </Field>
              <Field
                label="País"
                hint={
                  formEquipo.tipo === "seleccion"
                    ? "El país toma el nombre de la selección."
                    : undefined
                }
              >
                <input
                  value={
                    formEquipo.tipo === "seleccion"
                      ? formEquipo.nombre
                      : formEquipo.pais
                  }
                  disabled={formEquipo.tipo === "seleccion"}
                  onChange={(e) =>
                    setFormEquipo({ ...formEquipo, pais: e.target.value })
                  }
                  required
                />
              </Field>
            </div>
            <Field label="Confederación">
              <select
                value={formEquipo.confederacion_id}
                onChange={(e) =>
                  setFormEquipo({
                    ...formEquipo,
                    confederacion_id: e.target.value,
                  })
                }
              >
                {confOptions}
              </select>
            </Field>
            <Field label="URL del escudo">
              <input
                type="url"
                value={formEquipo.logo}
                onChange={(e) =>
                  setFormEquipo({ ...formEquipo, logo: e.target.value })
                }
                placeholder="https://…"
                required
              />
            </Field>
            {formFooter}
          </form>
          {toast}
        </Modal>
      )}
      {showMatchForm && (
        <Modal
          title="Registrar partido"
          subtitle="Primero elige la competición. Solo podrás seleccionar equipos matriculados."
          onClose={closeForms}
        >
          <form
            className="v-form"
            id="match-form"
            onSubmit={handleSubmitPartido}
          >
            <Field label="Competición">
              <select
                value={formPartido.competicion_id}
                onChange={(e) =>
                  setFormPartido({
                    ...formPartido,
                    competicion_id: e.target.value,
                    equipo_local_id: "",
                    equipo_visitante_id: "",
                  })
                }
                required
              >
                <option value="">Selecciona una competición</option>
                {competiciones.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </Field>
            <div className="v-form-grid">
              <Field label="Equipo local">
                <select
                  value={formPartido.equipo_local_id}
                  disabled={!formPartido.competicion_id}
                  onChange={(e) =>
                    setFormPartido({
                      ...formPartido,
                      equipo_local_id: e.target.value,
                      equipo_visitante_id:
                        e.target.value === formPartido.equipo_visitante_id
                          ? ""
                          : formPartido.equipo_visitante_id,
                    })
                  }
                  required
                >
                  <option value="">Selecciona el local</option>
                  {equiposDisponiblesParaPartido
                    .filter(
                      (eq) => String(eq.id) !== formPartido.equipo_visitante_id,
                    )
                    .map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.nombre}
                      </option>
                    ))}
                </select>
              </Field>
              <Field label="Equipo visitante">
                <select
                  value={formPartido.equipo_visitante_id}
                  disabled={!formPartido.competicion_id}
                  onChange={(e) =>
                    setFormPartido({
                      ...formPartido,
                      equipo_visitante_id: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Selecciona el visitante</option>
                  {equiposDisponiblesParaPartido
                    .filter(
                      (eq) => String(eq.id) !== formPartido.equipo_local_id,
                    )
                    .map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.nombre}
                      </option>
                    ))}
                </select>
              </Field>
            </div>
            {formPartido.competicion_id &&
              equiposDisponiblesParaPartido.length < 2 && (
                <p className="v-notice">
                  Necesitas al menos dos equipos matriculados en esta
                  competición para registrar un partido.
                </p>
              )}
            <Field label="Estado">
              <select
                value={formPartido.estado}
                onChange={(e) =>
                  setFormPartido({ ...formPartido, estado: e.target.value })
                }
              >
                <option value="programado">Programado</option>
                <option value="en vivo">En vivo</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </Field>
            <div className="v-form-grid">
              <Field label="Goles local">
                <input
                  type="number"
                  min="0"
                  value={formPartido.marcador_local}
                  onChange={(e) =>
                    setFormPartido({
                      ...formPartido,
                      marcador_local: e.target.value,
                    })
                  }
                  required
                />
              </Field>
              <Field label="Goles visitante">
                <input
                  type="number"
                  min="0"
                  value={formPartido.marcador_visitante}
                  onChange={(e) =>
                    setFormPartido({
                      ...formPartido,
                      marcador_visitante: e.target.value,
                    })
                  }
                  required
                />
              </Field>
            </div>
            {formFooter}
          </form>
          {toast}
        </Modal>
      )}
    </div>
  );
}
