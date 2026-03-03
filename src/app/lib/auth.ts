import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { envVars } from "../../config/env";
import { bearer } from "better-auth/plugins";

// If your Prisma file is located elsewhere, you can change the path
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
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

  plugins: [bearer()],

  session: {
    expiresIn: 60 * 60 * 60 * 24, // 24 hours in seconds
    updateAge: 60 * 60 * 60, // 24 hours in seconds
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24 * 1, // 1 day in seconds
    },
  },
});
