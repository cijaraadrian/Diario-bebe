# Genera public/index.html a partir de src/app.html (cabecera PWA + app)
import pathlib
root=pathlib.Path(__file__).parent
app=(root/'src/app.html').read_text()
head='''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Diario bebé">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="theme-color" content="#f6f2f1" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#16181e" media="(prefers-color-scheme: dark)">
<meta name="robots" content="noindex">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="icon" href="icon-192.png">
<style>:root{padding-top:env(safe-area-inset-top,0px)}body{margin:0}[hidden]{display:none!important}</style>
</head>
<body>
'''
(root/'public/index.html').write_text(head+app+'\n</body>\n</html>\n')
print('public/index.html listo')
