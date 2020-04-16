## Task
### Правильное использование БЭМ-сущностей

* какие части макета являются одним и тем же блоком?
* какие стили относятся к блокам, а какие к элементам и модификаторам?
* где нужно использовать каскады и почему?

### Консистентность

* какие видите базовые и семантические константы?
* какие видите закономерности в интерфейсе?

### Адаптивность

* где видите вариативность данных и как это обрабатываете?
* какие видите особенности, связанные с размером экрана?
* что еще повлияло на вашу вёрстку?

## Solution

### БЭМ-сущности

* Кнопки, иконки, хэдер, футер, стиль цвета, инпуты, карточка коммита, иконка с текстом, блок с логом
* К элементам в основном цвета (Иконки), исключения в отображении (Высота строчки в кнопке), расположение внутри родителя.
* В карточке коммита

### База

* Цвета (шрифтов иконок и статусов), паддинги, отступы

### Адапривность

* Меняется направление расположения объектов, исчезают лэйблы кнопок, кнопки расширяются на весь экран, меняются размеры шрифтов
* Есть максимальный размер экрана


## Info

* Для установки запустите npm i, docker deamon и в файле ./server/.end введите свой ACCESS_TOKEN
* Запуск верстки npm srart
* Запуск сервера npm run start-server, для запуска необходим докер
* Запуск всего npm start
* Запуск тестов npm test
* Мое задание можно использовать как показательный пример ошибок

## Tests

Before starting test, be sure that your docker daemon is launched and selenium-standalone is listening http://0.0.0.0:4444/wd/hub

To install amd run selenium-standalone:

    npm i selenium-standalone --global
    selenium-standalone install

### Server side tests

#### Module tests

* Task manager
    * Periodical task check
* Builder
    * Set to queue checking
    * Register build checking
    * Record build starting time checking
    * Build result checking
* Queue
    * Queue order checking

#### Integration tests

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


### Disadvantage of test implementation

* Test are not atomic, and some of them relay on previos tests 
(To solve it need to restart and prepare mock server every time, that will increase git api requests, and it will be blocked coz there is no authorization. Solution: Make an authorization or mock git api)
* There are not test of rainy day scenarios
* sinon.js could be used

## Bugs

* Не правильный цвет плэйсхолдеров
* Не обработал большое название для названий веток
* Не обработал большое название для текста в кнопках
* Слишком много миксов и модификаторов для одного блока
* Модификатор элемента (Текст кнопки адаптив)
* Ресет стилей на тэгах - может было бы лучше использовать блоки убирающие эти стили
* Нет связей для отступов (Не доделал)

## Links
[Figma](https://www.figma.com/file/vA6BJJ3AiWar3Q3bq30eyG/SHRI-homework-specification)