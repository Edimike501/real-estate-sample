// Accepts POST { name, phone, propertyId, message }
// TODO: connect to CRM or email service
export async function POST(request: Request) {
  const body = await request.json();
  console.log("Property enquiry:", body);
  return Response.json({ success: true, message: "Enquiry received." });
}
