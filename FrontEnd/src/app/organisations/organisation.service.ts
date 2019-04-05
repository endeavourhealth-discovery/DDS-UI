import {Injectable} from "@angular/core";
import {URLSearchParams, Http} from "@angular/http";
import {Observable} from "rxjs";
import {Organisation} from "./models/Organisation";
import {Service} from "../services/models/Service";

@Injectable()
export class OrganisationService {
	constructor(private http : Http) { }

	getOrganisations(): Observable<Organisation[]> {
		return this.http.get('api/organisation')
      .map((result) => result.json());
	}

	getOrganisation(uuid : string) : Observable<Organisation> {
		let params = new URLSearchParams();
		params.append('uuid',uuid);
		return this.http.get('api/organisation', { search : params })
      .map((result) => result.json());
	}

	getOrganisationServices(uuid : string) :  Observable<Service[]> {
		let params = new URLSearchParams();
		params.append('uuid',uuid);
		return this.http.get('api/organisation/services', { search : params })
      .map((result) => result.json());
	}

	saveOrganisation(organisation : Organisation) : Observable<any> {
		return this.http.post('api/organisation', organisation);
	}

	deleteOrganisation(uuid : string) : Observable<any> {
		let params = new URLSearchParams();
		params.append('uuid',uuid);
		return this.http.delete('api/organisation', { search : params });
	}

	search(searchData : string) : Observable<Organisation[]> {
		let params = new URLSearchParams();
		params.append('searchData',searchData);
		return this.http.get('api/organisation', { search : params })
      .map((result) => result.json());
	}
}
