import { html, LitElement } from 'lit';
import { DateTime, Settings as LuxonSettings } from 'luxon';
import styles from './card.styles';

export class GrocyTasksChoresCard extends LitElement {
    static styles = styles;

    _hass;
    _tasksEntity;
    _choresEntity;
    _tasksAndChoresJson;
    _title;
    _sort;
    _columns;
    _layout;
    _showTypeIcon;
    _taskIcon;
    _choreIcon;
    _iconMapping;
    _wrapName
    _showDescription;
    _wrapDescription
    _showDueDate;
    _wrapDueDate
    _showDueDateLabel;
    _showLastDate;
    _wrapLastDate
    _showLastDateLabel;
    _showUser;
    _wrapUser;
    _showUserLabel;
    _dateFormat;
    _timeFormat;
    _relativeDateDays;
    _almostDueDays;
    _dueDays;
    _texts;
    _userId;
    _hideNotDue;
    _hideAlmostDue;
    _hideDue;
    _filterUsers;
    _filterTaskCategories;
    _tappedTasks = {
        chore: [],
        task: []
    };

    /**
     * Get config element
     *
     * @returns {HTMLElement}
     */
    static getConfigElement() {
        // Create and return an editor element
        return document.createElement("grocy-tasks-chores-card-editor");
    }

    /**
     * Get stub config
     *
     * @returns Object
     */
    static getStubConfig() {
        return {
            title: '',
            entity: {
                tasks: null,
                chores: null
            },
            sort: 'date desc'
        };
    }

    /**
     * Get properties
     *
     * @return {Object}
     */
    static get properties() {
        return {
            _config: { type: Object },
            _tasksAndChores: { type: Array },
            _tappedTasks: { type: Object }
        }
    }

    /**
     * Set configuration
     *
     * @param {Object} config
     */
    setConfig(config) {
        this._config = config;

        if (!config.entity || !config.entity.tasks && !config.entity.chores) {
            throw new Error('No tasks and/or chores entities configured');
        }

        this._title = config.title ?? null;
        this._tasksEntity = config.entity.tasks ?? null;
        this._choresEntity = config.entity.chores ?? null;
        this._sort = config.sort ?? 'date desc';
        this._columns = config.columns ?? 2;
        this._layout = config.layout ?? 'horizontal';
        this._showTypeIcon = config.showTypeIcon ?? true;
        this._taskIcon = config.taskIcon ?? 'mdi:calendar-check';
        this._choreIcon = config.choreIcon ?? 'mdi:vacuum';
        this._iconMapping = this._mapIcons(config.iconMapping ?? {});
        this._wrapName = config.wrapName ?? false;
        this._showDescription = config.showDescription ?? false;
        this._wrapDescription = config.wrapDescription ?? false;
        this._showDueDate = config.showDueDate ?? true;
        this._wrapDueDate = config.wrapDueDate ?? false;
        this._showDueDateLabel = config.showDueDateLabel ?? true;
        this._showLastDate = config.showLastDate ?? false;
        this._wrapLastDate = config.wrapLastDate ?? false;
        this._showLastDateLabel = config.showLastDateLabel ?? true;
        this._showUser = config.showUser ?? false;
        this._wrapUser = config.wrapUser ?? false;
        this._showUserLabel = config.showUserLabel ?? true;
        this._dateFormat = config.dateFormat ?? 'd LLLL yyyy';
        this._timeFormat = config.timeFormat ?? 'HH:mm';
        this._relativeDateDays = config.relativeDateDays ?? 14;
        this._almostDueDays = config.almostDueDays ?? 3;
        this._dueDays = config.dueDays ?? 0;
        this._userId = config.userId ?? 0;
        this._hideNotDue = config.hideNotDue ?? false;
        this._hideAlmostDue = config.hideAlmostDue ?? false;
        this._hideDue = config.hideDue ?? false;
        this._filterUsers = config.filterUsers ? String(config.filterUsers).split(',').map(Number) : null;
        this._filterTaskCategories = config.filterTaskCategories ? String(config.filterTaskCategories).split(',').map(Number) : null;

        if (config.locale) {
            LuxonSettings.defaultLocale = config.locale;
        }

        this._texts = Object.assign({
            due: 'Due:',
            last: 'Last:',
            user: 'User:',
            none: 'No tasks or chores found'
        }, config.texts ?? {});
    }

    set hass(hass) {
        this._hass = hass;
        this._processTasksAndChores();
    }

