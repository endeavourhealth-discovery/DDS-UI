import {Injectable} from "@angular/core";
import {URLSearchParams, Http} from "@angular/http";
import {Observable} from "rxjs";
import {Cohort} from "./models/Cohort";
import {EdsLibraryItem} from "../edsLibrary/models/EdsLibraryItem";

@Injectable()
export class ProtocolService {
	constructor(private http : Http) { }

	getProtocols(serviceId: string): Observable<EdsLibraryItem[]> {
		let params = new URLSearchParams();
		params.append('serviceId', serviceId);

		return this.http.get('api/library/getProtocols', {search: params})
      .map((result) => result.json());
	}

	getCohorts(): Observable<Cohort[]> {
		return this.http.get('api/library/getQueries')
      .map((result) => result.json());
	}
}
