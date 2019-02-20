
class UserInerfacePanel {
    constructor() {
        //1-初始状态 2-游戏中 3-用户停止 4-游戏过关
        this.status = 1;
        this.dom = null;
    }
    init(dom, handler) {
        dom.classList.add('user-interface');
        this.dom = dom;
        this.renderPanelDom(dom);
        
        dom.addEventListener('click', (e) => {
            let target = e.target;
            let type = target.getAttribute('data-type');
            console.log('type', type);
            if (type === 'opera') {
                let id = target.getAttribute('data-id');
                console.log('设置==', id);
                handler(id);
            }
        })
    }
    changStatus(status) {
        this.status = status;
        this.renderPanelDom(this.dom);
    }
    getStatus() {
        return this.status;
    }
    renderPanelDom(dom) {
        const statusBtns = {1: '123', 2: '4', 3: '5236', 4: '1236'};
        let status = this.status;
        dom.innerHTML = '';
        statusBtns[status].split('').forEach(item => {
            let btnNode = this.getBtnNode(item);
            dom.appendChild(btnNode);
        });
    }
    getBtnNode(btnId) {
        const typeList = ['start', 'next', 'level', 'stop', 'reset', 'answer'];
        const typeName = ['开始', '换一个', '难度', '停止', '重置', '答案'];
        let node = document.createElement('a');
        node.classList.add('user-btns');
        node.classList.add(typeList[btnId - 1]);
        node.innerText = typeName[btnId - 1];
        node.setAttribute('data-type', 'opera');
        node.setAttribute('data-id', typeList[btnId - 1]);
        return node;
    }
}
export default UserInerfacePanel;