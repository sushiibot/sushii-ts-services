import { Awaitable } from "discord.js";
import { EventEmitter } from "events";

type EventMap = Record<string, any>;

type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => Awaitable<void>;

interface Emitter<T extends EventMap> {
  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
  emit<K extends EventKey<T>>(eventName: K, ...params: T[K][]): void;
}

export class TypedEmitter<T extends EventMap> implements Emitter<T> {
  private emitter = new EventEmitter();

  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void {
    this.emitter.on(eventName, fn);
  }

  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void {
    this.emitter.off(eventName, fn);
  }

  emit<K extends EventKey<T>>(eventName: K, params: T[K]): void {
    this.emitter.emit(eventName, params);
  }
}
