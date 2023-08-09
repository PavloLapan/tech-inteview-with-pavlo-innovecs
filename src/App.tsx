// We need to implement search "engine" on client side

// Search engine requirements:
// 1. Search data source should be persisted, and should not be re-downloaded on each app load.
// 2. Each search request should be cached in order to prevent unnecessary search function invocation
// 3. Minimum string length to initiate search should be 2 symbols
// 4. Fields used to search: type, name (Model defined in components/Search.ts)
// 5. Result prioritization:
//   1. market
//   2. growing price: item value lastTradedPrevious should be closer to high value

//=====================================================================================================

// Display options:
// For the search input use simple input field
// for displaying search result show a list where each list item looks like below:
// Since the search results may be huge, we need to have some kind of optimization, please propose a solution

// #####################################################
// #          item name | market | price              #
// #####################################################

// Item name: ${name}_${type}
// Price: we should show lastTradedPrevious * lotSize, and it should be colored in:
//// red - if price is lower than lastTradedPrevious,
//// grey - if price the same,
//// green - if price higher than lastTradedPrevious

import Search from "./components/Search";

export default function App() {
  return (
      <div className="App">
        <Search />
      </div>
  );
}
