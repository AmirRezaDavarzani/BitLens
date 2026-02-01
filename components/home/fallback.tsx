import React from "react";
import DataTable from "@/components/DataTable";

const trendingRows = Array.from({ length: 6 }, (_, index) => ({ id: index }));

const trendingColumns: DataTableColumn<{ id: number }>[] = [
  {
    header: "Name",
    cell: () => (
      <div className="name-cell">
        <div className="name-link">
          <div className="skeleton name-image" />
          <div className="skeleton name-line" />
        </div>
      </div>
    ),
  },
  {
    header: "24h Price Change",
    cell: () => (
      <div className="change-cell">
        <div className="price-change">
          <div className="skeleton change-icon" />
          <div className="skeleton change-line" />
        </div>
      </div>
    ),
  },
  {
    header: "Price",
    cell: () => (
      <div className="price-cell">
        <div className="skeleton price-line" />
      </div>
    ),
  },
];

const CoinOverviewFallback = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <div className="skeleton header-image" />
        <div className="info">
          <div className="skeleton header-line-sm" />
          <div className="skeleton header-line-lg" />
        </div>
      </div>
      <div className="flex gap-2 md:gap-3 px-2 pb-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={`period-${index}`}
            className="skeleton period-button-skeleton"
          />
        ))}
      </div>
      <div className="chart px-2 pb-4">
        <div className="skeleton chart-skeleton" />
      </div>
    </div>
  );
};

const TrendingCoinsFallback = () => {
  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <div>
        <DataTable
          data={trendingRows}
          columns={trendingColumns}
          rowKey={(row) => row.id}
          tableClassName="trending-coins-table"
          headerCellClassName="py-3!"
          bodyCellClassName="py-2!"
        />
      </div>
    </div>
  );
};

export { CoinOverviewFallback, TrendingCoinsFallback };
