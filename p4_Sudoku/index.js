/**
 * @class Board 9x9数独矩阵
 */
class Board {
    //构造函数生成空白的9x9数独格子
    constructor() {
        let cells = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                cells[i * 9 + j] = new Cell(i + 1, j + 1, 0);
            }
        };
        this.cells = cells;
    }
    //初始化数独矩阵，生成完整的符合数独规则的表格
    init() {
        let row = 1;
        while (row <= 9) {
            row = Tools.fillRow(this, row);
        };
    }
    //获取当前数独的81个格子列表
    getCells() {
        return this.cells;
    }
    /**
     * 获取指定矩形范围的格子列表
     * @param {number} startRow 开始行数-含
     * @param {number} startCol 开始列数-含
     * @param {number} endRow 结束行数-含
     * @param {number} endCol 结束列数-含
     * @param {boolean} onlyValue 返回格子的值，默认false返回格子对象
     * @returns {array} 指定范围的格子/格子值列表
     */
    getRangeList(startRow, startCol, endRow, endCol, onlyValue = false) {
        let rangeList = this.cells.filter(item => {
            let [cellRow, cellCol] = item.getLocation();
            let isContainRow = cellRow >= startRow && cellRow <= endRow,
                isContainCol = cellCol >= startCol && cellCol <= endCol;
            return isContainRow && isContainCol;
        });
        return onlyValue ? Tools.getValueList(rangeList) : rangeList;
    }
    //获取指定坐标的格子对象
    getSingleCell(row, col) {
        return this.getRangeList(row, col, row, col)[0];
    }
    //获取指定行的9个格子列表
    getRowList(row) {
        return this.getRangeList(row, 1, row, 9);
    }
    //获取指定列的9个格子列表
    getColList(col) {
        return this.getRangeList(1, col, 9, col);
    }
    //获取指定坐标的格子所在3x3区块的9个格子列表
    getSqureList(row, col) {
        let bigRow = parseInt((row - 1) / 3) + 1,
            rowTop = bigRow * 3,
            rowBottom = rowTop - 2,
            bigCol = parseInt((col - 1) / 3) + 1,
            colTop = bigCol * 3,
            colBottom = colTop - 2;
        return this.getRangeList(rowBottom, colBottom, rowTop, colTop);
    }
    /**
     * 批量设置指定矩形范围格子的值
     * @param {number} startRow 开始行数-含
     * @param {number} startCol 开始列数-含
     * @param {number} endRow 结束行数-含
     * @param {number} endCol 结束列数-含
     * @param {number} value 格子的值，默认0
     * @returns {array} 指定范围的格子列表
     */
    setRangeList(startRow, startCol, endRow, endCol, value = 0) {
        let list = this.getRangeList(startRow, startCol, endRow, endCol, false);
        list.forEach(item => {
            item.setValue(value);
        });
        return list;
    }
    /**
     * 设置指定坐标格子的值
     * @param {number} row 行坐标
     * @param {number} col 列坐标
     * @param {number} val 要设置的值
     * @returns {object} 返回指定的格子对象
     */
    setSingleCell(row, col, val) {
        return this.setRangeList(row, col, row, col, val)[0];
    }
    /**
     * 清楚指定矩形范围格子的值和数字使用记录
     * @param {number} startRow 开始行数-含
     * @param {number} startCol 开始列数-含
     * @param {number} endRow 结束行数-含
     * @param {number} endCol 结束列数-含
     */
    clearRangeList(startRow, startCol, endRow, endCol) {
        let list = this.setRangeList(startRow, startCol, endRow, endCol, 0);
        list.forEach(cell => {
            cell.used.clearUsed();
        });
    }
    /**
     * 渲染数独表格
     * @param {object} dom 装载数独表格的容器
     */
    renderBoard(dom) {
        let cells = this.cells;
        let listHtml = document.createElement('ul');
        listHtml.className = 'sudoku-list';
        cells.forEach((item, index) => {
            let cellNode = document.createElement('li');
            let value = item.getValue();
            if (value === 0) cellNode.className = 'zero-cell';
            cellNode.innerText = value;
            listHtml.appendChild(cellNode);
        });
        dom.innerHTML = '';
        dom.appendChild(listHtml);
    }
}
/**
 * @class Cell 数独的单个元素/格子
 */
