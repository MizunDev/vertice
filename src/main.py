import os
import datetime
import hmac
from enum import Enum
from fastapi import FastAPI, Depends, HTTPException, status, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlmodel import SQLModel, Field, Session, select, Relationship
from contextlib import asynccontextmanager
import jwt
from src.database import crear_tablas_db, engine
from src.security import get_auth_settings, verify_password


ALGORITHM = "HS256"


# ==========================================
# 1. ENUMS
# ==========================================
class EstadoPartido(str, Enum):
    VIVO = "en vivo"
    FINALIZADO = "finalizado"
    PROGRAMADO = "programado"


class TipoCompeticion(str, Enum):
    LIGA_NACIONAL = "liga_nacional"
    COPA_NACIONAL = "copa_nacional"
    INTERNACIONAL_CLUBES = "internacional_clubes"
    INTERNACIONAL_SELECCIONES = "internacional_selecciones"


class TipoEquipo(str, Enum):
    CLUB = "club"
    SELECCION = "seleccion"


# ==========================================
# 2. MODELOS JERÁRQUICOS Y RELACIONALES
# ==========================================

class Participacion(SQLModel, table=True):
    equipo_id: int | None = Field(default=None, foreign_key="equipo.id", primary_key=True)
    competicion_id: int | None = Field(default=None, foreign_key="competicion.id", primary_key=True)


class ConfederacionBase(SQLModel):
    nombre: str = Field(index=True, unique=True)
    logo: str


