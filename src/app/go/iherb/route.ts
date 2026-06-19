import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// ⚠️ ВАЖНО: вставьте сюда ваш реальный rcode из личного кабинета
// iHerb Rewards Program (https://www.iherb.com/info/rewards-program),
// либо задайте переменную окружения IHERB_RCODE в .env / Vercel.
// Cам 30-дневный affiliate-cookie ставит iHerb на СВОЕЙ домене —
// это управляется их программой, мы это не контролируем напрямую.
// Наша задача — чтобы ВСЕ ссылки на iHerb на сайте шли через
// этот редирект (/go/iherb), а не напрямую на iherb.com,
// иначе rcode не попадёт в URL и их cookie не выставится.
const IHERB_CODE = process.env.IHERB_RCODE || "QXH0410";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const source =
    searchParams.get("source") || searchParams.get("diet") || "unknown";
  const query = searchParams.get("q"); // конкретный товар, если есть

  try {
    // ⚠️ Запись в файл на диске работает только локально / на сервере
    // с постоянной файловой системой. На Vercel (serverless) этот файл
    // будет пропадать между деплоями/инстансами — для реальной аналитики
    // кликов нужна внешняя БД (Vercel KV, Supabase, Postgres и т.п.).
    const analyticsDir = path.join(process.cwd(), "src", "data");

    fs.mkdirSync(analyticsDir, {
      recursive: true,
    });

    const file = path.join(analyticsDir, "affiliate-clicks.json");

    let clicks = [];

    if (fs.existsSync(file)) {
      clicks = JSON.parse(fs.readFileSync(file, "utf8"));
    }

    clicks.push({
      partner: "iherb",
      source,
      time: new Date().toISOString(),
    });

    fs.writeFileSync(file, JSON.stringify(clicks, null, 2));
  } catch {}

  const targetUrl = query
    ? `https://www.iherb.com/search?kw=${encodeURIComponent(query)}&rcode=${IHERB_CODE}`
    : `https://www.iherb.com/?rcode=${IHERB_CODE}`;

  const response = NextResponse.redirect(targetUrl);

  // Свой first-party cookie на 30 дней — НЕ влияет на комиссию iHerb
  // (та считается их собственным cookie на их домене), но позволяет
  // вам видеть в своей аналитике, что именно этот посетитель уже
  // кликал на iHerb через ваш сайт, даже если он купит не сразу.
  response.cookies.set("nutriguide_ref_source", source, {
    maxAge: 60 * 60 * 24 * 30, // 30 дней
    path: "/",
  });

  response.cookies.set("nutriguide_ref_partner", "iherb", {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}
