from fastapi.testclient import TestClient
from src.main import app

def test_leer_partidos_devuelve_lista_y_200():
    # El bloque 'with' obliga a FastAPI a ejecutar el 'lifespan' (crear_tablas_db)
    with TestClient(app) as client:
        # 1. Ejecución: Hacemos la petición GET
        response = client.get("/partidos/")
        
        # 2. Validación (Aserciones): 
        assert response.status_code == 200
        assert isinstance(response.json(), list)