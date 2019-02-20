
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

export default Tools;