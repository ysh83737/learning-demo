import css from '../css/style.css';
import Sodoku from './module/Sodoku';

window.onload = () => {
    let appContainer = document.getElementById('app');
    let game = new Sodoku(appContainer);
    console.log(game);
};
window.onunload = () => {
    alert('离开ing...');
}