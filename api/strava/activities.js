// Intermediario de lectura: pide a Strava las actividades desde una fecha, con el acceso del usuario.
module.exports = async (req, res) => {
  const auth = req.headers.authorization || "";
  if (!/^Bearer \S+$/.test(auth)) return res.status(401).json({error: "Falta autorización"});
  const after = Math.max(0, parseInt(new URL(req.url, "http://x").searchParams.get("after") || "0", 10) || 0);
  const out = [];
  for (let page = 1; page <= 3; page++){
    const r = await fetch(`https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=100&page=${page}`, {headers: {Authorization: auth}});
    if (!r.ok) return res.status(r.status).json({error: `Strava respondió ${r.status}`});
    const a = await r.json(); out.push(...a); if (a.length < 100) break;
  }
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(out.map(x => ({id: x.id, name: x.name, type: x.sport_type || x.type, start: x.start_date,
    min: Math.round((x.moving_time || 0)/60), km: x.distance ? Math.round(x.distance/100)/10 : 0,
    hr: x.average_heartrate ? Math.round(x.average_heartrate) : null, hrmax: x.max_heartrate ? Math.round(x.max_heartrate) : null,
    effort: x.suffer_score != null ? Math.round(x.suffer_score) : null})));
};