    /**
     * Render
     *
     * @return {Object}
     */
    render() {
        this._tappedTasks = {
            chore: [],
            task: []
        }

        const cardClasses = [
            'layout-' + this._layout
        ];
        const cardStyles = [
            '--task-columns: ' + this._columns
        ];

        return html`
            <ha-card class="${cardClasses.join(' ')}" style="${cardStyles.join('; ')}">
                <div class="card-content">
                    ${this._error ?
                        html`<ha-alert alert-type="error">${this._error}</ha-alert>` :
                        ''
                    }
                    ${this._title ?
                        html`<h1 class="card-title">${this._title}</h1>` :
                        ''
                    }
                    <div class="container">
                        ${this._tasksAndChores.length === 0 ?
                            html`
                                <div class="none">${this._texts.none}</div>
                            ` :
                            html`
                                ${this._tasksAndChores.map((task) => {
                                    const taskContainerClasses = ['task', 'task-' + task.type];

                                    if (task.dueClass) {
                                        taskContainerClasses.push(task.dueClass);
                                    }

                                    if (task.tapped) {
                                        taskContainerClasses.push('tapped');
                                    }

                                    return html`
                                        <div
                                            class="${taskContainerClasses.join(' ')}"
                                            title="${task.name}"
                                            data-type="${task.type}"
                                            data-name="${task.name}"
                                            data-description="${task.description}"
                                            data-due-date="${task.dueDate}"
                                            data-last-date="${task.lastDate}"
                                            data-user-id="${task.user.id}"
                                            data-user-username="${task.user.username}"
                                            data-user-name="${task.user.name}"
                                            @click="${() => {
                                                this._handleTap(task.type, task.id);
                                            }}"
                                        >
                                            ${this._showTypeIcon ?
                                                    html`
                                                    <div class="icon">
                                                        <div class="shape">
                                                            <ha-icon icon="${this._getIcon(task.type, task.id)}"></ha-icon>
                                                        </div>
                                                    </div>
                                                ` :
                                                ''
                                            }
                                            <div class="info">
                                                <div class="name${this._wrapName ? ' wrap' : ''}" title="${task.name}">${task.name}</div>
                                                ${(this._showDescription && task.description) ?
                                                    html`
                                                        <div class="description${this._wrapDescription ? ' wrap' : ''}">${task.description}</div>
                                                    ` :
                                                    ''
                                                }
                                                ${(this._showDueDate && task.dueDate) ?
                                                    html`
                                                        <div class="dueDate${this._wrapDueDate ? ' wrap' : ''}" title="${this._formatDate(task.dueDate, false)}">
                                                            ${this._showDueDateLabel ? this._texts.due : ''}
                                                            ${this._formatDate(task.dueDate)}
                                                        </div>
                                                    ` :
                                                    ''
                                                }
                                                ${(this._showLastDate && task.lastDate) ?
                                                    html`
                                                        <div class="lastDate${this._wrapLastDate ? ' wrap' : ''}" title="${this._formatDate(task.lastDate, false)}">
                                                            ${this._showLastDateLabel ? this._texts.last : ''}
                                                            ${this._formatDate(task.lastDate)}
                                                        </div>
                                                    ` :
                                                    ''
                                                }
                                                ${(this._showUser && task.user) ?
                                                    html`
                                                        <div class="user${this._wrapUser ? ' wrap' : ''}" title="${task.user.name}">
                                                            ${this._showUserLabel ? this._texts.user : ''}
                                                            ${task.user.name ?? task.user.username}
                                                        </div>
                                                    ` :
                                                    ''
                                                }
                                            </div>
                                        </div>
                                    `;
                                })}
                            `
                        }
                    </div>
                </div>
            </ha-card>
        `;
    }

    _processTasksAndChores() {
        let processedTasksAndChores = [...this._processTasks(), ...this._processChores()];

        processedTasksAndChores = processedTasksAndChores.sort((taskOrChore1, taskOrChore2) => {
            switch (this._sort) {
                case 'name':
                case 'name asc':
                    return taskOrChore1.name > taskOrChore2.name ? 1 : taskOrChore1.name < taskOrChore2.name ? -1 : 0;
                case 'name desc':
                    return taskOrChore1.name < taskOrChore2.name ? 1 : taskOrChore1.name > taskOrChore2.name ? -1 : 0;
                case 'date asc':
                    return this._dateSort(taskOrChore1.dueDate, taskOrChore2.dueDate);
                case 'date':
                case 'date desc':
                default:
                    return -this._dateSort(taskOrChore1.dueDate, taskOrChore2.dueDate);
            }
        });

        const processedTasksAndChoresJson = JSON.stringify(processedTasksAndChores);
        if (processedTasksAndChoresJson !== this._tasksAndChoresJson) {
            this._tasksAndChores = processedTasksAndChores;
            this._tasksAndChoresJson = processedTasksAndChoresJson;
        }
    }

    _dateSort(date1, date2) {
        if (!date1 || !date2) {
            if (date1) {
                return -1;
            } else if (date2) {
                return 1;
            }
            return 0;
        }
        return date1 > date2 ? 1 : date1 < date2 ? -1 : 0;
    }

    _processTasks() {
        const processedTasks = [];

        const tasks = this._getTasks();
        tasks.forEach((task) => {
            if (this._tappedTasks.task[task.id] && task.done) {
                this._setTappedTask('task', task.id, true);
            }

            if (task.done) {
                return;
            }

            const dueClass = this._getDueClass(task.due_date);
            const user = this._processUser(task.assigned_to_user);
            if (this._isFiltered(dueClass, user.id ?? 0, task.category_id ?? 0)) {
                return;
            }

            processedTasks.push({
                type: 'task',
                id: task.id,
                name: task.name,
                description: task.description ?? null,
                dueDate: task.due_date,
                dueClass: dueClass,
                user: user,
                tapped: !!this._tappedTasks.task[task.id]
            });
        });

        return processedTasks;
    }

