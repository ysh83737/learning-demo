
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

export default Cell;