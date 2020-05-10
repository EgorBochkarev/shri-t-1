# CI Builder

## Info

* Для установки запустите `npm i`, docker deamon, в файле `./server/.env` введите свой `ACCESS_TOKEN`
* Приложение использует [GitHub REST API v3](https://developer.github.com/v3/), для полноценной работы, в файле `./server/.env` заполните крэдами переменные `GIT_HUB_LOGIN` и `GIT_HUB_PSWD`
* Перед запуском сервера соберите UI командой `npm run build`;
* Запуск тестов `npm test` (Out of date)
* Запуск сервера и агентов: `cd $dir && npm ci && npm start`, где `$dir` это `server` или `agent`, клинт будет доступен по ссылке: [http://localhost:3000/](http://localhost:3000/)
* Запуск дев режима для клиента: `cd client && npm ci && npm start`
* Мое задание можно использовать как показательный пример ошибок

## Client resource caching

В идеале хорошо бы подключить: [Workbox modules](https://developers.google.com/web/tools/workbox/modules) используя [InjectManifest plugin](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.InjectManifest), где удобно можно выбрать [разные стратегии](https://developers.google.com/web/tools/workbox/modules/workbox-strategies). Но задача была другая.


Клиентская часть собирается веб паком, при изменении чего либо, меняется хэш, а значит и название файлов, при этом перед релизом нужно изменить название кэш стора (переменная - currentCacheName в коде сервис воркера) (нужно автоматизировать) => меняется и сервис воркер. Картинок и других медиа файлов в проекте нет, поэтому получается что при изменении чего либо в коде, нужно перерегистрировать воркер, а значит обновится кэш. Изходя из этого была выбрана стратегия [Cache First (Cache Falling Back to Network)](https://developers.google.com/web/tools/workbox/modules/workbox-strategies#cache_first_cache_falling_back_to_network). Данная стратегия подходит для стабильных продуктов где прошла активная стадия разработки.

При изменении сервис воркера у пользователя будет появляться нотификация, что доступна новая версия приложения и по желанию можно обновиться на новую версию.

## Tests (Out of date)

Before starting test, be sure that your docker daemon is launched and selenium-standalone is listening `http://0.0.0.0:4444/wd/hub`.
To prolong time of working test, please authorize your git hub account by setting Env property in `./server/.env` file

To install and run selenium-standalone:

    npm i selenium-standalone --global
    selenium-standalone install

To run it

    cd ./server && npm run selenium-start

To tun server side tests

    cd ./server && npm test

To run ui tests

    cd ./server && npm run hermione

### Module tests

* Task manager
    * Periodical task check
* Builder
    * Set to queue checking
    * Register build checking
    * Record build starting time checking
    * Build result checking
* Queue
    * Queue order checking

### Integration tests

Test rest api and git api integration

* Configuration rest api test
    * Getting configuration api
    * Setting configuration api
    * Deleting configuration api
* Buid rest api test
    * Getting list api
    * Starting build api
    * Getting build detail api
    * Getting build log api
    * Check build workflow

### UI tests

Scenarios:

* Start page
    1. Empty route without set settings lead to start page
    2. Load page
    3. Check header
    4. Check body
    5. Check footer
    6. Click on settings button in header lead to setting page
    7. Click on main "Open settings" button also lead to setting page
* History page
    1. Empty route with set settings lead to history page
    2. Load page
    3. Check header
    4. Check list of builds
    5. Check show more button for list of builds
    6. Check footer
    7. Check view of build in success status
    8. Check view of build in in progress status
    9. Click on settings button in header lead to setting page
    10. Open build start pop-up
    11. Close build start pop-up
    12. Launch new build
* Settings page
    1. Open settings without settings
    2. Open settings with settings
    3. Check git hub repository field validation
    4. Check build command field validation
    5. Click cancel button
    6. Check setting saving
* Build page
    1. Check build page
    2. Check footer
    3. Check header
    4. Check settings button
    5. Check rebuild button
    6. Check build card
    7. Check build logs

## Links
[Figma](https://www.figma.com/file/vA6BJJ3AiWar3Q3bq30eyG/SHRI-homework-specification)