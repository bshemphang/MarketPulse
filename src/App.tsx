import React, { useState, useEffect, useCallback } from 'react';
import { AssetPrice, NewsItem, AssetCategory, ViewMode, PortfolioItem, WalletState } from './types';
import { MarketApiService, DEFAULT_ASSETS } from './services/marketApi';
import { NewsApiService, INITIAL_NEWS } from './services/newsApi';
import { binanceWs } from './services/binanceWs';
import { generateConfluenceSignal } from './services/indicators';
import { StorageService } from './services/storage';
import { scheduler } from './services/scheduler';
import { walletService } from './services/walletService';

import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { NewsFeed } from './components/dashboard/NewsFeed';
import { DigestMode } from './components/dashboard/DigestMode';
import { ChartPanel } from './components/dashboard/ChartPanel';
import { SignalsPanel } from './components/dashboard/SignalsPanel';
import { Watchlist } from './components/dashboard/Watchlist';
import { PortfolioTracker } from './components/dashboard/PortfolioTracker';

import { FearGreedWidget } from './components/widgets/FearGreed';
import { EconomicCalendarWidget } from './components/widgets/EconomicCalendar';
import { TopMoversWidget } from './components/widgets/TopMovers';
import { HeatmapWidget } from './components/widgets/Heatmap';

import { WalletBar } from './components/trading/WalletBar';
import { DexSwapModule } from './components/trading/DexSwapModule';

import { DisclaimersModal } from './components/modals/DisclaimersModal';
import { AboutModal } from './components/modals/AboutModal';
import { SearchModal } from './components/modals/SearchModal';
import { IndicatorModal } from './components/modals/IndicatorModal';
import { TradingDisclaimerModal } from './components/modals/TradingDisclaimerModal';

