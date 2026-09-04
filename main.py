partidos = [
    {
        "local": "Deportes Tolima",
        "visitante": "Atlético Nacional",
        "goles_local": 2,
        "goles_visitante": 1
    },
    {
        "local": "Millonarios",
        "visitante": "América de Cali",
        "goles_local": 0,
        "goles_visitante": 0
    },
    {
        "local": "Junior",
        "visitante": "Independiente Santa Fe",
        "goles_local": 1,
        "goles_visitante": 3
    }
]

for partido in partidos:
    if partido["goles_local"] > partido["goles_visitante"]:
        print(f'Ganó {partido["local"]}')
    elif partido["goles_local"] < partido["goles_visitante"]:
        print(f'Ganó {partido["visitante"]}')
    else:
        print("Empate")