import { prisma } from './prisma';

export interface ValidGmailAuth {
  accessToken: string;
  email: string;
  name?: string;
}

export async function getConnectedGoogleAccount(): Promise<{ email: string; name?: string } | null> {
  try {
    const account = await prisma.account.findFirst({
      where: { provider: 'google' },
      include: { user: true }
    });
    if (account?.user) {
      return {
        email: account.user.email || 'induja2103@gmail.com',
        name: account.user.name || undefined
      };
    }
    return null;
  } catch (err) {
    return null;
  }
}

export async function getValidGmailToken(requestedEmail?: string): Promise<ValidGmailAuth | null> {
  try {
    const normalizedReq = requestedEmail ? requestedEmail.trim().toLowerCase() : undefined;

    // Search for matching Google account
    let account = null;
    if (normalizedReq) {
      account = await prisma.account.findFirst({
        where: {
          provider: 'google',
          user: { email: { equals: normalizedReq, mode: 'insensitive' } }
        },
        include: { user: true }
      });
    }

    // Fallback to any connected Google account if not explicitly found
    if (!account) {
      account = await prisma.account.findFirst({
        where: { provider: 'google' },
        include: { user: true }
      });
    }

    if (!account) {
      console.warn("[Gmail Auth] No Google OAuth account found in database.");
      return null;
    }

    const email = account.user?.email || "induja2103@gmail.com";
    const name = account.user?.name || undefined;
    let token = account.access_token;

    // Test token validity with lightweight request
    if (token) {
      try {
        const testRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (testRes.ok) {
          console.log("[Gmail Auth] Existing access token is valid for", email);
          return { accessToken: token, email, name };
        }
      } catch (testErr) {
        console.warn("[Gmail Auth] Test request failed, will refresh token.");
      }
    }

    // If token expired or failed, refresh using refresh_token
    if (account.refresh_token) {
      console.log("[Gmail Auth] Refreshing expired Google OAuth token for", email);
      const clientId = process.env.GOOGLE_CLIENT_ID || '';
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

      const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
          refresh_token: account.refresh_token
        })
      });

      const refreshData = await refreshRes.json();
      if (refreshData.access_token) {
        token = refreshData.access_token as string;
        console.log("[Gmail Auth] Token refreshed successfully!");

        // Update database
        await prisma.account.update({
          where: { id: account.id },
          data: {
            access_token: token,
            expires_at: Math.floor(Date.now() / 1000) + (refreshData.expires_in || 3600)
          }
        }).catch(err => console.warn("[Gmail Auth] Failed to save updated token to DB:", err.message));

        return { accessToken: token, email, name };
      } else {
        console.error("[Gmail Auth] Token refresh error:", refreshData);
      }
    }

    return null;
  } catch (error: any) {
    console.error("[Gmail Auth] Error obtaining valid Gmail token:", error);
    return null;
  }
}

