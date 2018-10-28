import '@babel/polyfill';
import * as stats_loader from './solver/stats_loader'
import Worker from 'worker-loader!./solver/worker.js';
import UI from './ui'

const stats = stats_loader.load();
new UI(stats, Worker).start()
