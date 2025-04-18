# PortfolioOverview

**PortfolioOverview** — это приложение для управления криптовалютным портфелем с возможностью реального обновления цен активов в реальном времени с использованием WebSocket. Оно предоставляет возможность добавлять, удалять и отслеживать активы, а также отображать подробную информацию о текущих и исторических изменениях цен.

## Демо

Приложение доступно по следующей ссылке:
[Демо проекта](https://nifontovsv.github.io/matrixapp/)

## Технологии

- **React**: библиотека для построения пользовательских интерфейсов.
- **TypeScript**: для строгой типизации и улучшения качества кода.
- **Redux Toolkit**: для управления состоянием приложения.
- **WebSocket**: для получения данных о ценах активов в реальном времени.
- **SCSS**: для стилизации приложения с использованием SASS.

## Установка

Для начала работы с проектом выполните следующие шаги:

1. Клонируйте репозиторий:
   ```bash
   https://github.com/nifontovsv/matrixapp.git
   ```
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Запустите приложение:
	```bash
	npm start
 	 ```

## Архитектура

### Структура папок

- `src/` — основной каталог с исходным кодом.
- `components/` — компоненты для отображения элементов интерфейса.
- `redux/` — папка с конфигурацией Redux (слайсы, хранилище, API и WebSocket).

### Основные компоненты

1. **Main**: отображает список активов с полями:
- Название
- Количество
- Текущая цена
- Общая стоимость
- Изменение за 24 часа
- Доля в портфеле

2. **Modal**: модальное окно для добавления активов.
	- **CurrencyForm**: форма для добавления активов в портфель, с возможностью ввода количества и выбора активов.
	- **CurrencyItem**: информация об активах
	- **CurrencyList**: список активов

3. **Header**: шапка приложения

### Redux Toolkit

Состояние приложения управляется через Redux Toolkit. Хранилище содержит данные о добавленных активах, их текущих ценах и другую информацию. Используется WebSocket для получения обновлений цен активов в реальном времени.

### WebSocket

Для обновления цен активов используется подключение к WebSocket серверу Binance API: `wss://stream.binance.com:9443/stream?streams`. Обновления приходят в реальном времени и обновляют состояние портфеля.

### Локальное хранилище

Данные о добавленных активах сохраняются в локальном хранилище браузера, чтобы при перезагрузке страницы состояние не терялось.

## Функциональные требования

1. **Список активов**:
- Отображение всех добавленных активов с полями: название, количество, текущая цена, общая стоимость, изменение за 24 часа, доля в портфеле.

2. **Форма добавления активов**:
- Возможность выбрать актив, указать количество и добавить его в портфель.

3. **Удаление активов**:
- Клик по активу удаляет его из списка.

4. **Real-time обновления**:
- Цены активов обновляются через WebSocket в реальном времени.
