
const COLORS = ['#020d34', '#cf5a5a', '#c7bd45', '#6897d1', '#73d45c', '#e15dec'];

// 根据图片生成方块
function getDataFromPic() {
    return new Promise((resolve, reject) => {
        // const canvas = document.querySelector('#canvas');
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
                    let a = ctx.getImageData(55+rowIndex*75, 1155-colIndex*75, 1, 1).data;

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

function initGame(rows) {
    new Vue({
        el: "#box",
        data: {
            rows: rows,
            colors: COLORS,
            // colors: ['white', 'red', 'yellow', 'blue', 'green', 'pink'],
            selected: [''],
            score: 0
        },
        created() {
            // const rows = this.$data.rows;
            // while (rows.length < 10) {
            //     const arr = [];
            //     while (arr.length < 10) {
            //         arr.push(parseInt(Math.random() * 5) + 1)
            //     }
            //     rows.push(arr);
            // }
            // this.$data.rows = [
            //     [1, 5, 5, 5, 2, 2, 1, 2, 1, 1],
            //     [5, 1, 5, 5, 3, 5, 2, 2, 2, 3],
            //     [4, 1, 3, 4, 4, 4, 4, 2, 2, 3],
            //     [4, 5, 5, 2, 4, 1, 1, 1, 4, 1],
            //     [5, 3, 3, 1, 1, 5, 4, 2, 2, 3],
            //     [2, 3, 3, 3, 2, 2, 3, 3, 1, 4],
            //     [4, 3, 1, 5, 2, 1, 5, 4, 4, 4],
            //     [1, 3, 4, 3, 3, 3, 2, 4, 2, 1],
            //     [1, 3, 3, 3, 3, 5, 2, 4, 1, 4],
            //     [5, 4, 2, 2, 2, 2, 2, 4, 2, 2],
            // ];
        },
        methods: {

            clickHandler(x, y) {
                // console.log('点击');
                const key = `${x},${y}`;
                const value = this.$data.rows[x][y];
                if (value == 0) {
                    // console.log('0，无效');
                    return
                };
                if (this.$data.selected.indexOf(key) == -1) {

                    // console.log('选择');
                    this.$data.selected = [];
                    this._selectBlock(x, y, value);
                    if (this.selected.length == 1) {
                        this.selected.length = 0;
                    }
                } else {
                    // console.log('清除');
                    this._distroyBlock();
                    console.log('清除点：', x, y);
                }
            },
            _score(num) {
                return num > 1 ? num * num * 5 : 0;
            },
            _selectBlock(x, y, val) {
                const key = `${x},${y}`;
                const value = this.$data.rows[x] && this.$data.rows[x][y];
                if (value && value == val && this.$data.selected.indexOf(key) == -1) {
                    this.$data.selected.push(key);
                    this._selectBlock(x - 1, y, value);
                    this._selectBlock(x + 1, y, value);
                    this._selectBlock(x, y - 1, value);
                    this._selectBlock(x, y + 1, value);
                }
            },
            _distroyBlock() {
                if (this.selected.length < 2) return;
                // console.log('清除内容', this.$data.selected);
                this.$data.selected.forEach(item => {
                    const xy = item.split(',');
                    const x = xy[0];
                    const y = xy[1];
                    this.$data.rows[x].splice(y, 1, 0);
                });
                this.$data.score += this._score(this.$data.selected.length);
                this.$data.selected = [];
                this._cleanUpData();
            },
            _cleanUpData() {
                this.$data.rows = this.$data.rows
                    .filter(item => item.some(item => item != 0))
                    .map(item => item.filter(item => item != 0));
            },
        }
    });
}

getDataFromPic().then(rows => {
    initGame(rows);
});

