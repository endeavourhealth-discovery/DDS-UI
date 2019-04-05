import {Injectable} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {EdsLibraryItem} from "../edsLibrary/models/EdsLibraryItem";

@Injectable()
export class CountReportService {
	constructor(private http: Http) {}

	runReport(uuid: string, baselineDate: number): Observable<EdsLibraryItem> {
		let params = new URLSearchParams();
		params.append('uuid', uuid);
		params.append('baselineDate', baselineDate.toString());
		return this.http.get('api/countReport/runReport', {search: params})
      .map((result) => result.json());
	}

	exportData(uuid: string): Observable<string> {
		let params = new URLSearchParams();
		params.append('uuid', uuid);
		return this.http.get('api/countReport/exportData', {search: params})
      .map((result) => result.json());
	}

}