class Cell {
    /**
     * 格子构造函数
     * @param {number} row 行坐标
     * @param {number} col 列坐标
     * @param {number} val 数值
     */
    constructor(row, col, val) {
        this.row = row;
        this.col = col;
        this.value = val;
        this.used = new NumberUsed();
    }
    //获取当前格子的坐标
    getLocation() {
        return [this.row, this.col];
    }
    //获取当前格子的数值
    getValue() {
        return this.value;
    }
    //设置当前格子的数值
    setValue(val) {
        this.value = val;
        this.used.addUsed(val);
    }
}
/**
 * @class NumberUsed 记录格子使用过的数字
 */
class NumberUsed {
    constructor() {
        this.used = [];
    }
    //获取当前格子使用过的数字列表
    getUsedList() {
        return this.used;
    }
    /**
     * 添加一个使用过的数字
     * @param {number} num 使用的数字
     * @returns {array} 使用过的数字列表
     */
    addUsed(num) {
        this.used.push(num);
        return this.used;
    }
    //删除上一个使用过的数字
    removeLastUsed() {
        this.used.pop();
        return this.used;
    }
    //清除使用记录
    clearUsed() {
        this.used.length = 0;
    }
}
/**
 * @class Tools 工具方法的集合
 */
class Tools {
    //基础数组
    static basicList = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    //获取基础数组的副本
    static getBasicList() {
        return [...this.basicList];
    }
    /**
     * 获取一个随机数，默认返回1~9的随机数
     * @param {number} top 随机数最大值，默认9
     * @param {number} fromZero 是否从零开始，默认false从1开始，设为true可返回随机索引值
     * @returns {number} 生成的随机数
     */
    static getRandomNum(top = 9, fromZero = false) {
        return parseInt(Math.random() * top) + (fromZero ? 0 : 1);
    }
    /**
     * 生成包含1~9随机顺序的数组
     * @returns {array}
     */
    static getRandomOrderValues() {
        let basicList = this.getBasicList();
        let newList = [];
        while (basicList.length > 0) {
            let randomIdnex = this.getRandomNum(basicList.length, true);
            let randomItem = basicList.splice(randomIdnex, 1)[0];
            newList.push(randomItem);
        };
        return newList;
    }
    /**
     * 提取一组格子的值
     * @param {array} cellList 格子数组
     * @returns {array}
     */
    static getValueList(cellList) {
        return cellList.map(item => item.getValue())
    }
    /**
     * 根据数独规则，计算指定坐标格子的可用数字
     * @param {number} row 行坐标
     * @param {number} col 列坐标
     * @param {object} table 所在数独表格对象
     * @returns {array} 可用数字列表
     */
    static getValidNums(row, col, table) {
        let rowList = table.getRowList(row),
            colList = table.getColList(col),
            squreList = table.getSqureList(row, col);
        let rowListVal = Tools.getValueList(rowList),
            colListVal = Tools.getValueList(colList),
            squreListVal = Tools.getValueList(squreList);
        let basicList = Tools.getBasicList();
        let cellUsed = table.getSingleCell(row, col).used.getUsedList();
        return basicList.filter(item => {
            return !rowListVal.includes(item) 
                && !colListVal.includes(item) 
                && !squreListVal.includes(item)
                && !cellUsed.includes(item);
        });
    }
    /**
     * 填充指定行数字
     * @param {object} table 所在数独表格对象
     * @param {number} row 行坐标
     * @returns {number} 下一个操作的行坐标，【上一行】 或 【下一行】
     */
    static fillRow(table, row) {
        table.clearRangeList(row, 1, row, 9);//清空当前行
        let col = 1;
        while (col <= 9) {
            let validNums = this.getValidNums(row, col, table),
                len = validNums.length;
            // console.log(`坐标 (${row}, ${col}) 的可用值有`, validNums);
            if (len > 0) {
                let randomIndex = this.getRandomNum(len - 1, true);
                table.setSingleCell(row, col, validNums[randomIndex]);
                col++;
            } else {
                if (col === 1) {//如果是本行第一个格子，返回操作【上一行】
                    table.clearRangeList(row, 1, row, 9);//清空当前行
                    return row - 1;
                } else {//返回上一个格子
                    table.clearRangeList(row, col, row, col);//清空当前格子
                    col--;
                }
            }
        };
        //本行填充完成，操作【下一行】
        return row + 1;
    }
}
window.onload = () => {
    let appContainer = document.getElementById('app');
    let table = new Board();
    table.init();
    table.renderBoard(appContainer);
};