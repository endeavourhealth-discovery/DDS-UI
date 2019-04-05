import {Injectable} from "@angular/core";
import {URLSearchParams, Http} from "@angular/http";
import {Observable} from "rxjs";
import {DataSet} from "./models/Dataset";
import {EntityMap} from "./models/EntityMap";

@Injectable()
export class DataSetService {
	constructor(private http : Http) { }

	getDatasets(): Observable<DataSet[]> {
		return this.http.get('api/library/getDataSets')
      .map((result) => result.json());
	}

	getEntityMap(): Observable<EntityMap> {
		return this.http.get('api/entity/getEntityMap')
      .map((result) => result.json());
	}


	//**  NEW CODE FROM HERE  **//
	getAllDataSets(): Observable<DataSet[]> {
		return this.http.get('api/dataSet')
      .map((result) => result.json());
	}

	getDataSet(uuid : string) : Observable<DataSet> {
		let params = new URLSearchParams();
		params.append('uuid',uuid);
		return this.http.get('api/dataSet', { search : params })
      .map((result) => result.json());
	}

	saveDataSet(dataset : DataSet) : Observable<any> {
		return this.http.post('api/dataSet', dataset);
	}

	deleteDataSet(uuid : string) : Observable<any> {
		let params = new URLSearchParams();
		params.append('uuid',uuid);
		return this.http.delete('api/dataSet', { search : params });
	}

	search(searchData : string) : Observable<DataSet[]> {
		let params = new URLSearchParams();
		params.append('searchData',searchData);
		return this.http.get('api/dataSet', { search : params })
      .map((result) => result.json());
	}
}
