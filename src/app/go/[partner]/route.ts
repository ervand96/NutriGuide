import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const IHERB_CODE = process.env.IHERB_RCODE || "QXH0410";
const MY_PROTEIN = process.env.MY_PROTEIN_RCODE || "ERVAND-R5";

export async function GET(
  req: Request,
  { params }: { params: { partner: string } },
) {
  const { searchParams } = new URL(req.url);
  const partner = params.partner?.toLowerCase();
  const isMyProtein = partner === "myprotein";

  const source =
    searchParams.get("source") || searchParams.get("diet") || "unknown";
  const query = searchParams.get("q");

  try {
    const analyticsDir = path.join(process.cwd(), "src", "data");

    fs.mkdirSync(analyticsDir, { recursive: true });
    const file = path.join(analyticsDir, "affiliate-clicks.json");

    let clicks = [];

    if (fs.existsSync(file)) {
      clicks = JSON.parse(fs.readFileSync(file, "utf8"));
    }

    clicks.push({
      partner: isMyProtein ? "myprotein" : "iherb",
      source,
      time: new Date().toISOString(),
    });

    fs.writeFileSync(file, JSON.stringify(clicks, null, 2));
  } catch {}

  const targetUrl = isMyProtein
    ? `https://www.myprotein.com/c/myreferrals/?ref=${MY_PROTEIN}`
    : query
      ? `https://www.iherb.com/search?kw=${encodeURIComponent(query)}&rcode=${IHERB_CODE}`
      : `https://www.iherb.com/?rcode=${IHERB_CODE}`;

  const response = NextResponse.redirect(targetUrl);

  response.cookies.set("nutriguide_ref_source", source, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  response.cookies.set(
    "nutriguide_ref_partner",
    isMyProtein ? "myprotein" : "iherb",
    {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    },
  );

  return response;
}
