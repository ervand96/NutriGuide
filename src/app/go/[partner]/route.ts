import { NextResponse } from "next/server";
import {
  buildAffiliateUrl,
  isValidPartner,
  appendUtm,
} from "@/lib/affiliate";
import { recordAffiliateClick } from "@/lib/affiliate-clicks";

type Partner = "iherb" | "myprotein";

function visitorCountry(req: Request) {
  // Vercel / Cloudflare edge headers (first match wins)
  return (
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-country-code") ||
    ""
  );
}

export async function GET(
  req: Request,
  { params }: { params: { partner: string } },
) {
  const { searchParams } = new URL(req.url);
  const rawPartner = params.partner?.toLowerCase();
  const partner: Partner = isValidPartner(rawPartner)
    ? (rawPartner as Partner)
    : "iherb";

  const source =
    searchParams.get("source") || searchParams.get("diet") || "unknown";
  const query = searchParams.get("q");
  const country = visitorCountry(req);

  await recordAffiliateClick(partner, source);

  const targetUrl = appendUtm(
    buildAffiliateUrl(partner, query, process.env, { country }),
    source,
    partner,
  );

  // 302 so browsers treat it as a normal affiliate hop (not method-preserving 307)
  const response = NextResponse.redirect(targetUrl, 302);

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
