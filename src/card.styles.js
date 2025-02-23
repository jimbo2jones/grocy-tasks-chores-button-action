import { css } from 'lit';

export default css`
  ha-card {
    --task-columns: 2;
    --task-gap: 8px;
    --task-padding: 8px;
    --icon-size: 24px;
    --icon-color: var(--primary-text-color);
    --icon-shape-spacing: 16px;
    --name-font-weight: bold;
    --name-font-size: 14px;
    --name-line-height: 15px;
    --name-color: var(--primary-text-color);
    
    background: transparent;
    backdrop-filter: none;
    box-shadow: none;
    border-radius: 0;
    border-width: 0;
  }
  
  .card-content {
    padding: 0;
  }
  
  .container {
    display: flex;
    flex-wrap: wrap;
    gap: var(--task-gap);
  }
  
  .task,
  .none {
    width: 100%;
    padding: var(--task-padding);
    box-sizing: border-box;
    background: var(--ha-card-background, var(--card-background-color, #fff));
    backdrop-filter: var(--ha-card-backdrop-filter none);
    box-shadow: var(--ha-card-box-shadow, none);
    border-radius: var(--ha-card-border-radius, 12px);
    border-width: var(--ha-card-border-width, 1px);
    border-style: solid;
    border-color: var(--ha-card-border-color, var(--divider-color, #e0e0e0));
  }
  
  .task {
    display: flex;
    gap: var(--task-gap);
    width: calc((100% - var(--task-gap) * calc(var(--task-columns) - 1)) / var(--task-columns));
    cursor: pointer;
  }
  
  .task:active {
    animation: pulse-animation 2s ease-out;
  }
  
  .task.tapped {
    animation: pulse-animation 2s infinite;
  }

  .task.almostDue {
    --icon-color: var(--accent-color);
    --ha-card-border-color: var(--accent-color);
  }

  .task.due {
    --icon-color: var(--error-color);
    --ha-card-border-color: var(--error-color);
  }

  ha-card.layout-vertical .task {
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .icon {
    display: flex;
    justify-content: center;
    position: relative;
    --icon-primary-color: var(--icon-color, inherit);
    --mdc-icon-size: var(--icon-size);
  }

  .icon .shape {
    position: relative;
    width: calc(var(--icon-size) + var(--icon-shape-spacing));
    height: calc(var(--icon-size) + var(--icon-shape-spacing));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .icon .shape::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: var(--icon-color);
    opacity: .2;
  }
  
  .info {
    width: 1px;
    flex-grow: 1;
  }

  ha-card.layout-vertical .info {
    width: 100%;
    flex-grow: initial;
  }

  .info .name,
  .info .description,
  .info .dueDate,
  .info .lastDate,
  .info .user {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  
  .info .wrap {
    white-space: initial;
    overflow: initial;
    text-overflow: initial;
  }
    
  .info .name {
    font-weight: var(--name-font-weight);
    font-size: var(--name-font-size);
    line-height: var(--name-line-height);
    color: var(--name-color);
  }
  
  @keyframes pulse-animation {
    0% {
      opacity: .35;
    }
    50% {
      opacity: 1
    }
    100% {
      opacity: .35;
    }
  }
`;
