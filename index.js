new Vue({
    el: "#box",
    data: {
        rows: [],
        colors: ['#020d34', '#cf5a5a', '#c7bd45', '#6897d1', '#73d45c', '#e15dec'],
        // colors: ['white', 'red', 'yellow', 'blue', 'green', 'pink'],
        selected: [''],
        score: 0
    },
    created() {
        const rows = this.$data.rows;
        while (rows.length < 10) {
            const arr = [];
            while (arr.length < 10) {
                arr.push(parseInt(Math.random() * 5) + 1)
            }
            rows.push(arr);
        }

    },
    methods: {
        
        clickHandler(x, y) {
            console.log('点击');
            const key = `${x},${y}`;
            const value = this.$data.rows[x][y];
            if (value == 0) {
                console.log('0，无效');
                return };
            if (this.$data.selected.indexOf(key) == -1) {

                console.log('选择');
                this.$data.selected = [];
                this._selectBlock(x, y, value);
                if(this.selected.length==1){
                    this.selected.length = 0;
                }
            } else {
                console.log('清除');
                this._distroyBlock();
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
            if(this.selected.length < 2) return;
            console.log('清除内容', this.$data.selected);
            this.$data.selected.forEach(item => {
                const xy = item.split(',');
                const x = xy[0];
                const y = xy[1];
                this.$data.rows[x].splice(y,1,0);
            });
            this.$data.score+=this._score(this.$data.selected.length);
            this.$data.selected=[];
            this._cleanUpData();
        },
        _cleanUpData(){
            this.$data.rows = this.$data.rows
            .filter(item => item.some(item=>item!=0))
            .map(item=>item.filter(item => item != 0));    
        },
    }
})