import path from 'path';
import { AsyncResource } from 'async_hooks';
import { EventEmitter } from 'events';
import { Worker } from 'worker_threads';
const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');
class WorkerPoolTaskInfo extends AsyncResource {
    constructor(callback) {
        super('WorkerPoolTaskInfo');
        this.callback = callback;
    }
    done(err, result) {
        this.runInAsyncScope(this.callback, null, err, result);
        this.emitDestroy();
    }
}
class WorkerPool extends EventEmitter {
    constructor(numThreads, workerFile) {
        super();
        this.numThreads = numThreads;
        this.workerFile = workerFile;
        this.workers = [];
        this.freeWorkers = [];
        for (let i = 0; i < numThreads; i++)
            this.addNewWorker();
    }
    addNewWorker() {
        const worker = new Worker(path.resolve(this.workerFile || ''));
        worker.on('message', (result) => {
            var _a;
            (_a = worker[kTaskInfo]) === null || _a === void 0 ? void 0 : _a.done(null, result);
            worker[kTaskInfo] = null;
            this.freeWorkers.push(worker);
            this.emit(kWorkerFreedEvent);
        });
        worker.on('error', (err) => {
            var _a;
            if (worker[kTaskInfo])
                (_a = worker[kTaskInfo]) === null || _a === void 0 ? void 0 : _a.done(err, null);
            else
                this.emit('error', err);
            this.workers.splice(this.workers.indexOf(worker), 1);
            this.addNewWorker();
        });
        this.workers.push(worker);
        this.freeWorkers.push(worker);
        this.emit(kWorkerFreedEvent);
    }
    runTask(task, callback) {
        if (this.freeWorkers.length === 0) {
            this.once(kWorkerFreedEvent, () => this.runTask(task, callback));
            return;
        }
        const worker = this.freeWorkers.pop();
        worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
        worker.postMessage(task);
    }
    close() {
        for (const worker of this.workers)
            worker.terminate();
    }
}
export default WorkerPool;
//# sourceMappingURL=worker-pool.js.map