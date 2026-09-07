import pytest
from sqlalchemy.exc import DataError
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


def test_crear_partido_inserta_datos_correctamente():
    with TestClient(app) as client:
        # 1. Preparar los datos
        nuevo_partido = {
            "competicion": "Champions League",
            "equipo_local": "Real Madrid",
            "equipo_visitante": "Bayern Munich",
            "marcador_local": 0,
            "marcador_visitante": 0,
            "estado": "programado"
        }
        
        # 2. Ejecutar: Hacemos el POST
        response = client.post("/partidos/", json=nuevo_partido)
        
        # 3. Validaciones QA
        assert response.status_code == 200
        datos_guardados = response.json()
        assert "id" in datos_guardados
        assert datos_guardados["equipo_local"] == "Real Madrid"
        assert datos_guardados["estado"] == "programado"


# --- EL CASO DE PRUEBA NEGATIVO ---
def test_crear_partido_con_estado_falso_hace_explotar_el_pipeline():
    with TestClient(app) as client:
        partido_malo = {
            "competicion": "Champions League",
            "equipo_local": "Real Madrid",
            "equipo_visitante": "Bayern Munich",
            "marcador_local": 0,
            "marcador_visitante": 0,
            "estado": "arbitro_borracho" # <--- El estado que no existe en el Enum
        }
        
        # Le decimos a pytest: "Vigila esta petición. Si NO causa un DataError, el test falla. 
        # Si SÍ causa un DataError, el test pasa porque la BD reaccionó como esperábamos".
        with pytest.raises(DataError):
            client.post("/partidos/", json=partido_malo)