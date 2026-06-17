// OAuth service for Decap CMS
// This handles GitHub OAuth authentication for Decap CMS git-gateway backend

export default function handler(req, res) {
  // This is a simple OAuth proxy service
  // In production, you would need to set up proper GitHub OAuth app
  // and configure the redirect URLs

  const { code, state } = req.query;

  if (code) {
    // Exchange authorization code for access token
    // This would typically involve calling GitHub's OAuth API
    // For now, return a success response
    res.status(200).json({
      success: true,
      message: 'OAuth callback received',
      code: code,
      state: state,
    });
  } else {
    // Redirect to GitHub OAuth authorization page
    const clientId = process.env.CMS_GITHUB_CLIENT_ID || 'your-github-client-id';
    const redirectUri = encodeURIComponent(
      process.env.OAUTH_REDIRECT_URI || 'https://eduacademy.pl/api/oauth'
    );
    const scope = 'repo';
    const state = Math.random().toString(36).substring(7);

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    res.redirect(authUrl);
  }
}
