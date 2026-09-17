import pytest
from sqlmodel import Session, select

from src import main


def test_leer_partidos_devuelve_lista_y_200(authenticated):
    response = authenticated.get('/partidos/')
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_crear_partido_inserta_datos_correctamente(authenticated, match_payload, catalog):
    response = authenticated.post('/partidos/', json=match_payload)
    assert response.status_code == 200
    saved = response.json()
    assert saved['equipo_local']['id'] == catalog['teams'][0]['id']
    assert saved['estado'] == 'programado'
    detail = authenticated.get(f"/partidos/{saved['id']}")
    assert detail.status_code == 200
    assert detail.json()['competicion']['id'] == match_payload['competicion_id']


@pytest.mark.parametrize('field,value', [
    ('estado', 'estado_inventado'), ('marcador_local', -1), ('marcador_visitante', -1),
    ('competicion_id', None), ('equipo_local_id', None), ('equipo_visitante_id', 0),
])
def test_invalid_match_input_returns_422(authenticated, match_payload, field, value):
    response = authenticated.post('/partidos/', json={**match_payload, field: value})
    assert response.status_code == 422
    assert authenticated.get('/partidos/').json() == []


@pytest.mark.parametrize('team_index', [2, 3, 4])
def test_unregistered_or_incompatible_teams_cannot_play(authenticated, match_payload, catalog, team_index):
    payload = {**match_payload, 'equipo_visitante_id': catalog['teams'][team_index]['id']}
    response = authenticated.post('/partidos/', json=payload)
    assert response.status_code == 400
    assert authenticated.get('/partidos/').json() == []


def test_team_cannot_play_itself(authenticated, match_payload):
    payload = {**match_payload, 'equipo_visitante_id': match_payload['equipo_local_id']}
    assert authenticated.post('/partidos/', json=payload).status_code == 400


def test_unknown_team_returns_404(authenticated, match_payload):
    payload = {**match_payload, 'equipo_visitante_id': 999999}
    assert authenticated.post('/partidos/', json=payload).status_code == 404


@pytest.mark.parametrize('team_index', [3, 4])
def test_incompatible_enrollment_is_rejected(authenticated, catalog, team_index):
    team_id = catalog['teams'][team_index]['id']
    response = authenticated.post(f"/equipos/{team_id}/matricular/{catalog['comp']['id']}")
    assert response.status_code == 400


@pytest.mark.parametrize('field,value', [('tipo', 'seleccion'), ('pais', 'España'), ('confederacion_id', None)])
def test_team_edit_cannot_invalidate_enrollment(authenticated, catalog, field, value):
    original = catalog['teams'][0]
    payload = {**original, field: value}
    assert authenticated.put(f"/equipos/{original['id']}", json=payload).status_code == 400
    saved = next(t for t in authenticated.get('/equipos/').json() if t['id'] == original['id'])
    assert saved[field] == original[field]


@pytest.mark.parametrize('field,value', [('tipo', 'internacional_selecciones'), ('pais', 'España')])
def test_competition_edit_cannot_invalidate_enrollment(authenticated, catalog, field, value):
    original = catalog['comp']
    assert authenticated.put(f"/competiciones/{original['id']}", json={**original, field: value}).status_code == 400
    saved = next(c for c in authenticated.get('/competiciones/').json() if c['id'] == original['id'])
    assert saved[field] == original[field]


def statistics_payload(match_id):
    return {'partido_id': match_id, 'posesion_local': 55, 'posesion_visitante': 45,
            'tiros_puerta_local': 4, 'tiros_puerta_visitante': 3}


def test_delete_match_removes_only_its_statistics(authenticated, match_payload):
    first = authenticated.post('/partidos/', json=match_payload).json()['id']
    second = authenticated.post('/partidos/', json=match_payload).json()['id']
    for match_id in (first, second):
        assert authenticated.post('/estadisticas/', json=statistics_payload(match_id)).status_code == 200
    assert authenticated.delete(f'/partidos/{first}').status_code == 200
    assert authenticated.get(f'/partidos/{first}').status_code == 404
    assert authenticated.get(f'/partidos/{second}').status_code == 200
    with Session(main.engine) as session:
        remaining = session.exec(select(main.EstadisticasPartido)).all()
        assert [s.partido_id for s in remaining] == [second]


def test_delete_match_without_statistics(authenticated, match_payload):
    match_id = authenticated.post('/partidos/', json=match_payload).json()['id']
    assert authenticated.delete(f'/partidos/{match_id}').status_code == 200
    assert authenticated.delete(f'/partidos/{match_id}').status_code == 404


def test_statistics_for_unknown_match_return_404(authenticated):
    assert authenticated.post('/estadisticas/', json=statistics_payload(999999)).status_code == 404


@pytest.mark.parametrize('field,value', [('posesion_local', 101), ('posesion_visitante', -1), ('tiros_puerta_local', -1)])
def test_invalid_statistics_return_422(authenticated, match_payload, field, value):
    match_id = authenticated.post('/partidos/', json=match_payload).json()['id']
    payload = {**statistics_payload(match_id), field: value}
    assert authenticated.post('/estadisticas/', json=payload).status_code == 422
    assert authenticated.get(f'/partidos/{match_id}').json()['estadisticas'] == []