    _processChores() {
        const processedChores = [];

        const chores = this._getChores();
        chores.forEach((chore) => {
            if (this._tappedTasks.chore[chore.id] && DateTime.fromISO(chore.last_tracked_time) >= this._tappedTasks.chore[chore.id]) {
                this._setTappedTask('chore', chore.id, true);
            }

            const dueClass = this._getDueClass(chore.next_estimated_execution_time);
            const user = this._processUser(chore.next_execution_assigned_user);
            if (this._isFiltered(dueClass, user.id ?? 0)) {
                return;
            }

            processedChores.push({
                type: 'chore',
                id: chore.id,
                name: chore.name,
                description: chore.description ?? null,
                dueDate: chore.next_estimated_execution_time,
                dueClass: dueClass,
                user: user,
                lastDate: chore.last_tracked_time ?? null,
                lastUser: this._processUser(chore.last_done_by),
                timesDone: chore.track_count ?? 0,
                tapped: !!this._tappedTasks.chore[chore.id]
            });
        });

        return processedChores;
    }

    _isFiltered(dueClass, userId, taskCategoryId) {
        return this._hideNotDue && dueClass === null
            || this._hideAlmostDue && dueClass === 'almostDue'
            || this._hideDue && dueClass === 'due'
            || this._filterUsers && this._filterUsers.indexOf(userId) === -1
            || this._filterTaskCategories && taskCategoryId !== undefined && this._filterTaskCategories.indexOf(taskCategoryId) === -1
    }

    _processUser(user) {
        if (!user || !user.id) {
            return {};
        }

        return {
            id: user.id,
            name: user.display_name ?? null,
            username: user.username ?? null
        }
    }

    _getTasks() {
        if (
            !this._tasksEntity
            || !this._hass.states[this._tasksEntity]
            || !this._hass.states[this._tasksEntity].attributes
            || !this._hass.states[this._tasksEntity].attributes.tasks
        ) {
            return [];
        }

        return this._hass.states[this._tasksEntity].attributes.tasks ?? [];
    }

    _getChores() {
        if (
            !this._choresEntity
            || !this._hass.states[this._choresEntity]
            || !this._hass.states[this._choresEntity].attributes
            || !this._hass.states[this._choresEntity].attributes.chores
        ) {
            return [];
        }

        return this._hass.states[this._choresEntity].attributes.chores ?? [];
    }

    _formatDate(date, relative) {
        date = DateTime.fromISO(date);
        relative = relative ?? true;
        const relativeFromDate = DateTime.now().plus({ days: this._relativeDateDays });
        const relativeToDate = DateTime.now().minus({ days: this._relativeDateDays });

        if (relative && date < relativeFromDate && date > relativeToDate) {
            // Setting `{ unit: "days" }` is a workaround for Luxon issue https://github.com/moment/luxon/issues/394
            return DateTime.fromISO(date).toRelativeCalendar({ unit: "days" });
        }

        let formattedDate = DateTime.fromISO(date).toFormat(this._dateFormat);
        if (date.hour > 0 || date.minute > 0 || date.second > 0) {
            formattedDate += ' ' + DateTime.fromISO(date).toFormat(this._timeFormat);
        }

        return formattedDate;
    }

    _getDueClass(date) {
        date = DateTime.fromISO(date);

        const dueDate = DateTime.now().plus({ days: this._dueDays });
        if (date < dueDate) {
            return 'due';
        }

        const almostDueDate = DateTime.now().plus({ days: this._almostDueDays });
        if (date < almostDueDate) {
            return 'almostDue';
        }

        return null;
    }

    _mapIcons(mapping) {
        const taskMapping = mapping.task ?? {};
        const choreMapping = mapping.chore ?? {};

        return {
            task: taskMapping,
            chore: choreMapping
        }
    }

    _getIcon(type, id) {
        if (this._iconMapping[type][id]) {
            return this._iconMapping[type][id];
        }

        return type === 'chore' ? this._choreIcon : this._taskIcon;
    }

    _handleTap(type, id) {
        if (this._tappedTasks[type][id]) {
            return;
        }
        this._setTappedTask(type, id);

        const event = new Event(
            'hass-action', {
                bubbles: true,
                composed: true,
            }
        );

        let config = {
            tap_action: {
                action: 'perform-action',
                perform_action: 'grocy.complete_task',
                data: {
                    task_id: id
                }
            }
        }
        if (type === 'chore') {
            config = {
                tap_action: {
                    action: 'perform-action',
                    perform_action: 'grocy.execute_chore',
                    target: {},
                    data: {
                        chore_id: id,
                        done_by: this._userId
                    }
                }
            }
        }

        event.detail = {
            config: config,
            action: 'tap',
        }
        this.dispatchEvent(event);
    }

    _setTappedTask(type, id, unset) {
        this._tappedTasks[type][id] = unset ? null : DateTime.now().startOf('minute');
        this._tappedTasks = Object.assign({}, this._tappedTasks);
    }
}
