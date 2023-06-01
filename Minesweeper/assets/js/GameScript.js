window.addEventListener('load', () => { // нужен для коректной загрузки данных элементов из HTML в переменные
    LoadData();
    StartGame();
    FollowingToCursorFlagCounter();
    DisplayFlags();
    StartTimer();
});
window.addEventListener('contextmenu', function(e) {
    e.preventDefault(); // функция не даёт контекстному меню появиться
});

let gameField; // хранит элемент: GameField
let widthGameField; // хранит ширину игрового поля, которая берётся из меню (с элементов: input)
let heightGameField; // тоже самое, только для высоты
let cellsCount; // хранит площадь поля/кол-во ячеек на поле
const gameFieldCellWidth = 80 * 1.2; // хранит ширину одной ячйки
const gameFieldCellHeight = 40 * 1.2; // хранит высоту одной ячйки
const gapGameFieldCells = 0; // хранит отступы между ячейками в гриде
let bomdsOnFieldPersentage; // хранит, процент бомб, которые должны быть на поле
let bombsCount; // хранит кол-во бомб на поле
let cells = []; // список, который будет хранить все ячейки (типа игровое поле)
let closedCount; // хранит кол-во открытых ячеек в процессе игры
let flagsCount; // хранит кол-во флагов в реальном времени
let bombs; // список, который хранит бомбы
let isDragging = false; // для предотвращения ложных установок флага и нажатий
let isGameOver = false; // если true, то происходят соответствующие события при проигрыше в игре
let flagsCounterSpan; // хранит текстовый элемент для отображения в нём времени
let flagsCounter; // хранит элемент: счётчик флагов
let milliseconds = 0; // хранит время в милисекундах с момента запуска таймера
let timer; // хранит обработчик событий, который является таймером
let longpress = false; // (true, если происходит долгое нажатие по экрану (для установки флага в моб версии сайта))
let presstimer = null; // хранит время долгого нажатия на экран
let preventClick = false; // если true, то это значит, что происходит зажатие по эрану для установки флага и ячейка не будет открыта

function LoadData() { // решил засунуть загрузку данных после загрузки в функцию, чтобы эту часть кода можно было сворачивать
    gameField = document.querySelector('.GameField');
    widthGameField = parseInt(localStorage.getItem('widthGameField'));
    heightGameField = parseInt(localStorage.getItem('heightGamefield'));
    cellsCount = widthGameField * heightGameField;
    bomdsOnFieldPersentage = parseInt(localStorage.getItem('BombsOnFieldPercentage'));
    bombsCount = Math.floor(cellsCount * (bomdsOnFieldPersentage / 100));
    closedCount = cellsCount;
    
    // Связанное с флагами
    flagsCount = bombsCount;
    flagsCounterSpan = document.querySelector('.FlagsCounter span');
    flagsCounter = document.querySelector('.FlagsCounter');
}

// функция для воспроизведения звука нажатия на кнопку, когда пользователь нажимет на кнопки
function ClickOnButtonSound() {
    var clickSound = document.getElementById("clickOnButton");
    clickSound.volume = 0.2;
    clickSound.play();
}  

