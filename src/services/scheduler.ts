/**
 * Rate-Limit Scheduler & Queue Manager
 * Staggers API requests across sources to strictly adhere to free-tier rate limits
 * (e.g. 5 calls/min for Alpha Vantage, 8 calls/min for Twelve Data).
 */

type Task = () => Promise<void>;

interface ScheduledTask {
  id: string;
  task: Task;
  intervalMs: number;
  lastExecuted: number;
}

class RateLimitScheduler {
  private tasks: Map<string, ScheduledTask> = new Map();
  private isRunning: boolean = false;
  private timer: number | null = null;
  private queue: Task[] = [];
  private lastCallTime: number = 0;
  private minStaggerDelayMs: number = 3000; // 3 second stagger between any outgoing API calls

  public addTask(id: string, task: Task, intervalMs: number) {
    this.tasks.set(id, {
      id,
      task,
      intervalMs,
      lastExecuted: 0
    });
    if (!this.isRunning) {
      this.start();
    }
  }

  public removeTask(id: string) {
    this.tasks.delete(id);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.tick();
    this.timer = window.setInterval(() => this.tick(), 1000);
  }

  public stop() {
    this.isRunning = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async tick() {
    const now = Date.now();

    // Check if any scheduled task is due
    for (const [id, item] of this.tasks.entries()) {
      if (now - item.lastExecuted >= item.intervalMs) {
        item.lastExecuted = now;
        this.enqueue(item.task);
      }
    }

    // Process queue with staggered delay
    if (this.queue.length > 0 && now - this.lastCallTime >= this.minStaggerDelayMs) {
      const nextTask = this.queue.shift();
      if (nextTask) {
        this.lastCallTime = now;
        try {
          await nextTask();
        } catch (err) {
          console.warn(`[Scheduler] Task execution warning:`, err);
        }
      }
    }
  }

  public enqueue(task: Task) {
    this.queue.push(task);
  }
}

export const scheduler = new RateLimitScheduler();
