import {Injectable} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {FolderItem} from 'eds-angular4/dist/folder/models/FolderItem';

@Injectable()
export class DashboardService {
	constructor(private http : Http) { }

	getRecentDocumentsData():Observable<FolderItem[]> {
		let params = new URLSearchParams();
		params.append('count','5');

		return this.http.get('api/dashboard/getRecentDocuments', {search : params})
      .map((result) => result.json());
	}
}
