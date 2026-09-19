export function summarizeAdmin(competitions, teams, matches) {
  const unregistered = teams.filter((team) => !team.competiciones?.length);
  const incomplete = matches.filter(
    (match) =>
      !match.competicion || !match.equipo_local || !match.equipo_visitante,
  );
  return {
    unregistered,
    incomplete,
    scheduled: matches.filter((match) => match.estado === "programado"),
    live: matches.filter((match) => match.estado === "en vivo"),
    finished: matches.filter((match) => match.estado === "finalizado"),
    recent: [...matches].sort((a, b) => b.id - a.id).slice(0, 4),
    rosters: competitions
      .map((competition) => ({
        ...competition,
        teamCount: teams.filter((team) =>
          team.competiciones?.some((item) => item.id === competition.id),
        ).length,
      }))
      .sort(
        (a, b) =>
          b.teamCount - a.teamCount || a.nombre.localeCompare(b.nombre, "es"),
      ),
  };
}
