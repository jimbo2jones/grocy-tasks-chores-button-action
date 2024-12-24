import { GrocyTasksChoresCard } from './card';
import { GrocyTasksChoresCardEditor } from "./editor";
import { version } from '../package.json';

customElements.define(
    'grocy-tasks-chores',
    GrocyTasksChoresCard
);

window.customCards = window.customCards || [];
window.customCards.push({
    type: 'grocy-tasks-chores',
    name: 'Grocy Tasks and Chores Card',
    description: 'Card for displaying tasks and chores from Grocy.'
});

customElements.define(
    'grocy-tasks-chores-card-editor',
    GrocyTasksChoresCardEditor
);

console.info(
    `%c GROCY-TASKS-CHORES %c v${version} `,
    'color: white; background: black; font-weight: 700;',
    'color: black; background: white; font-weight: 700;',
);