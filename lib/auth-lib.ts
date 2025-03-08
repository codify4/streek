import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectTo = makeRedirectUri({
  scheme: 'streek',
  path: 'sign-in',
  preferLocalhost: false,
});

export const createSessionFromUrl = async (url: string) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);
  
    if (errorCode) throw new Error(errorCode);
    const { access_token, refresh_token } = params;
  
    if (!access_token) return;
  
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) throw error;
    
    // The navigation will be handled by the auth state change in _layout.tsx
    return data.session;
};

export const performOAuth = async () => {
    try {
      console.log("Starting OAuth flow with redirectTo:", redirectTo);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });
      
      if (error) {
        console.error("Supabase OAuth error:", error);
        throw error;
      }
      
      console.log("Opening browser with URL:", data?.url);
      
      const res = await WebBrowser.openAuthSessionAsync(
        data?.url ?? "",
        redirectTo
      );
      
      console.log("Browser result:", res);
      
      if (res.type === "success") {
        const { url } = res;
        console.log("Success URL:", url);
        await createSessionFromUrl(url);
      } else {
        console.log("Auth was dismissed or failed:", res.type);
      }
    } catch (error) {
      console.error("OAuth process error:", error);
      throw error;
    }
};

export async function signOut() {
    const { error } = await supabase.auth.signOut()
}