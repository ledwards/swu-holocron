import React, {useContext, useState, useRef, useCallback, useEffect, useImperativeHandle, forwardRef} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';
import ThemeContext from '../../contexts/ThemeContext';
import {Theme} from '../../types/interfaces';
import layout from '../../constants/layout';

export interface RulesScreenRef {
  performSearch: (query: string) => void;
  navigateNext: () => void;
  navigatePrev: () => void;
  getSearchResults: () => { current: number; total: number };
}

interface RulesScreenProps {
  onSearchResultsChange?: (results: { current: number; total: number }) => void;
}

const RulesScreen = forwardRef<RulesScreenRef, RulesScreenProps>(({ onSearchResultsChange }, ref) => {
  const themeContext = useContext(ThemeContext);
  const [searchResults, setSearchResults] = useState({ current: 0, total: 0 });
  const webViewRef = useRef<WebView>(null);
  
  // Navigation functions for search results
  const navigateToNextResult = useCallback(() => {
    webViewRef.current?.injectJavaScript(`
      if (window.searchNext) {
        window.searchNext();
      }
      true;
    `);
  }, []);

  const navigateToPrevResult = useCallback(() => {
    webViewRef.current?.injectJavaScript(`
      if (window.searchPrev) {
        window.searchPrev();
      }
      true;
    `);
  }, []);
  
  const theme: Theme = themeContext || {
    name: 'dark',
    backgroundColor: '#000000',
    foregroundColor: '#FFFFFF',
    dividerColor: '#444444',
    translucentBackgroundColor: 'rgba(0,0,0,0.5)',
  };

  const pdfUrl = 'https://cdn.starwarsunlimited.com//SWH_Comp_Rules_4_0_1_67fd04599a.pdf';
  const headerHeight = layout.nativeHeaderHeight();

  const performSearch = useCallback((text: string) => {
    if (text.length > 0) {
      webViewRef.current?.injectJavaScript(`
        if (window.performSearch) {
          window.performSearch('${text.replace(/'/g, "\\'")}');
        }
        true;
      `);
    } else {
      setSearchResults({ current: 0, total: 0 });
      webViewRef.current?.injectJavaScript(`
        if (window.clearSearch) {
          window.clearSearch();
        }
        true;
      `);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    performSearch,
    navigateNext: navigateToNextResult,
    navigatePrev: navigateToPrevResult,
    getSearchResults: () => searchResults,
  }), [performSearch, navigateToNextResult, navigateToPrevResult, searchResults]);



  // Create the HTML content with the PDF URL
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>PDF Viewer</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf_viewer.min.css">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #000;
                color: #fff;
                overflow: hidden;
                height: 100vh;
                display: flex;
                flex-direction: column;

            }
            
            #toolbar {
                background: #1a1a1a;
                padding: 8px;
                display: flex;
                align-items: center;
                gap: 10px;
                border-bottom: 1px solid #333;
                flex-shrink: 0;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }

            #toolbar button {
                background: #333;
                color: #fff;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-touch-callout: none;
            }

            #toolbar button:hover {
                background: #444;
            }

            #toolbar button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            #pageInfo {
                font-size: 14px;
                margin: 0 10px;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }

            #searchBox {
                display: none;
                background: #333;
                padding: 4px 8px;
                border-radius: 4px;
                align-items: center;
                gap: 8px;
            }

            #searchBox input {
                background: #222;
                color: #fff;
                border: 1px solid #444;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 14px;
                width: 200px;
            }

            #searchBox button {
                padding: 4px 8px;
                font-size: 12px;
            }

            #viewerContainer {
                flex: 1;
                overflow: auto;
                background: #000;
                padding: ${headerHeight + 5}px 0 20px 0;
                -webkit-overflow-scrolling: touch;
                position: relative;
            }
            
            #pagesWrapper {
                display: inline-flex;
                flex-direction: column;
                align-items: center;
                min-width: 100%;
            }


            /* Control horizontal scrolling based on zoom state */
            #viewerContainer {
                overflow-x: hidden;
                overflow-y: auto;
            }
            
            #viewerContainer.allow-horizontal-scroll {
                overflow-x: auto;
            }

            .page {
                margin-bottom: 20px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                position: relative;
                flex-shrink: 0;
            }

            .textLayer {
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                overflow: hidden;
                opacity: 0.2;
                line-height: 1;
            }

            .textLayer > span {
                color: transparent;
                position: absolute;
                white-space: pre;
                cursor: text;
                transform-origin: 0% 0%;
            }

            .textLayer .highlight {
                background-color: rgb(255, 255, 0);
                opacity: 0.5;
            }

            .textLayer .highlight.selected {
                background-color: rgb(0, 100, 200);
            }

            ::selection {
                background: rgb(0, 100, 200);
            }

            .annotationLayer {
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
            }

            .annotationLayer section {
                position: absolute;
                cursor: pointer;
            }

            .annotationLayer .linkAnnotation > a,
            .annotationLayer .linkAnnotation > a:visited {
                position: absolute;
                font-size: 1em;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 0, 0) !important;
                opacity: 1;
                text-decoration: none;
                display: block;
            }

            .annotationLayer .linkAnnotation > a:hover {
                background: rgba(255, 255, 0, 0.2) !important;
            }

            .loading {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                font-size: 18px;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
        </style>
    </head>
    <body>
        <div id="toolbar" style="display: none;">
            <span id="pageInfo">Loading...</span>
            <button id="zoomOut">-</button>
            <button id="zoomReset">Fit</button>
            <button id="zoomIn">+</button>
            <button id="searchToggle">Search</button>
            <div id="searchBox">
                <input type="text" id="searchInput" placeholder="Search...">
                <button id="searchPrev">◀</button>
                <button id="searchNext">▶</button>
                <button id="searchClose">✕</button>
            </div>
        </div>
        <div id="viewerContainer">
            <div class="loading">Loading PDF...</div>
        </div>

        <script>
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

            let pdfDoc = null;
            let scale = 1;
            let baseScale = 1; // Scale to fit width
            let initialScale = 1; // The initial calculated scale (minimum zoom)
            let searchState = {
                query: '',
                matches: [],
                currentMatch: -1,
                isSearching: false
            };
            
            // Function to update horizontal scroll based on zoom level
            function updateHorizontalScroll() {
                const container = document.getElementById('viewerContainer');
                if (!container) return;
                
                // Allow horizontal scroll if zoomed in or if pinching
                if (Math.abs(scale - initialScale) > 0.01 || isPinching) {
                    container.classList.add('allow-horizontal-scroll');
                } else {
                    container.classList.remove('allow-horizontal-scroll');
                    // Reset horizontal scroll to 0 when at initial zoom
                    container.scrollLeft = 0;
                }
            }
            let renderedPages = new Set();
            let renderingPages = new Set();
            let allPages = [];

            const container = document.getElementById('viewerContainer');
            const pageInfo = document.getElementById('pageInfo');
            const zoomInButton = document.getElementById('zoomIn');
            const zoomOutButton = document.getElementById('zoomOut');
            const zoomResetButton = document.getElementById('zoomReset');
            const searchToggle = document.getElementById('searchToggle');
            const searchBox = document.getElementById('searchBox');
            const searchInput = document.getElementById('searchInput');
            const searchPrev = document.getElementById('searchPrev');
            const searchNext = document.getElementById('searchNext');
            const searchClose = document.getElementById('searchClose');

            const pdfUrl = '${pdfUrl}';
            
            // Continuous pinch to zoom
            let touches = [];
            let initialDistance = 0;
            let startScale = 1;
            let isPinching = false;
            let pinchCenter = { x: 0, y: 0 };
            let startScrollLeft = 0;
            let startScrollTop = 0;
            let currentTransform = { x: 0, y: 0, scale: 1 };
            
            container.addEventListener('touchstart', function(e) {
                if (e.touches.length === 2) {
                    isPinching = true;
                    touches = Array.from(e.touches);
                    
                    // Enable horizontal scrolling during pinch
                    updateHorizontalScroll();
                    const dx = touches[0].clientX - touches[1].clientX;
                    const dy = touches[0].clientY - touches[1].clientY;
                    initialDistance = Math.sqrt(dx * dx + dy * dy);
                    startScale = scale;
                    
                    // Calculate pinch center relative to container
                    const rect = container.getBoundingClientRect();
                    pinchCenter = {
                        x: ((touches[0].clientX + touches[1].clientX) / 2) - rect.left,
                        y: ((touches[0].clientY + touches[1].clientY) / 2) - rect.top
                    };
                    
                    // Save initial scroll position
                    startScrollLeft = container.scrollLeft;
                    startScrollTop = container.scrollTop;
                }
            });
            
            container.addEventListener('touchmove', function(e) {
                if (isPinching && e.touches.length === 2) {
                    e.preventDefault();
                    touches = Array.from(e.touches);
                    const dx = touches[0].clientX - touches[1].clientX;
                    const dy = touches[0].clientY - touches[1].clientY;
                    const currentDistance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Calculate current pinch center
                    const rect = container.getBoundingClientRect();
                    const currentPinchCenter = {
                        x: ((touches[0].clientX + touches[1].clientX) / 2) - rect.left,
                        y: ((touches[0].clientY + touches[1].clientY) / 2) - rect.top
                    };
                    
                    if (initialDistance > 0) {
                        // Calculate new scale based on pinch distance
                        const pinchRatio = currentDistance / initialDistance;
                        const newScale = startScale * pinchRatio;
                        
                        // Apply scale with limits - don't allow zooming out below initial scale
                        scale = Math.max(initialScale, Math.min(3, newScale));
                        
                        // Calculate pan offset based on finger movement
                        const panX = currentPinchCenter.x - pinchCenter.x;
                        const panY = currentPinchCenter.y - pinchCenter.y;
                        
                        // Apply visual zoom and pan immediately using CSS transform
                        const pagesWrapper = document.getElementById('pagesWrapper');
                        if (pagesWrapper) {
                            const visualScale = scale / startScale;
                            
                            // Calculate transform origin based on initial pinch center
                            const scrolledX = pinchCenter.x + startScrollLeft;
                            const scrolledY = pinchCenter.y + startScrollTop;
                            
                            // Store current transform state
                            currentTransform = {
                                x: panX,
                                y: panY,
                                scale: visualScale
                            };
                            
                            // Apply both scale and translate
                            // Note: translate is divided by scale to maintain correct visual position
                            const translateX = panX / visualScale;
                            const translateY = panY / visualScale;
                            pagesWrapper.style.transform = 'scale(' + visualScale + ') translate(' + translateX + 'px, ' + translateY + 'px)';
                            pagesWrapper.style.transformOrigin = scrolledX + 'px ' + scrolledY + 'px';
                            
                            // Debug: log the actual transform values
                            if (window.ReactNativeWebView) {
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                    type: 'debug', 
                                    message: 'Transform update',
                                    data: {
                                        visualScale: visualScale,
                                        pan: { x: panX, y: panY },
                                        translate: { x: translateX, y: translateY },
                                        origin: { x: scrolledX, y: scrolledY }
                                    }
                                }));
                            }
                        }
                    }
                }
            });
            
            container.addEventListener('touchend', function(e) {
                if (isPinching && e.touches.length < 2) {
                    isPinching = false;
                    
                    // Calculate the document point that was under the pinch center at the start
                    const documentX = (startScrollLeft + pinchCenter.x) / (baseScale * startScale);
                    const documentY = (startScrollTop + pinchCenter.y) / (baseScale * startScale);
                    
                    // Clear transform
                    const pagesWrapper = document.getElementById('pagesWrapper');
                    if (pagesWrapper) {
                        pagesWrapper.style.transform = '';
                    }
                    
                    // Re-render at final scale
                    renderedPages.clear();
                    renderAllPages().then(() => {
                        // Use requestAnimationFrame to ensure layout is complete
                        requestAnimationFrame(() => {
                            // Calculate where that document point is now at the new scale
                            const newX = documentX * (baseScale * scale);
                            const newY = documentY * (baseScale * scale);
                            
                            // Calculate the scroll position to keep the document point at the pinch center
                            // The formula is: scrollPosition = (documentPoint * newScale) - screenPoint
                            const targetScrollLeft = newX - pinchCenter.x;
                            const targetScrollTop = newY - pinchCenter.y;
                            
                            // Set the scroll position
                            container.scrollLeft = Math.max(0, targetScrollLeft);
                            container.scrollTop = Math.max(0, targetScrollTop);
                            
                            // Update horizontal scroll state after zoom
                            updateHorizontalScroll();
                            
                            // Debug the position error
                            if (window.ReactNativeWebView) {
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                    type: 'debug',
                                    message: 'Position calculation',
                                    data: {
                                        pinchCenter: pinchCenter,
                                        startScale: startScale,
                                        finalScale: scale,
                                        scaleRatio: scale / startScale,
                                        docPoint: { x: documentX, y: documentY },
                                        startPosition: { scrollLeft: startScrollLeft, scrollTop: startScrollTop },
                                        transform: currentTransform
                                    }
                                }));
                            }
                        }, 50);
                    });
                    
                    touches = [];
                    initialDistance = 0;
                }
            });
            
            // Global search functions for React Native integration
            let searchTimeout = null;
            window.performSearch = function(query) {
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'debug',
                        message: 'performSearch called',
                        data: { query: query, time: new Date().toISOString() }
                    }));
                }
                
                // Clear any pending search
                if (searchTimeout) {
                    clearTimeout(searchTimeout);
                }
                
                // Debounce to prevent multiple rapid searches
                searchTimeout = setTimeout(() => {
                    if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'debug',
                            message: 'performSearch executing',
                            data: { query: query, time: new Date().toISOString() }
                        }));
                    }
                    searchState.query = query;
                    searchState.currentMatch = -1;
                    searchState.matches = [];
                
                if (query) {
                    // Search through all rendered pages
                    allPages.forEach((pageInfo, index) => {
                        // Only search in pages that have been rendered
                        if (renderedPages.has(pageInfo.pageNum) && pageInfo.pageDiv) {
                            const textLayer = pageInfo.pageDiv.querySelector('.textLayer');
                            if (textLayer) {
                                const spans = textLayer.querySelectorAll('span');
                                spans.forEach(span => {
                                    span.classList.remove('highlight', 'selected');
                                    if (span.textContent.toLowerCase().includes(query.toLowerCase())) {
                                        span.classList.add('highlight');
                                        searchState.matches.push({
                                            pageNum: index + 1,
                                            element: span
                                        });
                                    }
                                });
                            }
                        }
                    });
                    
                    if (searchState.matches.length > 0) {
                        searchState.currentMatch = 0;
                        highlightCurrentMatch();
                    }
                }
                
                    if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'debug',
                            message: 'performSearch complete',
                            data: { matchCount: searchState.matches.length }
                        }));
                    }
                    updateSearchResults();
                }, 100); // 100ms debounce
            };
            
            window.clearSearch = function() {
                searchState.query = '';
                searchState.currentMatch = -1;
                searchState.matches.forEach(match => {
                    if (match.element && match.element.classList) {
                        match.element.classList.remove('highlight', 'selected');
                    }
                });
                searchState.matches = [];
                updateSearchResults();
            };
            
            window.searchNext = function() {
                if (searchState.matches.length > 0) {
                    if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'debug',
                            message: 'searchNext called',
                            data: { 
                                currentMatch: searchState.currentMatch,
                                matchCount: searchState.matches.length,
                                query: searchState.query
                            }
                        }));
                    }
                    searchState.currentMatch = (searchState.currentMatch + 1) % searchState.matches.length;
                    highlightCurrentMatch();
                    updateSearchResults();
                }
            };
            
            window.searchPrev = function() {
                if (searchState.matches.length > 0) {
                    if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'debug',
                            message: 'searchPrev called',
                            data: { 
                                currentMatch: searchState.currentMatch,
                                matchCount: searchState.matches.length,
                                query: searchState.query
                            }
                        }));
                    }
                    searchState.currentMatch = (searchState.currentMatch - 1 + searchState.matches.length) % searchState.matches.length;
                    highlightCurrentMatch();
                    updateSearchResults();
                }
            };
            
            function highlightCurrentMatch() {
                // Remove previous selection
                searchState.matches.forEach(match => {
                    match.element.classList.remove('selected');
                });
                
                // Highlight current match
                if (searchState.currentMatch >= 0 && searchState.currentMatch < searchState.matches.length) {
                    const match = searchState.matches[searchState.currentMatch];
                    if (match.element && match.element.classList) {
                        match.element.classList.add('selected');
                        
                        // Scroll to the match
                        const pageDiv = allPages[match.pageNum - 1].pageDiv;
                        const rect = match.element.getBoundingClientRect();
                        const containerRect = container.getBoundingClientRect();
                        const scrollTop = container.scrollTop + rect.top - containerRect.top - 100;
                        container.scrollTop = scrollTop;
                    }
                }
            }
            
            function updateSearchResults() {
                if (window.ReactNativeWebView) {
                    // Ensure current match is within bounds
                    const current = searchState.matches.length > 0 ? searchState.currentMatch + 1 : 0;
                    const total = searchState.matches.length;
                    
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'searchResults',
                        current: Math.min(current, total),
                        total: total
                    }));
                }
            }
            
            async function renderAllPages() {
                return new Promise(async (resolve) => {
                    // First time setup
                    if (allPages.length === 0) {
                    container.innerHTML = '<div class="loading">Preparing PDF...</div>';

                    // Calculate scale to fit width
                    const containerWidth = container.clientWidth - 40; // 20px padding on each side
                    const firstPage = await pdfDoc.getPage(1);
                    const tempViewport = firstPage.getViewport({ scale: 1 });

                    // Calculate base scale to fit width
                    baseScale = containerWidth / tempViewport.width;

                    // Calculate responsive zoom multiplier
                    // iPhone 16 Pro Max (430pt) = 1.1x is perfect
                    const referenceWidth = 430;
                    const referenceScale = 1.1;
                    const screenWidth = window.innerWidth;

                    // Larger screens get MORE zoom, smaller screens get LESS zoom
                    scale = referenceScale * (screenWidth / referenceWidth);

                    // Store the initial scale to use as minimum zoom
                    initialScale = scale;
                    
                    // Limit the scale to reasonable bounds - minimum is the initial scale
                    scale = Math.max(initialScale, Math.min(2.0, scale));

                    container.innerHTML = '';
                    
                    // Create wrapper for pages
                    const pagesWrapper = document.createElement('div');
                    pagesWrapper.id = 'pagesWrapper';
                    container.appendChild(pagesWrapper);
                    
                    allPages = [];
                    renderedPages.clear();
                    renderingPages.clear();

                    // Create placeholders for all pages
                    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
                        const viewport = firstPage.getViewport({ scale: baseScale * scale });
                        
                        const pageDiv = document.createElement('div');
                        pageDiv.className = 'page';
                        pageDiv.id = 'page-' + pageNum;
                        pageDiv.style.height = viewport.height + 'px';
                        pageDiv.style.width = viewport.width + 'px';
                        pageDiv.style.backgroundColor = '#1a1a1a';
                        pageDiv.style.position = 'relative';

                        // Add loading text
                        const loadingDiv = document.createElement('div');
                        loadingDiv.className = 'page-loading';
                        loadingDiv.style.position = 'absolute';
                        loadingDiv.style.top = '50%';
                        loadingDiv.style.left = '50%';
                        loadingDiv.style.transform = 'translate(-50%, -50%)';
                        loadingDiv.style.color = '#666';
                        loadingDiv.textContent = 'Page ' + pageNum;
                        pageDiv.appendChild(loadingDiv);

                        pagesWrapper.appendChild(pageDiv);
                        allPages.push({
                            pageNum: pageNum,
                            pageDiv: pageDiv,
                            rendered: false
                        });
                    }

                    // Set up scroll listener
                    container.addEventListener('scroll', debounce(checkAndRenderVisiblePages, 100));
                } else {
                    // Re-render at new scale - just update sizes
                    const firstPage = await pdfDoc.getPage(1);
                    
                    for (let i = 0; i < allPages.length; i++) {
                        const pageInfo = allPages[i];
                        const viewport = firstPage.getViewport({ scale: baseScale * scale });
                        
                        // Update page div size
                        pageInfo.pageDiv.style.height = viewport.height + 'px';
                        pageInfo.pageDiv.style.width = viewport.width + 'px';
                        
                        // Clear the page content to force re-render
                        pageInfo.pageDiv.innerHTML = '';
                        
                        // Add loading placeholder
                        const loadingDiv = document.createElement('div');
                        loadingDiv.className = 'page-loading';
                        loadingDiv.style.position = 'absolute';
                        loadingDiv.style.top = '50%';
                        loadingDiv.style.left = '50%';
                        loadingDiv.style.transform = 'translate(-50%, -50%)';
                        loadingDiv.style.color = '#666';
                        loadingDiv.textContent = 'Page ' + pageInfo.pageNum;
                        pageInfo.pageDiv.appendChild(loadingDiv);
                        
                        // Mark as not rendered so it will be re-rendered
                        pageInfo.rendered = false;
                    }
                    
                    renderedPages.clear();
                    renderingPages.clear();
                }

                // Check and render visible pages
                checkAndRenderVisiblePages();
                
                // Resolve promise after a brief delay to ensure layout is complete
                setTimeout(resolve, 100);
                });
            }

            function debounce(func, wait) {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            }

            function checkAndRenderVisiblePages() {
                const containerRect = container.getBoundingClientRect();
                const buffer = 200; // Render pages 200px before they come into view
                
                const previousRenderedCount = renderedPages.size;
                
                allPages.forEach(pageInfo => {
                    const pageRect = pageInfo.pageDiv.getBoundingClientRect();
                    const isVisible = pageRect.bottom >= containerRect.top - buffer &&
                                   pageRect.top <= containerRect.bottom + buffer;

                    if (isVisible && !renderedPages.has(pageInfo.pageNum) && !renderingPages.has(pageInfo.pageNum)) {
                        renderPage(pageInfo.pageNum);
                    }
                });
                
                // Check if new pages were rendered and search is active
                if (renderedPages.size > previousRenderedCount && searchState.query) {
                    if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'debug',
                            message: 'New pages rendered during navigation',
                            data: { 
                                previousCount: previousRenderedCount,
                                newCount: renderedPages.size,
                                query: searchState.query
                            }
                        }));
                    }
                }
            }

            async function renderPage(pageNum) {
                if (renderingPages.has(pageNum) || renderedPages.has(pageNum)) return;

                renderingPages.add(pageNum);

                try {
                    const page = await pdfDoc.getPage(pageNum);
                    const pageInfo = allPages[pageNum - 1];
                    const viewport = page.getViewport({ scale: baseScale * scale });

                    // Clear placeholder content
                    pageInfo.pageDiv.innerHTML = '';
                    pageInfo.pageDiv.style.backgroundColor = 'transparent';

                    // Create canvas
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    pageInfo.pageDiv.appendChild(canvas);

                    // Render the page
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };

                    await page.render(renderContext).promise;

                    // Render text layer
                    const textContent = await page.getTextContent();
                    const textLayerDiv = document.createElement('div');
                    textLayerDiv.className = 'textLayer';
                    textLayerDiv.style.width = viewport.width + 'px';
                    textLayerDiv.style.height = viewport.height + 'px';
                    pageInfo.pageDiv.appendChild(textLayerDiv);

                    pdfjsLib.renderTextLayer({
                        textContent: textContent,
                        container: textLayerDiv,
                        viewport: viewport,
                        textDivs: []
                    });

                    // Render annotation layer for links
                    const annotations = await page.getAnnotations();
                    if (annotations.length > 0) {
                        const annotationLayerDiv = document.createElement('div');
                        annotationLayerDiv.className = 'annotationLayer';
                        pageInfo.pageDiv.appendChild(annotationLayerDiv);

                        // Create link service
                        const linkService = {
                            navigateTo: function(dest) {
                                handleInternalLink(dest);
                            },
                            getDestinationHash: function(dest) {
                                return '#';
                            },
                            getAnchorUrl: function(hash) {
                                return '#';
                            },
                            goToDestination: function(dest) {
                                handleInternalLink(dest);
                            }
                        };

                        // Process each annotation manually
                        annotations.forEach(annotation => {
                            if (!annotation) return;

                            const element = document.createElement('section');
                            element.setAttribute('data-annotation-id', annotation.id);

                            if (annotation.subtype === 'Link' && annotation.rect) {
                                const link = document.createElement('a');
                                link.href = '#';
                                link.onclick = function(e) {
                                    e.preventDefault();
                                    if (annotation.dest) {
                                        handleInternalLink(annotation.dest);
                                    } else if (annotation.url) {
                                        window.open(annotation.url, '_blank');
                                    }
                                    return false;
                                };

                                element.className = 'linkAnnotation';
                                element.appendChild(link);

                                // Position the element
                                const rect = pdfjsLib.Util.normalizeRect([
                                    annotation.rect[0],
                                    page.view[3] - annotation.rect[1],
                                    annotation.rect[2],
                                    page.view[3] - annotation.rect[3]
                                ]);

                                element.style.left = Math.floor(rect[0] * viewport.scale) + 'px';
                                element.style.top = Math.floor(rect[1] * viewport.scale) + 'px';
                                element.style.width = Math.ceil((rect[2] - rect[0]) * viewport.scale) + 'px';
                                element.style.height = Math.ceil((rect[3] - rect[1]) * viewport.scale) + 'px';
                            }

                            if (element.className) {
                                annotationLayerDiv.appendChild(element);
                            }
                        });
                    }

                    renderedPages.add(pageNum);
                    renderingPages.delete(pageNum);

                    // Search will be handled by window.performSearch when needed
                } catch (error) {
                    console.error('Error rendering page ' + pageNum + ':', error);
                    renderingPages.delete(pageNum);
                }
            }

            // Make zoom functions globally accessible
            window.onZoomIn = function() {
                scale = Math.min(scale * 1.2, 3);
                renderedPages.clear();
                renderAllPages().then(() => {
                    updateHorizontalScroll();
                });
            }

            
            window.onZoomOut = function() {
                scale = Math.max(scale / 1.2, initialScale);
                renderedPages.clear();
                renderAllPages().then(() => {
                    updateHorizontalScroll();
                });
            };
            


            
            window.onZoomReset = function() {
                // Reset to the responsive scale calculated for this device
                const referenceWidth = 430;
                const referenceScale = 1.1;
                const screenWidth = window.innerWidth;
                scale = referenceScale * (screenWidth / referenceWidth);
                scale = Math.max(initialScale, Math.min(2.0, scale));
                renderedPages.clear();
                renderAllPages().then(() => {
                    updateHorizontalScroll();
                });
            }

            // Search functions consolidated into window.performSearch above

            function onSearch() {
                searchState.query = searchInput.value;
                window.performSearch(searchInput.value);
            }

            function onSearchPrev() {
                window.searchPrev();
            }

            function onSearchNext() {
                window.searchNext();
            }


            zoomInButton.addEventListener('click', onZoomIn);
            zoomOutButton.addEventListener('click', onZoomOut);
            zoomResetButton.addEventListener('click', onZoomReset);

            searchToggle.addEventListener('click', function() {
                searchBox.style.display = searchBox.style.display === 'flex' ? 'none' : 'flex';
                if (searchBox.style.display === 'flex') {
                    searchInput.focus();
                }
            });

            searchInput.addEventListener('input', onSearch);
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    window.searchNext();
                }
            });

            searchPrev.addEventListener('click', onSearchPrev);
            searchNext.addEventListener('click', onSearchNext);
            searchClose.addEventListener('click', function() {
                searchBox.style.display = 'none';
                searchInput.value = '';
                window.clearSearch();
            });

            async function handleInternalLink(dest) {
                if (!dest || !pdfDoc) return;

                try {
                    let pageNumber = 1;
                    let destArray = null;

                    if (typeof dest === 'string') {
                        // Named destination
                        destArray = await pdfDoc.getDestination(dest);
                    } else if (Array.isArray(dest)) {
                        // Direct destination array
                        destArray = dest;
                    } else if (typeof dest === 'object' && dest.num != null) {
                        // Reference object
                        destArray = [dest];
                    }

                    if (destArray && destArray[0]) {
                        const ref = destArray[0];
                        if (ref.num != null || ref.gen != null) {
                            pageNumber = await pdfDoc.getPageIndex(ref) + 1;
                        } else if (typeof ref === 'number') {
                            pageNumber = ref;
                        }
                    }

                    // Ensure the page is rendered first
                    if (!renderedPages.has(pageNumber)) {
                        await renderPage(pageNumber);
                    }

                    // Small delay to ensure rendering is complete
                    setTimeout(() => {
                        const targetPage = document.getElementById('page-' + pageNumber);
                        if (targetPage) {
                            const container = document.getElementById('viewerContainer');
                            const offsetTop = targetPage.offsetTop - 20; // 20px padding
                            container.scrollTop = offsetTop;
                        }
                    }, 100);
                } catch (error) {
                    console.log('Error navigating to destination:', error);
                }
            }

            document.addEventListener('keydown', function(e) {
                if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    searchBox.style.display = 'flex';
                    searchInput.focus();
                }
            });

            pdfjsLib.getDocument(pdfUrl).promise.then(function(pdf) {
                pdfDoc = pdf;
                pageInfo.textContent = 'Loading ' + pdf.numPages + ' pages...';

                renderAllPages().then(() => {
                    updateHorizontalScroll();
                });
            }).catch(function(error) {
                container.innerHTML = '<div class="loading">Error loading PDF: ' + error.message + '</div>';
            });
        </script>
    </body>
    </html>
  `;

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <WebView
        ref={webViewRef}
        source={{ html: html, baseUrl: 'https://cdn.starwarsunlimited.com/' }}
        style={[styles.webView]}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={[styles.loadingContainer, {backgroundColor: theme.backgroundColor}]}>
            <ActivityIndicator size="large" color={theme.foregroundColor} />
          </View>
        )}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsBackForwardNavigationGestures={true}
        pullToRefreshEnabled={true}
        bounces={true}
        scalesPageToFit={false}
        originWhitelist={['*']}
        mixedContentMode="always"
        scrollEnabled={true}
        injectedJavaScript={`
          // Allow native pinch-to-zoom
          true;
        `}
        onError={(syntheticEvent) => {
          console.log('WebView error:', syntheticEvent.nativeEvent);
        }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'searchResults') {
              const results = {
                current: data.current,
                total: data.total
              };
              setSearchResults(results);
              console.log('RulesScreen setting result count:', data.total, 'current:', data.current);
              onSearchResultsChange?.(results);
            } else if (data.type === 'debug') {
              console.log('WebView Debug:', data.message, data.data);
            }
          } catch (e) {
            console.log('Error parsing message:', e);
          }
        }}
      />
    </View>
  );
});

RulesScreen.displayName = 'RulesScreen';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RulesScreen;
