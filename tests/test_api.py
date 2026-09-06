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

# (Mantenemos el import y el primer test de leer_partidos justo arriba)

def test_crear_partido_inserta_datos_correctamente():
    with TestClient(app) as client:
        # 1. Preparar los datos (Lo que escribirías en la cajita de Swagger)
        nuevo_partido = {
            "competicion": "Champions League",
            "equipo_local": "Real Madrid",
            "equipo_visitante": "Bayern Munich",
            "marcador_local": 0,
            "marcador_visitante": 0,
            "estado": "programado"
        }
        
        # 2. Ejecutar: Hacemos el POST simulando a un usuario
        response = client.post("/partidos/", json=nuevo_partido)
        
        # 3. Validaciones QA (Aserciones)
        # ¿El servidor aceptó la creación? (200 OK)
        assert response.status_code == 200
        
        datos_guardados = response.json()
        
        # ¿La base de datos le asignó un ID automáticamente?
        assert "id" in datos_guardados
        
        # ¿Guardó exactamente los equipos que le mandamos?
        assert datos_guardados["equipo_local"] == "Real Madrid"
        assert datos_guardados["estado"] == "programado"