import os
from sqlmodel import create_engine, SQLModel

# Va a buscar la URL en Docker, y si no la encuentra (cuando programas localmente), usa la de tu PC
URL_BASE_DATOS = os.getenv(
    "DATABASE_URL", 
    "postgresql://vertice_user:vertice123@localhost/vertice_db"
)

engine = create_engine(URL_BASE_DATOS, echo=True)

def crear_tablas_db():
    SQLModel.metadata.create_all(engine)