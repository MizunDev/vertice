import os
import datetime
from enum import Enum
from fastapi import FastAPI, Depends, HTTPException, status, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import SQLModel, Field, Session, select, Relationship
from contextlib import asynccontextmanager
import jwt
from src.database import crear_tablas_db, engine

SECRET_KEY = os.getenv("SECRET_KEY", "vertice_super_secreto_jwt_2026")
ALGORITHM = "HS256"

class EstadoPartido(str, Enum):
    VIVO = "en vivo"
    FINALIZADO = "finalizado"
    PROGRAMADO = "programado"

class PartidoBase(SQLModel):
    competicion: str
    equipo_local: str
    equipo_visitante: str
    marcador_local: int
    marcador_visitante: int
    estado: EstadoPartido

class EstadisticasPartido(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    partido_id: int = Field(foreign_key="partido.id")
    posesion_local: int
    posesion_visitante: int
    tiros_puerta_local: int
    tiros_puerta_visitante: int
    partido: "Partido" = Relationship(back_populates="estadisticas")

class Partido(PartidoBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    estadisticas: list[EstadisticasPartido] = Relationship(back_populates="partido")

class PartidoConEstadisticas(PartidoBase):
    id: int
    estadisticas: list[EstadisticasPartido] = []

class LoginRequest(BaseModel):
    username: str
    password: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    crear_tablas_db()
    yield

app = FastAPI(title="VÉRTICE API", lifespan=lifespan)

# OJO CON EL CORS: Cuando usamos cookies seguras entre puertos diferentes (ej. Frontend 5173/80 y Backend 8000), 
# allow_origins no puede ser ["*"], debe permitir credenciales explícitamente.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- VERIFICACIÓN DE TOKEN DESDE COOKIE HTTP-ONLY ---
def verificar_token(request: Request):
    token = request.cookies.get("vertice_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No autenticado. Falta la cookie de sesión.",
        )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
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

# --- LOGIN: FIJA EL TOKEN EN UNA COOKIE HTTP-ONLY ---
@app.post("/login")
def login(credentials: LoginRequest, response: Response):
    if credentials.username == "admin" and credentials.password == "vertice2026":
        expire = datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        payload = {
            "sub": credentials.username,
            "exp": expire
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        
        # 🛡️ Inyectamos la Cookie HTTP-only de forma segura
        response.set_cookie(
            key="vertice_token",
            value=token,
            httponly=True,     # Inaccesible a JavaScript (Protege contra XSS)
            secure=False,      # Cambiar a True si subes la app a producción con HTTPS estricto
            samesite="lax",    # Protección contra Cross-Site Request Forgery
            max_age=86400      # 24 horas en segundos
        )
        return {"ok": True, "mensaje": "Sesión iniciada correctamente"}
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales incorrectas"
    )

# --- ENDPOINT DE LOGOUT (Borra la Cookie) ---
@app.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="vertice_token")
    return {"ok": True, "mensaje": "Sesión cerrada"}

# --- ENDPOINTS PROTEGIDOS ---

@app.post("/partidos/", response_model=Partido)
def crear_partido(partido_in: PartidoBase, session: Session = Depends(get_session), usuario: str = Depends(verificar_token)):
    partido_db = Partido.model_validate(partido_in)
    session.add(partido_db)
    session.commit()
    session.refresh(partido_db)
    return partido_db

@app.get("/partidos/", response_model=list[Partido])
def leer_partidos(session: Session = Depends(get_session), usuario: str = Depends(verificar_token)):
    return session.exec(select(Partido)).all()

@app.get("/partidos/{partido_id}", response_model=PartidoConEstadisticas)
def leer_detalle_partido(partido_id: int, session: Session = Depends(get_session), usuario: str = Depends(verificar_token)):
    partido = session.get(Partido, partido_id)
    if not partido:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    return partido

@app.post("/estadisticas/", response_model=EstadisticasPartido)
def crear_estadisticas(estadisticas: EstadisticasPartido, session: Session = Depends(get_session), usuario: str = Depends(verificar_token)):
    session.add(estadisticas)
    session.commit()
    session.refresh(estadisticas)
    return estadisticas

@app.delete("/partidos/{partido_id}")
def eliminar_partido(partido_id: int, session: Session = Depends(get_session), usuario: str = Depends(verificar_token)):
    partido = session.get(Partido, partido_id)
    if not partido:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    
    session.delete(partido)
    session.commit()
    return {"ok": True, "mensaje": f"Partido {partido_id} eliminado correctamente"}