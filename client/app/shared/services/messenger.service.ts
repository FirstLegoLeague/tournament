import {Injectable, OnInit} from '@angular/core';
import {ConfigService} from "./config.service";
import {of} from "rxjs";
import {LoggerService} from "./logger.service";

const MESSAGE_TYPES = {
    SUBSCRIBE: 'subscribe',
    LOGIN: 'login',
    PUBLISH: 'publish'
}
const IDENTITY_TOKEN_KEY = 'client-id'
const DEFAULT_NODE = 'default'
const RETRY_TIMOUT = 10000

@Injectable({
    providedIn: 'root'
})
export class MessengerService implements OnInit {

    private open: boolean = false;
    private listeners = [];

    private ws: WebSocket;
    private node: string;
    private token: number;

    constructor(private config: ConfigService, private logger: LoggerService) {
    }

    ngOnInit(): void {
        this.init();
    }

    init() {
        if (this.open) {
            return of(this.ws);
        }

        return this.config.get().subscribe(config => {
            this.ws = new WebSocket(config.mhubUri);
            this.node = DEFAULT_NODE || config.mhunNode;
            this.token = parseInt(String(Math.floor(0x100000 * (Math.random()))), 16);

            this.ws.onopen = () => {
                setTimeout(() => {
                    this.ws.send(JSON.stringify({
                        type: MESSAGE_TYPES.SUBSCRIBE,
                        node: this.node
                    }))
                }, 0);
                this.open = true;
                this.logger.info("Client connected to mhub")
                return of(this.ws)
            }

            this.ws.onclose = () => {
                this.open = false;
                this.logger.info("Client disconnected from mhub")
                setTimeout(() => {
                    this.logger.info("Retrying mhub connection")
                    this.init()
                }, RETRY_TIMOUT)
            }

            this.ws.onmessage = (msg: any) => {
                let data = JSON.parse(msg.data)
                let headers = data.headers
                let topic = data.topic

                msg.from = headers[IDENTITY_TOKEN_KEY]
                msg.fromMe = (msg.from === this.token)

                this.listeners.filter(listener => {
                    return (typeof(listener.topic) === 'string' && topic === listener.topic) ||
                        (listener.topic instanceof RegExp && topic.matches(listener.topic))
                }).forEach(listener => listener.handler(data, msg))
            }

        });
    }

    on(topic, handler, ignoreSelfMessages = true) {
        this.listeners.push({
            topic: topic,
            handler: (data, msg) => {
                if (!(msg.fromMe && ignoreSelfMessages))
                    handler(data, msg)
            }
        })

        return this.init()
    }

}