function StartGame() { // начало игры
    gameField.style.setProperty('--widthGameField', widthGameField); // установка стилей
    gameField.style.width = widthGameField * (gameFieldCellWidth + gapGameFieldCells) - gapGameFieldCells + 'px';
    gameField.style.setProperty('--gameFieldCellWidth', `${gameFieldCellWidth}px`);
    gameField.style.setProperty('--gameFieldCellHeight', `${gameFieldCellHeight}px`);
    gameField.style.setProperty('--gapGameFieldCells', `${gapGameFieldCells}px`);

    for (let i = 0; i < cellsCount; i++) { // создание ячеек в поле
        const cell = document.createElement('button');
        cell.classList.add('GameFieldCell', 'notDisabled');
        cells.push(cell);
    }

    gameField.append(...cells); // добавление на игровое поле всех ячеек по отдельности

    bombs = [...Array(cellsCount).keys()]
        .sort(() => Math.random() - 0.5)
        .slice(0, bombsCount); // список, содержащий индексы бомб
    
    { // для того, чтобы можно было свернуть и не ломать голову от кол-ва строк
        // Массив с источниками аудиофайлов
        const audioSources = [
            "assets/mediaFiles/audio/BackgroundMusic/BackgroundSound.mp3",
            "assets/mediaFiles/audio/BackgroundMusic/BackgroundSound1.mp3",
            "assets/mediaFiles/audio/BackgroundMusic/BackgroundSound2.mp3",
            "assets/mediaFiles/audio/BackgroundMusic/BackgroundSound3.mp3",
            "assets/mediaFiles/audio/BackgroundMusic/BackgroundSound4.mp3"
        ];
        
        // Функция для перемешивания массива
        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
            }
        };
        
        // Перемешивание массива с источниками аудиофайлов
        shuffleArray(audioSources);
        
        // Получение ссылки на элемент аудио
        let backgroundMusic = document.querySelector("#BackgroundMusic");
        
        // Установка начального источника аудио
        backgroundMusic.src = audioSources[Math.floor(Math.random() * audioSources.length)];
        
        // Счетчик для отслеживания текущей композиции
        let currentTrack = audioSources.indexOf(backgroundMusic.src);
        
        // Функция для переключения на следующую композицию
        const nextTrack = () => {
            // Увеличение счетчика
            currentTrack++;
            // Проверка достижения конца массива
            if (currentTrack >= audioSources.length) {
            currentTrack = 0;
            shuffleArray(audioSources);
            // Проверка совпадения последнего и первого треков
            while (audioSources[0] === backgroundMusic.src) {
                shuffleArray(audioSources);
            }
            }
            // Установка нового источника аудио
            backgroundMusic.src = audioSources[currentTrack];
        };
        
        // Добавление обработчика события окончания воспроизведения аудио
        backgroundMusic.addEventListener("ended", nextTrack);
  
    
        backgroundMusic.volume = 0.05;
        backgroundMusic.play();
        // приостановка воспроизведения музыки при потере фокуса окном
        window.addEventListener('blur', () => {
            backgroundMusic.pause();
        });
        // возобновление воспроизведения музыки при получении фокуса окном
        window.addEventListener('focus', () => {
            backgroundMusic.play();
        });
    }
}

// Функция предотвращающая долгое нажатие и следовательно установку флага
function cancelPressing() {
    if (isGameOver) return; // Если игра окончена, выходим из функции
    if (presstimer !== null) {
        clearTimeout(presstimer); // Очищаем таймер
        presstimer = null; // Сбрасываем значение таймера
    }
}
// Функция для обработки события клика
function click(event) {
    if (isGameOver) return; // Если игра окончена, выходим из функции
    if (presstimer !== null) {
        clearTimeout(presstimer); // Очищаем таймер
        presstimer = null; // Сбрасываем значение таймера
    }

    // Проверка типа события и кнопки мыши
    if (event.type === "click" && event.button !== 0) {
        return; // Если событие не является кликом левой кнопкой мыши, выходим из функции
    }

    if (longpress || preventClick) {
        preventClick = false; // Сбрасываем флаг предотвращения клика
        return; // Если произошло долгое нажатие или клик был предотвращен, выходим из функции
    }

    // Проверка наличия флажка в ячейке
    if (event.target.classList.contains("Flagged")) return; // Если ячейка содержит флажок, выходим из функции

    // Определение индекса нажатой ячейки
    const index = cells.indexOf(event.target);
    // Определение столбца и строки нажатой ячейки
    const column = index % widthGameField;
    const row = Math.floor(index / widthGameField);
    // Открытие ячейки
    OpenCell(row, column);
}
// Функция для обработки события начала касания
function touchStart(event) {
    // Проверка типа события и кнопки мыши
    if (event.type === "mousedown" || isGameOver) {
        return; // Если событие является нажатием кнопки мыши или игра окончена, выходим из функции
    }

    longpress = false; // Устанавливаем флаг долгого нажатия в false

    presstimer = setTimeout(() => {
        if (isDragging) return; // Если происходит перетаскивание, выходим из функции
        SetUnsetFlag(event); // Установка или снятие флажка
        longpress = true; // Устанавливаем флаг долгого нажатия в true
        preventClick = true; // Устанавливаем флаг предотвращения клика в true
    }, 150);

    return false; // Возвращаем false, чтобы предотвратить дальнейшую обработку события
}
// Функция для обработки события правого клика
function rightClick(event) {
    event.preventDefault(); // Предотвращаем стандартное контекстное меню

    // Если игра окончена или ячейка не содержит класс 'GameFieldCell', выходим из функции
    if (isGameOver || !event.target.classList.contains('GameFieldCell')) return;

    SetUnsetFlag(event); // Установка или снятие флажка
}
// Привязка функций к соответствующим событиям
document.addEventListener("click", click); // Обработка события клика
document.addEventListener("contextmenu", rightClick); // Обработка события правого клика
document.addEventListener("touchstart", touchStart); // Обработка события начала касания
document.addEventListener("touchend", cancelPressing); // Обработка события окончания касания
document.addEventListener("touchleave", cancelPressing); // Обработка события покидания элемента при касании
document.addEventListener("touchcancel", cancelPressing); // Обработка события отмены касания

