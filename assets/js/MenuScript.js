// Объявление глобальных переменных для ширины и высоты игрового поля и процента бомб на поле
window.widthGameField;
window.heightGamefield;
window.BombsOnFieldPercentage;

// Объявление переменных для элементов ввода размера поля и выбора размера поля и сложности игры
let widthGameInputField;
let heightGameInputField;
let fieldSizeDropdown;
let difficultiesDropdown;
let maxFieldArea = 125670;
// Получение сохраненных значений ширины и высоты поля из локального хранилища
let savedWidth = localStorage.getItem('widthGameField');
let savedHeight = localStorage.getItem('heightGamefield');
// Получение сохраненных значений размера поля и сложности игры из локального хранилища
let savedFieldSize = localStorage.getItem('fieldSize');
let savedDifficulties = localStorage.getItem('difficulties');

// Добавление обработчика событий при загрузке страницы
window.addEventListener('load', function () {
    // Получение элементов ввода размера поля и выбора размера поля и сложности игры
    widthGameInputField = document.getElementById("WidthInputField");
    heightGameInputField = document.getElementById("HeightInputField");
    fieldSizeDropdown = document.getElementById("FieldSizeDropdown");
    difficultiesDropdown = document.getElementById("DifficultiesDropdown");

    // Если сохраненные значения существуют, установка их в соответствующие элементы выбора
    if (savedFieldSize) {
        fieldSizeDropdown.value = savedFieldSize;
        ChangeFieldSize();
    }
    if (savedDifficulties) {
        difficultiesDropdown.value = savedDifficulties;
        ChangeDifficult();
    }

    // Изменение размера поля в соответствии с выбранным значением
    ChangeFieldSize();

    // Если сохраненные значения существуют, установка их в соответствующие элементы ввода
    if (savedWidth) {
        widthGameInputField.value = savedWidth;
    }
    if (savedHeight) {
        heightGameInputField.value = savedHeight;
    }

    // Изменение сложности игры в соответствии с выбранным значением
    ChangeDifficult();
});

// функция для воспроизведения звука нажатия на кнопку, когда пользователь нажимет на кнопки
function ClickOnButtonSound() {
    var clickSound = document.getElementById("clickOnButton");
    clickSound.volume = 0.2;
    clickSound.play();
}

// Функция запуска игры
function StartGame() {
    // Проверка, не превышает ли площадь поля максимально допустимое значение
    if(widthGameInputField.value * heightGameInputField.value > maxFieldArea){
        GetLargeFieldSizeError();
        return;
    }
    // Установка глобальных переменных ширины и высоты игрового поля в соответствии с введенными значениями
    window.widthGameField = widthGameInputField.value;
    window.heightGamefield = heightGameInputField.value;

    // Сохранение текущих значений ширины, высоты, процента бомб на поле, размера поля и сложности игры в локальное хранилище
    localStorage.setItem('widthGameField', window.widthGameField);
    localStorage.setItem('heightGamefield', window.heightGamefield);
    localStorage.setItem('BombsOnFieldPercentage', window.BombsOnFieldPercentage);
    localStorage.setItem('fieldSize', fieldSizeDropdown.value);
    localStorage.setItem('difficulties', difficultiesDropdown.value);
}

// Функция изменения размера поля в соответствии с выбранным значением
function ChangeFieldSize() {
    switch (fieldSizeDropdown.value) {
    case "small":
    ShowGameFieldSize(10, 10);
    break;
    case "medium":
    ShowGameFieldSize(20, 20);
    break;
    case "large":
    ShowGameFieldSize(30, 30);
    break;
    case "custom":
    ShowGameFieldSize(0, 0);
    break;
    }
}

// Функция установки значения "custom" в элемент выбора размера поля
function SetCustomInSelect() {
    fieldSizeDropdown.value = "custom";
}

// Функция отображения заданного размера поля в элементах ввода ширины и высоты
function ShowGameFieldSize(width, height) {
    widthGameInputField.value = width;
    heightGameInputField.value = height;
}

// Функция изменения сложности игры в соответствии с выбранным значением
function ChangeDifficult() {
    switch (difficultiesDropdown.value) {
    case "easy":
    window.BombsOnFieldPercentage = 15;
    break;
    case "hard":
    window.BombsOnFieldPercentage = 35;
    break;
    case "impossible":
    window.BombsOnFieldPercentage = 55;
    break;
    }
}

// Функция отображения ошибки при выборе слишком большого размера поля
function GetLargeFieldSizeError() {
    // Получение элемента кнопки "начать игру"
    let startGameButton = document.querySelector(".StartGameButton label");
    // Изменение текста кнопки на "сенпай, он слишком большой"
    startGameButton.textContent = "сенпай, он слишком большой";
    // Установка таймера на 1 секунду для возврата текста кнопки к исходному значению
    setTimeout(() => {
    startGameButton.textContent = "начать игру";
    }, 1000);
    // Воспроизведение звука ошибки
    document.getElementById("LargeFieldSizeError").play();
    // Изменение цвета текста элементов ввода ширины и высоты поля на красный
    widthGameInputField.style.color = "red";
    heightGameInputField.style.color = "red";
    // Установка таймера на 1 секунду для возврата цвета текста элементов ввода к исходному значению
    setTimeout(() => {
    widthGameInputField.style.color = "";
    heightGameInputField.style.color = "";
    }, 1000);
}   