export const App: React.FC = () => {
  // Core State
  const [assets, setAssets] = useState<AssetPrice[]>(DEFAULT_ASSETS);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC');
  const [activeCategory, setActiveCategory] = useState<AssetCategory | 'All'>('All');
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');

  const [watchlist, setWatchlist] = useState<string[]>(() => StorageService.getWatchlist());
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => StorageService.getPortfolio());

  // Spec v1.1 Trading Mode State (Feature Flagged, OFF by default)
  const [isTradingEnabled, setIsTradingEnabled] = useState<boolean>(false);
  const [walletState, setWalletState] = useState<WalletState>(() => walletService.getState());
  const [isTradingDisclaimerOpen, setIsTradingDisclaimerOpen] = useState<boolean>(false);

  // Modals
  const [isDisclaimersOpen, setIsDisclaimersOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMathModalOpen, setIsMathModalOpen] = useState(false);

  // Settings
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState<'EN' | 'ES'>('EN');
  const [lastPricesUpdate, setLastPricesUpdate] = useState<number>(Date.now());
  const [lastNewsUpdate, setLastNewsUpdate] = useState<number>(Date.now());

  // Subscribe to Wallet Service
  useEffect(() => {
    const unsubscribe = walletService.subscribe(setWalletState);
    return () => { unsubscribe(); };
  }, []);

  // 1. Connect Binance WebSocket for zero-latency streaming on Crypto assets
  useEffect(() => {
    binanceWs.connect((symbol, price, change24h) => {
      setAssets((prev) =>
        prev.map((a) => {
          if (a.symbol === symbol) {
            const oldSparkline = [...a.sparkline];
            oldSparkline.shift();
            oldSparkline.push(price);
            return {
              ...a,
              price,
              change24h,
              sparkline: oldSparkline,
              lastUpdated: Date.now(),
              source: 'Binance WS',
              isStale: false
            };
          }
          return a;
        })
      );
    });

    return () => {
      binanceWs.disconnect();
    };
  }, []);

  // 2. Schedule REST polling for Stocks, Forex & Metals (XAU/USD, XAG/USD)
  const updatePrices = useCallback(async () => {
    const updated = await MarketApiService.fetchPrices();
    setAssets(updated);
    setLastPricesUpdate(Date.now());
  }, []);

  const updateNews = useCallback(async () => {
    const updated = await NewsApiService.fetchNews(activeCategory);
    setNews(updated);
    setLastNewsUpdate(Date.now());
  }, [activeCategory]);

  useEffect(() => {
    scheduler.addTask('prices_poll', updatePrices, 25000);
    scheduler.addTask('news_poll', updateNews, 45000);
    return () => {
      scheduler.removeTask('prices_poll');
      scheduler.removeTask('news_poll');
    };
  }, [updatePrices, updateNews]);

  // Handle Feature-Flag Trading Toggle
  const handleToggleTrading = () => {
    if (!isTradingEnabled) {
      // Show opt-in disclosure modal first
      setIsTradingDisclaimerOpen(true);
    } else {
      setIsTradingEnabled(false);
      if (activeView === 'trading') setActiveView('dashboard');
    }
  };

  const confirmEnableTrading = () => {
    setIsTradingEnabled(true);
    setIsTradingDisclaimerOpen(false);
    setActiveView('trading');
  };

  // Compute live confluence signal for selected asset
  const currentAsset = assets.find((a) => a.symbol === selectedSymbol) || assets[0];
  const relatedNews = news.filter((n) => n.relatedSymbols.includes(selectedSymbol));
  const avgSentiment = relatedNews.length > 0
    ? relatedNews.reduce((acc, n) => acc + n.sentimentScore, 0) / relatedNews.length
    : 0.2;

  const currentSignal = generateConfluenceSignal(
    currentAsset.symbol,
    currentAsset.category,
    currentAsset.price,
    currentAsset.sparkline,
    avgSentiment
  );

  // Filter assets based on navbar category selection
  const filteredAssets = activeCategory === 'All'
    ? assets
    : assets.filter((a) => a.category === activeCategory);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#0a0d14]' : 'bg-slate-100'} text-slate-100 font-sans`}>
      
      {/* Top Header */}
      <Header
        assets={assets}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenDisclaimers={() => setIsDisclaimersOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        lang={lang}
        setLang={setLang}
        isTradingEnabled={isTradingEnabled}
        onToggleTrading={handleToggleTrading}
      />

      {/* Navigation Bar */}
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        activeView={activeView}
        setActiveView={setActiveView}
        isTradingEnabled={isTradingEnabled}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Spec v1.1 Wallet Status Bar (Visible in Trading Mode) */}
        {isTradingEnabled && (
          <WalletBar
            walletState={walletState}
            onConnectEVM={() => walletService.connectEVM('okx')}
            onConnectSolana={() => walletService.connectSolana()}
            onDisconnect={() => walletService.disconnect()}
            onSwitchChain={(chainId) => walletService.switchChain(chainId)}
          />
        )}

        {/* View Mode Switching */}
        {activeView === 'trading' && isTradingEnabled ? (
          <DexSwapModule
            walletState={walletState}
            onConnectWallet={() => walletService.connectEVM('okx')}
          />
        ) : activeView === 'digest' ? (
          <DigestMode
            news={news}
            assets={assets}
            onBack={() => setActiveView('dashboard')}
          />
        ) : activeView === 'portfolio' ? (
          <PortfolioTracker
            assets={assets}
            portfolio={portfolio}
            setPortfolio={setPortfolio}
          />
        ) : activeView === 'news' ? (
          <NewsFeed
            news={news}
            categoryFilter={activeCategory}
            setCategoryFilter={setActiveCategory}
            lastUpdated={lastNewsUpdate}
            onOpenDigest={() => setActiveView('digest')}
          />
        ) : activeView === 'charts' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartPanel
                assets={filteredAssets}
                selectedSymbol={selectedSymbol}
                setSelectedSymbol={setSelectedSymbol}
              />
            </div>
            <div>
              <SignalsPanel
                signal={currentSignal}
                onOpenMathModal={() => setIsMathModalOpen(true)}
              />
            </div>
          </div>
        ) : (
          /* Dashboard Overview Mode */
          <div className="space-y-6">
            
            {/* Top Row: Interactive Chart & Signals Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ChartPanel
                  assets={filteredAssets}
                  selectedSymbol={selectedSymbol}
                  setSelectedSymbol={setSelectedSymbol}
                />
              </div>

              <div className="space-y-6">
                <SignalsPanel
                  signal={currentSignal}
                  onOpenMathModal={() => setIsMathModalOpen(true)}
                />
                <Watchlist
                  assets={assets}
                  watchlist={watchlist}
                  setWatchlist={setWatchlist}
                  selectedSymbol={selectedSymbol}
                  onSelectSymbol={setSelectedSymbol}
                />
              </div>
            </div>

            {/* Middle Row: Live News Feed */}
            <NewsFeed
              news={news}
              categoryFilter={activeCategory}
              setCategoryFilter={setActiveCategory}
              lastUpdated={lastNewsUpdate}
              onOpenDigest={() => setActiveView('digest')}
            />

            {/* Cross-Asset Volatility Heatmap */}
            <HeatmapWidget
              assets={filteredAssets}
              onSelectSymbol={setSelectedSymbol}
            />

            {/* Bottom Row Market Context Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FearGreedWidget />
              <EconomicCalendarWidget />
              <TopMoversWidget
                assets={assets}
                onSelectSymbol={setSelectedSymbol}
              />
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <Footer
        onOpenDisclaimers={() => setIsDisclaimersOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Modals */}
      <DisclaimersModal
        isOpen={isDisclaimersOpen}
        onClose={() => setIsDisclaimersOpen(false)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        assets={assets}
        news={news}
        onSelectAsset={setSelectedSymbol}
      />

      <IndicatorModal
        isOpen={isMathModalOpen}
        onClose={() => setIsMathModalOpen(false)}
        indicators={currentSignal.indicators}
        symbol={selectedSymbol}
      />

      <TradingDisclaimerModal
        isOpen={isTradingDisclaimerOpen}
        onClose={() => setIsTradingDisclaimerOpen(false)}
        onConfirmEnable={confirmEnableTrading}
      />

    </div>
  );
};

export default App;
