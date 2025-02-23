import { html, LitElement } from "lit";
import styles from './editor.styles';

export class GrocyTasksChoresCardEditor extends LitElement {
    static styles = styles;

    connectedCallback() {
        super.connectedCallback();
        this.loadCustomElements();
    }

    async loadCustomElements() {
        if (!customElements.get("ha-entity-picker")) {
            await customElements.get("hui-entities-card").getConfigElement();
        }
    }

    static get properties() {
        return {
            hass: {},
            _config: {},
        };
    }

    setConfig(config) {
        this._config = config;
    }

    render() {
        if (!this.hass || !this._config) {
            return html``;
        }

        const sortingOptions = [
            {
                value: 'date desc',
                label: 'Date descending'
            }, {
                value: 'date asc',
                label: 'Date ascending'
            }, {
                value: 'name asc',
                label: 'Alphabetical A-Z'
            }, {
                value: 'name desc',
                label: 'Alphabetical Z-A'
            }
        ];
        const layoutOptions = [
            {
                value: 'horizontal',
                label: 'Horizontal'
            }, {
                value: 'vertical',
                label: 'Vertical'
            }
        ];

        return html`
            <div style="display: flex; flex-direction: column">
                ${this.addTextField('title', 'Title')}
                ${this.addExpansionPanel(
                    'Entities',
                    html`
                        ${this.addEntityPickerField('entity.tasks', 'Tasks entity')}
                        ${this.addEntityPickerField('entity.chores', 'Chores entity')}
                    `
                )}
                ${this.addExpansionPanel(
                    'Appearance',
                    html`
                        ${this.addSelectField('sort', 'Sorting', sortingOptions, false, 'date desc')}
                        ${this.addTextField('columns', 'Number of columns', 'number', 2)}
                        ${this.addSelectField('layout', 'Layout', layoutOptions, false, 'horizontal')}
                        ${this.addBooleanField('wrapName', 'Wrap name', false)}
                        ${this.addBooleanField('showDescription', 'Show description', false)}
                        ${this.addBooleanField('wrapDescription', 'Wrap description', false)}
                        ${this.addBooleanField('showDueDate', 'Show due date', true)}
                        ${this.addBooleanField('wrapDueDate', 'Wrap due date', false)}
                        ${this.addBooleanField('showDueDateLabel', 'Show due date label', true)}
                        ${this.addBooleanField('showLastDate', 'Show last date', false)}
                        ${this.addBooleanField('wrapLastDate', 'Wrap last date', false)}
                        ${this.addBooleanField('showLastDateLabel', 'Show last date label', true)}
                        ${this.addBooleanField('showUser', 'Show user name', false)}
                        ${this.addBooleanField('wrapUser', 'Wrap user name', false)}
                        ${this.addBooleanField('showUserLabel', 'Show user name label', true)}
                    `
                )}
                ${this.addExpansionPanel(
                    'Icons',
                    html`
                        ${this.addBooleanField('showTypeIcon', 'Show type icon', true)}
                        ${this.addIconPickerField('taskIcon', 'Default task icon', 'mdi:calendar-check')}
                        ${this.addIconPickerField('choreIcon', 'Default chore icon', 'mdi:vacuum')}
                    `
                    // @todo Add icon mapping
                )}
                ${this.addExpansionPanel(
                    'Date/time format',
                    html`
                        ${this.addTextField('locale', 'Locale')}
                        ${this.addTextField('dateFormat', 'Date format', null, 'd LLLL yyyy')}
                        ${this.addTextField('timeFormat', 'Time format', null, 'HH:MM')}
                        ${this.addTextField('relativeDateDays', 'Relative date days', 'number', 14)}
                    `
                )}
                ${this.addExpansionPanel(
                    'Highlight due',
                    html`
                        ${this.addTextField('almostDueDays', 'Almost due days', 'number', 3)}
                        ${this.addTextField('dueDays', 'Due days', 'number', 0)}
                    `
                )}
                ${this.addExpansionPanel(
                    'Grocy user',
                    html`
                        ${this.addTextField('userId', 'User ID', 'number', 0)}
                    `
                )}
                ${this.addExpansionPanel(
                    'Filter',
                    html`
                        ${this.addBooleanField('hideNotDue', 'Hide not due', false)}
                        ${this.addBooleanField('hideAlmostDue', 'Hide almost due', false)}
                        ${this.addBooleanField('hideDue', 'Hide due', false)}
                        ${this.addTextField('filterUsers', 'Filter users (comma separated id\'s)')}
                        ${this.addTextField('filterTaskCategories', 'Filter task categories (comma separated id\'s)')}
                    `
                )}
                ${this.addExpansionPanel(
                    'Override texts',
                    html`
                        ${this.addTextField('texts.due', 'Due date label')}
                        ${this.addTextField('texts.last', 'Last date label')}
                        ${this.addTextField('texts.user', 'User label')}
                        ${this.addTextField('texts.none', 'No tasks or chores found')}
                    `
                )}
            </div>
        `;
    }

