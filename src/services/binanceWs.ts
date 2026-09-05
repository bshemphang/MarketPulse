/**
 * Real-Time Binance WebSocket Stream for Crypto Assets
 * Provides zero-latency public WebSocket updates for crypto pairs.
 */

type PriceCallback = (symbol: string, price: number, change24h: number) => void;

class BinanceWsManager {
  private ws: WebSocket | null = null;
  private callbacks: Set<PriceCallback> = new Set();
  private isConnected: boolean = false;
  private reconnectTimer: number | null = null;

  // Stream symbols for Binance public websocket
  private streams = ['btcusdt@ticker', 'ethusdt@ticker', 'solusdt@ticker', 'bnbusdt@ticker', 'xrpusdt@ticker', 'adausdt@ticker', 'dogeusdt@ticker'];

  public connect(onPriceUpdate: PriceCallback) {
    this.callbacks.add(onPriceUpdate);

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const url = `wss://stream.binance.com:9443/ws/${this.streams.join('/')}`;
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('[Binance WS] Connected to public streaming endpoint');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.s && data.c) {
            // Transform e.g. "BTCUSDT" -> "BTC"
            const rawSymbol = data.s.replace('USDT', '');
            const price = parseFloat(data.c);
            const change24h = parseFloat(data.P);

            for (const cb of this.callbacks) {
              cb(rawSymbol, price, change24h);
            }
          }
        } catch (err) {
          // Silent JSON parse error handling
        }
      };

      this.ws.onerror = (err) => {
        console.warn('[Binance WS] Stream error:', err);
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        // Reconnect after 5s
        if (!this.reconnectTimer) {
          this.reconnectTimer = window.setTimeout(() => {
            this.reconnectTimer = null;
            this.connect(onPriceUpdate);
          }, 5000);
        }
      };
    } catch (e) {
      console.warn('[Binance WS] Connection failed:', e);
    }
  }

  public disconnect(cb?: PriceCallback) {
    if (cb) {
      this.callbacks.delete(cb);
    }
    if (this.callbacks.size === 0 && this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const binanceWs = new BinanceWsManager();
