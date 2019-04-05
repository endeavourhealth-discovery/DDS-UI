import {Injectable} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {LoggingEvent} from "./models/LoggingEvent";

@Injectable()
export class LoggingService {
	constructor(private http: Http) { }

	getLoggingEvents(serviceId : string, level : string, page : number):Observable<LoggingEvent[]> {
		let params = new URLSearchParams();
		params.append('serviceId',serviceId);
		params.append('level',level);
		params.append('page',page.toString());

		return this.http.get('api/logging/getLoggingEvents', {search : params})
      .map((result) => result.json());
	}

	getStackTrace(eventId : string):Observable<string> {
		let params = new URLSearchParams();
		params.append('eventId',eventId);

		return this.http.get('api/logging/getStackTrace', {search : params})
      .map((result) => result.json());
	}
}
