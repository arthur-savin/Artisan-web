import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint contact — compatible Hostinger Node.
 * Branchez Mailgun via variables d'environnement :
 * MAILGUN_API_KEY, MAILGUN_DOMAIN, CONTACT_TO_EMAIL
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let data: Record<string, string> = {};

    if (contentType.includes("application/json")) {
      data = (await request.json()) as Record<string, string>;
    } else {
      const form = await request.formData();
      form.forEach((value, key) => {
        if (typeof value === "string") data[key] = value;
      });
    }

    // Honeypot
    if (data.website?.trim()) {
      return NextResponse.json({
        ok: true,
        message: "Merci, votre demande a bien été envoyée.",
      });
    }

    const firstName = (data.firstName || "").trim();
    const phone = (data.phone || "").trim();
    const requestType = data.requestType === "devis" ? "devis" : "appel";

    if (!firstName || !phone) {
      return NextResponse.json(
        { ok: false, message: "Prénom et téléphone sont obligatoires." },
        { status: 400 },
      );
    }

    if (requestType === "devis") {
      const email = (data.email || "").trim();
      const lastName = (data.lastName || "").trim();
      if (!email || !lastName) {
        return NextResponse.json(
          { ok: false, message: "Nom et email sont obligatoires pour un devis." },
          { status: 400 },
        );
      }
    }

    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    const toEmail = process.env.CONTACT_TO_EMAIL || "contact@artisan-web.com";

    if (apiKey && domain) {
      const subject =
        requestType === "devis"
          ? `[Artisan-Web] Demande de devis — ${firstName}`
          : `[Artisan-Web] Réservation d'appel — ${firstName}`;

      const text = Object.entries(data)
        .filter(([k]) => k !== "website")
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");

      const body = new URLSearchParams({
        from: `Artisan-Web <noreply@${domain}>`,
        to: toEmail,
        subject,
        text,
      });

      const auth = Buffer.from(`api:${apiKey}`).toString("base64");
      const mailRes = await fetch(
        `https://api.mailgun.net/v3/${domain}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        },
      );

      if (!mailRes.ok) {
        return NextResponse.json(
          { ok: false, message: "Échec d’envoi du message. Réessayez plus tard." },
          { status: 502 },
        );
      }
    } else if (process.env.NODE_ENV === "production") {
      console.warn(
        "[contact] MAILGUN_API_KEY / MAILGUN_DOMAIN manquants — demande reçue mais non envoyée.",
        { firstName, phone, requestType },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Merci, votre demande a bien été envoyée.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Une erreur est survenue." },
      { status: 500 },
    );
  }
}
