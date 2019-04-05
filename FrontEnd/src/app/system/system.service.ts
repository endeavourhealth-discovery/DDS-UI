import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {System} from "./models/System";
import {Observable} from "rxjs";

@Injectable()
export class SystemService {
	constructor(private http : Http) { }

	getSystems(): Observable<System[]> {
		return this.http.get('api/library/getSystems')
      .map((result) => result.json());
	}
}
