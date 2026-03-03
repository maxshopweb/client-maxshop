import { getConfigTiendaServer } from "@/app/lib/serverConfig";
import CheckoutResultView from "./CheckoutResultView";

export const dynamic = "force-dynamic";

export default async function CheckoutResultPage() {
  const config = await getConfigTiendaServer();
  return <CheckoutResultView initialConfig={config} />;
}
