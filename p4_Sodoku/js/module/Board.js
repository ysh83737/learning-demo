import Cell from './Cell';
import Tools from './Tools';
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
        console.log('this===', this);
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
                // this.handleInputFocus(...this.getNextDigCell(row, col));//移到下一格
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
            if (val !== 0 && cellValue === val) {
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
    renderBoard(dom, handler) {
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

        dom.addEventListener('click', (e) => {
            let target = e.target;
            let type = target.getAttribute('data-type');
            console.log('type', type);
            if (type === 'cell') {
                let [row, col] = target.getAttribute('data-location').split('-').map(item => Number(item));
                console.log('坐标==', row, col);
                this.handleInputFocus(row, col);
            }
        })
    }
}
export default Board;