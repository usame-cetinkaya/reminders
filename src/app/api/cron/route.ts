export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("Authorization");

  if (!cronSecret || !authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
