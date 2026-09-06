# 1. Usamos una versión oficial y ligera de Python
FROM python:3.12-slim

# 2. Creamos una carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos el pasaporte de dependencias que creamos antes
COPY requirements.txt .

# 4. Instalamos las librerías
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copiamos el código fuente de VÉRTICE
COPY src/ ./src/

# 6. Le decimos cómo encender el servidor 
# (Usamos 0.0.0.0 para que el contenedor exponga el puerto al exterior)
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]