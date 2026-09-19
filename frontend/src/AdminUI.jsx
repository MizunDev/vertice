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
        VÉRTICE<small>ADMIN WORKSPACE</small>
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

export function Modal({ title, subtitle, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
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
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="v-dialog-head">
        <div>
          <span className="v-eyebrow">GESTIÓN DEL CATÁLOGO</span>
          <h2 id="editor-title">{title}</h2>
          <p>{subtitle}</p>
        </div>
        <button
          type="button"
          className="v-icon-btn"
          onClick={onClose}
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

// Illustrations belong to the interface: decorative, local and independent of match data.
export function SectionArt({ variant = "inicio" }) {
  const field = variant === "inicio" || variant === "arena";
  return (
    <svg
      className="v-section-art"
      viewBox="0 0 560 330"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`floor-${variant}`}
          x1="160"
          y1="90"
          x2="400"
          y2="310"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#344c62" />
          <stop offset="1" stopColor="#162639" />
        </linearGradient>
        <linearGradient
          id={`grass-${variant}`}
          x1="150"
          y1="80"
          x2="390"
          y2="230"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9abe6b" />
          <stop offset="1" stopColor="#396b56" />
        </linearGradient>
        <linearGradient id={`card-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f1f9e1" />
          <stop offset="1" stopColor="#b6d28a" />
        </linearGradient>
        <filter
          id={`shadow-${variant}`}
          x="-50%"
          y="-50%"
          width="200%"
          height="240%"
        >
          <feDropShadow
            dx="0"
            dy="22"
            stdDeviation="16"
            floodColor="#06101b"
            floodOpacity=".45"
          />
        </filter>
      </defs>
      <ellipse
        cx="300"
        cy="280"
        rx="188"
        ry="28"
        fill="#070e19"
        opacity=".22"
      />
      <path
        d="m52 244 236-139 227 128M105 279l224-131"
        stroke="#93b2c4"
        strokeOpacity=".12"
      />
      <circle cx="475" cy="77" r="35" stroke="#b3c6cf" strokeOpacity=".1" />
      <circle cx="475" cy="77" r="51" stroke="#b3c6cf" strokeOpacity=".06" />
      {field ? (
        <g filter={`url(#shadow-${variant})`}>
          <path
            d="m102 157 175-100 222 128v22L324 309 102 180Z"
            fill="#102130"
          />
          <path
            d="m102 157 175-100 222 128-175 101Z"
            fill={`url(#floor-${variant})`}
          />
          <path
            d="m128 151 149-85 195 113-149 86Z"
            stroke="#657d87"
            strokeWidth="9"
          />
          <path
            d="m143 151 134-77 180 104-134 77Z"
            fill={`url(#grass-${variant})`}
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`m${143 + i * 36} ${151 + i * 21} 134-77 18 10-134 77Z`}
              fill="#d5ebba"
              opacity=".08"
            />
          ))}
          <path
            d="m154 151 123-70 169 97-123 71ZM238 200l123-71M168 143l32 19 29-17-32-19M432 186l-32-19-29 17 32 19"
            stroke="#edf6db"
            strokeWidth="1.5"
            strokeOpacity=".75"
          />
          <ellipse
            cx="300"
            cy="165"
            rx="27"
            ry="15"
            transform="rotate(30 300 165)"
            stroke="#edf6db"
            strokeWidth="1.5"
          />
          <path
            d="m154 138-8-5v-16l21 12v17m250 47 8 5v-16l-21-12v17"
            stroke="#d8e9dc"
            strokeWidth="2"
          />
          <path
            d="M121 145V65m0 0 33 19v8l-33-19m324 95V88m0 0-33-19v8l33 19"
            stroke="#849aaa"
            strokeWidth="3"
          />
          <path
            d="m124 68 27 16m-27-11 27 16m291 2-27-16m27 11-27-16"
            stroke="#e2efc7"
            strokeWidth="3"
          />
          <circle cx="278" cy="171" r="4" fill="#e7f6bc" />
          <circle cx="332" cy="182" r="4" fill="#142637" />
          <circle cx="310" cy="144" r="4" fill="#e7f6bc" />
        </g>
      ) : (
        <g filter={`url(#shadow-${variant})`}>
          <path
            d="m104 216 170-98 225 130-171 98Z"
            fill={`url(#floor-${variant})`}
          />
          <path
            d="m160 221 90-52 137 79-91 52Z"
            stroke="#8fa891"
            strokeDasharray="5 5"
          />
          <g transform="translate(204 53) rotate(13)">
            <rect x="5" y="8" width="148" height="175" rx="17" fill="#182b3b" />
            <rect
              width="148"
              height="175"
              rx="17"
              fill={`url(#card-${variant})`}
            />
            {variant === "matriculas" ? (
              <g>
                <circle cx="74" cy="55" r="24" fill="#324e43" />
                <path
                  d="m62 55 8 8 17-18"
                  stroke="#d8efa5"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M31 104h86M31 117h63"
                  stroke="#536f55"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <rect
                  x="30"
                  y="139"
                  width="88"
                  height="14"
                  rx="7"
                  fill="#769064"
                />
              </g>
            ) : (
              <g>
                <path
                  d="M53 27h42v23a21 21 0 0 1-42 0Zm0 6H39v13c0 12 10 18 18 18m38-31h14v13c0 12-10 18-18 18M74 72v24M55 102h38"
                  stroke="#38563f"
                  strokeWidth="5"
                  strokeLinejoin="round"
                />
                <path
                  d="M31 129h86M44 144h60"
                  stroke="#66855a"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </g>
            )}
          </g>
          <g transform="translate(102 132) rotate(-13)">
            <rect width="94" height="115" rx="12" fill="#789caf" />
            <path
              d="m47 20-24 8v24c0 16 24 30 24 30s24-14 24-30V28Z"
              stroke="#d6e5ea"
              strokeWidth="3"
            />
            <path d="m34 48 9 9 18-20" stroke="#e1f2d5" strokeWidth="3" />
          </g>
          <g transform="translate(399 169) rotate(13)">
            <rect width="87" height="101" rx="11" fill="#f1eee3" />
            <circle cx="43" cy="38" r="16" fill="#cbd2be" />
            <path
              d="M21 73h46M31 84h26"
              stroke="#7b927c"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
        </g>
      )}
      <g transform="translate(371 41)">
        <rect width="118" height="36" rx="18" fill="#d5ef9a" />
        <circle cx="20" cy="18" r="4" fill="#304535" />
        <path
          d="M34 15h60M34 22h40"
          stroke="#6d8255"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      <circle cx="93" cy="94" r="5" fill="#c8e998" opacity=".65" />
      <path d="M464 285h14m-7-7v14" stroke="#b9d1dc" strokeOpacity=".5" />
    </svg>
  );
}
