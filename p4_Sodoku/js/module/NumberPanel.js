
class NumberButton {
    constructor(num) {
        this.num = num;
    }
    getNum() {
        return this.num;
    }
}
class NumberPanel {
    constructor() {
        let list = [];
        for (let i = 1; i <= 9; i++) {
            let btn = new NumberButton(i);
            list.push(btn);
        };
        list.push(new NumberButton(0));//清除输入
        this.buttons = list;
    }
    init(dom, handler) {
        let list = this.buttons;
        let container = document.createElement('ul');
        list.forEach(btn => {
            let btnNode = document.createElement('li');
            let num = btn.getNum();
            btnNode.classList.add('btn');
            btnNode.classList.add('base-cell');
            btnNode.innerText = num === 0 ? '←' : num;
            btnNode.setAttribute('data-value', num);
            btnNode.setAttribute('data-type', 'num');
            container.appendChild(btnNode);
        });
        container.classList.add('number-btns');
        dom.appendChild(container);

        dom.addEventListener('click', (e) => {
            let target = e.target;
            let type = target.getAttribute('data-type');
            console.log('type', type);
            if (type === 'num') {
                let value = Number(target.getAttribute('data-value'));
                console.log('输入==', value);
                handler(value);
            }
        })
    }
}
export default NumberPanel;