// Paso 2: Strava vuelve con un código; se cambia por tokens y se entregan a la app en el fragmento (#),
// que el navegador no envía a ningún servidor.
const {base, missing, token} = require("./_lib");
module.exports = async (req, res) => {
  const q = new URL(req.url, base(req)).searchParams;
  const back = h => { res.writeHead(302, {Location: `${base(req)}/#${h}`}); res.end(); };
  if (missing()) return back("strava-error=" + encodeURIComponent("Falta configurar Strava en Vercel."));
  if (q.get("error") || !q.get("code")) return back("strava-error=" + encodeURIComponent("No se autorizó la conexión con Strava."));
  if (!String(q.get("scope") || "").includes("activity:read")) return back("strava-error=" + encodeURIComponent("Debes permitir el acceso a tus actividades."));
  try {
    const t = await token({code: q.get("code"), grant_type: "authorization_code"});
    back("strava=" + Buffer.from(JSON.stringify(t)).toString("base64url"));
  } catch (e) { back("strava-error=" + encodeURIComponent(e.message)); }
};
