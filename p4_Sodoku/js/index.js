import css from '../css/style.css';
import Sodoku from './module/Sodoku';

window.onload = () => {
    (function () {
        var html = document.documentElement;
        function onWindowResize() {
            html.style.fontSize = html.getBoundingClientRect().width / 20 + 'px';
        }
        window.addEventListener('resize', onWindowResize);
        onWindowResize();
    })();
    let appContainer = document.getElementById('app');
    let game = new Sodoku(appContainer);
    console.log(game);
};
window.onunload = () => {
    alert('离开ing...');
}