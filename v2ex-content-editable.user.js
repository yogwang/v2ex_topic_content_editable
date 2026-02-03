// ==UserScript==
// @name         V2EX 主题正文 Contenteditable 脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  在 v2ex 主题正文悬停时显示编辑按钮，点击后启用 contenteditable 属性，以调整文本排版便于阅读。
// @author       You
// @match        https://www.v2ex.com/t/*
// @match        https://v2ex.com/t/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const CONFIG = {
        // 正文容器选择器（按优先级尝试）
        contentSelectors: [
            '.topic_content',
            '#Main .box .inner',
            '.box .inner',
            '.topic_content .inner'
        ],
        // 按钮类名
        buttonClass: 'v2ex-edit-btn',
        // 编辑状态类名
        editingClass: 'v2ex-editing'
    };

    /**
     * 查找正文容器
     */
    function findContentContainer() {
        try {
            for (const selector of CONFIG.contentSelectors) {
                if (!selector || typeof selector !== 'string') {
                    continue;
                }
                const element = document.querySelector(selector);
                if (element && element.nodeType === Node.ELEMENT_NODE) {
                    return element;
                }
            }
        } catch (error) {
            console.error('[V2EX ContentEditable] 查找容器时出错:', error);
        }
        return null;
    }

    /**
     * 创建编辑按钮
     */
    function createEditButton() {
        try {
            const button = document.createElement('button');
            button.className = CONFIG.buttonClass;
            button.textContent = '编辑';
            button.type = 'button';
            button.setAttribute('aria-label', '编辑正文');
            return button;
        } catch (error) {
            console.error('[V2EX ContentEditable] 创建按钮时出错:', error);
            return null;
        }
    }

    /**
     * 添加按钮样式
     */
    function addStyles() {
        try {
            const styleId = 'v2ex-content-editable-styles';
            if (document.getElementById(styleId)) {
                return;
            }

            if (!document.head) {
                console.warn('[V2EX ContentEditable] document.head 不存在，等待 DOM 加载');
                return;
            }

            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
            .${CONFIG.buttonClass} {
                position: absolute;
                top: 8px;
                right: 8px;
                padding: 4px 12px;
                font-size: 12px;
                line-height: 1.5;
                color: #778087;
                background-color: #f5f5f5;
                border: 1px solid #e5e5e5;
                border-radius: 3px;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.2s ease-in-out, background-color 0.2s ease-in-out;
                z-index: 1000;
                pointer-events: none;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }

            .${CONFIG.buttonClass}:hover {
                background-color: #e8e8e8;
                color: #333;
            }

            .${CONFIG.buttonClass}.show {
                opacity: 1;
                pointer-events: auto;
            }

            .${CONFIG.buttonClass}.editing {
                background-color: #007fff;
                color: #fff;
                border-color: #007fff;
            }

            .${CONFIG.buttonClass}.editing:hover {
                background-color: #0066cc;
            }

            /* 确保容器有定位上下文 */
            .topic_content,
            #Main .box .inner,
            .box .inner {
                position: relative !important;
            }

            /* 编辑状态样式 */
            .${CONFIG.editingClass} {
                outline: 2px solid #007fff;
                outline-offset: 2px;
            }

            /* 暗色主题适配 */
            #Wrapper.Night .${CONFIG.buttonClass} {
                color: #b0b0b0;
                background-color: #2a2a2a;
                border-color: #404040;
            }

            #Wrapper.Night .${CONFIG.buttonClass}:hover {
                background-color: #3a3a3a;
                color: #fff;
            }
        `;
            document.head.appendChild(style);
        } catch (error) {
            console.error('[V2EX ContentEditable] 添加样式时出错:', error);
        }
    }

    /**
     * 初始化编辑功能
     */
    function initEditFeature(container) {
        // 参数验证
        if (!container || !container.nodeType || container.nodeType !== Node.ELEMENT_NODE) {
            console.error('[V2EX ContentEditable] 无效的容器元素');
            return;
        }

        // 检查是否已经初始化
        if (container.dataset.v2exEditInitialized === 'true') {
            return;
        }

        // 检查是否已存在按钮
        const existingButton = container.querySelector(`.${CONFIG.buttonClass}`);
        if (existingButton) {
            console.warn('[V2EX ContentEditable] 编辑按钮已存在，跳过初始化');
            return;
        }

        try {
            // 确保容器有定位上下文
            const computedStyle = window.getComputedStyle(container);
            if (computedStyle.position === 'static') {
                container.style.position = 'relative';
            }

            // 创建编辑按钮
            const editButton = createEditButton();
            if (!editButton) {
                console.error('[V2EX ContentEditable] 创建编辑按钮失败');
                return;
            }

            container.appendChild(editButton);

        let isEditing = false;
        let hideTimeout = null;

        /**
         * 显示按钮
         */
        function showButton() {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            if (!isEditing) {
                editButton.classList.add('show');
            }
        }

        /**
         * 隐藏按钮
         */
        function hideButton() {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }
            hideTimeout = setTimeout(() => {
                if (!isEditing) {
                    editButton.classList.remove('show');
                }
            }, 100);
        }

        /**
         * 启用编辑
         */
        function enableEditing() {
            if (isEditing) {
                return;
            }

            isEditing = true;
            container.contentEditable = 'true';
            container.classList.add(CONFIG.editingClass);
            editButton.textContent = '完成';
            editButton.classList.add('editing');
            editButton.classList.add('show');

            // 聚焦到容器
            container.focus();
        }

        /**
         * 禁用编辑
         */
        function disableEditing() {
            if (!isEditing) {
                return;
            }

            isEditing = false;
            container.contentEditable = 'false';
            container.classList.remove(CONFIG.editingClass);
            editButton.textContent = '编辑';
            editButton.classList.remove('editing');
        }

        // 悬停显示/隐藏按钮
        container.addEventListener('mouseenter', showButton);
        container.addEventListener('mouseleave', hideButton);

        // 按钮悬停时保持显示
        editButton.addEventListener('mouseenter', () => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            if (!isEditing) {
                editButton.classList.add('show');
            }
        });

        editButton.addEventListener('mouseleave', () => {
            if (!isEditing) {
                hideButton();
            }
        });

        // 点击按钮切换编辑状态
        editButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isEditing) {
                disableEditing();
                hideButton();
            } else {
                enableEditing();
            }
        });

            // 点击外部区域退出编辑（可选）
            document.addEventListener('click', (e) => {
                if (isEditing && !container.contains(e.target) && !editButton.contains(e.target)) {
                    disableEditing();
                    hideButton();
                }
            }, true);

            // 标记为已初始化
            container.dataset.v2exEditInitialized = 'true';
        } catch (error) {
            console.error('[V2EX ContentEditable] 初始化编辑功能时出错:', error);
        }
    }

    /**
     * 主函数
     */
    function main() {
        try {
            // 检查是否在正确的页面
            if (!window.location.href.match(/\/t\/\d+/)) {
                return;
            }

            // 添加样式
            addStyles();

            // 查找正文容器
            const container = findContentContainer();

            if (!container) {
                console.warn('[V2EX ContentEditable] 未找到正文容器，可能页面结构已更改');
                return;
            }

            // 初始化编辑功能
            initEditFeature(container);
        } catch (error) {
            console.error('[V2EX ContentEditable] 主函数执行出错:', error);
        }
    }

    // 执行主函数
    try {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', main);
        } else {
            // 使用 setTimeout 确保 DOM 完全加载
            setTimeout(main, 0);
        }
    } catch (error) {
        console.error('[V2EX ContentEditable] 脚本初始化出错:', error);
    }
})();
