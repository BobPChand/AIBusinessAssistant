// AI Invoice & Quote Generator — GPT-4o powered backend
// Canadian tax logic: GST 5% default, HST by province

const PROVINCE_TAX: Record<string, { name: string; rate: number }> = {
  AB: { name: "GST", rate: 0.05 },
  BC: { name: "GST+PST", rate: 0.12 },
  MB: { name: "GST+PST", rate: 0.12 },
  NB: { name: "HST", rate: 0.15 },
  NL: { name: "HST", rate: 0.15 },
  NS: { name: "HST", rate: 0.15 },
  NT: { name: "GST", rate: 0.05 },
  NU: { name: "GST", rate: 0.05 },
  ON: { name: "HST", rate: 0.13 },
  PE: { name: "HST", rate: 0.15 },
  QC: { name: "GST+QST", rate: 0.14975 },
  SK: { name: "GST+PST", rate: 0.11 },
  YT: { name: "GST", rate: 0.05 },
};

Deno.serve(async (req: Request): Promise<Response> => {
  const cors = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const { prompt, province = "ON", invoice_type = "invoice" } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), { status: 400, headers: cors });
    }

    const tax = PROVINCE_TAX[province.toUpperCase()] || { name: "GST", rate: 0.05 };

    const systemPrompt = `You are a professional Canadian invoicing assistant. Parse the user's description and return a structured JSON invoice/quote.

Canadian tax for province ${province}: ${tax.name} at ${(tax.rate * 100).toFixed(3)}%

Return ONLY valid JSON with this exact structure:
{
  "invoice_type": "${invoice_type}",
  "client_name": "string or empty",
  "client_email": "string or empty",
  "line_items": [
    { "description": "string", "quantity": number, "unit_price": number, "total": number }
  ],
  "subtotal": number,
  "tax_rate": ${tax.rate},
  "tax_name": "${tax.name}",
  "tax_total": number,
  "total": number,
  "currency": "CAD",
  "notes": "string or empty",
  "due_days": 30
}

Rules:
- All amounts in CAD
- Calculate totals accurately
- If client name/email not mentioned, leave empty
- Be professional with descriptions
- Round to 2 decimal places`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("OPENAI_PROJECT_KEY")}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const invoice = JSON.parse(data.choices[0].message.content);

    // Add metadata
    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (invoice.due_days || 30));

    invoice.issue_date = now.toISOString().split("T")[0];
    invoice.due_date = dueDate.toISOString().split("T")[0];
    invoice.province = province.toUpperCase();
    invoice.status = "draft";

    return new Response(JSON.stringify({ success: true, invoice }), { headers: cors });

  } catch (err: any) {
    console.error("aiInvoice error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: cors });
  }
});
