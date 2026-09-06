from sqlmodel import create_engine, SQLModel

# 1. Definimos la dirección exacta de nuestra base de datos local
DATABASE_URL = "postgresql://vertice_user:vertice123@localhost/vertice_db"

# 2. Creamos el "motor" de conexión
# echo=True hace que la terminal nos muestre el código SQL interno (muy útil para aprender)
engine = create_engine(DATABASE_URL, echo=True)

# 3. Creamos una función que construiremos más adelante para generar las tablas
def crear_tablas_db():
    SQLModel.metadata.create_all(engine)