from fastapi.testclient import TestClient
from src.main import app

def test_leer_partidos_devuelve_lista_y_200():
    # El bloque 'with' obliga a FastAPI a ejecutar el 'lifespan' (crear_tablas_db)
    with TestClient(app) as client:
        response = client.get("/partidos/")
        assert response.status_code == 200
        assert isinstance(response.json(), list)


def test_crear_partido_inserta_datos_correctamente():
    with TestClient(app) as client:
        nuevo_partido = {
            "competicion": "Champions League",
            "equipo_local": "Real Madrid",
            "equipo_visitante": "Bayern Munich",
            "marcador_local": 0,
            "marcador_visitante": 0,
            "estado": "programado" # Estado válido
        }
        
        response = client.post("/partidos/", json=nuevo_partido)
        
        assert response.status_code == 200
        datos_guardados = response.json()
        assert "id" in datos_guardados
        assert datos_guardados["equipo_local"] == "Real Madrid"
        assert datos_guardados["estado"] == "programado"


# --- EL CASO DE PRUEBA NEGATIVO (Validando el escudo) ---
def test_crear_partido_con_estado_falso_es_rechazado_con_422():
    with TestClient(app) as client:
        partido_malo = {
            "competicion": "Champions League",
            "equipo_local": "Real Madrid",
            "equipo_visitante": "Bayern Munich",
            "marcador_local": 0,
            "marcador_visitante": 0,
            "estado": "arbitro_borracho" # <--- Estado inválido
        }
        
        response = client.post("/partidos/", json=partido_malo)
        
        # Validamos que Pydantic interceptó el dato ANTES de que llegara a la BD
        assert response.status_code == 422