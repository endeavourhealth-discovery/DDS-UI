import {Injectable} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {AuditEvent} from "./models/AuditEvent";
import {User} from "../users/models/User";

@Injectable()
export class AuditService {
	constructor(private http: Http) { }

	getUsers():Observable<User[]> {
		return this.http.get('api/audit/users')
      .map((response) => response.json());
	}

	getUserAudit(module : string, userId : string, month : Date, organisationId : string):Observable<AuditEvent[]> {
		let params = new URLSearchParams();
		params.append('module',module);
		params.append('userId',userId);
		params.append('month',month.valueOf().toString());
		params.append('organisationId',organisationId);

		return this.http.get('api/audit', {search : params})
      .map((response) => response.json());
	}

	getModules():Observable<string[]> {
		return this.http.get('api/audit/modules')
      .map((response) => response.json());
	}

	getSubmodules(module : string):Observable<string[]> {
		let params = new URLSearchParams();
		params.append('module',module);

		return this.http.get('api/audit/submodules', {search : params})
      .map((response) => response.json());
	}

	getActions():Observable<string[]> {
		return this.http.get('api/audit/actions')
      .map((response) => response.json());
	}
}
