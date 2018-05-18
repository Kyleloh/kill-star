
const COLORS = ['#020d34', '#cf5a5a', '#c7bd45', '#6897d1', '#73d45c', '#e15dec'];

let gameover = false;

// 根据图片生成方块
function getDataFromPic() {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = 750;
        canvas.height = 1334;
        const ctx = canvas.getContext('2d');

        const image = new Image();
        image.src = "./test.jpeg";
        image.onload = function () {
            ctx.drawImage(image, 0, 0);

            let rows = new Array(10).fill(new Array(10).fill(0));
            rows = rows.map((item, rowIndex) => {
                return item.map((item, colIndex) => {
                    let a = ctx.getImageData(55 + rowIndex * 75, 1155 - colIndex * 75, 1, 1).data;

                    let r = a[0],
                        g = a[1],
                        b = a[2];

                    let colorsDifferent = COLORS.map(item => {
                        let xr = item.substring(1, 3),
                            xg = item.substring(3, 5),
                            xb = item.substring(5, 7);
                        return Math.abs(parseInt(xr, 16) - r) + Math.abs(parseInt(xg, 16) - g) + Math.abs(parseInt(xb, 16) - b);
                    });
                    let minNumber = colorsDifferent.reduce((prev, now) => Math.min(prev, now));
                    let color = colorsDifferent.indexOf(minNumber);
                    return color;
                });
            });
            resolve(rows);
        }

    })
}


// 1 => 1000
// 2 => 3000
// 3 => 6000
// 4 => 8000
// 5 => 10000
// 6 => 13000
// 7 => 15000
// ...
// 34 => 120000
// 35 => 124000


function initGame(rows) {
    new Vue({
        el: "#box",
        data: {
            rows: rows,
            colors: COLORS,
            selected: [''],
            score: 0,
            remainingParts: [],
            blockAmount: 100,
        },
        created() {
            this.resetRemainingParts();
        },
        methods: {
            resetRemainingParts() {
                let remainingParts = [];
                this.$data.rows.forEach((item, rowIndex) => {
                    item.forEach((item, colIndex) => {
                        const sameColorBlock = this._getSameColorBlock(rowIndex, colIndex);
                        if (sameColorBlock.length > 1 && !remainingParts.some(item => item.indexOf(`${rowIndex},${colIndex}`) != -1)) {
                            const partString = sameColorBlock.join(';');
                            remainingParts.push(partString);
                        }
                    })
                });
                this.$data.remainingParts = remainingParts;
            },
            clickHandler(x, y) {
                const key = `${x},${y}`;
                const value = this.$data.rows[x][y];
                if (value == 0) {
                    return
                };
                if (this.$data.selected.indexOf(key) == -1) {
                    this.$data.selected = [];
                    this._selectBlock(x, y);
                    if (this.selected.length == 1) {
                        this.selected.length = 0;
                    }
                } else {
                    console.log('清除点：', x, y);
                    this._distroyBlock();
                }
            },
            _score(num) {
                return num > 1 ? num * num * 5 : 0;
            },
            _selectBlock(x, y) {
                let selectArray = this._getSameColorBlock(x, y);
                if (selectArray.length < 2) return;
                this.$data.selected = selectArray;
            },
            _getSameColorBlock(x, y, val, result = []) {
                const key = `${x},${y}`;
                const value = this.$data.rows[x] && this.$data.rows[x][y];
                if (!val || (value && value == val && result.indexOf(key) == -1)) {
                    result.push(key);
                    result = result.concat(this._getSameColorBlock(x - 1, y, value, result));
                    result = result.concat(this._getSameColorBlock(x + 1, y, value, result));
                    result = result.concat(this._getSameColorBlock(x, y - 1, value, result));
                    result = result.concat(this._getSameColorBlock(x, y + 1, value, result));
                }
                return [...new Set(result)];
            },
            _distroyBlock() {
                if (this.selected.length < 2) return;
                console.log(this.selected[0]);
                this.$data.selected.forEach(item => {
                    const xy = item.split(',');
                    const x = xy[0];
                    const y = xy[1];
                    this.$data.rows[x].splice(y, 1, 0);
                });
                this._cleanUpData();
            },
            _cleanUpData() {
                this.$data.rows = this.$data.rows
                    .filter(item => item.some(item => item != 0))
                    .map(item => item.filter(item => item != 0));

                this.resetRemainingParts();

                this.countScore();

                this.$data.selected = [];
            },
            countBlock() {
                this.$data.amount = this.$data.rows.reduce((total, item) => total + item.filter(item => item != 0).length, 0);
            },
            countScore() {
                this.$data.score += this._score(this.$data.selected.length);
                this.countBlock();
                if (this.$data.remainingParts.length == 0) {
                    this.$data.score += Math.max(0, 2000 - this.$data.amount * this.$data.amount * 20);
                    console.log('game over! score: ' + this.$data.score);
                    gameover = true;
                }
            }
        }
    });
}

getDataFromPic().then(rows => {
    initGame(rows);
});

