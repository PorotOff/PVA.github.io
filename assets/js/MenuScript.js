const menuApp = new Vue({
	el: '#MenuApp',
	data() {
	  return {
		fieldSize: 'small',
		widthGameField: 10,
		heightGameField: 10,
		BombsOnFieldPercentage: null,
		maxFieldArea: 125670,
		savedWidth: localStorage.getItem('widthGameField'),
		savedHeight: localStorage.getItem('heightGamefield'),
		savedFieldSize: localStorage.getItem('fieldSize'),
		savedDifficulties: localStorage.getItem('difficulties'),
	  };
	},
	methods: {
		changeFieldSize() {
			switch (this.fieldSize) {
				case 'small':
					this.showGameFieldSize(10, 10);
					break;
				case 'medium':
					this.showGameFieldSize(20, 20);
					break;
				case 'large':
					this.showGameFieldSize(30, 30);
					break;
				case 'custom':
					// В данном случае, не выполняется изменение размера поля, так как пользователь вводит значения в поля ввода
					break;
			}
		},
		showGameFieldSize(width, height) {
			this.widthGameField = width;
			this.heightGameField = height;
		},
		StartGame() {
			if(this.widthGameInputField * this.heightGameInputField > this.maxFieldArea){
				GetLargeFieldSizeError();
				return;
			}
			this.widthGameField = this.widthGameInputField;
			this.heightGamefield = this.heightGameInputField;
			localStorage.setItem('widthGameField', this.widthGameField);
			localStorage.setItem('heightGamefield', this.heightGamefield);
			localStorage.setItem('BombsOnFieldPercentage', this.BombsOnFieldPercentage);
			localStorage.setItem('fieldSize', fieldSizeDropdown.value);
			localStorage.setItem('difficulties', difficultiesDropdown.value);
		},
		handleClickForRestartButton() {
			this.ClickOnButtonSound();
			setTimeout(() => {
				window.location.href = 'GameField.html';
			}, 100);
		},
		ClickOnButtonSound() {
			var clickSound = document.getElementById("clickOnButton");
			clickSound.volume = 0.2;
			clickSound.play();
		},
		ChangeDifficult(event) {
			switch (event.target.value) {
				case "easy":
					this.BombsOnFieldPercentage = 15;
					break;
				case "hard":
					this.BombsOnFieldPercentage = 35;
					break;
				case "impossible":
					this.BombsOnFieldPercentage = 55;
					break;
			}
		},
		GetLargeFieldSizeError() {
			let startGameButton = document.querySelector(".StartGameButton label");
			startGameButton.textContent = "сенпай, он слишком большой";
			setTimeout(() => {
				startGameButton.textContent = "начать игру";
			}, 1000);
			document.getElementById("LargeFieldSizeError").play();
			widthGameInputField.style.color = "red";
			heightGameInputField.style.color = "red";
			setTimeout(() => {
				widthGameInputField.style.color = "";
				heightGameInputField.style.color = "";
			}, 1000);
		}
	},
	mounted() {
		if (this.savedFieldSize) {
			this.fieldSizeDropdown = this.savedFieldSize;
			this.ChangeFieldSize();
		}
		if (this.savedDifficulties) {
			this.difficultiesDropdown = this.savedDifficulties;
			this.ChangeDifficult();
		}
		this.ChangeFieldSize();
		if (this.savedWidth) {
			this.widthGameInputField = this.savedWidth;
		}
		if (this.savedHeight) {
			this.heightGameInputField = this.savedHeight;
		}
		this.ChangeDifficult();
		this.changeFieldSize();
	},
});