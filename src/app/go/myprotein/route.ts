import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MY_PROTEIN = process.env.MY_PROTEIN_RCODE || "ERVAND-R5";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const source =
    searchParams.get("source") || searchParams.get("diet") || "unknown";

  try {
    const analyticsDir = path.join(process.cwd(), "src", "data");

    fs.mkdirSync(analyticsDir, { recursive: true });
    const file = path.join(analyticsDir, "affiliate-clicks.json");

    let clicks = [];
    if (fs.existsSync(file)) {
      clicks = JSON.parse(fs.readFileSync(file, "utf8"));
    }

    clicks.push({
      partner: "myprotein",
      source,
      time: new Date().toISOString(),
    });

    fs.writeFileSync(file, JSON.stringify(clicks, null, 2));
  } catch {}

  const targetUrl = `https://www.myprotein.com/c/myreferrals/?ref=${MY_PROTEIN}`;
  const response = NextResponse.redirect(targetUrl);

  response.cookies.set("nutriguide_ref_source", source, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  response.cookies.set("nutriguide_ref_partner", "myprotein", {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}
