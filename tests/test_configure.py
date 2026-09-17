import pytest

from src import configure
from src.security import verify_password


def test_setup_stores_a_hash_and_keeps_existing_database_password(tmp_path, monkeypatch):
    monkeypatch.setattr(configure, "__file__", str(tmp_path / "src" / "configure.py"))
    monkeypatch.setattr("builtins.input", lambda _: "operador")
    password = "nueva-contraseña-de-prueba"
    answers = iter([password, password, "existing_database_password"])
    monkeypatch.setattr(configure.getpass, "getpass", lambda _: next(answers))
    configure.main()
    text = (tmp_path / ".env").read_text()
    values = dict(line.split("=", 1) for line in text.splitlines())
    assert password not in text
    assert verify_password(password, values["ADMIN_PASSWORD_HASH"])
    assert len(values["SECRET_KEY"]) >= 32
    assert values["POSTGRES_PASSWORD"] == "'existing_database_password'"


def test_setup_never_overwrites_existing_configuration(tmp_path, monkeypatch):
    target = tmp_path / ".env"
    target.write_text("existing configuration")
    monkeypatch.setattr(configure, "__file__", str(tmp_path / "src" / "configure.py"))
    with pytest.raises(SystemExit, match="ya existe"):
        configure.main()
    assert target.read_text() == "existing configuration"
