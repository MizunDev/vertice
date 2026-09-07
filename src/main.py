from enum import Enum
from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import SQLModel, Field, Session, select, Relationship
from contextlib import asynccontextmanager
from src.database import crear_tablas_db, engine

# 1. TU FILTRO ESTRICTO
class EstadoPartido(str, Enum):
    VIVO = "en vivo"
    FINALIZADO = "finalizado"
    PROGRAMADO = "programado"

# 2. EL MOLDE BASE (Datos comunes puros, sin configuración de base de datos)
class PartidoBase(SQLModel):
    competicion: str
    equipo_local: str
    equipo_visitante: str
    marcador_local: int
    marcador_visitante: int
    estado: EstadoPartido

# 3. LAS TABLAS (Lo que se guarda en PostgreSQL)
class EstadisticasPartido(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    
    # La llave foránea conecta el ID con la tabla partido
    partido_id: int = Field(foreign_key="partido.id")
    
    posesion_local: int
    posesion_visitante: int
    tiros_puerta_local: int
    tiros_puerta_visitante: int

    # Relación inversa para que Python entienda la conexión
    partido: "Partido" = Relationship(back_populates="estadisticas")

class Partido(PartidoBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    
    # La "magia": Le decimos que un partido puede tener estadísticas asociadas
    estadisticas: list[EstadisticasPartido] = Relationship(back_populates="partido")

# 4. EL MOLDE DE RESPUESTA (Lo que le enviamos a la interfaz de VÉRTICE)
class PartidoConEstadisticas(PartidoBase):
    id: int
    estadisticas: list[EstadisticasPartido] = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    crear_tablas_db()
    yield

app = FastAPI(title="VÉRTICE API", lifespan=lifespan)

def get_session():
    with Session(engine) as session:
        yield session

# --- ENDPOINTS DE PARTIDOS ---

@app.post("/partidos/", response_model=Partido)
def crear_partido(partido_in: PartidoBase, session: Session = Depends(get_session)):
    # 1. FastAPI y Pydantic ya filtraron con PartidoBase. 
    # Si llegó aquí, los datos son 100% seguros y el estado es válido.
    
    # 2. Convertimos los datos limpios al molde de la base de datos (Partido)
    partido_db = Partido.model_validate(partido_in)
    
    # 3. Guardamos en PostgreSQL
    session.add(partido_db)
    session.commit()
    session.refresh(partido_db)
    return partido_db

@app.get("/partidos/", response_model=list[Partido])
def leer_partidos(session: Session = Depends(get_session)):
    return session.exec(select(Partido)).all()


# --- ENDPOINT DE DETALLE DE PARTIDO ---

@app.get("/partidos/{partido_id}", response_model=PartidoConEstadisticas)
def leer_detalle_partido(partido_id: int, session: Session = Depends(get_session)):
    partido = session.get(Partido, partido_id)
    if not partido:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    return partido

# --- NUEVOS ENDPOINTS DE ESTADÍSTICAS ---

@app.post("/estadisticas/", response_model=EstadisticasPartido)
def crear_estadisticas(estadisticas: EstadisticasPartido, session: Session = Depends(get_session)):
    session.add(estadisticas)
    session.commit()
    session.refresh(estadisticas)
    return estadisticas