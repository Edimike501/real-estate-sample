// Accepts POST { name, email, phone, message }
// TODO: connect to email service (e.g. Resend, Nodemailer)
export async function POST(request: Request) {
  const body = await request.json();
  console.log("Contact form submission:", body);
  return Response.json({
    success: true,
    message: "Message received. We'll be in touch."
  });
}
