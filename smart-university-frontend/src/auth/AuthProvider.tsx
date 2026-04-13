import { createContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import keycloak from './keycloak';

export interface AuthContextValue {
  initialized: boolean;
  authenticated: boolean;
  token: string | undefined;
  username: string;
  sub: string;
  roles: string[];
  hasRole: (role: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  initialized: false,
  authenticated: false,
  token: undefined,
  username: '',
  sub: '',
  roles: [],
  hasRole: () => false,
  logout: () => {},
});

/** Extract roles from both realm_access and resource_access (client roles). */
function extractRoles(parsed: Record<string, unknown> | undefined): string[] {
  if (!parsed) return [];
  const realmRoles: string[] =
    (parsed.realm_access as { roles?: string[] })?.roles ?? [];
  const resourceAccess = parsed.resource_access as
    | Record<string, { roles?: string[] }>
    | undefined;
  const clientRoles: string[] = resourceAccess
    ? Object.values(resourceAccess).flatMap((c) => c.roles ?? [])
    : [];
  return [...new Set([...realmRoles, ...clientRoles])];
}

// Module-level flag — survives React StrictMode unmount/remount
// but resets on full page reload (which is what we want).
let initStarted = false;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [username, setUsername] = useState('');
  const [sub, setSub] = useState('');
  const [token, setToken] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const syncTokenState = useCallback(() => {
    const parsed = keycloak.tokenParsed as Record<string, unknown> | undefined;
    setToken(keycloak.token);
    setRoles(extractRoles(parsed));
    setUsername((parsed?.preferred_username as string) ?? '');
    setSub((parsed?.sub as string) ?? '');
  }, []);

  useEffect(() => {
    if (initStarted) {
      // StrictMode re-mount: if keycloak already authenticated, sync state
      if (keycloak.authenticated) {
        syncTokenState();
        setAuthenticated(true);
        setInitialized(true);
      }
      return;
    }
    initStarted = true;

    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).catch(() => keycloak.login());
    };

    keycloak
      .init({ onLoad: 'login-required', checkLoginIframe: false })
      .then((auth) => {
        if (auth) {
          syncTokenState();
          setAuthenticated(true);
        } else {
          setError('Keycloak returned auth=false. Redirecting to login…');
          keycloak.login();
          return;
        }
        setInitialized(true);
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[AuthProvider] init failed:', msg, err);
        setError(`Keycloak init error: ${msg}`);
        setInitialized(true);
      });
  }, [syncTokenState]);

  const hasRole = useCallback(
    (role: string) => roles.includes(role),
    [roles],
  );

  const logout = useCallback(() => {
    keycloak.logout();
  }, []);

  // Show error panel if Keycloak init failed
  if (error && !authenticated) {
    return (
      <div style={{ padding: 40, fontFamily: 'monospace', maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ color: 'red' }}>Keycloak Authentication Error</h2>
        <p style={{ background: '#fee', padding: 12, borderRadius: 8 }}>{error}</p>
        <h3>Debug Info</h3>
        <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 8, fontSize: 12, overflow: 'auto' }}>
{JSON.stringify({
  keycloakUrl: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  authenticated: keycloak.authenticated,
  hasToken: !!keycloak.token,
  tokenParsedKeys: keycloak.tokenParsed ? Object.keys(keycloak.tokenParsed) : null,
}, null, 2)}
        </pre>
        <button
          onClick={() => keycloak.login()}
          style={{ marginTop: 12, padding: '8px 24px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          Try Login Again
        </button>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        initialized,
        authenticated,
        token,
        username,
        sub,
        roles,
        hasRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
