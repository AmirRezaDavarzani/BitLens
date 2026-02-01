"use server";
import qs from "query-string";

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

/**
 * Optional: set COINGECKO_ENTERPRISE="true" if your plan supports forcing interval=hourly/5m.
 * For non-Enterprise, CoinGecko recommends omitting interval to use auto-granularity. :contentReference[oaicite:2]{index=2}
 */
const IS_ENTERPRISE = process.env.COINGECKO_ENTERPRISE === "true";

if (!BASE_URL) throw new Error("Could not get base url");
if (!API_KEY) throw new Error("Could not get api key");

function joinUrl(base: string, endpoint: string) {
  const b = base.replace(/\/+$/, "");
  const e = endpoint.replace(/^\/+/, "");
  return `${b}/${e}`;
}

function sanitizeParams(params?: QueryParams): QueryParams | undefined {
  if (!params) return params;

  // Make a shallow copy so we don't mutate the caller's object
  const safe: Record<string, unknown> = { ...(params as any) };

  // Sanitize "interval" if present.
  // Valid values for market chart endpoints are: "daily", "hourly", "5m". :contentReference[oaicite:3]{index=3}
  if (typeof safe.interval === "string") {
    const interval = safe.interval.trim();

    const isValid = interval === "daily" || interval === "hourly" || interval === "5m";

    if (!isValid) {
      // invalid interval => remove to avoid 400:invalid interval parameter
      delete safe.interval;
    } else {
      // "hourly" and "5m" are Enterprise-only overrides for market_chart / market_chart/range. :contentReference[oaicite:4]{index=4}
      if (!IS_ENTERPRISE && (interval === "hourly" || interval === "5m")) {
        delete safe.interval;
      } else {
        safe.interval = interval;
      }
    }
  }

  return safe as QueryParams;
}

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
): Promise<T> {
  const safeParams = sanitizeParams(params);

  const url = qs.stringifyUrl(
    {
      url: joinUrl(BASE_URL!, endpoint),
      query: safeParams,
    },
    {
      skipEmptyString: true,
      skipNull: true,
    },
  );

  // Helpful when debugging:
  // console.log("CoinGecko URL:", url);

  const response = await fetch(url, {
    headers: {
      // Keep your current header; change only if your plan/docs require a different header key.
      "x-cg-demo-api-key": API_KEY,
      "Content-Type": "application/json",
    } as Record<string, string>,
    next: { revalidate },
  });

  if (!response.ok) {
    const errorBody: CoinGeckoErrorBody = await response
      .json()
      .catch(() => ({}));

    throw new Error(
      `API Error: ${response.status}:${errorBody.error || response.statusText}`,
    );
  }

  return response.json();
}

export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null,
): Promise<PoolData> {
  const fallback: PoolData = {
    id: "",
    address: "",
    name: "",
    network: "",
  };

  if (network && contractAddress) {
    const poolData = await fetcher<{ data: PoolData[] }>(
      `/onchain/networks/${network}/tokens/${contractAddress}/pools`,
    );

    return poolData.data?.[0] ?? fallback;
  }

  try {
    const poolData = await fetcher<{ data: PoolData[] }>(
      "/onchain/search/pools",
      { query: id },
    );

    return poolData.data?.[0] ?? fallback;
  } catch {
    return fallback;
  }
}