// Функция для открытия ячейки
function OpenCell(row, column) {
    // Определение индекса ячейки
    const index = row * widthGameField + column;
    // Получение ссылки на элемент ячейки
    const cell = cells[index];
    // Проверка условий для выхода из функции
    if (!isValid(row, column) || cell.classList.contains('disabled')) return;
    // Изменение классов элемента ячейки
    cell.classList.add('disabled');
    cell.classList.remove('notDisabled');
    // Уменьшение количества закрытых ячеек
    closedCount--;
    // Воспроизведение звука копания
    const digSounds = [
        document.querySelector('#digSound1'),
        document.querySelector('#digSound2')
    ];
    const randomIndex = Math.floor(Math.random() * digSounds.length);
    const digSound = digSounds[randomIndex];
    digSound.volume = 0.3;
    digSound.play();
    // Проверка наличия бомбы в ячейке
    if (isBomb(row, column)) {
        // Если в ячейке есть бомба, вызов функции GameOver
        GameOver(cell);
        return;
    }
    // Проверка условия победы
    if (closedCount <= bombsCount) {
        stopTimer();
        document.querySelector('.GameTimer').classList.add('WonGame');
        return;
    }
    // Определение количества бомб вокруг ячейки
    const bombsCountAroundCell = GetBombCountAroundCell(row, column);
    if (bombsCountAroundCell !== 0) {
        // Если вокруг ячейки есть бомбы, отображение их количества на ячейке
        cell.textContent = bombsCountAroundCell;
        return;
    } else {
        cell.textContent = "";
    }
    // Открытие всех пустых ячеек вокруг текущей ячейки
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            OpenCell(row + y, column + x);
        }
    }
}
// Функция для завершения игры (проигрыш)
function GameOver(cell) {
    stopTimer();
    isGameOver = true;
    // Создание и добавление изображения бомбы в ячейку
    const bombImg = document.createElement('img');
    bombImg.src = 'assets/mediaFiles/images/buttons/redButton.png';
    bombImg.classList.add('ButtonForLaunch');
    cell.appendChild(bombImg);

    // Анимация проигрыша
    setTimeout(() => {
        bombImg.src = 'assets/mediaFiles/images/buttons/pressedRedButton.png';

        const fallingBombImg = document.createElement('img');
        fallingBombImg.src = 'assets/mediaFiles/images/bombs/NuclearBomb.png';
        fallingBombImg.classList.add('NuclearBomb');
        document.querySelector('.BombContainer').appendChild(fallingBombImg);

        const BassBoostSound = document.querySelector('#BassBoost');
        BassBoostSound.volume = 0.1;
        BassBoostSound.play();

        setTimeout(() => {
            const whiteOverlay = document.createElement('div');
            whiteOverlay.classList.add('WhiteOverlay');
            document.body.appendChild(whiteOverlay);

            const BoomSound = document.querySelector('#Boom');
            BoomSound.volume = 0.1;
            BoomSound.play();

            setTimeout(() => {
                window.location.href = "GameField.html";
            }, 1000);
        }, 1000);
    }, 700);
}
// Функция возвращает true, если координаты ячейки находятся в пределах игрового поля (это значит ячейка дествительная)
function isValid(row, column) {
    return row >= 0 &&
        row < heightGameField &&
        column >= 0 &&
        column < widthGameField;
}
// Функция для определения количества бомб вокруг ячейки
function GetBombCountAroundCell(row, column) {
    let count = 0;
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (isBomb(row + y, column + x)) {
                count++;
            }
        }
    }
    return count;
}
// Функция для проверки наличия бомбы в ячейке
function isBomb(row, column) {
    if (!isValid(row, column)) return false;

    const index = row * widthGameField + column;
    return bombs.includes(index);
}

