import { cloneElement, useEffect, useId, useRef, useState } from "react";

const paths = {
  home: "M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  shield: "M12 3 3 6v6c0 5 9 9 9 9s9-4 9-9V6ZM8 12l3 3 5-6",
  trophy:
    "M7 3h10v5a5 5 0 0 1-10 0ZM7 5H3v3a4 4 0 0 0 5 4M17 5h4v3a4 4 0 0 1-5 4M12 13v5M7 21h10M9 18h6v3",
  link: "m10 13 4-4M8 16l-2 2a3 3 0 0 1-4-4l5-5a3 3 0 0 1 4 0m2 6a3 3 0 0 0 4 0l5-5a3 3 0 0 0-4-4l-2 2",
  pitch: "M3 4h18v16H3ZM12 4v16M3 9h3v6H3M21 9h-3v6h3",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  plus: "M12 5v14M5 12h14",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  refresh: "M20 8a8 8 0 0 0-14-3L3 8m0-5v5h5M4 16a8 8 0 0 0 14 3l3-3m0 5v-5h-5",
  logout: "M9 4H4v16h5M9 12h12m-4-4 4 4-4 4",
  close: "m6 6 12 12M6 18 18 6",
  edit: "m15 4 5 5M4 16 16 4a2 2 0 0 1 4 4L8 20l-5 1Z",
  trash: "M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7",
  check: "m5 12 4 4L19 6",
  clock: "M12 7v5l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
  globe:
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18",
  alert: "m12 3 10 18H2ZM12 9v5M12 17v1",
};

export function Icon({ name, ...props }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.grid} />
    </svg>
  );
}

export function Brand() {
  return (
    <div className="v-brand">
      <span className="v-brand-mark" aria-hidden="true">
        V<span />
      </span>
      <span>
        VÉRTICE<small>FOOTBALL OPERATIONS</small>
      </span>
    </div>
  );
}

export function Crest({ src, name = "", small = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return (
    <span className={`v-crest ${small ? "v-crest-small" : ""}`}>
      {src && !failed ? (
        <img src={src} alt="" onError={() => setFailed(true)} />
      ) : (
        <span aria-hidden="true">{name.slice(0, 2).toUpperCase() || "V"}</span>
      )}
    </span>
  );
}

export function EmptyState({
  title,
  children,
  action,
  onAction,
  icon = "grid",
}) {
  return (
    <div className="v-empty">
      <span className="v-empty-icon">
        <Icon name={icon} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
      {action && (
        <button className="v-btn v-btn-secondary" onClick={onAction}>
          {action}
          <Icon name="arrow" />
        </button>
      )}
    </div>
  );
}

export function Modal({
  title,
  subtitle,
  onClose,
  children,
  busy = false,
  eyebrow = "VÉRTICE / MESA DE EDICIÓN",
}) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    dialog.querySelector("[data-autofocus]")?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previous;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="v-dialog"
      aria-labelledby="editor-title"
      aria-busy={busy || undefined}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onClose();
      }}
    >
      <div className="v-dialog-head">
        <div>
          <span className="v-eyebrow">{eyebrow}</span>
          <h2 id="editor-title">{title}</h2>
          <p>{subtitle}</p>
        </div>
        <button
          type="button"
          className="v-icon-btn"
          onClick={onClose}
          disabled={busy}
          aria-label="Cerrar formulario"
        >
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export function Field({ label, children, hint }) {
  const generatedId = useId();
  const id = children.props.id || generatedId;
  return (
    <label className="v-field" htmlFor={id}>
      <span id={`${id}-label`}>{label}</span>
      {cloneElement(children, {
        id,
        "aria-labelledby": `${id}-label`,
        "aria-describedby": hint ? `${id}-hint` : undefined,
      })}
      {hint && <small id={`${id}-hint`}>{hint}</small>}
    </label>
  );
}

export function Status({ value }) {
  const label =
    {
      programado: "Programado",
      "en vivo": "En vivo",
      finalizado: "Finalizado",
    }[value] || value;
  return (
    <span className={`v-status v-status-${value?.replace(" ", "-")}`}>
      <i />
      {label}
    </span>
  );
}

export function MatchRow({ match, onDelete }) {
  return (
    <article className="v-match-row">
      <div className="v-match-meta">
        <span>{match.competicion?.nombre || "Sin competición"}</span>
        <Status value={match.estado} />
      </div>
      <div className="v-match-teams">
        <span>
          <Crest
            small
            src={match.equipo_local?.logo}
            name={match.equipo_local?.nombre}
          />
          {match.equipo_local?.nombre || "Equipo sin asignar"}
        </span>
        <strong>
          {match.estado === "programado"
            ? "vs"
            : `${match.marcador_local} : ${match.marcador_visitante}`}
        </strong>
        <span>
          {match.equipo_visitante?.nombre || "Equipo sin asignar"}
          <Crest
            small
            src={match.equipo_visitante?.logo}
            name={match.equipo_visitante?.nombre}
          />
        </span>
      </div>
      {onDelete && (
        <div className="v-match-footer">
          <span>Registro #{match.id}</span>
          <button
            className="v-text-btn v-danger"
            onClick={onDelete}
            aria-label={`Eliminar partido ${match.id}`}
          >
            <Icon name="trash" />
            Eliminar
          </button>
        </div>
      )}
    </article>
  );
}

// Bespoke local artwork is decorative: all information and controls remain HTML.
const artwork = {
  inicio: ["stadium", "01", "ESTADIO / VISTA GENERAL"],
  ecosistema: ["catalog", "02", "IDENTIDAD / ECOSISTEMA"],
  matriculas: ["registration", "03", "ACCESO / PARTICIPACIÓN"],
  arena: ["matchday", "04", "CANCHA / ENCUENTROS"],
};

export function SectionArt({ variant = "inicio" }) {
  const [asset, number, caption] = artwork[variant] || artwork.inicio;
  return (
    <figure className={`v-section-art v-art-${variant}`} aria-hidden="true">
      <span className="v-art-index">V / {number}</span>
      <img
        key={asset}
        src={`/art/${asset}.webp`}
        width="1536"
        height="1024"
        alt=""
        decoding="async"
      />
      <span className="v-art-cross v-art-cross-top" />
      <span className="v-art-cross v-art-cross-bottom" />
      <figcaption>
        <span>{caption}</span>
        <span>VÉRTICE — OBJETOS DEL JUEGO</span>
      </figcaption>
    </figure>
  );
}
