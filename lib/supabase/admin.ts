import { createSupabaseServerClient } from "./server";

export async function getReviewAdminClient() {
  const client = await createSupabaseServerClient();
  if (!client) return null;

  const { data, error } = await client.auth.getClaims();
  if (error || !data || typeof data.claims.sub !== "string") return null;

  const { data: admin, error: adminError } = await client
    .from("review_admins")
    .select("user_id")
    .eq("user_id", data.claims.sub)
    .maybeSingle();

  if (adminError || !admin) return null;
  return client;
}