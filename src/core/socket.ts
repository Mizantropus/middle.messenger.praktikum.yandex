export default abstract class Socket {

  protected url: string;
  protected socket: WebSocket | null = null;
  private ping_interval: number | null = null;

  constructor(user_id: number, chat_id: number, token: string) {
    this.url = `wss://ya-praktikum.tech/ws/chats/${user_id}/${chat_id}/${token}`;
    this._connect();
  }

  abstract on_message(event: MessageEvent): void;

  protected on_open(): void {}

  protected on_close(_event: CloseEvent): void {}

  protected on_error(_event: Event): void {}

  private async _connect(): Promise<void> {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return;
    return new Promise((resolve, reject) => {
      let resolved = false;
      const cleanup = () => {
        if (!this.socket) return;
        this.socket.removeEventListener("open", onOpen);
        this.socket.removeEventListener("close", onClose);
        this.socket.removeEventListener("message", onMessage);
        this.socket.removeEventListener("error", onError);
      };
      const onOpen = () => {
        if (resolved) return;
        resolved = true;
        this.on_open();
        this.start_ping();
        resolve();
      };
      const onClose = (event: CloseEvent) => {
        if (event.wasClean) {
          console.debug("Соединение закрыто чисто");
        } else {
          console.debug("Обрыв соединения");
        }
        this.on_close(event);
        this.socket = null;
        this.stop_ping();
      };
      const onMessage = (event: MessageEvent) => {
        this.on_message(event);
      };
      const onError = (event: Event) => {
        if (resolved) return;
        resolved = true;
        cleanup();
        this.on_error(event);
        reject(new Error("Ошибка вебсокета"));
      };
      try {
        if (this.socket) {
          cleanup();
          this.socket.close();
        }
        this.socket = new WebSocket(this.url);
        this.socket.addEventListener("open", onOpen);
        this.socket.addEventListener("close", onClose);
        this.socket.addEventListener("message", onMessage);
        this.socket.addEventListener("error", onError);
      } catch (err) {
        if (!resolved) {
          resolved = true;
          reject(err);
        }
      }
    });
  }

  public async waitUntilOpen(timeoutMs: number = 5000): Promise<void> {
    const interval = 100;
    const start = Date.now();
    while (!this.is_connected()) {
      if (Date.now() - start > timeoutMs) {
        throw new Error("Сокет не открылся за отведённое время");
      }
      await new Promise(res => setTimeout(res, interval));
    }
  }

  public send_message(message: string, type: string = "message"): void {
    if (!this.socket) {
      throw new Error("Сокет не открыт");
    } else if (this.socket.readyState !== WebSocket.OPEN) {
      this.close();
      this._connect();
    }
    this.socket.send(JSON.stringify({
      content: message,
      type
    }));
  }

  public is_connected(): boolean {
    return !!this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.stop_ping();
    }
  }

  public async reconnect(): Promise<void> {
    this.close();
    this._connect();
  }

  private async _ping(): Promise<void> {
    if (!this.socket) return;
    if (this.is_connected()) {
      this.send_message("", "ping");
    } else {
      this.stop_ping();
      this.close();
      await this._connect();
    }
  }

  public start_ping(interval_ms: number = 10000): void {
    if (this.ping_interval) return;
    this.ping_interval = window.setInterval(() => this._ping(), interval_ms);
  }

  public stop_ping(): void {
    if (this.ping_interval) {
      clearInterval(this.ping_interval);
      this.ping_interval = null;
    }
  }

}
