/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * @file DOM测量相关函数
 * @author houyu(houyu01@baidu.com)
 */
const global = window;
export const getElementBox = el => {
    const boxRect = el.getBoundingClientRect();
    const elementStyle = global.getComputedStyle(el);
    const topWidth = parseFloat(elementStyle.getPropertyValue('border-top-width'));
    const bottomWidth = parseFloat(elementStyle.getPropertyValue('border-bottom-width'));
    const leftWidth = parseFloat(elementStyle.getPropertyValue('border-left-width'));
    const rightWidth = parseFloat(elementStyle.getPropertyValue('border-right-width'));
    return {
        top: boxRect.top + global.scrollY + topWidth + '',
        left: boxRect.left + global.scrollX + leftWidth + '',
        width: el.offsetWidth - leftWidth - rightWidth + '',
        height: el.offsetHeight - topWidth - bottomWidth + ''
    };
};
