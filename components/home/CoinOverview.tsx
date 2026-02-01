import { fetcher } from "@/lib/coingecko.action";
import React from "react";
import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";

const CoinOverview = async () => {
  let coin: CoinDetailsData | null = null;

  try {
    coin = await fetcher<CoinDetailsData>("/coins/bitcoin", {
      dex_pair_format: "symbol",
    });
  } catch (error) {
    console.error("CoinOverview fetch failed", error);
  }

  if (!coin) {
    return (
      <div id="coin-overview">
        <div className="header pt-2">
          <div className="info">
            <p>Bitcoin / BTC</p>
            <h1>Data unavailable</h1>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div id="coin-overview">
      <div className="header pt-2">
        <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
        <div className="info">
          <p>
            {coin.name} / {coin.symbol.toUpperCase()}
          </p>
          <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
        </div>
      </div>
    </div>
  );
};

export default CoinOverview;
