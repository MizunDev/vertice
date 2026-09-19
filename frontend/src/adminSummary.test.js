import assert from "node:assert/strict";
import { test } from "node:test";
import { summarizeAdmin } from "./adminSummary.js";

test("overview derives counts from real enrollment and match status", () => {
  const competitions = [
    { id: 1, nombre: "Liga" },
    { id: 2, nombre: "Copa" },
  ];
  const teams = [
    { id: 1, competiciones: [{ id: 1 }, { id: 2 }] },
    { id: 2, competiciones: [] },
    { id: 3 },
  ];
  const matches = [
    {
      id: 3,
      estado: "programado",
      competicion: { id: 1 },
      equipo_local: { id: 1 },
      equipo_visitante: { id: 2 },
    },
    {
      id: 9,
      estado: "en vivo",
      competicion: null,
      equipo_local: null,
      equipo_visitante: { id: 2 },
    },
    {
      id: 5,
      estado: "finalizado",
      competicion: { id: 1 },
      equipo_local: { id: 1 },
      equipo_visitante: { id: 2 },
    },
  ];
  const before = JSON.stringify({ competitions, teams, matches });
  const result = summarizeAdmin(competitions, teams, matches);
  assert.equal(result.scheduled.length, 1);
  assert.equal(result.live.length, 1);
  assert.equal(result.finished.length, 1);
  assert.deepEqual(
    result.unregistered.map((t) => t.id),
    [2, 3],
  );
  assert.deepEqual(
    result.incomplete.map((m) => m.id),
    [9],
  );
  assert.deepEqual(
    result.recent.map((m) => m.id),
    [9, 5, 3],
  );
  assert.deepEqual(
    result.rosters.map((c) => c.teamCount),
    [1, 1],
  );
  assert.equal(JSON.stringify({ competitions, teams, matches }), before);
});

test("empty workspace has zero counts and no fabricated activity", () => {
  const result = summarizeAdmin([], [], []);
  assert.deepEqual(result.recent, []);
  assert.deepEqual(result.rosters, []);
  assert.deepEqual(result.unregistered, []);
});
