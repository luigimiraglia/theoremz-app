import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

interface MathViewProps {
  math: string;
  style?: any;
}

export const MathView: React.FC<MathViewProps> = ({ math, style }) => {
  const [webViewHeight, setWebViewHeight] = useState(80);
  const [loading, setLoading] = useState(true);

  // Escapiamo il testo per evitare problemi con caratteri speciali
  const escapedMath = math
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      padding: 4px 2px;
      font-family: -apple-system, system-ui, sans-serif;
      font-size: 17px;
      color: #e7e9ea;
      background: transparent;
      line-height: 1.3;
      overflow: hidden;
    }
    #math-content {
      min-height: 20px;
    }
    .katex { color: #e7e9ea !important; font-size: 1.1em; }
    .katex-display { margin: 6px 0 4px 0; }
  </style>
</head>
<body>
  <div id="math-content"></div>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
  <script>
    window.onerror = function(msg, url, line) {
      window.ReactNativeWebView.postMessage(JSON.stringify({error: msg}));
      return false;
    };
    
    function init() {
      try {
        const container = document.getElementById('math-content');
        container.textContent = \`${escapedMath}\`;
        
        if (typeof renderMathInElement === 'function') {
          renderMathInElement(container, {
            delimiters: [
              {left: '$$', right: '$$', display: true},
              {left: '$', right: '$', display: false}
            ],
            throwOnError: false,
            trust: true
          });
        }
        
        setTimeout(function() {
          const height = Math.max(document.body.scrollHeight, 35);
          window.ReactNativeWebView.postMessage(JSON.stringify({height: height, loaded: true}));
        }, 300);
      } catch(e) {
        window.ReactNativeWebView.postMessage(JSON.stringify({error: e.toString()}));
      }
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  </script>
</body>
</html>`;

  return (
    <View style={[styles.container, style, { height: webViewHeight }]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#1d9bf0" />
        </View>
      )}
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        scrollEnabled={false}
        bounces={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={false}
        style={styles.webView}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.height) {
              setWebViewHeight(Math.max(data.height + 12, 60));
            }
            if (data.loaded) {
              setLoading(false);
            }
            if (data.error) {
              console.error("Math rendering error:", data.error);
              setLoading(false);
            }
          } catch {
            setLoading(false);
          }
        }}
        onLoad={() => {
          setTimeout(() => setLoading(false), 500);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  webView: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
});