    addTextField(name, label, type, defaultValue) {
        return html`
            <ha-textfield
                name="${name}"
                label="${label ?? name}"
                type="${type ?? 'text'}"
                value="${this.getConfigValue(name, defaultValue)}"
                @keyup="${this._valueChanged}"
                @change="${this._valueChanged}"
            />
        `;
    }

    addEntityPickerField(name, label, includeDomains, defaultValue) {
        return html`
            <ha-entity-picker
                .hass="${this.hass}"
                name="${name}"
                label="${label ?? name}"
                value="${this.getConfigValue(name, defaultValue)}"
                .includeDomains="${includeDomains}"
                @change="${this._valueChanged}"
            />
        `;
    }

    addIconPickerField(name, label, defaultValue) {
        return html`
            <ha-icon-picker
                .hass="${this.hass}"
                name="${name}"
                label="${label ?? name}"
                value="${this.getConfigValue(name, defaultValue)}"
                @change="${this._valueChanged}"
            />
        `;
    }

    addSelectField(name, label, options, clearable, defaultValue) {
        return html`
            <ha-select
                name="${name}"
                label="${label ?? name}"
                value="${this.getConfigValue(name, defaultValue)}"
                .clearable="${clearable}"
                @change="${this._valueChanged}"
                @closed="${(event) => { event.stopPropagation(); } /* Prevent a bug where the editor dialog also closes. See https://github.com/material-components/material-web/issues/1150 */}"
            >
                ${options.map((option) => {
                    return html`
                        <mwc-list-item
                            value="${option.value}"
                        >${option.label ?? option.value}</mwc-list-item>
                    `;
                })}
            </ha-select>
        `;
    }

    addBooleanField(name, label, defaultValue) {
        return html`
            <ha-formfield
                label="${label ?? name}"
            >
                <ha-switch
                    name="${name}"
                    .checked="${this.getConfigValue(name, defaultValue)}"
                    value="true"
                    @change="${this._valueChanged}"
                />
            </ha-formfield>
        `;
    }

    addExpansionPanel(header, content, expanded) {
        return html`
            <ha-expansion-panel
                header="${header}"
                .expanded="${expanded ?? false}"
                outlined="true"
            >
                <div style="display: flex; flex-direction: column">
                    ${content}
                </div>
            </ha-expansion-panel>
        `;
    }

    addButton(text, icon, clickFunction) {
        return html`
            <ha-button
                @click="${clickFunction}"
            >
                <ha-icon icon="${icon}"></ha-icon>
                ${text}
            </ha-button>
        `;
    }

    _valueChanged(event) {
        const target = event.target;
        let value = target.value;

        if (target.tagName === 'HA-SWITCH') {
            value = target.checked;
        }

        this.setConfigValue(target.attributes.name.value, value);
    }

    getConfigValue(key, defaultValue) {
        if (!this._config) {
            return '';
        }

        defaultValue = defaultValue ?? '';

        return key.split('.').reduce((o, i) => o[i] ?? defaultValue, this._config) ?? defaultValue;
    }

    setConfigValue(key, value) {
        const config = Object.assign({}, this._config);
        const keyParts = key.split('.');
        const lastKeyPart = keyParts.pop();
        const lastObject = keyParts.reduce((objectPart, keyPart) => {
            if (!objectPart[keyPart]) {
                objectPart[keyPart] = {};
            }
            return objectPart[keyPart];
        }, config);
        if (value === '') {
            delete lastObject[lastKeyPart];
        } else {
            lastObject[lastKeyPart] = value;
        }
        this._config = config;

        this.dispatchConfigChangedEvent();
    }

    dispatchConfigChangedEvent() {
        const configChangedEvent = new CustomEvent("config-changed", {
            detail: { config: this._config },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(configChangedEvent);
    }
}
