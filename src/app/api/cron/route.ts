export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("Authorization");

  console.log({ cronSecret, authHeader });

  if (!cronSecret || !authHeader || authHeader !== `Bearer ${cronSecret}`) {
    console.log("Unauthorized cron attempt at", new Date().toISOString());

    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  console.log("Cron ran at", new Date().toISOString());

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
