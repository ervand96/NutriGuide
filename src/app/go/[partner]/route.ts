import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Referral / affiliate codes — set the real ones in .env once you're
// approved for each program. Until then these fall back to plain
// (non-monetized) links so buttons never break.
const IHERB_CODE = process.env.IHERB_RCODE || "QXH0410";
const MY_PROTEIN = process.env.MY_PROTEIN_RCODE || "ERVAND-R5";
const AMAZON_TAG = process.env.AMAZON_ASSOCIATE_TAG || ""; // e.g. "nutriguide-20" from associates.amazon.com
const NOOM_LINK = process.env.NOOM_AFFILIATE_LINK || ""; // full tracking link from impact.com (search "Noom")
const HELLOFRESH_LINK = process.env.HELLOFRESH_AFFILIATE_LINK || ""; // full tracking link from hellofresh.com/affiliates

const PARTNERS = ["iherb", "myprotein", "amazon", "noom", "hellofresh"] as const;
type Partner = (typeof PARTNERS)[number];

function buildTargetUrl(partner: Partner, query: string | null): string {
  switch (partner) {
    case "myprotein":
      return `https://www.myprotein.com/c/referrals/?applyCode=${MY_PROTEIN}`;

    case "amazon": {
      const base = "https://www.amazon.com";
      const search = query
        ? `/s?k=${encodeURIComponent(query)}`
        : "/s?k=nutrition+supplements";
      const tagParam = AMAZON_TAG ? `&tag=${AMAZON_TAG}` : "";
      return `${base}${search}${tagParam}`;
    }

    case "noom":
      // NOOM_AFFILIATE_LINK is the full tracking URL Impact gives you —
      // paste it as-is in .env once approved.
      return NOOM_LINK || "https://www.noom.com/";

    case "hellofresh":
      return HELLOFRESH_LINK || "https://www.hellofresh.com/";

    case "iherb":
    default:
      return query
        ? `https://www.iherb.com/search?kw=${encodeURIComponent(query)}&rcode=${IHERB_CODE}`
        : `https://www.iherb.com/?rcode=${IHERB_CODE}`;
  }
}

export async function GET(
  req: Request,
  { params }: { params: { partner: string } },
) {
  const { searchParams } = new URL(req.url);
  const rawPartner = params.partner?.toLowerCase();
  const partner: Partner = PARTNERS.includes(rawPartner as Partner)
    ? (rawPartner as Partner)
    : "iherb";

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
      partner,
      source,
      time: new Date().toISOString(),
    });

    fs.writeFileSync(file, JSON.stringify(clicks, null, 2));
  } catch {}

  const targetUrl = buildTargetUrl(partner, query);

  const response = NextResponse.redirect(targetUrl);

  response.cookies.set("nutriguide_ref_source", source, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  response.cookies.set("nutriguide_ref_partner", partner, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}
