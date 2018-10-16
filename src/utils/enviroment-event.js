/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * @file enviromentEvent.js 封装宿主上下文派发的事件信息(宿主可能为webview或者原声rootview，此处为先手，
 *                          切换底层时候，切换enviroment即可)
 * @author houyu(houyu01@baidu.com)
 */
import EventsEmitter from '@baidu/events-emitter';

const global = window;

const getWindowHeight = () => {
    return 'CSS1Compat' === document.compatMode ? document.documentElement.clientHeight : document.body.clientHeight;
};

const getScrollHeight = () => {
    const bodyScrollHeight = document.body.scrollHeight;
    const elementScrollHeight = document.documentElement.scrollHeight;
    return Math.max(bodyScrollHeight, elementScrollHeight);
};

export default class EnviromentEvent {

    constructor(params = {}) {
        this.params = params;
        this.communicator = new EventsEmitter();
    }

    enviromentEventMap = [
        {
            type: 'scroll',
            called: false,
            handler() {
                global.addEventListener('scroll', event => {
                    this.communicator.fireMessage({
                        type: 'scroll',
                        event: {
                            scrollTop: global.scrollY
                        }
                    });
                });
            }
        },
        {
            type: 'reachBottom',
            called: false,
            buttonReached: false,
            handler({onReachBottomDistance = 0}, eventItem) {
                this.enviromentListen('scroll', event => {
                    const bottomDistance = getScrollHeight() - global.scrollY - getWindowHeight();
                    if (!eventItem.buttonReached
                       && bottomDistance <= onReachBottomDistance
                    ) {
                        this.communicator.fireMessage({
                            type: 'reachBottom',
                            event
                        });
                        eventItem.buttonReached = true;
                    }
                    else if (bottomDistance > onReachBottomDistance) {
                        eventItem.buttonReached = false;
                    }
                });
            }
        }
    ];

    enviromentListen(type, callback, params) {
        // 懒执行，第一次有人调用的时候，再开始监听，且只监听一次，也就是说，性能消耗的操作，不会重复执行
        const mergedParams = {...this.params, ...params};
        this.enviromentEventMap
        .filter(eventItem => eventItem.type === type && !eventItem.called)
        .forEach(eventItem => {
            eventItem.handler.call(this, mergedParams, eventItem);
        });
        // 具体的事件监听，当事件派发的时候，会放入事件队列
        this.communicator.onMessage(type, callback);
        return this;
    }
}
