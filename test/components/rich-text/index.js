/**
* @license
* Copyright Baidu Inc. All Rights Reserved.
*
* This source code is licensed under the Apache License, Version 2.0; found in the
* LICENSE file in the root directory of this source tree.
*/

/**
 * @file rich-text组件单测
 * @author yanghuabei@baidu.com
 */

import RichText from '../../../src/rich-text';
import buildComponent from '../../mock/swan-core/build-component';
import componentBaseFieldCheck from '../../utils/component-base-field-check';
import attach2Document from '../../utils/attach-to-document';

const COMPONENT_NAME = 'rich-text';

/* eslint-disable max-nested-callbacks */
describe(`component [${COMPONENT_NAME}]`, () => {
    describe('base feature', () => {
        const component = buildComponent(COMPONENT_NAME, RichText);
        const $component = attach2Document(component);
        componentBaseFieldCheck(COMPONENT_NAME, component);
        it('should be rendered after attach', () => {
            const $swanMain = $component.querySelector('swan-rich-text');
            expect($swanMain).not.toBe(null);
        });

        describe('default props', () => {
            it('default value of nodes should be []', () => {
                const actual = component.data.get('nodes');
                const expected = [];
                expect(actual.length).toBe(expected.length);
            });
        });

        describe('verify prop nodes', () => {
            const createRichText = options => buildComponent(COMPONENT_NAME, RichText, options);
            const render = richText => {
                const dom = attach2Document(richText);
                richText.slaveRendered();
                return dom;
            };

            it('should render string nodes properly', () => {
                const component = createRichText({
                    data: {nodes: '<div>Hello world!</div>'}
                });
                const main = render(component);
                const $swanMain = main.querySelector('swan-rich-text');
                const richContent = $swanMain.firstChild;
                const contrasts = [
                    ['div', richContent.tagName.toLowerCase()],
                    ['Hello world!', richContent.innerText]
                ];
                contrasts.forEach(([expected, actual]) => expect(actual).toBe(expected));
            });

            it('untrusted node should be filterd', () => {
                const component = createRichText({
                    data: {
                        nodes: [
                            {
                                type: 'node',
                                name: 'div',
                                children: [
                                    {
                                        type: 'text',
                                        text: 'Hello world!'
                                    }
                                ]
                            },
                            {
                                type: 'node',
                                name: 'iframe'
                            },
                            {
                                type: 'node',
                                name: 'video'
                            },
                            {
                                type: 'node',
                                name: 'xxxx'
                            }
                        ]
                    }
                });
                const main = render(component);
                const $swanMain = main.querySelector('swan-rich-text');
                const richContent = $swanMain.children;
                const actual = richContent.length;
                const expected = 1;
                expect(actual).toBe(expected);
            });
        });
    });
});
