import { db } from "@/lib/drizzle/db";
import { userRoles } from "@/drizzle/schemas/user-roles/user-roles.schema";
import { roles } from "@/drizzle/schemas/roles/roles.schema";
import { users } from "@/drizzle/schemas/auth/users.schema";
import { profiles } from "@/drizzle/schemas/profiles/profiles.schema";
import { eq, inArray } from "drizzle-orm";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const RESEND_EMAIL_FROM = process.env.RESEND_EMAIL_FROM;
const RESEND_OPERATOR_RECIPIENT = process.env.OPERATOR_RECIPIENT;

export async function notifyOperators(message: string, subject?: string) {
  "use step";

  if (!resend || !RESEND_EMAIL_FROM) {
    console.warn("RESEND_API_KEY or RESEND_EMAIL_FROM not set. Email notifications disabled.");
    return;
  }

  // Testing mode: send to single recipient instead of all operators
  if (RESEND_OPERATOR_RECIPIENT) {
    const emailSubject = subject || "Content Ready for Review";
    try {
      await resend.emails.send({
        from: RESEND_EMAIL_FROM,
        to: RESEND_OPERATOR_RECIPIENT,
        subject: emailSubject,
        html: `
          <h2>${emailSubject}</h2>
          <p>${message}</p>
          <p><strong>Testing Mode:</strong> This email was sent to the test recipient instead of all operators.</p>
        `,
      });
      console.log(`Test email sent to: ${RESEND_OPERATOR_RECIPIENT}`);
    } catch (error) {
      console.error(`Failed to send test email to ${RESEND_OPERATOR_RECIPIENT}:`, error);
    }
    return;
  }

  // Fetch all users with role = 'operator'
  const operatorRole = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.name, "operator"));

  if (operatorRole.length === 0) {
    console.warn("No operator role found in database");
    return;
  }

  const operatorRoleId = operatorRole[0].id;

  const operatorUserRoles = await db
    .select({ userId: userRoles.userId })
    .from(userRoles)
    .where(eq(userRoles.roleId, operatorRoleId));

  if (operatorUserRoles.length === 0) {
    console.log("No operators found to notify");
    return;
  }

  // Fetch operator emails and names
  const operatorUserIds = operatorUserRoles.map((ur) => ur.userId);

  const operatorData = await db
    .select({
      email: users.email,
      name: profiles.name,
    })
    .from(users)
    .innerJoin(profiles, eq(users.id, profiles.id))
    .where(inArray(users.id, operatorUserIds));

  const emailSubject = subject || "Content Ready for Review";

  // Send email to each operator
  for (const operator of operatorData) {
    if (!operator.email) continue;

    try {
      await resend.emails.send({
        from: RESEND_EMAIL_FROM,
        to: operator.email,
        subject: emailSubject,
        html: `
          <h2>${emailSubject}</h2>
          <p>Hello ${operator.name},</p>
          <p>${message}</p>
          <p>Please log in to the AIML system to review the content.</p>
        `,
      });
      console.log(`Email sent to operator: ${operator.email}`);
    } catch (error) {
      console.error(`Failed to send email to ${operator.email}:`, error);
    }
  }
}
