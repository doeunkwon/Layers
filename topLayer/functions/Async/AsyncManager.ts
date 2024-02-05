import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import { NotFoundError } from '../../Errors/NotFoundError';

export type resolutionType = [string, number];

export class AsyncManager extends EventEmitter {
	calls: number;
	failures: string[];
	result: number = 0;
	constructor(calls: number) {
		super();
		this.calls = calls;
		this.failures = [];
		if (calls <= 0) {
			throw new NotFoundError('0 Items to Create Calls On');
		}
	}

	// All async calls are complete
	allComplete(): void {
		this.emit('proceed', 'All Queries Were Completed', this.result);
	}

	// One query completed
	complete(call: string): void {
		this.calls--;
		this.emit('Async Call Completed', call);
		if (this.calls === 0) {
			this.allComplete();
		}
	}

	// One async call failed and the failure is predicted
	failure(failure: string, call: string): void {
		this.calls--;
		this.result--;
		this.failures.push(failure);
		this.emit('Async Call Failure Caught', call, failure);
		if (this.calls === 0) {
			this.allComplete();
		}
	}
}
