import '@babel/polyfill';
import * as statsLoader from './solver/stats_loader'
import Worker from 'worker-loader!./solver/worker.js';
import UI from './ui'
import ReactDOM from "react-dom";
import ExplainerContainer from './ui/explainer_component.jsx';
import React from "react";

const stats = statsLoader.load();

const explainComponentId = document.getElementById("explainer-component");
const explainerComponent = ReactDOM.hydrate(<ExplainerContainer stats={stats.rawData}/>, explainComponentId);

new UI(stats, Worker, explainerComponent).start();
