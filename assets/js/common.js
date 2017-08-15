/**
 * 公共组件注入脚本
 * 为所有页面：
 *   1. 动态加载 CSS（style.css + prism.css）
 *   2. 注入导航栏和页脚
 *   3. 处理导航栏滚动阴影
 *   4. 读取 <meta> 渲染文章页头部元信息
 *   5. 动态加载 prism.js
 */
(function () {
  'use strict';

  // 根据当前页面位置计算资源根路径
  // 根目录页面（如 index.html）使用 '.'，posts/ 下的页面使用 '..'
  var basePath = window.location.pathname.indexOf('/posts/') !== -1 ? '..' : '.';

  // --- 1. 动态加载 CSS ---
  var cssFiles = [
    basePath + '/assets/css/style.css',
    basePath + '/assets/css/prism.css'
  ];

  cssFiles.forEach(function (href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  });

  // --- 2. 等待 CSS 加载完成后注入 DOM 组件 ---
  function initComponents() {
    // --- 导航栏 HTML ---
    var navHTML =
      '<nav class="site-nav" id="siteNav">' +
        '<div class="nav-inner">' +
          '<a href="' + basePath + '/" class="nav-brand">HoEndo 的技术博客</a>' +
        '</div>' +
      '</nav>';

    // --- 页脚 HTML ---
    var footerHTML =
      '<footer class="site-footer">' +
        '<p>&copy; 2026 HoEndo &middot; Powered by <a href="https://pages.github.com" target="_blank" rel="noopener">GitHub Pages</a></p>' +
      '</footer>';

    // --- 注入导航栏到 body 最前面 ---
    var body = document.body;
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = navHTML;
    var nav = tempDiv.firstChild;
    body.insertBefore(nav, body.firstChild);

    // --- 注入页脚到 body 最后面 ---
    tempDiv.innerHTML = footerHTML;
    var footer = tempDiv.firstChild;
    body.appendChild(footer);

    // --- 导航栏滚动阴影 ---
    var siteNav = document.getElementById('siteNav');
    if (siteNav) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 10) {
          siteNav.classList.add('scrolled');
        } else {
          siteNav.classList.remove('scrolled');
        }
      });
    }

    // --- 文章页：从 meta 标签读取信息，包裹在 <main> 中 ---
    var articleDate = document.querySelector('meta[name="article-date"]');
    var articleTags = document.querySelector('meta[name="article-tags"]');

    if (articleDate || articleTags) {
      var article = document.querySelector('.post-content');
      if (article) {
        // 文章标题取自 <article> 内的第一个 <h1>
        var title = article.querySelector('h1');
        var titleText = title ? title.textContent : '';
        if (title) {
          title.style.display = 'none';
        }

        // 构建文章头部 HTML
        var headerHTML = '<div class="post-header">';
        if (titleText) {
          headerHTML += '<h1>' + titleText + '</h1>';
        }
        headerHTML += '<div class="post-meta">';
        if (articleDate) {
          headerHTML += '<span class="post-date">' + articleDate.getAttribute('content') + '</span>';
        }
        if (articleTags) {
          var tags = articleTags.getAttribute('content').split(',').map(function (t) { return t.trim(); });
          headerHTML += '<ul class="post-tags">';
          tags.forEach(function (tag) {
            if (tag) { headerHTML += '<li>' + tag + '</li>'; }
          });
          headerHTML += '</ul>';
        }
        headerHTML += '</div></div>';

        // --- 用 <main> 包裹文章页的全部内容 ---
        var main = document.createElement('main');
        main.innerHTML = headerHTML;

        // 将 article 移入 <main>
        article.parentNode.insertBefore(main, article);
        main.appendChild(article);

        // --- 添加返回链接 ---
        var backLink = document.createElement('a');
        backLink.href = basePath + '/';
        backLink.className = 'back-link';
        backLink.innerHTML = '&larr; 返回文章列表';
        main.appendChild(backLink);
      }
    }
  }

  // --- 3. 动态加载 prism.js ---
  function loadPrismJS(callback) {
    var script = document.createElement('script');
    script.src = basePath + '/assets/js/prism.js';
    script.onload = callback;
    document.body.appendChild(script);
  }

  // --- 启动流程 ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initComponents();
      loadPrismJS(function () {
        // prism.js 加载完成后触发高亮
        if (typeof Prism !== 'undefined' && Prism.highlightAll) {
          Prism.highlightAll();
        }
      });
    });
  } else {
    // DOM 已经就绪
    initComponents();
    loadPrismJS(function () {
      if (typeof Prism !== 'undefined' && Prism.highlightAll) {
        Prism.highlightAll();
      }
    });
  }
})();
