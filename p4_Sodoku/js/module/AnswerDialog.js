class AnswerDialog {
    constructor() {
        this.dom = null;
        this.container = null;
    }
    init(dom) {
        let closeBtn = document.createElement('a'),
            container = document.createElement('div');
        dom.className = 'answer-table';
        closeBtn.className = 'close-btn';
        container.className = 'answer-init';
        dom.appendChild(closeBtn);
        dom.appendChild(container);
        this.dom = dom;
        this.container = container;
        closeBtn.addEventListener('click', () => {
            this.toggleAnswerShow();
        });
    }
    updateAnswer(table) {
        table.renderBoard(this.container);
    }
    getShowStatus() {
        return this.show;
    }
    toggleAnswerShow() {
        let classList = this.dom.classList,
            isShow = classList.contains('show');
        classList[isShow ? 'remove' : 'add']('show');
    }
}
export default AnswerDialog;