class Confederacion(ConfederacionBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    competiciones: list["Competicion"] = Relationship(back_populates="confederacion")
    equipos: list["Equipo"] = Relationship(back_populates="confederacion")


class ConfederacionRead(ConfederacionBase):
    id: int


class CompeticionBase(SQLModel):
    nombre: str
    logo: str
    tipo: TipoCompeticion
    pais: str = Field(default="Internacional")
    confederacion_id: int | None = Field(default=None, foreign_key="confederacion.id")


class Competicion(CompeticionBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    confederacion: Confederacion | None = Relationship(back_populates="competiciones")
    equipos: list["Equipo"] = Relationship(back_populates="competiciones", link_model=Participacion)
    partidos: list["Partido"] = Relationship(back_populates="competicion_rel")


class CompeticionRead(CompeticionBase):
    id: int


class EquipoBase(SQLModel):
    nombre: str
    logo: str
    tipo: TipoEquipo
    pais: str = Field(default="Internacional")
    confederacion_id: int | None = Field(default=None, foreign_key="confederacion.id")


class Equipo(EquipoBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    confederacion: Confederacion | None = Relationship(back_populates="equipos")
    competiciones: list[Competicion] = Relationship(back_populates="equipos", link_model=Participacion)

    partidos_local: list["Partido"] = Relationship(
        back_populates="equipo_local_rel",
        sa_relationship_kwargs={"foreign_keys": "Partido.equipo_local_id"}
    )
    partidos_visitante: list["Partido"] = Relationship(
        back_populates="equipo_visitante_rel",
        sa_relationship_kwargs={"foreign_keys": "Partido.equipo_visitante_id"}
    )


class EquipoRead(EquipoBase):
    id: int


class EquipoConCompeticionesRead(EquipoRead):
    competiciones: list[CompeticionRead] = []


class EstadisticasBase(SQLModel):
    partido_id: int = Field(foreign_key="partido.id", gt=0)
    posesion_local: int = Field(ge=0, le=100)
    posesion_visitante: int = Field(ge=0, le=100)
    tiros_puerta_local: int = Field(ge=0)
    tiros_puerta_visitante: int = Field(ge=0)


class EstadisticasCreate(EstadisticasBase):
    pass


class EstadisticasPartido(EstadisticasBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    partido: "Partido" = Relationship(back_populates="estadisticas")


class PartidoBase(SQLModel):
    competicion_id: int | None = Field(default=None, foreign_key="competicion.id")
    equipo_local_id: int | None = Field(default=None, foreign_key="equipo.id")
    equipo_visitante_id: int | None = Field(default=None, foreign_key="equipo.id")
    marcador_local: int = Field(default=0, ge=0)
    marcador_visitante: int = Field(default=0, ge=0)
    estado: EstadoPartido


class Partido(PartidoBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

    competicion_rel: Competicion | None = Relationship(back_populates="partidos")
    equipo_local_rel: Equipo | None = Relationship(
        back_populates="partidos_local",
        sa_relationship_kwargs={"foreign_keys": "[Partido.equipo_local_id]"}
    )
    equipo_visitante_rel: Equipo | None = Relationship(
        back_populates="partidos_visitante",
        sa_relationship_kwargs={"foreign_keys": "[Partido.equipo_visitante_id]"}
    )
    estadisticas: list[EstadisticasPartido] = Relationship(back_populates="partido", cascade_delete=True)


class PartidoCreate(PartidoBase):
    competicion_id: int = Field(gt=0)
    equipo_local_id: int = Field(gt=0)
    equipo_visitante_id: int = Field(gt=0)


class PartidoReadDetail(SQLModel):
    id: int
    competicion_id: int | None
    equipo_local_id: int | None
    equipo_visitante_id: int | None
    marcador_local: int
    marcador_visitante: int
    estado: EstadoPartido
    competicion: CompeticionRead | None = None
    equipo_local: EquipoRead | None = None
    equipo_visitante: EquipoRead | None = None


class PartidoConEstadisticasRead(PartidoReadDetail):
    estadisticas: list[EstadisticasPartido] = []


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=64)
    password: str = Field(min_length=1, max_length=1024)


# ==========================================
# 4. CONFIGURACIÓN Y MIDDLEWARE (IMPORT LOCAL DE SEED)
# ==========================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    get_auth_settings()  # Fallar al arrancar si no se han configurado secretos.
    crear_tablas_db()
    # Importación local corregida apuntando a src.seed
    from src.seed import ejecutar_seed
    with Session(engine) as session:
        ejecutar_seed(session)
    yield


app = FastAPI(title="VÉRTICE API", lifespan=lifespan, root_path=os.getenv("ROOT_PATH", ""))

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv(
        "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer(auto_error=False)


def verificar_token(request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = request.cookies.get("vertice_token")
    if not token and credentials:
        token = credentials.credentials

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No autenticado. Falta la cookie o el token de sesión.",
        )
    try:
        settings = get_auth_settings()
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[ALGORITHM],
            options={"require": ["sub", "exp"]},
        )
        if payload["sub"] != settings.admin_username:
            raise jwt.InvalidTokenError("Usuario no autorizado")
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado. Por favor, inicia sesión de nuevo.",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido.",
        )


def get_session():
    with Session(engine) as session:
        yield session


# ==========================================
# 5. ENDPOINTS DE AUTENTICACIÓN
# ==========================================
@app.post("/login")
def login(credentials: LoginRequest, response: Response):
    settings = get_auth_settings()
    password_ok = verify_password(credentials.password, settings.admin_password_hash)
    username_ok = hmac.compare_digest(
        credentials.username.encode("utf-8"), settings.admin_username.encode("utf-8")
    )
    if username_ok and password_ok:
        expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
        payload = {"sub": credentials.username, "exp": expire}
        token = jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)
        response.set_cookie(
            key="vertice_token", value=token, httponly=True,
            secure=settings.cookie_secure, samesite="lax", max_age=86400, path="/",
        )
        return {"ok": True, "mensaje": "Sesión iniciada correctamente"}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales incorrectas")


@app.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="vertice_token", path="/", httponly=True,
        secure=get_auth_settings().cookie_secure, samesite="lax",
    )
    return {"ok": True, "mensaje": "Sesión cerrada"}


# ==========================================
# 6. ENDPOINTS CONFEDERACIONES
# ==========================================
@app.post("/confederaciones/", response_model=ConfederacionRead)
def crear_confederacion(conf_in: ConfederacionBase, session: Session = Depends(get_session),
                        usuario: str = Depends(verificar_token)):
    conf_db = Confederacion.model_validate(conf_in)
    session.add(conf_db)
    session.commit()
    session.refresh(conf_db)
    return conf_db


@app.get("/confederaciones/", response_model=list[ConfederacionRead])
def leer_confederaciones(session: Session = Depends(get_session), usuario: str = Depends(verificar_token)):
    return session.exec(select(Confederacion)).all()


@app.put("/confederaciones/{id}", response_model=ConfederacionRead)
def editar_confederacion(id: int, conf_in: ConfederacionBase, session: Session = Depends(get_session),
                         usuario: str = Depends(verificar_token)):
    conf = session.get(Confederacion, id)
    if not conf:
        raise HTTPException(status_code=404, detail="Confederación no encontrada")
    for key, value in conf_in.model_dump().items():
        setattr(conf, key, value)
    session.add(conf)
    session.commit()
    session.refresh(conf)
    return conf


@app.delete("/confederaciones/{id}")
def eliminar_confederacion(id: int, session: Session = Depends(get_session), usuario: str = Depends(verificar_token)):
    conf = session.get(Confederacion, id)
    if not conf:
        raise HTTPException(status_code=404, detail="Confederación no encontrada")

    for c in conf.competiciones:
        c.confederacion_id = None
    for e in conf.equipos:
        e.confederacion_id = None

    session.delete(conf)
    session.commit()
    return {"ok": True, "mensaje": "Confederación eliminada. Datos asociados intactos y huérfanos."}


# ==========================================
# 7. ENDPOINTS COMPETICIONES (BLINDADAS)
# ==========================================
@app.post("/competiciones/", response_model=CompeticionRead)
def crear_competicion(comp_in: CompeticionBase, session: Session = Depends(get_session),
                      usuario: str = Depends(verificar_token)):
    if comp_in.tipo in [TipoCompeticion.LIGA_NACIONAL, TipoCompeticion.COPA_NACIONAL]:
        if not comp_in.pais or comp_in.pais.lower() == "internacional":
            raise HTTPException(status_code=400, detail="Ligas Nacionales deben tener un país específico.")
    else:
        comp_in.pais = "Internacional"

    comp_db = Competicion.model_validate(comp_in)
    session.add(comp_db)
    session.commit()
    session.refresh(comp_db)
    return comp_db


@app.get("/competiciones/", response_model=list[CompeticionRead])
def leer_competiciones(session: Session = Depends(get_session), usuario: str = Depends(verificar_token)):
    return session.exec(select(Competicion)).all()


@app.put("/competiciones/{id}", response_model=CompeticionRead)
def editar_competicion(id: int, comp_in: CompeticionBase, session: Session = Depends(get_session),
                       usuario: str = Depends(verificar_token)):
    comp = session.get(Competicion, id)
    if not comp:
        raise HTTPException(status_code=404, detail="Competición no encontrada")

    if comp_in.tipo in [TipoCompeticion.LIGA_NACIONAL, TipoCompeticion.COPA_NACIONAL]:
        if not comp_in.pais or comp_in.pais.lower() == "internacional":
            raise HTTPException(status_code=400, detail="Ligas Nacionales deben tener un país específico.")
    else:
        comp_in.pais = "Internacional"

    for equipo in comp.equipos:
        validar_compatibilidad(equipo, comp_in)

    for key, value in comp_in.model_dump().items():
        setattr(comp, key, value)
    session.add(comp)
    session.commit()
    session.refresh(comp)
    return comp


@app.delete("/competiciones/{id}")
def eliminar_competicion(id: int, session: Session = Depends(get_session), usuario: str = Depends(verificar_token)):
    comp = session.get(Competicion, id)
    if not comp:
        raise HTTPException(status_code=404, detail="Competición no encontrada")

    for p in comp.partidos:
        p.competicion_id = None

    session.delete(comp)
    session.commit()
    return {"ok": True, "mensaje": "Competición eliminada."}


# ==========================================
# 8. ENDPOINTS EQUIPOS (BLINDADOS)
# ==========================================
@app.post("/equipos/", response_model=EquipoRead)
def crear_equipo(equipo_in: EquipoBase, session: Session = Depends(get_session),
                 usuario: str = Depends(verificar_token)):
    if equipo_in.tipo == TipoEquipo.SELECCION:
        equipo_in.pais = equipo_in.nombre

    equipo_db = Equipo.model_validate(equipo_in)
    session.add(equipo_db)
    session.commit()
    session.refresh(equipo_db)
    return equipo_db


@app.get("/equipos/", response_model=list[EquipoConCompeticionesRead])
def leer_equipos(session: Session = Depends(get_session), usuario: str = Depends(verificar_token)):
    return session.exec(select(Equipo)).all()


@app.put("/equipos/{id}", response_model=EquipoRead)
def editar_equipo(id: int, eq_in: EquipoBase, session: Session = Depends(get_session),
                  usuario: str = Depends(verificar_token)):
    eq = session.get(Equipo, id)
    if not eq:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")

    if eq_in.tipo == TipoEquipo.SELECCION:
        eq_in.pais = eq_in.nombre

    for competicion in eq.competiciones:
        validar_compatibilidad(eq_in, competicion)

    for key, value in eq_in.model_dump().items():
        setattr(eq, key, value)
    session.add(eq)
    session.commit()
    session.refresh(eq)
    return eq


@app.delete("/equipos/{id}")
def eliminar_equipo(id: int, session: Session = Depends(get_session), usuario: str = Depends(verificar_token)):
    eq = session.get(Equipo, id)
    if not eq:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")

    for p in eq.partidos_local:
        p.equipo_local_id = None
    for p in eq.partidos_visitante:
        p.equipo_visitante_id = None

    session.delete(eq)
    session.commit()
    return {"ok": True, "mensaje": "Equipo eliminado."}


# Una única regla para matrículas, partidos y cambios de equipos/competiciones.
def validar_compatibilidad(equipo: EquipoBase, competicion: CompeticionBase):
    if competicion.tipo == TipoCompeticion.INTERNACIONAL_SELECCIONES and equipo.tipo != TipoEquipo.SELECCION:
        raise HTTPException(status_code=400, detail="A torneos de selecciones solo pueden entrar selecciones.")
    if competicion.tipo != TipoCompeticion.INTERNACIONAL_SELECCIONES and equipo.tipo == TipoEquipo.SELECCION:
        raise HTTPException(status_code=400, detail="Una selección no puede disputar torneos de clubes.")

    if competicion.tipo in [TipoCompeticion.LIGA_NACIONAL, TipoCompeticion.COPA_NACIONAL]:
        if equipo.pais != competicion.pais:
            raise HTTPException(status_code=400,
                                detail=f"Un equipo de {equipo.pais} no puede jugar en la liga de {competicion.pais}.")

    if competicion.confederacion_id and competicion.confederacion_id != equipo.confederacion_id:
        raise HTTPException(status_code=400, detail="El equipo no pertenece a la misma confederación del torneo.")


@app.post("/equipos/{equipo_id}/matricular/{competicion_id}")
def matricular_equipo(equipo_id: int, competicion_id: int, session: Session = Depends(get_session),
                      usuario: str = Depends(verificar_token)):
    equipo = session.get(Equipo, equipo_id)
    competicion = session.get(Competicion, competicion_id)
    if not equipo or not competicion:
        raise HTTPException(status_code=404, detail="Equipo o Competición no encontrados")
    validar_compatibilidad(equipo, competicion)

    if competicion in equipo.competiciones:
        return {"ok": False, "mensaje": f"El equipo {equipo.nombre} ya participa en {competicion.nombre}"}

    equipo.competiciones.append(competicion)
    session.add(equipo)
    session.commit()
    return {"ok": True, "mensaje": f"{equipo.nombre} matriculado exitosamente en {competicion.nombre}"}


# ==========================================
# 9. ENDPOINTS PARTIDOS REFACTORIZADOS
# ==========================================
@app.post("/partidos/", response_model=PartidoReadDetail)
def crear_partido(partido_in: PartidoCreate, session: Session = Depends(get_session),
                  usuario: str = Depends(verificar_token)):
    comp = session.get(Competicion, partido_in.competicion_id)
    local = session.get(Equipo, partido_in.equipo_local_id)
    visita = session.get(Equipo, partido_in.equipo_visitante_id)

    if not comp or not local or not visita:
        raise HTTPException(status_code=404, detail="Faltan datos de Competición o Equipos")

    if local.id == visita.id:
        raise HTTPException(status_code=400, detail="Un equipo no puede jugar contra sí mismo")

    for equipo in (local, visita):
        validar_compatibilidad(equipo, comp)
        if comp not in equipo.competiciones:
            raise HTTPException(
                status_code=400,
                detail=f"{equipo.nombre} no está matriculado en {comp.nombre}.",
            )

    partido_db = Partido.model_validate(partido_in)
    session.add(partido_db)
    session.commit()
    session.refresh(partido_db)

    return PartidoReadDetail(
        id=partido_db.id,
        competicion_id=partido_db.competicion_id,
        equipo_local_id=partido_db.equipo_local_id,
        equipo_visitante_id=partido_db.equipo_visitante_id,
        marcador_local=partido_db.marcador_local,
        marcador_visitante=partido_db.marcador_visitante,
        estado=partido_db.estado,
        competicion=comp,
        equipo_local=local,
        equipo_visitante=visita
    )


@app.get("/partidos/", response_model=list[PartidoReadDetail])
def leer_partidos(session: Session = Depends(get_session), usuario: str = Depends(verificar_token)):
    partidos = session.exec(select(Partido)).all()
    resultado = []
    for p in partidos:
        resultado.append(PartidoReadDetail(
            id=p.id,
            competicion_id=p.competicion_id,
            equipo_local_id=p.equipo_local_id,
            equipo_visitante_id=p.equipo_visitante_id,
            marcador_local=p.marcador_local,
            marcador_visitante=p.marcador_visitante,
            estado=p.estado,
            competicion=p.competicion_rel,
            equipo_local=p.equipo_local_rel,
            equipo_visitante=p.equipo_visitante_rel
        ))
    return resultado


@app.get("/partidos/{partido_id}", response_model=PartidoConEstadisticasRead)
def leer_detalle_partido(partido_id: int, session: Session = Depends(get_session),
                         usuario: str = Depends(verificar_token)):
    partido = session.get(Partido, partido_id)
    if not partido:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    return PartidoConEstadisticasRead(
        id=partido.id,
        competicion_id=partido.competicion_id,
        equipo_local_id=partido.equipo_local_id,
        equipo_visitante_id=partido.equipo_visitante_id,
        marcador_local=partido.marcador_local,
        marcador_visitante=partido.marcador_visitante,
        estado=partido.estado,
        competicion=partido.competicion_rel,
        equipo_local=partido.equipo_local_rel,
        equipo_visitante=partido.equipo_visitante_rel,
        estadisticas=partido.estadisticas
    )


@app.post("/estadisticas/", response_model=EstadisticasPartido)
def crear_estadisticas(estadisticas: EstadisticasCreate, session: Session = Depends(get_session),
                       usuario: str = Depends(verificar_token)):
    if not session.get(Partido, estadisticas.partido_id):
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    estadisticas_db = EstadisticasPartido.model_validate(estadisticas)
    session.add(estadisticas_db)
    session.commit()
    session.refresh(estadisticas_db)
    return estadisticas_db


@app.delete("/partidos/{partido_id}")
def eliminar_partido(partido_id: int, session: Session = Depends(get_session), usuario: str = Depends(verificar_token)):
    partido = session.get(Partido, partido_id)
    if not partido:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    session.delete(partido)
    session.commit()
    return {"ok": True, "mensaje": f"Partido {partido_id} eliminado correctamente"}
