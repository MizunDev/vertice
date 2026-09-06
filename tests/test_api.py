# Archivo: tests/test_api.py
from fastapi.testclient import TestClient
from src.main import app

# Instanciamos el cliente que simulará ser nuestro navegador/Swagger
client = TestClient(app)

def test_leer_partidos_devuelve_lista_y_200():
    # 1. Ejecución: Hacemos la petición GET
    response = client.get("/partidos/")
    
    # 2. Validación (Aserciones): 
    # ¿El código de estado es 200 OK?
    assert response.status_code == 200
    
    # ¿El cuerpo de la respuesta es una lista (arreglo)?
    assert isinstance(response.json(), list)