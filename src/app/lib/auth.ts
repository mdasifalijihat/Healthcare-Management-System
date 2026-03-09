import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { envVars } from "../../config/env";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";

// If your Prisma file is located elsewhere, you can change the path
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignIn: true,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.PATIENT,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
      needPasswordChange: {
        type: "boolean",
        returned: true,
        defaultValue: false,
      },
      isDeleted: {
        type: "boolean",
        returned: true,
        defaultValue: false,
        required: false,
      },
      deletedAt: {
        type: "date",
        returned: false,
        defaultValue: null,
        required: false,
      },
    },
  },
  trustedOrigins: [envVars.BETTER_AUTH_URL || "http://localhost:5000"],

  advanced: {
    disableCSRFCheck: true,
  },

  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });
          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "verify your email",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (user) {
            await sendEmail({
              to: email,
              subject: "Reset Your Password",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        }
      },
      expiresIn: 2 * 60,
      otpLength: 6,
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 60 * 24, // 24 hours in seconds
    updateAge: 60 * 60 * 60, // 24 hours in seconds
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24 * 1, // 1 day in seconds
    },
  },
});
