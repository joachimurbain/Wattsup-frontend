import { HttpInterceptorFn, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs';

export const dateInterceptor: HttpInterceptorFn = (req, next) => {
	return next(req).pipe(
		map((event) => {
			if (event.type === HttpEventType.Response && event.body) {
				return event.clone({ body: convertDates(event.body) });
			}
			return event;
		})
	);
};

function convertDates(body: any): any {
	if (body === null || body === undefined) return body;

	if (Array.isArray(body)) {
		return body.map(convertDates);
	}

	if (typeof body === 'object') {
		Object.keys(body).forEach((key) => {
			const value = body[key];
			if (typeof value === 'string' && isIsoDate(value)) {
				body[key] = new Date(value);
			} else if (typeof value === 'object') {
				body[key] = convertDates(value);
			}
		});
	}

	return body;
}

function isIsoDate(value: string): boolean {
	return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z$/.test(value);
}