// запуск таймера игры
function StartTimer() {
    // Запуск интервала с заданным временем в миллисекундах
    timer = setInterval(() => {
        // Увеличение количества миллисекунд на 10
        milliseconds += 10;
        // Вычисление общего количества секунд
        const totalSeconds = Math.floor(milliseconds / 1000);
        // Вычисление количества часов, минут и секунд
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        // Форматирование времени в виде строки
        const formattedTime = hours.toString().padStart(2, '0') + ':' +
            minutes.toString().padStart(2, '0') + ':' +
            seconds.toString().padStart(2, '0') + ':' +
            (milliseconds % 1000).toString().padStart(3, '0');
        // Обновление отображения времени игры на странице
        document.querySelector('.GameTimer').textContent = formattedTime;
    }, 10);
}
// остановка таймера игры
function stopTimer() {
    clearInterval(timer);
}

// Функция для установки и удаления флажков
function SetUnsetFlag(event) {
    // Получение ссылки на элемент ячейки
    const cell = event.target;
    // Проверка условий для выхода из функции
    if(cell.classList.contains('disabled') || isGameOver) return;
    // Проверка наличия флажка в ячейке
    if (cell.classList.contains('Flagged')) {
        // Если флажок есть, удаление его из ячейки
        cell.removeChild(cell.querySelector('.Flag'));
        cell.classList.remove('Flagged');
        // Увеличение количества доступных флажков
        flagsCount++;
        // Обновление отображения количества доступных флажков
        DisplayFlags();
        return;
    }
    // Проверка количества доступных флажков
    if(flagsCount <= 0) return;

    // Создание и добавление изображения флажка в ячейку
    const flagImg = document.createElement('img');
    flagImg.src = 'assets/mediaFiles/images/flags/redFlag2.png';
    flagImg.classList.add('Flag');
    cell.appendChild(flagImg);
    cell.classList.add('Flagged');
    // Уменьшение количества доступных флажков
    flagsCount--;
    // Обновление отображения количества доступных флажков
    DisplayFlags();

    // Воспроизведение звука установки флажка
    const settingFlagSounds = [
        document.querySelector('#flagSound1'),
        document.querySelector('#flagSound2')
    ];
    const randomIndex = Math.floor(Math.random() * settingFlagSounds.length);
    const setFlagSound = settingFlagSounds[randomIndex];
    setFlagSound.volume = 0.3;
    setFlagSound.play();
}
// Функция для отслеживания перемещения курсора мыши и перемещения счетчика флажков за ним
function FollowingToCursorFlagCounter() {
    document.addEventListener('mousemove', function(event) {
        let x = event.clientX + 5;
        let y = event.clientY;
        if (x + flagsCounter.offsetWidth > window.innerWidth) {
            x = window.innerWidth - flagsCounter.offsetWidth;
        }
        if (y + flagsCounter.offsetHeight > window.innerHeight) {
            y = window.innerHeight - flagsCounter.offsetHeight;
        }
        flagsCounter.style.left = x + 'px';
        flagsCounter.style.top = y + 'px';
    });
}
// Функция для обновления отображения количества доступных флажков
function DisplayFlags() {
    flagsCounterSpan.textContent = flagsCount;
}