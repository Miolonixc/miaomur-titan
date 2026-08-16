# Мурчик для Titan OS

HTML5 Canvas-порт TV-заставки из [MiaoMurApp](https://github.com/Miolonixc/MiaoMurApp).

Запускается как hosted web app в Titan OS DevView. Откройте сайт в современном браузере для локальной проверки. Управление пультом: **OK** открывает меню, стрелки перемещают фокус, **Back** закрывает меню.

Это не системный DreamService (Titan OS не даёт публичного API для замены системной заставки), а отдельное TV-приложение с режимом живой заставки.

## Проверка

```sh
npx serve .
```

Для Titan OS потребуется HTTPS URL, добавленный в Partner Portal → DevView.
