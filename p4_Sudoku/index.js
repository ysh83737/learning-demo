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
        this.focusLocation = [0, 0];
        this.dom = null;
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
    digSingleCell(row, col) {
        let cell = this.getSingleCell(row, col);
        cell.setDigStatus(true);
        return cell;
    }
    handleInputFocus(row, col) {
        let cell = this.getSingleCell(row, col);
        if (cell.getDigStatus()) {
            cell.toggleFocus();
            this.setFocusLocation(row, col);
            this.updateCellDom(row, col);
        }
    }
    setFocusLocation(row, col) {
        let [lastRow, lastCol] = this.focusLocation;
        let lastCell = this.getSingleCell(lastRow, lastCol);
        if (lastCell) {
            lastCell.toggleFocus();
            this.setReleAreaFocus(lastRow, lastCol, false);
            this.updateCellDom(lastRow, lastCol);
        };
        this.focusLocation = [row, col];
        this.setReleAreaFocus(row, col, true);
    }
    setReleAreaFocus(row, col, isFocus = true) {
        let associatArea = this.getReleArea(row, col);
        associatArea.forEach(cell => {
            let [cellRow, cellCol] = cell.getLocation();
            cell.setReleFocus(isFocus);
            this.updateCellDom(cellRow, cellCol);
        });
    }
    getReleArea(row, col) {
        let rowList = this.getRowList(row),
            colList = this.getColList(col),
            squreList = this.getSqureList(row, col);
        let combineList = [].concat(rowList, colList, squreList);
        return combineList.reduce((pre, cur) => {
            if (!pre.includes(cur)) pre.push(cur);
            return pre;
        }, []);
    }
    handleUserInput(val) {
        val = Number(val);
        let [row, col] = this.focusLocation;
        let cell = this.getSingleCell(row, col);
        if (!cell) return;
        let isValid = this.checkInputValid(row, col, val);
        cell.setUserInput(val);
        if (isValid) {
            console.log(`(${row}, ${col}) = ${val} valid`);
            if (this.checkAllDone()) {
                this.updateCellDom(row, col);
                alert('恭喜过关');
            } else {
                this.handleInputFocus(...this.getNextDigCell(row, col));
            }
        } else {
            console.log(`(${row}, ${col}) = ${val} invalid`);
        }
        this.updateCellDom(row, col);
    }
    checkInputValid(row, col, val) {
        let editingCell = this.getSingleCell(row, col),
            releAreaCells = this.getReleArea(row, col),
            isValid = true;
        releAreaCells.forEach(cell => {
            let [cellRow, cellCol] = cell.getLocation();
            if (row === cellRow && col === cellCol) return;
            let cellValue = cell.getDigStatus() ? cell.getUserInput() : cell.getValue();
            let cellInvalid = false;
            if (cellValue === val) {
                isValid = false;
                cellInvalid = true;
            } else {
                cellInvalid = false;
            }
            editingCell.setReleInputInvalid(cellRow, cellCol, cellInvalid);
            cell.setReleInputInvalid(row, col, cellInvalid);
            this.updateCellDom(cellRow, cellCol);
        });
        return isValid;
    }
    checkAllDone() {
        let cells = this.getCells();
        for (let i = 0; i < cells.length; i++) {
            let cell = cells[i];
            if (cell.getDigStatus()) {
                if (cell.getUserInput() === 0) return false;
                // if (!cell.getInputValidStatus()) return false;
                if (cell.getReleInputInvalid().length > 0) return false;
            }
        };
        return true;
    }
    getNextDigCell(row, col) {
        let cells = this.getCells(),
            cell = this.getSingleCell(row, col),
            curIndex = cell.getListIndex();
        for (let i = curIndex + 1; i < cells.length; i++) {
            let item = cells[i];
            if (item.getDigStatus()) {
                return item.getLocation();
            }
        };
        return false;
        
    }
    updateCellDom(row, col) {
        let index = (row - 1) * 9 + col - 1,
            cellList = this.dom.children[0],
            oldCellNode = cellList.children[index],
            cell = this.getSingleCell(row, col),
            newCellNode = Tools.renderSingleCell(cell);
        cellList.replaceChild(newCellNode, oldCellNode);
    }
    /**
     * 渲染数独表格
     * @param {object} dom 装载数独表格的容器
     */
    renderBoard(dom) {
        let cells = this.cells;
        let listHtml = document.createElement('ul');
        listHtml.className = 'sudoku-list';
        cells.forEach(cell => {
            let cellNode = Tools.renderSingleCell(cell);
            listHtml.appendChild(cellNode);
        });
        dom.innerHTML = '';
        dom.appendChild(listHtml);
        this.dom = dom;
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
        this.userInput = 0;
        this.isDigged = false;
        this.focus = false;
        this.index = (row - 1) * 9 + col - 1;
        this.releFocus = false;
        this.releInputInvalid = new ReleInputInvalidRecord();
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
    getUserInput() {
        return this.userInput;
    }
    setUserInput(val) {
        this.userInput = val;
    }
    getDigStatus() {
        return this.isDigged;
    }
    setDigStatus(bool) {
        this.isDigged = bool;
    }
    toggleFocus() {
        this.focus = !this.focus;
    }
    getFocus() {
        return this.focus;
    }
    getListIndex() {
        return this.index;
    }
    getReleFocus() {
        return this.releFocus;
    }
    setReleFocus(bool) {
        this.releFocus = bool;
        return this;
    }
    getReleInputInvalid() {
        return this.releInputInvalid.getArray();
    }
    setReleInputInvalid(row, col, isAdd) {
        return this.releInputInvalid.handleRecord(row, col, isAdd);
    }
}
class ReleInputInvalidRecord {
    constructor() {
        this.record = new Set();
    }
    handleRecord(row, col, isAdd) {
        let record = this.record,
            str = `${row}-${col}`;
        if (isAdd) {
            record.add(str);
        } else {
            record.delete(str);
        };
    }
    getArray() {
        return [...this.record];
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
        return parseInt(Math.random() * (top - 0.1)) + (fromZero ? 0 : 1);
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
     * @param {boolean} isInput 是不是用户输入，如果是，优先返回输入数据
     * @returns {array}
     */
    static getValueList(cellList, isInput = false, row, col) {
        return cellList.map(cell => {
            if (isInput) {
                let [cellRow, cellCol] = cell.getLocation();
                if (row === cellRow && col === cellCol) return 0;
                return cell.getDigStatus() ? cell.getUserInput() : cell.getValue();
            } else {
                return cell.getValue();
            }
        })
    }
    /**
     * 根据数独规则，计算指定坐标格子的可用数字
     * @param {number} row 行坐标
     * @param {number} col 列坐标
     * @param {object} table 所在数独表格对象
     * @param {boolean} isInput 是不是用户输入的情况
     * @returns {array} 可用数字列表
     */
    static getValidNums(row, col, table, isInput = false) {
        let rowList = table.getRowList(row),
            colList = table.getColList(col),
            squreList = table.getSqureList(row, col);
        let rowListVal = this.getValueList(rowList, isInput, row, col),
            colListVal = this.getValueList(colList, isInput, row, col),
            squreListVal = this.getValueList(squreList, isInput, row, col);
        let basicList = this.getBasicList();
        let cellUsed = isInput ? [] : table.getSingleCell(row, col).used.getUsedList();
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
            let validNums = this.getValidNums(row, col, table, false),
                len = validNums.length;
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
    static renderSingleCell(cell) {
        let cellNode = document.createElement('li');
        let value = cell.getValue(),
            [row, col] = cell.getLocation();
        cellNode.classList.add('base-cell');
        if (row === 3 || row === 6) cellNode.classList.add('bold-bottom');
        if (row === 4 || row === 7) cellNode.classList.add('bold-top');
        if (col === 3 || col === 6) cellNode.classList.add('bold-right');
        if (col === 4 || col === 7) cellNode.classList.add('bold-left');
        if (value === 0) cellNode.classList.add('zero-cell');
        if (cell.getFocus()) cellNode.classList.add('focus');
        if (cell.getReleFocus()) cellNode.classList.add('rele-focus');
        if (cell.getReleInputInvalid().length > 0) cellNode.classList.add('rele-invalid');
        if (cell.getDigStatus()) {
            let userInput = cell.getUserInput();
            value = userInput || '';
            cellNode.classList.add('digged-cell');
        };
        cellNode.innerText = value;
        cellNode.setAttribute('data-location', `${row}-${col}`);
        cellNode.setAttribute('data-type', 'cell');
        return cellNode;
    }
}
class Sodoku {
    constructor(dom) {
        let table = new Board();
        let panel = new NumberPanel();
        table.init();
        table.renderBoard(dom);
        // table.renderBoard(document.getElementById('answer'));//答案
        this.dom = dom;
        this.table = table;
        this.panel = panel;
    }
    /**
     * 对完整的数独进行挖空
     * @param {number} level 难度等级 ---------- 暂时没用，未掌握数独定级算法
     *      1-简单 -每行保留4格
     *      2-普通 -每行保留3格
     *      3-困难 -每行保留2格
     */
    digBoard(level = 1) {
        let keepCount = 5 - level;
        let table = this.table;
        for (let row = 1; row <= 9; row++) {
            let keepColList = [];
            for (let j = 0; j < keepCount; j++) {
                let randomCol = Tools.getRandomNum(9, false);
                while (keepColList.includes(randomCol)) {
                    randomCol = Tools.getRandomNum(9, false);
                };
                keepColList.push(randomCol);
            };
            for (let col = 1; col <= 9; col++) {
                if (!keepColList.includes(col)) {
                    table.digSingleCell(row, col);
                }
            }
        }
    }
    updateDom() {
        this.table.renderBoard(this.dom);
    }
    gameStart() {
        let dom = this.dom;
        dom.addEventListener('click', (e) => {
            let target = e.target;
            let type = target.getAttribute('data-type');
            switch (type) {
                case 'cell':
                    let [row, col] = target.getAttribute('data-location').split('-').map(item => Number(item));
                    this.table.handleInputFocus(row, col);
                    break;
                case 'btn':
                    let inputNum = target.getAttribute('data-value');
                    this.table.handleUserInput(inputNum);
                    break;
                default:
                    console.log('点击无效区域');
                    break;
            }
        });
        this.panel.init(dom);
    }
}
class NumberPanel {
    constructor() {
        let list = [];
        for (let i = 1; i <= 9; i++) {
            let btn = new NumberButton(i);
            list.push(btn);
        };
        this.buttons = list;
    }
    init(dom) {
        let list = this.buttons;
        let container = document.createElement('ul');
        list.forEach(btn => {
            let btnNode = document.createElement('li');
            btnNode.classList.add('btn');
            btnNode.classList.add('base-cell');
            btnNode.innerText = btn.getNum();
            btnNode.setAttribute('data-value', btn.getNum());
            btnNode.setAttribute('data-type', 'btn');
            container.appendChild(btnNode);
        });
        container.classList.add('number-btns');
        dom.appendChild(container);
    }
}
class NumberButton {
    constructor(num) {
        this.num = num;
    }
    getNum() {
        return this.num;
    }
}
window.onload = () => {
    let appContainer = document.getElementById('app');
    let game = new Sodoku(appContainer);
    game.digBoard(1);
    game.updateDom();
    game.gameStart();
    console.log(game);
};